import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import VenueMap3D from '../components/Map/VenueMap3D';
import { useEngineStore } from '../store/useEngineStore';
import { Crosshair, Shield, Activity, MapPin } from 'lucide-react';

const GuardManagement = () => {
  const { guards, heatmap, zones, setFocusedLocation, setZones, setActiveEvent } = useEngineStore();
  const [activeTab, setActiveTab] = useState('guards');

  // Fetch active event zones on mount
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const token = userInfo.token;
        const res = await fetch('http://localhost:5000/api/events', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const events = await res.json();
        const active = events.find(e => e.isActive);
        if (active) {
          setActiveEvent(active);
          const zRes = await fetch(`http://localhost:5000/api/events/${active._id}/zones`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const zData = await zRes.json();
          setZones(zData);
        }
      } catch (err) { console.error(err); }
    };
    if (zones.length === 0) fetchZones();
  }, []);

  const centroid = (coords) => {
    if (!coords || coords.length === 0) return [0, 0];
    const lngSum = coords.reduce((s, c) => s + c[0], 0);
    const latSum = coords.reduce((s, c) => s + c[1], 0);
    return [lngSum / coords.length, latSum / coords.length];
  };

  const handleFocus = (lng, lat, zoom = 18.5) => {
    setFocusedLocation({ longitude: lng, latitude: lat, zoom });
  };

  return (
    <div className="flex h-screen bg-background text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative w-full">
        <TopBar alertActive={false} />

        <main className="flex-1 p-6 lg:p-10 overflow-y-auto flex gap-6">
          {/* Left Panel: Lists */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">Command & Dispatch</h1>
              <p className="text-slate-400">Personnel tracking and zone coordination.</p>
            </div>

            <div className="flex bg-slate-800 rounded-lg p-1">
               <button 
                 onClick={() => setActiveTab('guards')}
                 className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'guards' ? 'bg-primary text-white shadow' : 'text-slate-400 hover:text-white'}`}
               >
                 Guards ({guards.length})
               </button>
               <button 
                 onClick={() => setActiveTab('zones')}
                 className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'zones' ? 'bg-primary text-white shadow' : 'text-slate-400 hover:text-white'}`}
               >
                 Zones ({zones.length})
               </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {activeTab === 'guards' ? (
                 guards.map(g => (
                    <div key={g.id} className="bg-slate-900/60 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 ${g.status === 'Engaged' ? 'text-alert' : g.status === 'En Route' ? 'text-yellow-400' : 'text-secondary'}`}>
                             <Shield size={20} />
                          </div>
                          <div>
                             <h4 className="font-bold text-white">{g.id}</h4>
                             <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Activity size={12} />
                                <span>{g.status}</span>
                             </div>
                          </div>
                       </div>
                       <button 
                         onClick={() => handleFocus(g.lng, g.lat, 19.5)}
                         className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                         title="Focus on Map"
                       >
                         <Crosshair size={18} />
                       </button>
                    </div>
                 ))
              ) : (
                 zones.map(z => {
                   const c = centroid(z.coordinates);
                   return (
                    <div key={z.zoneId} className="bg-slate-900/60 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 text-primary">
                             <MapPin size={20} />
                          </div>
                          <div>
                             <h4 className="font-bold text-white">{z.name}</h4>
                             <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span>Crowd: {heatmap[z.zoneId] || 0} / {z.maxCapacity}</span>
                             </div>
                          </div>
                       </div>
                       <button 
                         onClick={() => handleFocus(c[0], c[1], 18.5)}
                         className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                         title="Focus on Zone"
                       >
                         <Crosshair size={18} />
                       </button>
                    </div>
                   );
                 })
              )}
            </div>
          </div>

          {/* Right Panel: Map */}
          <div className="flex-1 h-[800px]">
            <VenueMap3D />
          </div>
        </main>
      </div>
    </div>
  );
};

export default GuardManagement;
