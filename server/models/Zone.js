const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  zoneId: { type: String, required: true },       
  name: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: false },
  maxCapacity: { type: Number, required: true },
  coordinates: { type: Array, required: true }  // Array of [lat, lng] arrays
});

module.exports = mongoose.model('Zone', zoneSchema);
