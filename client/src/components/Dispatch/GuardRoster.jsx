import React from 'react';
import { useEngineStore } from '../../store/useEngineStore';

const GuardRoster = () => {
    const { guards } = useEngineStore();

    return (
        <div className="w-full bg-slate-900/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md shadow-lg h-64 overflow-y-auto">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Active Personnel</h3>
            
            {guards.length === 0 ? (
                <p className="text-slate-500 font-mono text-xs">No active guards linked.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {guards.map(g => (
                        <div key={g.id} className="flex items-center justify-between bg-black/30 p-3 rounded-lg border border-white/5">
                            <span className="font-bold text-white tracking-widest">{g.id}</span>
                            <StatusBadge status={g.status} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const StatusBadge = ({ status }) => {
    let colorClass = "bg-primary/20 text-secondary border-primary/50"; // Default Patrolling
    if (status === 'En Route') colorClass = "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
    if (status === 'Engaged') colorClass = "bg-alert/20 text-alert border-alert/50";

    return (
        <span className={`px-2 py-1 text-xs font-bold uppercase rounded border ${colorClass} tracking-wider`}>
            {status}
        </span>
    );
};

export default GuardRoster;
