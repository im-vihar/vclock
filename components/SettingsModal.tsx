
import React, { useState } from 'react';
import { X, Clock, Layout, Palette, Activity, Disc, Sparkles, User, HelpCircle, ExternalLink, Keyboard, Zap, RefreshCw, Mic, Monitor, FlaskConical, AlertTriangle } from 'lucide-react';
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
      <button onClick={onChange} className={`w-14 h-8 rounded-full relative transition-colors flex-shrink-0 ${checked ? 'bg-white' : 'bg-zinc-800 border border-zinc-700'}`}>
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
      
      <div className={`relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh] ${settings.enableGlassTheme ? 'glass-panel' : ''}`}>
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-72 bg-zinc-900/30 border-r border-white/5 p-4 flex flex-col gap-2 backdrop-blur-sm overflow-x-auto md:overflow-visible flex-shrink-0">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 px-2 hidden md:block">Settings</h2>
            <div className="flex md:flex-col gap-2">
                {[
                    { id: 'pages', icon: Layout, label: 'Pages & Nav' },
                    { id: 'visual', icon: Palette, label: 'Theme' },
                    { id: 'clock', icon: Clock, label: 'Clock Face' },
                    { id: 'data', icon: Activity, label: 'Connections' },
                    { id: 'system', icon: Monitor, label: 'System' },
                    { id: 'experimental', icon: FlaskConical, label: 'Experimental' },
                    { id: 'about', icon: HelpCircle, label: 'About' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-4 px-4 py-3 md:py-4 rounded-xl text-base font-medium transition-all text-left whitespace-nowrap md:whitespace-normal flex-shrink-0 ${activeTab === tab.id ? 'bg-white/10 text-white shadow-lg border border-white/5' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        <tab.icon size={20} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
            
            <div className="mt-auto pt-6 border-t border-white/5 hidden md:block px-2">
                <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2"><Keyboard size={14}/> Shortcuts</h3>
                <div className="space-y-2 text-xs text-zinc-500 font-mono">
                    <div className="flex justify-between"><span>Settings</span> <span className="text-zinc-300">S</span></div>
                    <div className="flex justify-between"><span>Fullscreen</span> <span className="text-zinc-300">F</span></div>
                    <div className="flex justify-between"><span>Prev/Next</span> <span className="text-zinc-300">← →</span></div>
                    <div className="flex justify-between"><span>Close</span> <span className="text-zinc-300">ESC</span></div>
                </div>
            </div>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-hidden flex flex-col bg-black/20 relative">
            
            {/* Sticky Header with Background to prevent overlap */}
            <div className="flex justify-between items-center px-8 py-6 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                    {activeTab === 'about' ? 'Information' : activeTab === 'experimental' ? 'Labs' : 'Configuration'}
                </h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            <div className="overflow-y-auto scrollbar-hide p-8 pb-20">
                <div className="space-y-8 max-w-3xl">
                    
                    {/* --- PAGES --- */}
                    {activeTab === 'pages' && (
                        <div className="space-y-6">
                            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-6 backdrop-blur-md">
                                  <div className="flex justify-between items-center">
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
                    
                    {/* --- EXPERIMENTAL --- */}
                    {activeTab === 'experimental' && (
                        <div className="space-y-6">
                            <div className="bg-amber-900/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
                                <AlertTriangle className="text-amber-500 flex-shrink-0" />
                                <div className="text-sm text-amber-200/80 leading-relaxed">
                                    <strong>Heads up:</strong> These features are currently in active development. They might be unstable, incomplete, or buggy. Use at your own risk.
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-6 backdrop-blur-md">
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
                            </div>
                        </div>
                    )}

                    {/* --- VISUAL --- */}
                    {activeTab === 'visual' && (
                        <>
                             <div className="bg-white/5 border border-white/5 p-6 rounded-2xl flex justify-between items-center mb-6 backdrop-blur-md">
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
                                        className={`w-14 h-14 rounded-full transition-all duration-300 flex-shrink-0 ${acc.color} ${settings.accentColor === acc.id ? 'ring-4 ring-white/20 scale-110 shadow-lg' : 'opacity-30 hover:opacity-100 hover:scale-105'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl mt-8">
                                <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider block mb-4">Media Player Style</label>
                                <div className="flex gap-3">
                                    {['vinyl', 'card', 'minimal'].map(style => (
                                        <button 
                                            key={style}
                                            onClick={() => updateSettings({ spotifyStyle: style as any })}
                                            className={`px-4 py-3 rounded-xl flex-1 capitalize text-sm font-medium transition-all ${settings.spotifyStyle === style ? 'bg-white text-black shadow-lg' : 'bg-black/40 text-zinc-400 hover:bg-black/60'}`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl mt-8">
                                <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider block mb-4 flex items-center gap-2"><Mic size={16}/> Audio Visualizer</label>
                                <div className="flex justify-between items-center mb-6">
                                     <div>
                                         <div className="font-bold text-white text-base">Enable Microphone Visualizer</div>
                                         <div className="text-xs text-zinc-500">Requires microphone permission. Picks up room audio.</div>
                                     </div>
                                     <Toggle checked={settings.enableVisualizer} onChange={() => updateSettings({ enableVisualizer: !settings.enableVisualizer })} />
                                </div>
                                {settings.enableVisualizer && (
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm text-zinc-400 font-bold">
                                            <span>SENSITIVITY</span>
                                            <span>{settings.visualizerSensitivity.toFixed(1)}x</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0.5" 
                                            max="3" 
                                            step="0.1" 
                                            value={settings.visualizerSensitivity} 
                                            onChange={(e) => updateSettings({ visualizerSensitivity: parseFloat(e.target.value) })}
                                            className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-white"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Wallpapers</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {WALLPAPERS.map((url, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => updateSettings({ predefinedWallpaper: url, customBackgroundUrl: '' })}
                                            className={`relative aspect-video rounded-xl overflow-hidden group border-2 ${settings.predefinedWallpaper === url && !settings.customBackgroundUrl ? 'border-white shadow-xl' : 'border-transparent'}`}
                                        >
                                            <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Wall" />
                                        </button>
                                    ))}
                                </div>
                                 <div className="pt-2">
                                     <input 
                                        type="text" 
                                        value={settings.customBackgroundUrl}
                                        onChange={(e) => updateSettings({ customBackgroundUrl: e.target.value })}
                                        placeholder="Or enter custom image URL..."
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-mono"
                                    />
                                </div>
                            </div>
                            
                            {settings.spotifyStyle === 'vinyl' && (
                                <div className="bg-white/5 border border-white/5 p-6 rounded-2xl flex justify-between items-center mt-6 backdrop-blur-md">
                                     <div>
                                         <div className="font-bold text-white text-lg flex items-center gap-3"><Disc size={20}/> Vinyl Sleeve</div>
                                         <div className="text-sm text-zinc-500">Show album cover case next to vinyl</div>
                                     </div>
                                     <Toggle checked={settings.showVinylSleeve} onChange={() => updateSettings({ showVinylSleeve: !settings.showVinylSleeve })} />
                                </div>
                            )}
                        </>
                    )}

                    {/* --- SYSTEM --- */}
                    {activeTab === 'system' && (
                        <div className="space-y-6">
                            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-6 backdrop-blur-md">
                                 <div className="flex justify-between items-center">
                                     <div>
                                         <div className="font-bold text-white text-lg">Keep Screen On</div>
                                         <div className="text-sm text-zinc-500">Prevents device from sleeping while open</div>
                                     </div>
                                     <Toggle checked={settings.keepScreenOn} onChange={() => updateSettings({ keepScreenOn: !settings.keepScreenOn })} />
                                 </div>
                                 
                                 <div className="space-y-3 pt-4 border-t border-white/5">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="font-bold text-white text-lg">Screensaver Timeout</div>
                                            <div className="text-sm text-zinc-500">Burn-in protection (floating clock)</div>
                                        </div>
                                        <span className="text-white font-bold">{settings.screensaverTimeout === 0 ? 'Disabled' : `${settings.screensaverTimeout}m`}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="60" 
                                        step="5" 
                                        value={settings.screensaverTimeout} 
                                        onChange={(e) => updateSettings({ screensaverTimeout: parseInt(e.target.value) })}
                                        className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-white"
                                    />
                                    <div className="flex justify-between text-[10px] text-zinc-600 uppercase font-bold">
                                        <span>Off</span>
                                        <span>30m</span>
                                        <span>60m</span>
                                    </div>
                                 </div>
                            </div>
                        </div>
                    )}

                    {/* --- CLOCK --- */}
                    {activeTab === 'clock' && (
                        <div className="space-y-6">
                            {/* Time Format Settings */}
                            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-6 backdrop-blur-md">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-white text-lg">Time Format</div>
                                        <div className="text-sm text-zinc-500">12-hour vs 24-hour clock</div>
                                    </div>
                                    <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-700">
                                        <button 
                                            onClick={() => updateSettings({ timeFormat: '12h' })}
                                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${settings.timeFormat === '12h' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                                        >
                                            12H
                                        </button>
                                        <button 
                                            onClick={() => updateSettings({ timeFormat: '24h' })}
                                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${settings.timeFormat === '24h' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                                        >
                                            24H
                                        </button>
                                    </div>
                                </div>
                                {settings.timeFormat === '12h' && (
                                     <div className="flex justify-between items-center animate-fade-in border-t border-white/5 pt-4">
                                         <div>
                                             <div className="font-bold text-white text-lg">Hide AM/PM</div>
                                             <div className="text-sm text-zinc-500">Show specific time period indicator</div>
                                         </div>
                                         <Toggle checked={settings.hideAmPm} onChange={() => updateSettings({ hideAmPm: !settings.hideAmPm })} />
                                     </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div className={`p-6 rounded-2xl border cursor-pointer transition-all ${settings.clockPosition === 'center' ? 'bg-white/10 border-white' : 'border-zinc-800 hover:bg-white/5'}`} onClick={() => updateSettings({ clockPosition: 'center' })}>
                                     <Layout className="mb-4 text-zinc-400" size={32} />
                                     <div className="font-bold text-lg">Center</div>
                                 </div>
                                 <div className={`p-6 rounded-2xl border cursor-pointer transition-all ${settings.clockPosition === 'bottom-left' ? 'bg-white/10 border-white' : 'border-zinc-800 hover:bg-white/5'}`} onClick={() => updateSettings({ clockPosition: 'bottom-left' })}>
                                     <Layout className="mb-4 text-zinc-400 transform rotate-180" size={32} />
                                     <div className="font-bold text-lg">Bottom Left</div>
                                 </div>
                            </div>
                            
                            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-6 backdrop-blur-md">
                                 <div className="flex flex-col gap-4">
                                     <span className="text-lg font-bold">Clock Style</span>
                                     <div className="flex gap-2 flex-wrap">
                                         {['digital', 'stack', 'flip', 'modern'].map(style => (
                                             <button 
                                                key={style}
                                                onClick={() => updateSettings({ clockStyle: style as any })} 
                                                className={`px-5 py-3 rounded-xl text-sm font-medium capitalize flex-1 ${settings.clockStyle === style ? 'bg-white text-black' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                                             >
                                                 {style}
                                             </button>
                                         ))}
                                     </div>
                                 </div>
                                 
                                 <div className="space-y-3 pt-2">
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
                                        className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-white"
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
                        <div className="space-y-8">
                            
                            {/* Discord ID */}
                            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
                                 <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 block">Discord ID (Lanyard)</label>
                                 <input 
                                    type="text" 
                                    value={settings.discordId}
                                    onChange={handleIdChange}
                                    placeholder="123456789..."
                                    className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-4 text-lg text-white focus:outline-none focus:border-white/50 font-mono transition-colors"
                                />
                                <p className="text-sm text-zinc-500 mt-4 leading-relaxed">
                                    The app connects to the <a href="https://github.com/Phineas/lanyard" className="text-indigo-400 hover:underline">Lanyard API</a> to fetch your Spotify status.
                                    <br/>
                                    <strong>Important:</strong> You must be in the Lanyard Discord server for this to work.
                                </p>
                                
                                <div className="mt-4 flex gap-4">
                                     <a 
                                        href="https://discord.gg/lanyard" 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#5865F2]/20 text-[#5865F2] hover:bg-[#5865F2]/30 rounded-lg text-sm font-bold transition-colors"
                                    >
                                        <ExternalLink size={14}/> Join Lanyard Server
                                    </a>
                                </div>

                                <div className="mt-8 border-t border-white/5 pt-6">
                                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">How to get your ID</h3>
                                    <ol className="list-decimal list-inside text-sm text-zinc-500 space-y-1">
                                        <li>Enable <strong>Developer Mode</strong> in Discord Settings &gt; Advanced.</li>
                                        <li>Right-click your profile picture in any chat.</li>
                                        <li>Select <strong>Copy User ID</strong>.</li>
                                    </ol>
                                </div>
                            </div>

                            {/* Connection Settings */}
                            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
                                <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 block">Connection Method</label>
                                
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <button 
                                        onClick={() => updateSettings({ lanyardConnectionMode: 'polling' })}
                                        className={`p-4 rounded-xl border text-left transition-all ${settings.lanyardConnectionMode === 'polling' ? 'bg-white/10 border-white ring-1 ring-white' : 'border-zinc-800 hover:bg-white/5'}`}
                                    >
                                        <div className="flex items-center gap-2 mb-2 font-bold text-white"><RefreshCw size={18}/> Reliable (Polling)</div>
                                        <div className="text-xs text-zinc-500 leading-relaxed">Fetches data periodically. More stable if the connection drops often.</div>
                                    </button>
                                    <button 
                                        onClick={() => updateSettings({ lanyardConnectionMode: 'websocket' })}
                                        className={`p-4 rounded-xl border text-left transition-all ${settings.lanyardConnectionMode === 'websocket' ? 'bg-white/10 border-white ring-1 ring-white' : 'border-zinc-800 hover:bg-white/5'}`}
                                    >
                                        <div className="flex items-center gap-2 mb-2 font-bold text-white"><Zap size={18}/> Real-time (WebSocket)</div>
                                        <div className="text-xs text-zinc-500 leading-relaxed">Instant updates but may disconnect on unstable networks.</div>
                                    </button>
                                </div>

                                {settings.lanyardConnectionMode === 'polling' && (
                                    <div className="space-y-3 pt-4 border-t border-white/5">
                                        <div className="flex justify-between text-sm text-zinc-400 font-bold">
                                            <span>POLLING INTERVAL</span>
                                            <span>{settings.lanyardPollingInterval / 1000}s</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="1000" 
                                            max="10000" 
                                            step="500" 
                                            value={settings.lanyardPollingInterval} 
                                            onChange={(e) => updateSettings({ lanyardPollingInterval: parseInt(e.target.value) })}
                                            className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-white"
                                        />
                                        <p className="text-xs text-zinc-600">Lower values update faster but use more data.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* --- ABOUT --- */}
                    {activeTab === 'about' && (
                        <div className="flex flex-col items-center justify-center text-center py-8 space-y-8">
                            
                            <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/10 relative overflow-hidden group">
                                 <div className="absolute inset-0 bg-white/10 blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
                                 <Clock size={40} className="text-white relative z-10" />
                            </div>
                            
                            <div className="space-y-2">
                                 <h1 className="text-5xl font-black text-white tracking-tighter uppercase">VCLOCK</h1>
                                 <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase">Smart Display Dashboard</p>
                            </div>
                            
                            <div className="w-full max-w-md space-y-4 pt-4">
                                
                                <div className="flex items-center justify-between p-4 border-b border-white/5">
                                    <div className="flex items-center gap-4 text-zinc-400">
                                        <Activity size={18} />
                                        <span className="text-base">Version</span>
                                    </div>
                                    <span className="font-mono text-white text-base">1.1.0</span>
                                </div>

                                <div className="flex items-center justify-between p-4 border-b border-white/5">
                                    <div className="flex items-center gap-4 text-zinc-400">
                                        <User size={18} />
                                        <span className="text-base">Developer</span>
                                    </div>
                                    <span className="text-white text-base font-bold">vihar</span>
                                </div>

                                <div className="flex items-center justify-between p-4 border-b border-white/5">
                                    <div className="flex items-center gap-4 text-zinc-400">
                                        <Layout size={18} />
                                        <span className="text-base">Language</span>
                                    </div>
                                    <span className="text-white text-base font-mono">TypeScript</span>
                                </div>

                            </div>

                            <a 
                                href="https://vihar.cc" 
                                target="_blank" 
                                rel="noreferrer"
                                className="mt-6 px-8 py-3 bg-white/5 rounded-full text-sm text-zinc-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 uppercase tracking-widest"
                            >
                                vihar.cc <ExternalLink size={14} />
                            </a>
                        </div>
                    )}

                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
