
import React, { useState, useEffect } from 'react';
import { Calendar, Cpu, CheckSquare, Battery, BatteryCharging, Wifi, Monitor, Activity } from 'lucide-react';
import { WidgetCard } from './WidgetCard';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { useSettings } from '../contexts/SettingsContext';

// Simple SVG Line Chart for visual flair
const MiniChart = () => (
    <svg className="w-full h-12 stroke-emerald-400 stroke-2 fill-none" viewBox="0 0 100 20">
        <path d="M0,10 Q10,15 20,10 T40,10 T60,15 T80,5 T100,10" />
    </svg>
);

const HardwareWidget = () => {
    const status = useSystemStatus();
    
    return (
        <div className="p-5 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-wider">
                    <Monitor size={16} /> Display
                </div>
                <div className="text-xs font-mono text-zinc-500">{status.screenResolution}</div>
            </div>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {status.isCharging ? <BatteryCharging size={20} className="text-green-400" /> : <Battery size={20} className="text-zinc-300" />}
                        <span className="text-2xl font-bold">{status.batteryLevel !== null ? Math.round(status.batteryLevel * 100) : '--'}%</span>
                    </div>
                    <div className="h-2 w-16 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-green-400" style={{ width: `${(status.batteryLevel || 0) * 100}%` }} />
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <div className="flex items-center gap-2 text-zinc-300">
                        <Wifi size={18} />
                        <span className="text-sm">Network</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-md ${status.online ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {status.online ? 'ONLINE' : 'OFFLINE'}
                    </span>
                </div>
            </div>
        </div>
    );
};

const CalendarWidget = () => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date().getDate();
    return (
        <div className="p-5 h-full flex flex-col">
            <div className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4">
                <Calendar size={16} /> Calendar
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {days.map(d => <span key={d} className="text-[10px] text-zinc-600 font-bold">{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center flex-1">
                {Array.from({length: 28}, (_, i) => i + 1).map(d => (
                    <div key={d} className={`text-xs py-1.5 rounded-md ${d === today ? 'bg-white text-black font-bold shadow-lg' : 'text-zinc-500'}`}>
                        {d}
                    </div>
                ))}
            </div>
        </div>
    );
};

const NoteWidget = () => {
    const [note, setNote] = useState(() => localStorage.getItem('cobalt_note') || '');
    useEffect(() => localStorage.setItem('cobalt_note', note), [note]);
    return (
        <textarea 
            className="w-full h-full bg-transparent resize-none focus:outline-none text-zinc-300 placeholder-zinc-700 p-5 font-mono text-sm leading-relaxed"
            placeholder="Scrawl something..."
            value={note}
            onChange={e => setNote(e.target.value)}
        />
    );
};

export const WidgetsPage: React.FC = () => {
    const { settings } = useSettings();
    return (
        <div className="w-full h-full p-8 md:p-12 overflow-y-auto scrollbar-hide">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex items-center gap-4">
                    <Activity className={`text-${settings.accentColor === 'white' ? 'zinc-100' : settings.accentColor + '-500'}`} size={32} />
                    <h1 className="text-4xl font-bold text-white tracking-tight">System Dashboard</h1>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[180px]">
                    
                    {/* Hardware Stats */}
                    <WidgetCard className="col-span-1 row-span-1 lg:col-span-1 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50">
                        <HardwareWidget />
                    </WidgetCard>

                    {/* Calendar */}
                    <WidgetCard className="col-span-1 row-span-1 lg:row-span-2">
                        <CalendarWidget />
                    </WidgetCard>

                    {/* Notes */}
                    <WidgetCard className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 bg-yellow-500/5 border-yellow-500/10">
                         <NoteWidget />
                    </WidgetCard>

                    {/* Tasks */}
                    <WidgetCard className="col-span-1 lg:col-span-1 row-span-1">
                        <div className="p-5">
                             <div className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4">
                                <CheckSquare size={16} /> Tasks
                            </div>
                            <div className="space-y-3">
                                {['Review Systems', 'Update Firmware'].map((t,i) => (
                                    <div key={i} className="flex items-center gap-3 text-zinc-300 text-sm">
                                        <div className={`w-4 h-4 rounded border ${i===0?'bg-green-500 border-green-500':'border-zinc-600'}`} />
                                        <span className={i===0?'line-through opacity-50':''}>{t}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </WidgetCard>

                    {/* Decorative Data Viz */}
                    <WidgetCard className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col justify-end p-0 overflow-hidden relative">
                         <div className="p-5 absolute top-0 left-0">
                            <div className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-wider">
                                <Cpu size={16} /> CPU Load
                            </div>
                         </div>
                         <div className="w-full h-24 mt-auto">
                             <MiniChart />
                         </div>
                    </WidgetCard>

                </div>
            </div>
        </div>
    );
};
