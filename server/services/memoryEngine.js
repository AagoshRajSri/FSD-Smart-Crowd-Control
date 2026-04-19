class MemoryEngine {
  constructor() {
    this.zones = {}; // { 'MAIN_STAGE': 450 }
    this.guards = []; // [ { id: 'G1', lng: 0, lat: 0, status: 'active' } ]
  }

  setZoneCount(zoneId, count) {
    this.zones[zoneId] = count;
  }

  getAllZonesLive() {
    return this.zones;
  }

  // Equivalent to GEOADD
  addGuardLocation(guardId, lng, lat, status = 'active') {
    const existing = this.guards.find(g => g.id === guardId);
    if (existing) {
      existing.lng = lng;
      existing.lat = lat;
      if (status) existing.status = status;
    } else {
      this.guards.push({ id: guardId, lng, lat, status });
    }
  }

  getGuard(guardId) {
    return this.guards.find(g => g.id === guardId);
  }

  // Equivalent to GEORADIUS using Haversine
  getGuardsInRadius(lng, lat, radiusInMeters) {
    const R = 6371e3; // Earth radius in meters
    const toRad = x => (x * Math.PI) / 180;
    
    return this.guards.map(g => {
      const dLat = toRad(g.lat - lat);
      const dLng = toRad(g.lng - lng);
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(toRad(lat)) * Math.cos(toRad(g.lat)) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      return { ...g, distance };
    })
    .filter(g => g.distance <= radiusInMeters && g.status === 'active')
    .sort((a, b) => a.distance - b.distance);
  }
}

module.exports = new MemoryEngine();
