const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  currentCrowd: { type: Number, required: true },
});

module.exports = mongoose.model('Log', logSchema);
