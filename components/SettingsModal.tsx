
import React, { useState } from 'react';
import { X, Clock, Layout, Palette, Activity, Disc, Sparkles, User, HelpCircle, ExternalLink, Keyboard } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { AccentColor } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACCENTS: { id: AccentColor; color: string }[] = [
  { id: 'white', color: 'bg-zinc-100' },
  { id: 'indigo', color: 'bg-indigo-500' },
  { id: 'emerald', color: 'bg-emerald-500' },
  { id: 'rose', color: 'bg-rose-500' },
  { id: 'amber', color: 'bg-amber-500' },
  { id: 'cyan', color: 'bg-cyan-500' },
];

const WALLPAPERS = [
    'https://images.unsplash.com/photo-1495616811223-4d98c6e9d869?q=80&w=2532&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534067783865-9abd3562da71?q=80&w=2554&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('pages');

  if (!isOpen) return null;

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
      <button onClick={onChange} className={`w-14 h-8 rounded-full relative transition-colors ${checked ? 'bg-white' : 'bg-zinc-800 border border-zinc-700'}`}>
         <div className={`absolute top-1 w-6 h-6 rounded-full transition-all duration-300 shadow-sm ${checked ? 'bg-black left-7' : 'bg-zinc-400 left-1'}`} />
      </button>
  );

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;
      if (val === 'vv' || val === 'vm') {
          val = '1156381555875385484';
      }
      updateSettings({ discordId: val });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity" onClick={onClose} />
      
      <div className={`relative w-full max-w-6xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-[80vh] ${settings.enableGlassTheme ? 'glass-panel' : ''}`}>
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-72 bg-zinc-900/30 border-r border-white/5 p-6 flex flex-col gap-2 backdrop-blur-sm overflow-x-auto md:overflow-visible flex-shrink-0">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 px-2 hidden md:block">Settings</h2>
            <div className="flex md:flex-col gap-2">
                {[
                    { id: 'pages', icon: Layout, label: 'Pages & Nav' },
                    { id: 'visual', icon: Palette, label: 'Theme & Wallpapers' },
                    { id: 'clock', icon: Clock, label: 'Clock Face' },
                    { id: 'data', icon: Activity, label: 'Connections' },
                    { id: 'about', icon: HelpCircle, label: 'About' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-4 px-5 py-4 md:py-4 rounded-2xl text-base font-medium transition-all text-left whitespace-nowrap md:whitespace-normal flex-shrink-0 ${activeTab === tab.id ? 'bg-white/10 text-white shadow-lg border border-white/5' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        <tab.icon size={22} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
            
            <div className="mt-auto pt-6 border-t border-white/5 hidden md:block">
                <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4 flex items-center gap-2"><Keyboard size={14}/> Shortcuts</h3>
                <div className="space-y-2 text-xs text-zinc-500 font-mono">
                    <div className="flex justify-between"><span>Settings</span> <span className="text-zinc-300">S</span></div>
                    <div className="flex justify-between"><span>Fullscreen</span> <span className="text-zinc-300">F</span></div>
                    <div className="flex justify-between"><span>Prev/Next</span> <span className="text-zinc-300">← →</span></div>
                    <div className="flex justify-between"><span>Close</span> <span className="text-zinc-300">ESC</span></div>
                </div>
            </div>
        </div>

        {/* Panel Content */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto scrollbar-hide bg-black/20">
            <div className="flex justify-between items-center mb-8 sticky top-0 z-10 py-2 -my-2 bg-transparent">
                <h2 className="text-3xl font-bold text-white tracking-tight">
                    {activeTab === 'about' ? 'Information' : 'Configuration'}
                </h2>
                <button onClick={onClose} className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                    <X size={28} />
                </button>
            </div>

            <div className="space-y-8 max-w-4xl pb-10">
                
                {/* --- PAGES --- */}
                {activeTab === 'pages' && (
                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/5 p-6 md:p-8 rounded-3xl space-y-8 backdrop-blur-md">
                             <div className="flex justify-between items-center">
                                 <div>
                                     <div className="font-bold text-white text-lg">Dashboard Widgets</div>
                                     <div className="text-sm text-zinc-500">Enable widgets grid page</div>
                                 </div>
                                 <Toggle checked={settings.enableDashboard} onChange={() => updateSettings({ enableDashboard: !settings.enableDashboard })} />
                             </div>
                             <div className="flex justify-between items-center">
                                 <div>
                                     <div className="font-bold text-white text-lg">Focus Timer</div>
                                     <div className="text-sm text-zinc-500">Enable Pomodoro timer page</div>
                                 </div>
                                 <Toggle checked={settings.enableFocus} onChange={() => updateSettings({ enableFocus: !settings.enableFocus })} />
                             </div>
                             <div className="flex justify-between items-center">
                                 <div>
                                     <div className="font-bold text-white text-lg">Device Info</div>
                                     <div className="text-sm text-zinc-500">Enable hardware specs page</div>
                                 </div>
                                 <Toggle checked={settings.enableDeviceInfo} onChange={() => updateSettings({ enableDeviceInfo: !settings.enableDeviceInfo })} />
                             </div>
                              <div className="flex justify-between items-center border-t border-white/5 pt-6">
                                 <div>
                                     <div className="font-bold text-white text-lg">Auto-Switch to Music</div>
                                     <div className="text-sm text-zinc-500">Jump to player when Spotify starts</div>
                                 </div>
                                 <Toggle checked={settings.autoSwitchToMedia} onChange={() => updateSettings({ autoSwitchToMedia: !settings.autoSwitchToMedia })} />
                             </div>
                             <div className="flex justify-between items-center">
                                 <div>
                                     <div className="font-bold text-white text-lg">Show Date on Music Page</div>
                                     <div className="text-sm text-zinc-500">Display day/date in top left</div>
                                 </div>
                                 <Toggle checked={settings.mediaShowDate} onChange={() => updateSettings({ mediaShowDate: !settings.mediaShowDate })} />
                             </div>
                        </div>
                    </div>
                )}

                {/* --- VISUAL --- */}
                {activeTab === 'visual' && (
                    <>
                         <div className="bg-white/5 border border-white/5 p-6 md:p-8 rounded-3xl flex justify-between items-center mb-6 backdrop-blur-md">
                             <div>
                                 <div className="font-bold text-white text-lg flex items-center gap-3"><Sparkles size={20} className="text-indigo-400"/> Liquid Glass Theme</div>
                                 <div className="text-sm text-zinc-500">Enable premium glassmorphism styling</div>
                             </div>
                             <Toggle checked={settings.enableGlassTheme} onChange={() => updateSettings({ enableGlassTheme: !settings.enableGlassTheme })} />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Accent Color</label>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {ACCENTS.map(acc => (
                                    <button
                                    key={acc.id}
                                    onClick={() => updateSettings({ accentColor: acc.id })}
                                    className={`w-16 h-16 rounded-full transition-all duration-300 flex-shrink-0 ${acc.color} ${settings.accentColor === acc.id ? 'ring-4 ring-white/20 scale-110 shadow-lg' : 'opacity-30 hover:opacity-100 hover:scale-105'}`}
                                    />
                                ))}
                            </div>
                        </div>
                        
                        <div className="space-y-4 pt-6 border-t border-white/5">
                            <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Wallpapers</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {WALLPAPERS.map((url, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => updateSettings({ predefinedWallpaper: url, customBackgroundUrl: '' })}
                                        className={`relative aspect-video rounded-2xl overflow-hidden group border-4 ${settings.predefinedWallpaper === url && !settings.customBackgroundUrl ? 'border-white shadow-xl' : 'border-transparent'}`}
                                    >
                                        <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Wall" />
                                    </button>
                                ))}
                            </div>
                             <div className="space-y-3 pt-4">
                                 <label className="text-xs text-zinc-500">Or use custom URL:</label>
                                 <input 
                                    type="text" 
                                    value={settings.customBackgroundUrl}
                                    onChange={(e) => updateSettings({ customBackgroundUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-base text-white focus:outline-none focus:border-white/20 transition-all font-mono"
                                />
                            </div>
                        </div>
                        
                        <div className="bg-white/5 border border-white/5 p-6 md:p-8 rounded-3xl flex justify-between items-center mt-6 backdrop-blur-md">
                             <div>
                                 <div className="font-bold text-white text-lg flex items-center gap-3"><Disc size={20}/> Vinyl Sleeve</div>
                                 <div className="text-sm text-zinc-500">Show album cover case next to vinyl</div>
                             </div>
                             <Toggle checked={settings.showVinylSleeve} onChange={() => updateSettings({ showVinylSleeve: !settings.showVinylSleeve })} />
                        </div>
                    </>
                )}

                {/* --- CLOCK --- */}
                {activeTab === 'clock' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className={`p-6 rounded-3xl border cursor-pointer transition-all ${settings.clockPosition === 'center' ? 'bg-white/10 border-white' : 'border-zinc-800 hover:bg-white/5'}`} onClick={() => updateSettings({ clockPosition: 'center' })}>
                                 <Layout className="mb-4 text-zinc-400" size={32} />
                                 <div className="font-bold text-xl">Center</div>
                             </div>
                             <div className={`p-6 rounded-3xl border cursor-pointer transition-all ${settings.clockPosition === 'bottom-left' ? 'bg-white/10 border-white' : 'border-zinc-800 hover:bg-white/5'}`} onClick={() => updateSettings({ clockPosition: 'bottom-left' })}>
                                 <Layout className="mb-4 text-zinc-400 transform rotate-180" size={32} />
                                 <div className="font-bold text-xl">Bottom Left</div>
                             </div>
                        </div>
                        
                        <div className="bg-white/5 border border-white/5 p-6 md:p-8 rounded-3xl space-y-6 backdrop-blur-md">
                             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                 <span className="text-lg font-bold">Clock Style</span>
                                 <div className="flex gap-3 flex-wrap">
                                     {['digital', 'stack', 'flip', 'modern'].map(style => (
                                         <button 
                                            key={style}
                                            onClick={() => updateSettings({ clockStyle: style as any })} 
                                            className={`px-6 py-3 rounded-xl text-sm font-medium capitalize ${settings.clockStyle === style ? 'bg-white text-black' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                                         >
                                             {style}
                                         </button>
                                     ))}
                                 </div>
                             </div>
                             
                             <div className="space-y-4 pt-4">
                                <div className="flex justify-between text-sm text-zinc-500 font-bold">
                                    <span>CLOCK OPACITY</span>
                                    <span>{Math.round(settings.clockTransparency * 100)}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0.1" 
                                    max="1" 
                                    step="0.1" 
                                    value={settings.clockTransparency} 
                                    onChange={(e) => updateSettings({ clockTransparency: parseFloat(e.target.value) })}
                                    className="w-full h-8 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-white"
                                />
                             </div>

                             <div className="flex justify-between items-center border-t border-white/5 pt-6">
                                 <span className="text-lg">Show Seconds</span>
                                 <Toggle checked={settings.showSeconds} onChange={() => updateSettings({ showSeconds: !settings.showSeconds })} />
                             </div>
                             <div className="flex justify-between items-center">
                                 <span className="text-lg">Show Date</span>
                                 <Toggle checked={settings.clockShowDate} onChange={() => updateSettings({ clockShowDate: !settings.clockShowDate })} />
                             </div>
                             <div className="flex justify-between items-center">
                                 <span className="text-lg">Show Battery</span>
                                 <Toggle checked={settings.clockShowBattery} onChange={() => updateSettings({ clockShowBattery: !settings.clockShowBattery })} />
                             </div>
                             <div className="flex justify-between items-center">
                                 <span className="text-lg">Show Weather</span>
                                 <Toggle checked={settings.clockShowWeather} onChange={() => updateSettings({ clockShowWeather: !settings.clockShowWeather })} />
                             </div>
                             <div className="flex justify-between items-center">
                                 <span className="text-lg">Show Now Playing</span>
                                 <Toggle checked={settings.clockShowNowPlaying} onChange={() => updateSettings({ clockShowNowPlaying: !settings.clockShowNowPlaying })} />
                             </div>
                        </div>
                    </div>
                )}

                {/* --- DATA --- */}
                {activeTab === 'data' && (
                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/5 p-6 md:p-8 rounded-3xl backdrop-blur-md">
                             <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 block">Discord ID (Lanyard)</label>
                             <input 
                                type="text" 
                                value={settings.discordId}
                                onChange={handleIdChange}
                                placeholder="123456789..."
                                className="w-full bg-black/50 border border-zinc-700 rounded-2xl px-6 py-5 text-base text-white focus:outline-none focus:border-white/50 font-mono transition-colors"
                            />
                            <p className="text-sm text-zinc-500 mt-4">Required for Spotify integration.</p>
                        </div>
                    </div>
                )}
                
                {/* --- ABOUT --- */}
                {activeTab === 'about' && (
                    <div className="flex flex-col items-center justify-center text-center py-12 space-y-10">
                        
                        <div className="w-32 h-32 bg-zinc-900 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/10 relative overflow-hidden group">
                             <div className="absolute inset-0 bg-white/10 blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
                             <Clock size={48} className="text-white relative z-10" />
                        </div>
                        
                        <div className="space-y-2">
                             <h1 className="text-6xl font-black text-white tracking-tighter uppercase">VCLOCK</h1>
                             <p className="text-indigo-400 font-mono text-base tracking-widest uppercase">Smart Display Dashboard</p>
                        </div>
                        
                        <div className="w-full max-w-md space-y-6 pt-6">
                            
                            <div className="flex items-center justify-between p-4 border-b border-white/5">
                                <div className="flex items-center gap-4 text-zinc-400">
                                    <Activity size={20} />
                                    <span className="text-base">Version</span>
                                </div>
                                <span className="font-mono text-white text-base">1.0.0</span>
                            </div>

                            <div className="flex items-center justify-between p-4 border-b border-white/5">
                                <div className="flex items-center gap-4 text-zinc-400">
                                    <User size={20} />
                                    <span className="text-base">Developer</span>
                                </div>
                                <span className="text-white text-base font-bold">vihar</span>
                            </div>

                            <div className="flex items-center justify-between p-4 border-b border-white/5">
                                <div className="flex items-center gap-4 text-zinc-400">
                                    <Layout size={20} />
                                    <span className="text-base">Language</span>
                                </div>
                                <span className="text-white text-base font-mono">TypeScript</span>
                            </div>

                        </div>

                        <a 
                            href="https://vihar.cc" 
                            target="_blank" 
                            rel="noreferrer"
                            className="mt-8 px-8 py-4 bg-white/5 rounded-full text-sm text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 uppercase tracking-widest"
                        >
                            vihar.cc <ExternalLink size={14} />
                        </a>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};
