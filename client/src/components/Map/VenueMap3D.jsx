import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { FlyToInterpolator } from '@deck.gl/core';
import { PolygonLayer, ScatterplotLayer, PathLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEngineStore } from '../../store/useEngineStore';

const INITIAL_VIEW_STATE = {
  longitude: 72.8778,
  latitude: 19.0765,
  zoom: 16.5,
  pitch: 50,
  bearing: 0
};

// Geometry calculated dynamically in component

const VenueMap3D = () => {
  const { heatmap, guards, focusedLocation, setFocusedLocation, zones, routes, routeHeatmap } = useEngineStore();
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  // Helper: compute centroid of a polygon's vertices
  const centroid = (coords) => {
    if (!coords || coords.length === 0) return [0, 0];
    const lngSum = coords.reduce((s, c) => s + c[0], 0);
    const latSum = coords.reduce((s, c) => s + c[1], 0);
    return [lngSum / coords.length, latSum / coords.length];
  };



  // Auto-fly to event area when zones load
  useEffect(() => {
    if (zones.length > 0 && !focusedLocation) {
      const allCoords = zones.flatMap(z => z.coordinates);
      const c = centroid(allCoords);
      setViewState(prev => ({
        ...prev,
        longitude: c[0],
        latitude: c[1],
        zoom: 16.5,
        pitch: 50,
        transitionDuration: 1500,
        transitionInterpolator: new FlyToInterpolator()
      }));
    }
  }, [zones.length]);

  useEffect(() => {
    if (focusedLocation) {
        setViewState({
            ...viewState,
            longitude: focusedLocation.longitude,
            latitude: focusedLocation.latitude,
            zoom: focusedLocation.zoom || 18,
            transitionDuration: 1000,
            transitionInterpolator: new FlyToInterpolator()
        });
        setFocusedLocation(null);
    }
  }, [focusedLocation, viewState, setFocusedLocation]);

  const layers = [
    new PolygonLayer({
      id: 'zones-3d-layer',
      data: zones,
      extruded: true,
      wireframe: true,
      elevationScale: 1, // 1 unit = 1 meter
      getPolygon: d => d.coordinates,
      getElevation: d => {
        const count = heatmap[d.zoneId] || 0;
        return (count / d.maxCapacity) * 100; // Tower up to 100 meters high based on density
      },
      getFillColor: d => {
        const pct = (heatmap[d.zoneId] || 0) / d.maxCapacity;
        if (pct < 0.5) return [34, 197, 94, 150]; // Green
        if (pct < 0.85) return [234, 179, 8, 150]; // Yellow
        return [239, 68, 68, 200]; // Red
      },
      getLineColor: [255, 255, 255, 50],
      transitions: {
        getElevation: 1000,
        getFillColor: 1000
      }
    }),

    new ScatterplotLayer({
      id: 'guards-layer',
      data: guards,
      getPosition: d => [d.lng, d.lat],
      getFillColor: d => {
          if (d.status === 'En Route') return [234, 179, 8, 255]; // yellow
          if (d.status === 'Engaged') return [239, 68, 68, 255]; // red
          return [14, 165, 233, 255]; // primary blue
      },
      getRadius: 5,
      radiusUnits: 'meters',
      stroked: true,
      getLineColor: [255, 255, 255, 200],
      lineWidthMinPixels: 2,
      parameters: { depthTest: false }
    }),

    new PathLayer({
      id: 'routes-layer',
      data: routes,
      getPath: d => d.path,
      getColor: d => {
        const congestion = routeHeatmap[d.routeId] || 0;
        if (congestion < 0.4) return [34, 197, 94, 255]; // Green
        if (congestion < 0.75) return [234, 179, 8, 255]; // Yellow
        return [239, 68, 68, 255]; // Red
      },
      getWidth: 5,
      widthUnits: 'pixels',
      capRounded: true,
      jointRounded: true,
      parameters: { depthTest: false }
    })
  ];

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-slate-700/50 relative shadow-lg z-0">
      <DeckGL
        viewState={viewState}
        onViewStateChange={e => setViewState(e.viewState)}
        controller={true}
        layers={layers}
      >
        <Map 
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        />
      </DeckGL>
      
      {/* Legend Override Overlay */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur border border-white/10 p-3 rounded-lg pointer-events-none">
         <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Zone Metrics</h4>
         <div className="flex flex-col gap-1 text-xs font-mono">
            {zones.map(z => (
               <div key={z.zoneId} className="flex justify-between gap-4">
                  <span>{z.name}:</span>
                  <span className={((heatmap[z.zoneId]||0)/z.maxCapacity) >= 0.85 ? 'text-alert' : 'text-secondary'}>
                     {heatmap[z.zoneId] || 0} / {z.maxCapacity}
                  </span>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default VenueMap3D;
