const mongoose = require('mongoose');
const Event = require('./models/Event');
const Zone = require('./models/Zone');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Seeding historical events...');

  const dummyEvents = [
    {
      name: 'Mumbai Music Fest 2025',
      location: 'Shivaji Park, Mumbai',
      maxCapacity: 8000,
      guardsCount: 25,
      isActive: false,
      createdAt: new Date('2025-12-15T10:00:00Z'),
      endedAt: new Date('2025-12-15T18:30:00Z'),
      stats: { peakCrowd: 7200, avgCrowd: 5100, alertsTriggered: 4, duration: 510 }
    },
    {
      name: 'New Year Countdown Rally',
      location: 'Marine Drive, Mumbai',
      maxCapacity: 15000,
      guardsCount: 40,
      isActive: false,
      createdAt: new Date('2025-12-31T20:00:00Z'),
      endedAt: new Date('2026-01-01T02:00:00Z'),
      stats: { peakCrowd: 14200, avgCrowd: 9800, alertsTriggered: 12, duration: 360 }
    },
    {
      name: 'Republic Day Parade Security',
      location: 'Rajpath, Delhi',
      maxCapacity: 20000,
      guardsCount: 50,
      isActive: false,
      createdAt: new Date('2026-01-26T06:00:00Z'),
      endedAt: new Date('2026-01-26T14:00:00Z'),
      stats: { peakCrowd: 18500, avgCrowd: 12000, alertsTriggered: 3, duration: 480 }
    },
    {
      name: 'IPL Match Day - Wankhede',
      location: 'Wankhede Stadium, Mumbai',
      maxCapacity: 33000,
      guardsCount: 45,
      isActive: false,
      createdAt: new Date('2026-03-22T14:00:00Z'),
      endedAt: new Date('2026-03-22T22:00:00Z'),
      stats: { peakCrowd: 31200, avgCrowd: 27500, alertsTriggered: 8, duration: 480 }
    },
    {
      name: 'Ganesh Visarjan Route Control',
      location: 'Girgaon Chowpatty, Mumbai',
      maxCapacity: 12000,
      guardsCount: 35,
      isActive: false,
      createdAt: new Date('2026-02-14T08:00:00Z'),
      endedAt: new Date('2026-02-15T04:00:00Z'),
      stats: { peakCrowd: 11800, avgCrowd: 8200, alertsTriggered: 15, duration: 1200 }
    },
    {
      name: 'Tech Conference IITKGP',
      location: 'Convention Center, Kolkata',
      maxCapacity: 3000,
      guardsCount: 10,
      isActive: false,
      createdAt: new Date('2026-04-05T09:00:00Z'),
      endedAt: new Date('2026-04-05T18:00:00Z'),
      stats: { peakCrowd: 2700, avgCrowd: 1800, alertsTriggered: 1, duration: 540 }
    },
    {
      name: 'Marathon Checkpoint Alpha',
      location: 'CSMT to Worli Sea Link',
      maxCapacity: 5000,
      guardsCount: 20,
      isActive: false,
      createdAt: new Date('2026-04-10T05:00:00Z'),
      endedAt: new Date('2026-04-10T12:00:00Z'),
      stats: { peakCrowd: 4600, avgCrowd: 3200, alertsTriggered: 2, duration: 420 }
    }
  ];

  // Insert dummy zones for each event
  for (let eventData of dummyEvents) {
    const event = await Event.create(eventData);
    
    // Create 2-3 dummy zones per event
    const baseLng = 72.82 + Math.random() * 0.1;
    const baseLat = 19.05 + Math.random() * 0.05;
    
    await Zone.insertMany([
      {
        zoneId: `ZONE_A_${event._id}`,
        name: 'Primary Zone',
        eventId: event._id,
        maxCapacity: Math.floor(eventData.maxCapacity * 0.5),
        coordinates: [
          [baseLng, baseLat],
          [baseLng + 0.002, baseLat],
          [baseLng + 0.002, baseLat + 0.002],
          [baseLng, baseLat + 0.002]
        ]
      },
      {
        zoneId: `ZONE_B_${event._id}`,
        name: 'Secondary Zone',
        eventId: event._id,
        maxCapacity: Math.floor(eventData.maxCapacity * 0.3),
        coordinates: [
          [baseLng + 0.003, baseLat],
          [baseLng + 0.005, baseLat],
          [baseLng + 0.005, baseLat + 0.002],
          [baseLng + 0.003, baseLat + 0.002]
        ]
      },
      {
        zoneId: `ZONE_C_${event._id}`,
        name: 'Overflow Zone',
        eventId: event._id,
        maxCapacity: Math.floor(eventData.maxCapacity * 0.2),
        coordinates: [
          [baseLng, baseLat + 0.003],
          [baseLng + 0.005, baseLat + 0.003],
          [baseLng + 0.005, baseLat + 0.005],
          [baseLng, baseLat + 0.005]
        ]
      }
    ]);
    
    console.log(`  Created: ${eventData.name} with 3 zones`);
  }

  console.log(`\nDone! Seeded ${dummyEvents.length} historical events.`);
  process.exit(0);
});
