require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const Log = require('./models/Log');
const Event = require('./models/Event');
const Zone = require('./models/Zone');
const CapacityLog = require('./models/CapacityLog');
const memoryEngine = require('./services/memoryEngine');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('MongoDB connected successfully');
    
    // Seed a dummy user for easy login
    const User = require('./models/User');
    const userExists = await User.findOne({ email: 'admin@prahar.com' });
    if (!userExists) {
      await User.create({ name: 'Admin', email: 'admin@prahar.com', password: 'password', role: 'admin' });
      console.log('--> DUMMY USER CREATED: admin@prahar.com / password');
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Engine Loops
setInterval(() => {
  const liveData = memoryEngine.getAllZonesLive();
  io.emit('heatmap_tick', liveData);
}, 2000);

// Predictive Forecasting Loop (Runs roughly every 30s)
setInterval(async () => {
  const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
  const zones = await Zone.find();
  
  for (let zone of zones) {
     const pastLog = await CapacityLog.findOne({ zoneId: zone.zoneId, timestamp: { $lte: fiveMinsAgo } }).sort({ timestamp: -1 });
     const liveCount = memoryEngine.zones[zone.zoneId] || 0;
     
     if (pastLog && liveCount > pastLog.count) {
         const ratePerMin = (liveCount - pastLog.count) / 5;
         const timeToMax = (zone.maxCapacity - liveCount) / ratePerMin;
         
         if (timeToMax > 0 && timeToMax <= 15) {
             io.emit('prediction_alert', { 
               zoneId: zone.zoneId, 
               zoneName: zone.name, 
               timeToMax: Math.ceil(timeToMax) 
             });
         }
     }
  }
}, 30000);

// Socket.io for Real-time
io.on('connection', (socket) => {
  console.log('User connected via Socket.io:', socket.id);

  // Identify Guard Device
  socket.on('guard_login', (guardId) => {
    socket.join('guards');
    socket.guardId = guardId;
    console.log('Guard logged in:', guardId);
  });

  socket.on('guard_telemetry', (data) => {
    const { guardId, lng, lat, status } = data;
    memoryEngine.addGuardLocation(guardId || socket.id, lng, lat, status);
    io.emit('guard_positions', memoryEngine.guards); // Broadcast to dashboard
  });

  socket.on('guard_acknowledge', (data) => {
    io.emit('dispatch_status_update', { guardId: data.guardId, status: 'En Route' });
  });

  // Example event for simulator to push continuous data
  socket.on('push_crowd_data', async (data) => {
    try {
      const { zoneId, currentCrowd } = data;
      
      // Save Live to Memory pseudo-redis
      memoryEngine.setZoneCount(zoneId, currentCrowd);

      // Save Historical Log
      await CapacityLog.create({ zoneId, count: currentCrowd });

      // Anomaly Checking
      const zone = await Zone.findOne({ zoneId });
      if (zone && currentCrowd >= (zone.maxCapacity * 0.95)) {
        // Dispatch closest guard — coordinates are [lng, lat] from DeckGL
        const centerLng = zone.coordinates[0][0];
        const centerLat = zone.coordinates[0][1];

        const closest = memoryEngine.getGuardsInRadius(centerLng, centerLat, 500); // 500 meters
        
        if (closest.length > 0) {
          const dispatchedGuard = closest[0];
          io.to(dispatchedGuard.id).emit('dispatch_order', {
            location: zone.name,
            issue: 'Critical Overcrowding Detected',
            coordinates: [centerLat, centerLng]
          });
        }
      }
    } catch (error) {
      console.error('Socket error:', error);
    }
  });

  // Route congestion data from simulator
  socket.on('route_congestion', (data) => {
    io.emit('route_heatmap', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
