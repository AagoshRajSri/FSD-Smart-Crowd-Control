import React, { useEffect, useState } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { useEngineStore } from '../../store/useEngineStore';
import { ShieldAlert, Crosshair } from 'lucide-react';

const MobileDispatchView = () => {
    const socket = useSocket();
    const { dispatchActive, setDispatch, clearDispatch } = useEngineStore();
    const [acknowledged, setAcknowledged] = useState(false);

    useEffect(() => {
        if(!socket) return;

        socket.on('dispatch_order', (payload) => {
            setDispatch(payload);
            setAcknowledged(false);
            if (navigator.vibrate) {
                navigator.vibrate([200, 100, 200, 100, 500]);
            }
        });

        return () => socket.off('dispatch_order');
    }, [socket]);

    const handleAcknowledge = () => {
        setAcknowledged(true);
        socket.emit('guard_acknowledge', { guardId: 'G1' });
        setTimeout(() => {
            clearDispatch();
        }, 3000);
    };

    if (!dispatchActive) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className={`w-full max-w-sm rounded-2xl border ${acknowledged ? 'border-primary bg-primary/10' : 'border-alert bg-alert/10 animate-pulse'} p-6 shadow-2xl relative overflow-hidden`}>
                <div className="flex items-center gap-4 mb-6">
                    {acknowledged ? <Crosshair className="text-secondary" size={40} /> : <ShieldAlert className="text-alert" size={40} />}
                    <div>
                        <h2 className={`text-xl font-bold tracking-widest ${acknowledged ? 'text-secondary' : 'text-alert'}`}>
                            {acknowledged ? 'ROUTE CONFIRMED' : 'DISPATCH INITIATED'}
                        </h2>
                        <p className="text-gray-300 text-sm mt-1">Code: {dispatchActive.issue}</p>
                    </div>
                </div>

                <div className="bg-black/40 rounded-lg p-4 mb-6 border border-white/5">
                    <p className="text-gray-400 text-xs tracking-wider mb-1">TARGET LOCATION</p>
                    <p className="text-white text-xl font-bold tracking-wide">{dispatchActive.location}</p>
                    <p className="text-gray-500 font-mono text-xs mt-2">
                        LAT: {dispatchActive.coordinates[0].toFixed(5)}<br/>
                        LNG: {dispatchActive.coordinates[1].toFixed(5)}
                    </p>
                </div>

                {!acknowledged ? (
                    <button 
                        onClick={handleAcknowledge}
                        className="w-full py-4 bg-alert hover:bg-red-500 text-white font-bold tracking-widest rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all uppercase"
                    >
                        Acknowledge & Proceed
                    </button>
                ) : (
                    <div className="w-full py-4 text-center text-primary font-bold tracking-widest uppercase">
                        En Route to anomaly
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileDispatchView;
