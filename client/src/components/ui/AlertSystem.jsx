import React from 'react';
import { AlertTriangle } from 'lucide-react';

const AlertSystem = ({ message }) => {
  return (
    <>
      <div className="absolute inset-0 z-0 pointer-events-none bg-alert/10 animate-[pulse_1s_ease-in-out_infinite]" />
      <div className="absolute top-20 right-6 z-50 animate-[slideIn_0.3s_ease-out]">
        <div className="bg-black/80 backdrop-blur-xl border border-alert border-l-4 border-l-alert text-white rounded-lg p-4 shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-start gap-4 max-w-md">
          <AlertTriangle className="text-alert shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-alert tracking-wider">CRITICAL ALERT</h3>
            <p className="text-gray-200 text-sm mt-1">{message}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertSystem;
