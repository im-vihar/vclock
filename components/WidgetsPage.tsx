
import React, { useState, useEffect } from 'react';
import { 
    CheckSquare, Battery, BatteryCharging, 
    Monitor, Activity, CloudRain, Flame, Wind, Plus, Trash2, 
    Newspaper, Zap
} from 'lucide-react';
import { WidgetCard } from './WidgetCard';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { useSettings } from '../contexts/SettingsContext';
import { AudioVisualizer } from './AudioVisualizer';

// --- SUB-COMPONENTS ---

const GreetingHeader = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const hour = time.getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    
    return (
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 border-b border-white/5 pb-8">
            <div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-2">{greeting}</h1>
                <p className="text-zinc-400 font-medium text-lg">System Dashboard Active</p>
            </div>
            <div className="text-right mt-4 md:mt-0">
                <div className="text-5xl md:text-7xl font-mono font-bold text-white/90 leading-none">
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </div>
                <div className="text-indigo-400 font-bold uppercase tracking-widest mt-2">
                    {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>
        </div>
    );
};

const SystemRing = ({ percent, icon: Icon, color, label }: any) => {
    const r = 30;
    const c = 2 * Math.PI * r;
    const offset = c - (percent / 100) * c;
    
    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="50%" cy="50%" r={r} className="stroke-zinc-800" strokeWidth="6" fill="transparent" />
                    <circle 
                        cx="50%" cy="50%" r={r} 
                        className={`stroke-${color}-500 transition-all duration-1000 ease-out`} 
                        strokeWidth="6" 
                        strokeDasharray={c} 
                        strokeDashoffset={offset} 
                        strokeLinecap="round"
                        fill="transparent" 
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                    <Icon size={20} />
                </div>
            </div>
            <div className="text-center">
                <div className="text-xl font-bold text-white">{percent}%</div>
                <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">{label}</div>
            </div>
        </div>
    );
};

