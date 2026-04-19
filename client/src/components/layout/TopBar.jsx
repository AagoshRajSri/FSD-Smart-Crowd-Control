import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const TopBar = ({ currentEvent = 'North Gate Frontline', alertActive }) => {
  const [time, setTime] = useState(new Date());
  const { user, logout } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-16 w-full bg-white/5 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 z-10 relative">
      <div className="flex items-center gap-4">
        <div className="px-3 py-1 bg-primary/20 border border-primary/50 rounded-md text-secondary font-mono text-sm tracking-widest shadow-[0_0_10px_rgba(34,211,238,0.2)]">
          {time.toLocaleTimeString()}
        </div>
        <div className="text-gray-300 font-medium">
          OPERATION: <span className="text-white font-bold tracking-wide">{currentEvent}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer">
          <Bell size={24} className={alertActive ? 'text-alert animate-bounce' : 'text-gray-300 hover:text-white'} />
          {alertActive && (
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-alert opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-alert"></span>
            </span>
          )}
        </div>
        
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">{user.name}</span>
            <button 
              onClick={logout}
              className="text-xs px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
            >
              LOGOUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
