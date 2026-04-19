const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeId: { type: String, required: true },
  name: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  path: { type: Array, required: true } // Array of [lng, lat] waypoints
});

module.exports = mongoose.model('Route', routeSchema);
