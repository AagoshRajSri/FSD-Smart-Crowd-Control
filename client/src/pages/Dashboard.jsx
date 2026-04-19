import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSocket } from '../contexts/SocketContext';
import AlertSystem from '../components/ui/AlertSystem';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import VenueMap3D from '../components/Map/VenueMap3D';
import ThreatRadar from '../components/Predictive/ThreatRadar';
import MobileDispatchView from '../components/Dispatch/MobileDispatchView';
import GuardRoster from '../components/Dispatch/GuardRoster';
import { useEngineStore } from '../store/useEngineStore';
import { TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard = () => {
  const socket = useSocket();
  const [data, setData] = useState([]);
  const [currentEvent, setCurrentEvent] = useState('Loading...');
  const [alert, setAlert] = useState(null);
  const [stats, setStats] = useState({ current: 0, max: 0, percent: 0 });
  const { setHeatmap, setGuards, setZones, setRoutes, setRouteHeatmap, setActiveEvent, activeEvent } = useEngineStore();

  useEffect(() => {
    const fetchActiveEvent = async () => {
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
            
            const rRes = await fetch(`http://localhost:5000/api/events/${active._id}/routes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const rData = await rRes.json();
            setRoutes(rData);
        } else {
            setActiveEvent(null);
            setZones([]);
            setRoutes([]);
        }
      } catch (err) { console.error(err); }
    };
    fetchActiveEvent();
  }, [setActiveEvent, setZones, setRoutes]);

  useEffect(() => {
    if (!socket) return;

    socket.on('heatmap_tick', (payload) => {
        setHeatmap(payload);
        let total = 0;
        Object.values(payload).forEach(v => total += v);
        
        const max = activeEvent ? activeEvent.maxCapacity : 3600;
        const percent = ((total / max) * 100).toFixed(1);

        setStats({ current: total, max: max, percent: parseFloat(percent) });

        // Feed live chart
        setData((prevData) => {
          const newData = [...prevData, { 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
            crowd: total 
          }];
          if (newData.length > 20) newData.shift();
          return newData;
        });
    });

    socket.on('guard_positions', (payload) => {
        setGuards(payload);
    });

    socket.on('ALERT', (payload) => {
      setAlert(payload.message);
      setTimeout(() => setAlert(null), 5000);
    });

    socket.on('route_heatmap', (payload) => {
      setRouteHeatmap(payload);
    });

    return () => {
      socket.off('heatmap_tick');
      socket.off('guard_positions');
      socket.off('ALERT');
      socket.off('route_heatmap');
    };
  }, [socket, activeEvent]);

  return (
    <div className="flex h-screen bg-background text-white overflow-hidden">
      <Sidebar />
      <MobileDispatchView />
      <div className="flex-1 flex flex-col relative w-full">
        <TopBar alertActive={!!alert} />
        {alert && <AlertSystem message={alert} />}

        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">Live Operations Center</h1>
            <p className="text-slate-400">Real-time geospatial telemetry and predictive analysis.</p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard 
                title="Total Venue Crowd" 
                value={stats.current} 
                trend="+3.2%" 
                trendUp={true} 
            />
            <MetricCard 
                title="Active Capacity Limits" 
                value={stats.max} 
                trend="Stable" 
                trendUp={null} 
            />
            <MetricCard 
                title="Global Load Efficiency" 
                value={`${stats.percent}%`} 
                trend={stats.percent > 90 ? "Critical" : "+1.8%"} 
                trendUp={stats.percent <= 90} 
                glow={stats.percent > 90 ? 'shadow-[0_0_20px_rgba(239,68,68,0.3)] border-alert/50' : ''}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full pb-20">
              {/* Left Main Map */}
              <div className="lg:col-span-2 h-[750px] lg:h-[800px]">
                 <VenueMap3D />
              </div>

              {/* Right Side Stack */}
              <div className="flex flex-col gap-6">
                 {/* Live Chart */}
                 <div className="w-full flex-1 bg-slate-900/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md shadow-lg overflow-hidden min-h-[250px]">
                    <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                      </span>
                      <span className="text-sm font-medium text-secondary tracking-widest">LIVE DATA</span>
                    </div>
                    
                    <div className="w-full h-full pt-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorCrowd" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorAlert" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey="time" stroke="#ffffff30" tick={{ fill: '#ffffff50', fontSize: 10 }} />
                            <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff50', fontSize: 10 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', color: '#fff', borderRadius: '8px' }} />
                            <Area 
                              type="monotone" 
                              dataKey="crowd" 
                              stroke={stats.percent > 90 ? '#ef4444' : '#22d3ee'} 
                              strokeWidth={3}
                              fillOpacity={1} 
                              fill={stats.percent > 90 ? 'url(#colorAlert)' : 'url(#colorCrowd)'} 
                              isAnimationActive={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                    </div>
                 </div>

                 {/* Forecasting Module */}
                 <ThreatRadar />

                 {/* Active Personnel Roster */}
                 <GuardRoster />
              </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, trend, trendUp, glow = '' }) => (
  <div className={`bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 shadow-lg ${glow} transition-all duration-300 flex justify-between items-end`}>
    <div>
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">{title}</h3>
        <div className="text-4xl font-bold tracking-tight text-white">{value}</div>
    </div>
    
    {trend && (
        <div className={`flex items-center gap-1 text-sm font-bold ${trendUp === false ? 'text-alert' : trendUp === true ? 'text-green-400' : 'text-slate-500'}`}>
            {trendUp === true && <TrendingUp size={16} />}
            {trendUp === false && <TrendingDown size={16} />}
            <span>{trend}</span>
        </div>
    )}
  </div>
);

export default Dashboard;
