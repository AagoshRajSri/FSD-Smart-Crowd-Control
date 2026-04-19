import React from 'react';
import { LayoutDashboard, BarChart2, Settings, User, Shield, MapPin } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="h-screen w-16 md:w-56 bg-white/5 backdrop-blur-md border-r border-white/10 flex flex-col items-center md:items-start py-6 transition-all duration-300 z-10 shrink-0">
      <div className="flex items-center justify-center w-full mb-8 md:justify-start md:px-6">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(14,165,233,0.5)]">
          P
        </div>
        <span className="hidden md:block ml-3 font-bold text-xl tracking-wider text-white">PRAHAR</span>
      </div>

      <nav className="w-full flex-1 flex flex-col gap-2">
        <NavItem to="/" icon={<LayoutDashboard size={24} />} label="Dashboard" />
        <NavItem to="/guards" icon={<Shield size={24} />} label="Guard Dispatch" />
        <NavItem to="/builder" icon={<MapPin size={24} />} label="Event Builder" />
        <NavItem to="/analytics" icon={<BarChart2 size={24} />} label="Analytics" />
        <NavItem to="/settings" icon={<Settings size={24} />} label="Settings" />
      </nav>

      <div className="w-full">
        <NavItem to="/profile" icon={<User size={24} />} label="Profile" />
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-6 py-3 w-full transition-colors duration-200 ${
          isActive 
            ? 'bg-primary/20 border-r-4 border-primary text-secondary' 
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`
      }
    >
      <div className="flex justify-center w-full md:w-auto">{icon}</div>
      <span className="hidden md:block ml-4 font-medium">{label}</span>
    </NavLink>
  );
};

export default Sidebar;