const SystemHealthWidget = () => {
    const status = useSystemStatus();
    // Simulate CPU/RAM for visuals
    const [simStats, setSimStats] = useState({ cpu: 12, ram: 45 });
    useEffect(() => {
        const t = setInterval(() => {
            setSimStats({ 
                cpu: Math.floor(Math.random() * 30) + 10,
                ram: Math.floor(Math.random() * 10) + 40
            });
        }, 3000);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="h-full flex flex-col justify-between p-2">
            <div className="flex justify-around items-center h-full">
                <SystemRing 
                    percent={status.batteryLevel ? Math.round(status.batteryLevel * 100) : 100} 
                    icon={status.isCharging ? BatteryCharging : Battery} 
                    color={status.isCharging ? 'green' : 'indigo'}
                    label="Battery"
                />
                <SystemRing 
                    percent={simStats.cpu} 
                    icon={Zap} 
                    color="rose"
                    label="CPU Load"
                />
                 <SystemRing 
                    percent={simStats.ram} 
                    icon={Activity} 
                    color="amber"
                    label="Memory"
                />
            </div>
        </div>
    );
};

const AmbienceMixer = () => {
    const [sounds, setSounds] = useState([
        { id: 'rain', label: 'Rain', icon: CloudRain, val: 0 },
        { id: 'fire', label: 'Fire', icon: Flame, val: 0 },
        { id: 'wind', label: 'Wind', icon: Wind, val: 0 },
    ]);

    const updateVal = (id: string, val: number) => {
        setSounds(prev => prev.map(s => s.id === id ? { ...s, val } : s));
    };

    return (
        <div className="h-full flex flex-col justify-center gap-4 p-2">
            {sounds.map(s => (
                <div key={s.id} className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg transition-colors ${s.val > 0 ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                        <s.icon size={18} />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between text-xs font-bold uppercase mb-1 text-zinc-500">
                            <span>{s.label}</span>
                            <span>{s.val}%</span>
                        </div>
                        <input 
                            type="range" min="0" max="100" 
                            value={s.val} 
                            onChange={(e) => updateVal(s.id, parseInt(e.target.value))}
                            className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-white"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

const TodoWidget = () => {
    const [tasks, setTasks] = useState<{id: number, text: string, done: boolean}[]>([
        { id: 1, text: "Review System Logs", done: false },
        { id: 2, text: "Backup Data", done: true },
    ]);
    const [input, setInput] = useState("");

    const add = () => {
        if (!input.trim()) return;
        setTasks(p => [...p, { id: Date.now(), text: input, done: false }]);
        setInput("");
    };

    return (
        <div className="h-full flex flex-col p-1">
            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2 mb-4 pr-2">
                {tasks.map(t => (
                    <div key={t.id} className="group flex items-center gap-3 bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors">
                        <button 
                            onClick={() => setTasks(p => p.map(x => x.id === t.id ? { ...x, done: !x.done } : x))}
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${t.done ? 'bg-green-500 border-green-500' : 'border-zinc-600 hover:border-zinc-400'}`}
                        >
                            {t.done && <CheckSquare size={12} className="text-black" />}
                        </button>
                        <span className={`flex-1 text-sm ${t.done ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>{t.text}</span>
                        <button onClick={() => setTasks(p => p.filter(x => x.id !== t.id))} className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity">
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && add()}
                    placeholder="Add task..."
                    className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
                />
                <button onClick={add} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-colors">
                    <Plus size={18} />
                </button>
            </div>
        </div>
    );
};

const NoteWidget = () => {
    const [note, setNote] = useState(() => localStorage.getItem('cobalt_note_v2') || '');
    useEffect(() => localStorage.setItem('cobalt_note_v2', note), [note]);
    return (
        <div className="h-full relative group">
            <textarea 
                className="w-full h-full bg-yellow-100/5 hover:bg-yellow-100/10 transition-colors resize-none focus:outline-none text-yellow-100/80 placeholder-yellow-100/30 p-4 font-mono text-sm leading-relaxed rounded-xl border border-yellow-500/10 focus:border-yellow-500/30"
                placeholder="Quick notes..."
                value={note}
                onChange={e => setNote(e.target.value)}
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded">
                AUTOSAVED
            </div>
        </div>
    );
};

const VisualizerPreview = () => {
    const { settings, updateSettings } = useSettings();
    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 bg-black/40 rounded-xl overflow-hidden relative border border-white/5">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    {!settings.enableVisualizer && <span className="text-xs text-zinc-500 font-bold uppercase">Mic Off</span>}
                </div>
                {settings.enableVisualizer && (
                     <AudioVisualizer isActive={true} sensitivity={settings.visualizerSensitivity} color="#818cf8" />
                )}
            </div>
            <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 uppercase">Mic Input</span>
                <button 
                    onClick={() => updateSettings({ enableVisualizer: !settings.enableVisualizer })}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${settings.enableVisualizer ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}
                >
                    {settings.enableVisualizer ? 'ON' : 'OFF'}
                </button>
            </div>
        </div>
    );
};

const NewsTicker = () => {
    const headlines = [
        "AI Models Surpass Human Reasoning Benchmarks",
        "SpaceX Announces Mars Colony Timeline",
        "Quantum Computing Reaches New Milestone",
        "Global Green Energy Output Doubles",
        "New VR Headsets redefine immersion"
    ];
    return (
        <div className="h-full flex items-center overflow-hidden whitespace-nowrap mask-linear">
             <div className="animate-ticker inline-block">
                 {headlines.map((h, i) => (
                     <span key={i} className="text-lg md:text-xl font-medium text-zinc-300 mr-12">
                         <span className="text-indigo-400 font-bold mr-2">•</span> {h}
                     </span>
                 ))}
             </div>
             <style>{`
                .animate-ticker { animation: ticker 20s linear infinite; }
                @keyframes ticker { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
             `}</style>
        </div>
    );
};

// --- MAIN PAGE ---

export const WidgetsPage: React.FC = () => {
    return (
        <div className="w-full h-full p-6 md:p-12 overflow-y-auto">
            <div className="max-w-[1600px] mx-auto pb-24">
                <GreetingHeader />
                
                {/* BENTO GRID LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
                    
                    {/* System Health (Wide) */}
                    <WidgetCard title="System Status" className="md:col-span-2 md:row-span-1">
                        <SystemHealthWidget />
                    </WidgetCard>

                    {/* Ambience Mixer */}
                    <WidgetCard title="Ambience Mixer" className="md:col-span-1 md:row-span-2">
                        <AmbienceMixer />
                    </WidgetCard>

                    {/* Quick Notes */}
                    <WidgetCard title="Scratchpad" className="md:col-span-1 md:row-span-2 bg-yellow-900/5">
                        <NoteWidget />
                    </WidgetCard>

                    {/* News Ticker (Wide Strip) */}
                    <WidgetCard className="md:col-span-2 md:row-span-1 flex items-center bg-indigo-900/10 border-indigo-500/20">
                         <div className="flex items-center gap-4 w-full px-4">
                             <Newspaper className="text-indigo-400 flex-shrink-0" />
                             <div className="h-8 w-[1px] bg-white/10 mx-2" />
                             <div className="flex-1 overflow-hidden relative h-10">
                                 <NewsTicker />
                             </div>
                         </div>
                    </WidgetCard>

                    {/* Visualizer Preview */}
                    <WidgetCard title="Audio Input" className="md:col-span-1 md:row-span-1">
                        <VisualizerPreview />
                    </WidgetCard>

                    {/* Todo List (Tall) */}
                    <WidgetCard title="Tasks" className="md:col-span-1 md:row-span-2">
                        <TodoWidget />
                    </WidgetCard>

                     {/* Placeholder / Decoration */}
                     <WidgetCard className="md:col-span-2 md:row-span-1 bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border-emerald-500/20 flex items-center justify-center">
                        <div className="text-center">
                            <Monitor size={48} className="mx-auto mb-4 text-emerald-400 opacity-50" />
                            <div className="text-2xl font-bold text-emerald-100">All Systems Operational</div>
                            <div className="text-emerald-500/60 text-sm font-mono mt-2">VCLOCK OS v1.1</div>
                        </div>
                    </WidgetCard>

                </div>
            </div>
        </div>
    );
};
