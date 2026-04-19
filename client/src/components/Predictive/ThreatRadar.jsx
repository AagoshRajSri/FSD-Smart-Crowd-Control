import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useSocket } from '../../contexts/SocketContext';
import { useEngineStore } from '../../store/useEngineStore';

const ThreatRadar = () => {
    const socket = useSocket();
    const { predictionAlert, setPredictionAlert, clearPredictionAlert } = useEngineStore();
    const [mockHistory, setMockHistory] = useState([
        { time: '10:00', count: 300, future: null },
        { time: '10:05', count: 450, future: null },
        { time: '10:10', count: 650, future: null },
        { time: '10:15', count: 850, future: null }
    ]);

    useEffect(() => {
        if(!socket) return;
        socket.on('prediction_alert', (data) => {
            setPredictionAlert(data);
            
            // Build visual projection bridging current trend to future max
            setMockHistory(prev => [
                ...prev.slice(0, 4),
                { time: '10:15', count: null, future: 850 },
                { time: `+${data.timeToMax}m`, count: null, future: 1000 }
            ]);
        });
        
        return () => socket.off('prediction_alert');
    }, [socket]);

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm shadow-2xl relative h-64 overflow-hidden">
            <h3 className="text-gray-400 text-sm font-medium tracking-wider mb-2">PREDICTIVE FORECASTING</h3>
            
            {predictionAlert ? (
                <div className="mb-2 bg-alert/20 border border-alert p-2 rounded animate-pulse">
                    <p className="text-alert font-bold tracking-widest text-sm text-center">
                        ⚠️ {predictionAlert.zoneName} -&gt; MAX CAP IN {predictionAlert.timeToMax} MINS
                    </p>
                </div>
            ) : (
                <p className="text-secondary/50 font-mono text-xs mb-4">No critical trajectories detected.</p>
            )}

            <ResponsiveContainer width="100%" height="80%">
                <LineChart data={mockHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="time" stroke="#ffffff30" tick={{fontSize: 10}} />
                    <YAxis stroke="#ffffff30" tick={{fontSize: 10}} />
                    <Tooltip contentStyle={{backgroundColor: '#000', borderColor: '#333'}} />
                    <ReferenceLine y={1000} label="CRITICAL CAP" stroke="#ef4444" strokeDasharray="3 3" />
                    
                    {/* Historical Line */}
                    <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={3} dot={false} />
                    
                    {/* Future Dotted Line */}
                    <Line type="monotone" dataKey="future" stroke="#ef4444" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ThreatRadar;
