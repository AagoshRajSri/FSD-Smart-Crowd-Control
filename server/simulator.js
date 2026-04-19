const { io } = require('socket.io-client');
const mongoose = require('mongoose');
const Zone = require('./models/Zone');
const Event = require('./models/Event');
const Route = require('./models/Route');
const CapacityLog = require('./models/CapacityLog');
require('dotenv').config();

const socket = io('http://localhost:5000');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Simulator connected to DB');

  let simulationInterval = null;
  let zones = [];
  let routes = [];
  let crowdState = {};
  let routeCongestion = {};
  let guards = [];
  let statusIndex = 0;
  const guardStatuses = ['Patrolling', 'En Route', 'Engaged', 'Break'];

  const runSimulationTick = () => {
    // Zone crowd simulation
    for (let zone of zones) {
      let change = Math.floor(Math.random() * (zone.maxCapacity * 0.05)) - (zone.maxCapacity * 0.02);
      let count = (crowdState[zone.zoneId] || 0) + change;
      if (count < 0) count = 0;
      if (count > zone.maxCapacity * 1.2) count = Math.floor(zone.maxCapacity * 1.2);
      crowdState[zone.zoneId] = count;

      socket.emit('push_crowd_data', {
        zoneId: zone.zoneId,
        currentCrowd: count
      });
    }

    // Route congestion simulation (0.0 to 1.0 scale)
    for (let route of routes) {
      let current = routeCongestion[route.routeId] || 0.3;
      current += (Math.random() * 0.1) - 0.04; // Slight upward drift
      if (current < 0.05) current = 0.05;
      if (current > 1.0) current = 1.0;
      routeCongestion[route.routeId] = parseFloat(current.toFixed(2));
    }

    // Emit route congestion data
    if (routes.length > 0) {
      socket.emit('route_congestion', routeCongestion);
    }

    // Guard telemetry
    if (Math.random() > 0.8) statusIndex = (statusIndex + 1) % guardStatuses.length;

    guards.forEach((g, idx) => {
        if (g.type === 'patrol') {
            g.lat += (Math.random() * 0.0002) - 0.0001;
            g.lng += (Math.random() * 0.0002) - 0.0001;
        }
        socket.emit('guard_telemetry', {
            guardId: g.id,
            lng: g.lng,
            lat: g.lat,
            status: g.type === 'static' ? 'Engaged' : guardStatuses[(statusIndex + idx) % guardStatuses.length]
        });
    });
  };

  const startSimulation = async (eventId) => {
    if (simulationInterval) clearInterval(simulationInterval);
    
    zones = await Zone.find({ eventId: eventId });
    routes = await Route.find({ eventId: eventId });
    
    if (zones.length === 0) {
      console.log('No zones found for event', eventId);
      return;
    }

    const event = await Event.findById(eventId);
    const guardCount = Math.min(event.guardsCount || 5, 50);

    // Compute centroid across ALL zone vertices for guard spread
    let allLngs = [], allLats = [];
    for (let z of zones) {
      for (let coord of z.coordinates) {
        allLngs.push(coord[0]);
        allLats.push(coord[1]);
      }
    }
    const centerLng = allLngs.reduce((a,b) => a+b, 0) / allLngs.length;
    const centerLat = allLats.reduce((a,b) => a+b, 0) / allLats.length;

    guards = Array.from({ length: guardCount }, (_, i) => ({
      id: `G${i+1}`,
      lat: centerLat + (Math.random() * 0.002 - 0.001),
      lng: centerLng + (Math.random() * 0.002 - 0.001),
      type: 'patrol'
    }));

    for (let g of guards) {
      socket.emit('guard_login', g.id);
    }

    crowdState = {};
    for (let z of zones) {
        crowdState[z.zoneId] = Math.floor(z.maxCapacity * 0.2);
    }

    routeCongestion = {};
    for (let r of routes) {
        routeCongestion[r.routeId] = 0.2 + Math.random() * 0.3; // Start between 0.2 and 0.5
    }

    simulationInterval = setInterval(runSimulationTick, 2000);
    console.log(`Started simulation for Event ${eventId} with ${zones.length} zones, ${routes.length} routes, and ${guardCount} guards.`);
  };

  socket.on('LAUNCH_MISSION', async (data) => {
    console.log('Received LAUNCH_MISSION');
    await startSimulation(data.event._id);
  });

  socket.on('ABORT_MISSION', () => {
    console.log('Received ABORT_MISSION');
    if (simulationInterval) clearInterval(simulationInterval);
    zones = [];
    routes = [];
    crowdState = {};
    routeCongestion = {};
    guards = [];
  });

  // Check if an active event already exists on boot
  const activeEvent = await Event.findOne({ isActive: true }).sort({ createdAt: -1 });
  if (activeEvent) {
      await startSimulation(activeEvent._id);
  } else {
      console.log('No active event found. Waiting for LAUNCH_MISSION...');
  }
});
