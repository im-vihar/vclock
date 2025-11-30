
import React, { useState, useEffect } from 'react';
import { X, Clock, Layout, Palette, Activity, Disc, Sparkles, User, HelpCircle, ExternalLink, Keyboard, Zap, RefreshCw, Mic, Monitor, FlaskConical, AlertTriangle, LogIn } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { AccentColor, MusicProvider } from '../types';
import { redirectToSpotifyAuth, setSpotifyClientId } from '../services/spotifyService';

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
  const [activeTab, setActiveTab] = useState('data');

  useEffect(() => {
      // Set the client ID in the service when the modal is opened or setting changes
      if (settings.spotifyClientId) {
          setSpotifyClientId(settings.spotifyClientId);
      }
  }, [settings.spotifyClientId, isOpen]);

  if (!isOpen) return null;

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
      <button onClick={onChange} className={`w-14 h-8 rounded-full relative transition-colors flex-shrink-0 ${checked ? 'bg-white' : 'bg-zinc-800 border border-zinc-700'}`}>
         <div className={`absolute top-1 w-6 h-6 rounded-full transition-all duration-300 shadow-sm ${checked ? 'bg-black left-7' : 'bg-zinc-400 left-1'}`} />
      </button>
  );

  const handleLanyardIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;
      if (val === 'vv' || val === 'vm') {
          val = '1156381555875385484';
      }
      updateSettings({ discordId: val });
  };

  const handleSpotifyConnect = () => {
      if (settings.spotifyClientId) {
          updateSettings({ musicProvider: 'spotify' });
          redirectToSpotifyAuth();
      } else {
          alert('Please enter your Spotify Client ID first.');
      }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity" onClick={onClose} />
      
      <div className={`relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh] ${settings.enableGlassTheme ? 'glass-panel' : ''}`}>
        
        <div className="w-full md:w-72 bg-zinc-900/30 border-r border-white/5 p-4 flex flex-col gap-2 backdrop-blur-sm overflow-x-auto md:overflow-visible flex-shrink-0">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 px-2 hidden md:block">Settings</h2>
            <div className="flex md:flex-col gap-2">
                {[
                    { id: 'data', icon: Activity, label: 'Connections' },
                    { id: 'pages', icon: Layout, label: 'Pages & Nav' },
                    { id: 'visual', icon: Palette, label: 'Theme' },
                    { id: 'clock', icon: Clock, label: 'Clock Face' },
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

        <div className="flex-1 overflow-hidden flex flex-col bg-black/20 relative">
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
                    
                    {activeTab === 'pages' && (
                        <div className="space-y-6">
                           {/* ... content ... */}
                        </div>
                    )}
                    
                    {activeTab === 'data' && (
                        <div className="space-y-8">
                            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
                                <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 block">Music Provider</label>
                                <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-700">
                                    <button 
                                        onClick={() => updateSettings({ musicProvider: 'lanyard' })}
                                        className={`px-4 py-2 flex-1 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${settings.musicProvider === 'lanyard' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>
                                        <RefreshCw size={14}/> Lanyard (Polling)
                                    </button>
                                    <button 
                                        onClick={() => updateSettings({ musicProvider: 'spotify' })}
                                        className={`px-4 py-2 flex-1 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${settings.musicProvider === 'spotify' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>
                                        <Zap size={14}/> Spotify (Direct)
                                    </button>
                                </div>
                            </div>

                            {settings.musicProvider === 'spotify' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="bg-green-900/10 border border-green-500/20 p-4 rounded-xl flex items-start gap-3">
                                        <Zap className="text-green-400 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-green-200/80 leading-relaxed">
                                            <strong>Direct Spotify Connection:</strong> This method is faster and more reliable. You'll need a free Spotify Developer account to get your Client ID.
                                        </div>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
                                        <label htmlFor="spotify-client-id" className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 block">Spotify Client ID</label>
                                        <input 
                                            id="spotify-client-id"
                                            type="text" 
                                            value={settings.spotifyClientId}
                                            onChange={(e) => updateSettings({ spotifyClientId: e.target.value })}
                                            placeholder="Your Spotify application client ID"
                                            className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-4 text-lg text-white focus:outline-none focus:border-white/50 font-mono transition-colors"
                                        />
                                        <div className="mt-6 flex flex-col sm:flex-row gap-4">
                                            <button onClick={handleSpotifyConnect} className="flex-1 inline-flex items-center justify-center gap-3 px-4 py-3 bg-green-500 text-black rounded-lg text-base font-bold transition-transform hover:scale-105">
                                                <LogIn size={18}/> {settings.spotifyAccessToken ? 'Re-authorize' : 'Connect Spotify Account'}
                                            </button>
                                            <a 
                                                href="https://developer.spotify.com/dashboard"
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white hover:bg-white/20 rounded-lg text-sm font-bold transition-colors"
                                            >
                                                <ExternalLink size={14}/> Create Spotify App
                                            </a>
                                        </div>
                                        {settings.spotifyAccessToken && (
                                            <p className="text-sm text-green-400 mt-4 text-center sm:text-left">Successfully connected to Spotify.</p>
                                        )}
                                    </div>
                                     <div className="bg-white/5 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
                                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Setup Instructions</h3>
                                        <ol className="list-decimal list-inside text-sm text-zinc-500 space-y-2">
                                            <li>Go to the <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Spotify Developer Dashboard</a> and log in.</li>
                                            <li>Click <strong>CREATE APP</strong>. Give it any name and description.</li>
                                            <li>Once created, copy the <strong>Client ID</strong> and paste it above.</li>
                                            <li>Click <strong>EDIT SETTINGS</strong>. In the "Redirect URIs" field, add the URL where you're hosting this app (e.g., `http://localhost:5173/` for local, or your Vercel URL).</li>
                                            <li>Click <strong>SAVE</strong> at the bottom of the form.</li>
                                            <li>You can now connect your account.</li>
                                        </ol>
                                    </div>
                                </div>
                            )}

                            {settings.musicProvider === 'lanyard' && (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
                                        <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 block">Discord ID (Lanyard)</label>
                                        <input 
                                            type="text" 
                                            value={settings.discordId}
                                            onChange={handleLanyardIdChange}
                                            placeholder="123456789..."
                                            className="w-full bg-black/50 border border-zinc-700 rounded-xl px-4 py-4 text-lg text-white focus:outline-none focus:border-white/50 font-mono transition-colors"
                                        />
                                        <p className="text-sm text-zinc-500 mt-4 leading-relaxed">The app connects to the <a href="https://github.com/Phineas/lanyard" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Lanyard API</a> to fetch your Spotify status. <strong>Important:</strong> You must be in the Lanyard Discord server.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
