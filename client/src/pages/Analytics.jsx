import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import { Clock, Users, AlertTriangle, RotateCcw, Activity, TrendingUp, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#ec4899'];

const Analytics = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getToken = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return userInfo.token;
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/events', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      setEvents(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const restartEvent = async (eventId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/restart`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}` 
        }
      });
      if (res.ok) {
        alert('Event restarted! Redirecting to dashboard...');
        window.location.href = '/';
      }
    } catch (err) {
      console.error(err);
    }
  };

  const archivedEvents = events.filter(e => !e.isActive);
  const activeEvent = events.find(e => e.isActive);

  // Chart data
  const capacityData = archivedEvents.slice(0, 8).map(e => ({
    name: e.name.substring(0, 12),
    capacity: e.maxCapacity,
    peak: e.stats?.peakCrowd || 0,
    avg: e.stats?.avgCrowd || 0
  }));

  const guardDistribution = archivedEvents.slice(0, 6).map((e, i) => ({
    name: e.name.substring(0, 10),
    value: e.guardsCount
  }));

  const durationData = archivedEvents.slice(0, 10).map(e => ({
    name: e.name.substring(0, 10),
    duration: e.stats?.duration || 0,
    alerts: e.stats?.alertsTriggered || 0
  }));

  return (
    <div className="flex h-screen bg-background text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative w-full">
        <TopBar alertActive={false} />

        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">Event Analytics</h1>
            <p className="text-slate-400 mt-1">Historical performance metrics and event intelligence.</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <SummaryCard icon={<Activity size={20} />} label="Total Events" value={events.length} color="text-primary" />
            <SummaryCard icon={<Users size={20} />} label="Total Guards Deployed" value={events.reduce((s, e) => s + (e.guardsCount || 0), 0)} color="text-green-400" />
            <SummaryCard icon={<TrendingUp size={20} />} label="Avg Peak Crowd" value={archivedEvents.length > 0 ? Math.round(archivedEvents.reduce((s, e) => s + (e.stats?.peakCrowd || 0), 0) / archivedEvents.length) : 0} color="text-yellow-400" />
            <SummaryCard icon={<AlertTriangle size={20} />} label="Total Alerts" value={archivedEvents.reduce((s, e) => s + (e.stats?.alertsTriggered || 0), 0)} color="text-red-400" />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Capacity vs Peak Chart */}
            <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Capacity vs Peak Analysis</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={capacityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#ffffff30" tick={{ fill: '#ffffff50', fontSize: 10 }} />
                  <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff50', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', color: '#fff', borderRadius: '8px' }} />
                  <Bar dataKey="capacity" fill="#0ea5e9" opacity={0.3} name="Max Capacity" />
                  <Bar dataKey="peak" fill="#ef4444" name="Peak Crowd" />
                  <Bar dataKey="avg" fill="#22c55e" name="Avg Crowd" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Guard Distribution Pie */}
            <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Guard Distribution by Event</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={guardDistribution} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {guardDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', color: '#fff', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Duration & Alerts Chart */}
          <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md mb-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Event Duration & Alert Frequency</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={durationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#ffffff30" tick={{ fill: '#ffffff50', fontSize: 10 }} />
                <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff50', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', color: '#fff', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="duration" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} name="Duration (min)" />
                <Area type="monotone" dataKey="alerts" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} name="Alerts" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Active Event Banner */}
          {activeEvent && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 mb-6 flex justify-between items-center">
              <div>
                <span className="text-green-400 font-bold text-sm uppercase tracking-wider">Currently Active</span>
                <h3 className="text-xl font-bold text-white">{activeEvent.name}</h3>
                <p className="text-slate-400 text-sm">{activeEvent.location} · {activeEvent.guardsCount} guards</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/builder/${activeEvent._id}`)}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Pencil size={12} /> Edit
                </button>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                </span>
                <span className="text-green-400 font-mono text-sm">LIVE</span>
              </div>
            </div>
          )}

          {/* Archived Events Table */}
          <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Archived Operations</h3>
            {archivedEvents.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No archived events yet. Complete an operation to see historical records.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Operation</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Location</th>
                      <th className="text-center py-3 px-4 text-slate-400 font-medium">Guards</th>
                      <th className="text-center py-3 px-4 text-slate-400 font-medium">Peak</th>
                      <th className="text-center py-3 px-4 text-slate-400 font-medium">Avg</th>
                      <th className="text-center py-3 px-4 text-slate-400 font-medium">Alerts</th>
                      <th className="text-center py-3 px-4 text-slate-400 font-medium">Duration</th>
                      <th className="text-center py-3 px-4 text-slate-400 font-medium">Date</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archivedEvents.map((event) => (
                      <tr key={event._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">{event.name}</td>
                        <td className="py-3 px-4 text-slate-300">{event.location}</td>
                        <td className="py-3 px-4 text-center text-primary font-mono">{event.guardsCount}</td>
                        <td className="py-3 px-4 text-center text-red-400 font-mono">{event.stats?.peakCrowd || '—'}</td>
                        <td className="py-3 px-4 text-center text-green-400 font-mono">{event.stats?.avgCrowd || '—'}</td>
                        <td className="py-3 px-4 text-center text-yellow-400 font-mono">{event.stats?.alertsTriggered || 0}</td>
                        <td className="py-3 px-4 text-center text-slate-300 font-mono">{event.stats?.duration || 0}m</td>
                        <td className="py-3 px-4 text-center text-slate-500 text-xs">{new Date(event.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <button 
                              onClick={() => navigate(`/builder/${event._id}`)}
                              className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                            >
                              <Pencil size={12} /> Edit
                            </button>
                            <button 
                              onClick={() => restartEvent(event._id)}
                              className="bg-primary/20 hover:bg-primary/40 text-primary px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                            >
                              <RotateCcw size={12} /> Restart
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, label, value, color }) => (
  <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-5 backdrop-blur-md">
    <div className="flex items-center gap-2 mb-2">
      <span className={color}>{icon}</span>
      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-3xl font-bold text-white">{value}</div>
  </div>
);

export default Analytics;
