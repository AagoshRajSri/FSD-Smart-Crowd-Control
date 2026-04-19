const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  maxCapacity: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  guardsCount: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  stats: {
    peakCrowd: { type: Number, default: 0 },
    avgCrowd: { type: Number, default: 0 },
    alertsTriggered: { type: Number, default: 0 },
    duration: { type: Number, default: 0 } // in minutes
  }
});

module.exports = mongoose.model('Event', eventSchema);
