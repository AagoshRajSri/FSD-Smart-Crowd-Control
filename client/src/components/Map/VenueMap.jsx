import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEngineStore } from '../../store/useEngineStore';

// Static venue polygons from seed
const ZONES = [
  { id: 'MAIN_STAGE', name: 'Main Stage', max: 1500, coords: [[19.0760, 72.8770], [19.0760, 72.8780], [19.0770, 72.8780], [19.0770, 72.8770]] },
  { id: 'NORTH_GATE', name: 'North Gate', max: 1000, coords: [[19.0770, 72.8770], [19.0770, 72.8780], [19.0775, 72.8780], [19.0775, 72.8770]] },
  { id: 'FOOD_COURT', name: 'Food Court', max: 800, coords: [[19.0755, 72.8770], [19.0755, 72.8780], [19.0760, 72.8780], [19.0760, 72.8770]] },
  { id: 'VIP_LOUNGE', name: 'VIP Lounge', max: 300, coords: [[19.0760, 72.8765], [19.0760, 72.8770], [19.0770, 72.8770], [19.0770, 72.8765]] }
];

const getDensityColor = (count, max) => {
  if (!count) return 'rgba(34, 197, 94, 0.4)'; // Green
  const pct = count / max;
  if (pct < 0.5) return 'rgba(34, 197, 94, 0.4)'; // Green
  if (pct < 0.85) return 'rgba(234, 179, 8, 0.6)'; // Yellow
  return 'rgba(239, 68, 68, 0.8)'; // Red
};

const VenueMap = () => {
  const { heatmap, guards } = useEngineStore();

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 relative shadow-2xl z-0">
        <MapContainer center={[19.0765, 72.8778]} zoom={17} style={{ height: '100%', width: '100%', backgroundColor: '#0f172a' }}>
            {/* Dark abstract base layer */}
            <TileLayer
                attribution='&copy; <a href="https://carto.com/">Carto</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Zone Polygons */}
            {ZONES.map(z => {
                const liveCount = heatmap[z.id] || 0;
                const color = getDensityColor(liveCount, z.max);
                const isCritical = liveCount / z.max >= 0.85;

                return (
                    <Polygon 
                        key={z.id}
                        positions={z.coords}
                        pathOptions={{ 
                            fillColor: color, 
                            color, 
                            weight: 2, 
                            fillOpacity: 1,
                            className: isCritical ? 'animate-[pulse_1s_ease-in-out_infinite]' : '' 
                        }}
                    >
                        <Popup>
                           <div className="text-black font-sans">
                               <h3 className="font-bold">{z.name}</h3>
                               <p>Capacity: {liveCount} / {z.max}</p>
                           </div>
                        </Popup>
                    </Polygon>
                )
            })}

            {/* Guard Blips */}
            {guards.map(g => (
                <CircleMarker 
                    key={g.id} 
                    center={[g.lat, g.lng]} 
                    radius={6} 
                    pathOptions={{ color: '#22d3ee', fillColor: '#0ea5e9', fillOpacity: 1 }}
                >
                    <Popup>Guard: {g.id}</Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    </div>
  );
};

export default VenueMap;
