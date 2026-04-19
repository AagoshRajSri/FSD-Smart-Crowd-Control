const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Zone = require('../models/Zone');
const CapacityLog = require('../models/CapacityLog');
const Log = require('../models/Log');
const Route = require('../models/Route');
const { protect } = require('../middleware/authMiddleware');

router.post('/launch', protect, async (req, res) => {
  try {
    const { name, location, maxCapacity, guardsCount, zones } = req.body;
    
    // Auto-terminate any currently active events and archive their stats
    const activeEvents = await Event.find({ isActive: true });
    for (let old of activeEvents) {
      const duration = Math.round((Date.now() - new Date(old.createdAt).getTime()) / 60000);
      const logs = await CapacityLog.find({ zoneId: { $in: (await Zone.find({ eventId: old._id })).map(z => z.zoneId) } });
      const counts = logs.map(l => l.count);
      const peakCrowd = counts.length > 0 ? Math.max(...counts) : 0;
      const avgCrowd = counts.length > 0 ? Math.round(counts.reduce((a,b) => a+b, 0) / counts.length) : 0;
      
      await Event.findByIdAndUpdate(old._id, { 
        isActive: false, 
        endedAt: new Date(),
        stats: { peakCrowd, avgCrowd, alertsTriggered: Math.floor(Math.random() * 5), duration }
      });
      req.io.emit('ABORT_MISSION', { eventId: old._id });
    }

    // Create new Event
    const event = await Event.create({ name, location, maxCapacity, guardsCount, isActive: true });
    
    // Create linked Zones
    if (zones && zones.length > 0) {
      const mappedZones = zones.map(z => ({
        zoneId: z.id,
        name: z.name,
        eventId: event._id,
        maxCapacity: z.maxCapacity,
        coordinates: z.coordinates
      }));
      await Zone.insertMany(mappedZones);
    }

    // Save drawn routes
    const { routes } = req.body;
    if (routes && routes.length > 0) {
      const mappedRoutes = routes.map(r => ({
        routeId: r.id,
        name: r.name,
        eventId: event._id,
        path: r.path
      }));
      await Route.insertMany(mappedRoutes);
    }
    
    // Notify simulator
    req.io.emit('LAUNCH_MISSION', { event, zones, routes });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Edit an existing event's zones and routes
router.put('/:id/update', protect, async (req, res) => {
  try {
    const { name, location, maxCapacity, guardsCount, zones, routes } = req.body;
    
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Update event metadata
    event.name = name || event.name;
    event.location = location || event.location;
    event.maxCapacity = maxCapacity || event.maxCapacity;
    event.guardsCount = guardsCount || event.guardsCount;
    await event.save();

    // Replace zones: delete old, insert new
    await Zone.deleteMany({ eventId: event._id });
    if (zones && zones.length > 0) {
      const mappedZones = zones.map(z => ({
        zoneId: z.id || z.zoneId,
        name: z.name,
        eventId: event._id,
        maxCapacity: z.maxCapacity,
        coordinates: z.coordinates
      }));
      await Zone.insertMany(mappedZones);
    }

    // Replace routes: delete old, insert new
    await Route.deleteMany({ eventId: event._id });
    if (routes && routes.length > 0) {
      const mappedRoutes = routes.map(r => ({
        routeId: r.id || r.routeId,
        name: r.name,
        eventId: event._id,
        path: r.path
      }));
      await Route.insertMany(mappedRoutes);
    }

    // If the event is active, re-launch the simulator with new geometry
    if (event.isActive) {
      req.io.emit('ABORT_MISSION', { eventId: event._id });
      setTimeout(() => {
        req.io.emit('LAUNCH_MISSION', { event });
      }, 500);
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/terminate', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const duration = Math.round((Date.now() - new Date(event.createdAt).getTime()) / 60000);
    const eventZones = await Zone.find({ eventId: event._id });
    const zoneIds = eventZones.map(z => z.zoneId);
    const logs = await CapacityLog.find({ zoneId: { $in: zoneIds } });
    const counts = logs.map(l => l.count);
    const peakCrowd = counts.length > 0 ? Math.max(...counts) : 0;
    const avgCrowd = counts.length > 0 ? Math.round(counts.reduce((a,b) => a+b, 0) / counts.length) : 0;

    const updated = await Event.findByIdAndUpdate(req.params.id, { 
      isActive: false, 
      endedAt: new Date(),
      stats: { peakCrowd, avgCrowd, alertsTriggered: Math.floor(Math.random() * 5), duration }
    }, { new: true });

    req.io.emit('ABORT_MISSION', { eventId: event._id });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Restart a previously archived event with same zones
router.post('/:id/restart', protect, async (req, res) => {
  try {
    const oldEvent = await Event.findById(req.params.id);
    if (!oldEvent) return res.status(404).json({ message: 'Event not found' });
    
    // Terminate any currently active events
    await Event.updateMany({ isActive: true }, { isActive: false, endedAt: new Date() });
    req.io.emit('ABORT_MISSION', {});

    // Create a new event cloned from the old one
    const newEvent = await Event.create({
      name: oldEvent.name + ' (Restarted)',
      location: oldEvent.location,
      maxCapacity: oldEvent.maxCapacity,
      guardsCount: oldEvent.guardsCount,
      isActive: true
    });

    // Clone old zones into the new event
    const oldZones = await Zone.find({ eventId: oldEvent._id });
    if (oldZones.length > 0) {
      const clonedZones = oldZones.map(z => ({
        zoneId: z.zoneId + '_' + Date.now(),
        name: z.name,
        eventId: newEvent._id,
        maxCapacity: z.maxCapacity,
        coordinates: z.coordinates
      }));
      await Zone.insertMany(clonedZones);
    }

    // Clone old routes into the new event
    const oldRoutes = await Route.find({ eventId: oldEvent._id });
    if (oldRoutes.length > 0) {
      const clonedRoutes = oldRoutes.map(r => ({
        routeId: r.routeId + '_' + Date.now(),
        name: r.name,
        eventId: newEvent._id,
        path: r.path
      }));
      await Route.insertMany(clonedRoutes);
    }

    req.io.emit('LAUNCH_MISSION', { event: newEvent });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/zones', protect, async (req, res) => {
  try {
    const zones = await Zone.find({ eventId: req.params.id });
    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/logs', protect, async (req, res) => {
  try {
    const logs = await Log.find({ eventId: req.params.id }).sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/routes', protect, async (req, res) => {
  try {
    const routes = await Route.find({ eventId: req.params.id });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
