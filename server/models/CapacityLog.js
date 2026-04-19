const mongoose = require('mongoose');

const capacityLogSchema = new mongoose.Schema({
  zoneId: { type: String, required: true },
  count: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CapacityLog', capacityLogSchema);
