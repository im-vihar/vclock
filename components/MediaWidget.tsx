
import React, { useEffect, useState } from 'react';
import { SpotifyData, SpotifyStyle } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { Disc, Music, ArrowRight, Pause, HelpCircle, ExternalLink, CheckCircle2, Mic, MicOff, Loader2 } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

interface MediaWidgetProps {
  spotify: SpotifyData | null;
  style: SpotifyStyle;
  isPlaying?: boolean;
  isLoading?: boolean;
}

export const MediaWidget: React.FC<MediaWidgetProps> = ({ spotify, isPlaying = true, style, isLoading = false }) => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [displayTrack, setDisplayTrack] = useState<SpotifyData | null>(spotify);
  const [animState, setAnimState] = useState<'idle' | 'exiting' | 'entering'>('idle');
  const [idInput, setIdInput] = useState('');
  
  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatMiniDate = (ms: number) => {
      return new Date(ms).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric'
      });
  };

  const formatTime = (ms: number) => {
      let time = new Date(ms).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: settings.timeFormat === '12h'
      });
      
      if (settings.hideAmPm) {
          time = time.replace(/AM|PM/, '').trim();
      }
      
      return time;
  };

  // Helper to determine font size based on title length
  // Switched to VW (Viewport Width) units to prioritize fitting horizontally on one line
  const getTitleSize = (title: string) => {
      const len = title.length;
      if (len < 10) return 'clamp(4rem, 15vw, 12rem)'; // Massive, fits width
      if (len < 20) return 'clamp(3rem, 10vw, 8rem)';  // Big, fits width
      if (len < 30) return 'clamp(2.5rem, 7vw, 6rem)'; // Medium, try 1 line
      if (len < 45) return 'clamp(2rem, 5vw, 4.5rem)'; // Long, try 1 line
      return 'clamp(1.5rem, 4vw, 4rem)';               // Very long, allow wrap
  };

  // Transition Logic
  useEffect(() => {
    if (spotify?.track_id !== displayTrack?.track_id) {
        if (!displayTrack) {
            setDisplayTrack(spotify);
            return;
        }

        setAnimState('exiting');
        const timer = setTimeout(() => {
            setDisplayTrack(spotify);
            setAnimState('entering');
            setTimeout(() => {
                setAnimState('idle');
            }, 600);
        }, 600);
        return () => clearTimeout(timer);
    } else {
        if (spotify) {
             setDisplayTrack(prev => prev ? ({ ...prev, start: spotify.start, end: spotify.end }) : spotify);
        }
    }
  }, [spotify?.track_id, spotify?.start]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val.toLowerCase() === 'v' || val.toLowerCase() === 'vv' || val.toLowerCase() === 'm' || val.toLowerCase() === 'vm') {
          setIdInput(val);
          return;
      }
      if (/^\d*$/.test(val)) {
          setIdInput(val);
      }
  };

  const handleSaveId = () => {
      let final = idInput.trim().toLowerCase();
      if (final === 'vv' || final === 'vm') {
          final = '1156381555875385484';
      }
      if (!/^\d+$/.test(final)) return;
      updateSettings({ discordId: final });
  };


  // Empty State: No ID set
  if (!settings.discordId) {
      return (
          <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in text-center p-8 overflow-y-auto">
              <div className="p-6 rounded-full bg-white/5 border border-white/10 shadow-2xl">
                  <Music size={48} className="text-zinc-500" />
              </div>
              <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white">Connect Lanyard</h2>
                  <p className="text-zinc-400 max-w-md mx-auto">Enter your numeric Discord User ID to display Spotify activity.</p>
              </div>
              <div className="flex gap-2 w-full max-w-md">
                  <input 
                    type="text" 
                    placeholder="e.g. 1156381555875385484" 
                    value={idInput}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveId()}
                    className="flex-1 bg-white/10 border border-white/10 rounded-xl px-6 py-4 text-lg text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono placeholder:text-zinc-600"
                  />
                  <button 
                    onClick={handleSaveId}
                    className="bg-white text-black px-6 rounded-xl font-bold hover:scale-105 transition-transform"
                  >
                      <ArrowRight size={24} />
                  </button>
              </div>
              <div className="max-w-md bg-white/5 border border-white/5 rounded-xl p-6 text-left space-y-4">
                  <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2"><HelpCircle size={14} /> Prerequisites</h3>
                  <ul className="space-y-3 text-sm text-zinc-400">
                      <li className="flex items-start gap-3"><span className="bg-indigo-500/20 text-indigo-400 rounded p-0.5 mt-0.5"><ExternalLink size={12}/></span><span>You <strong>must</strong> join the <a href="https://discord.gg/lanyard" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Lanyard Discord Server</a> for the API to see you.</span></li>
                      <li className="flex items-start gap-3"><span className="bg-green-500/20 text-green-400 rounded p-0.5 mt-0.5"><CheckCircle2 size={12}/></span><span>Enable <strong>"Display Spotify as your status"</strong> in Discord Settings &gt; Connections.</span></li>
                  </ul>
              </div>
          </div>
      );
  }

  // Loading State
  if (isLoading && !displayTrack) {
      return (
          <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in">
              <div className="relative">
                   <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
                   <Loader2 size={64} className="text-indigo-400 animate-spin relative z-10" />
              </div>
              <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Connecting...</h2>
                  <p className="text-zinc-500 font-mono text-sm">Waiting for Lanyard</p>
              </div>
          </div>
      );
  }

  // Empty State: Not Playing
  if (!displayTrack) {
       return (
          <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fade-in relative w-full p-8">
              <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse" />
                  <Disc size={120} className="text-zinc-700 relative z-10 animate-spin-slow opacity-50" />
              </div>
              <div className="text-center space-y-2">
                  <h2 className="text-4xl md:text-5xl font-black text-zinc-600 tracking-tighter uppercase">Silence</h2>
                  <p className="text-zinc-500 font-mono">Play something on Spotify</p>
              </div>
              <div className="absolute bottom-12 opacity-50 hover:opacity-100 transition-opacity flex flex-col items-center gap-2">
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Not showing up?</p>
                  <div className="flex gap-4 text-xs text-zinc-600">
                      <span className="flex items-center gap-1"><CheckCircle2 size={12}/> Spotify Linked</span>
                      <span className="flex items-center gap-1"><CheckCircle2 size={12}/> Joined Lanyard Server</span>
                  </div>
              </div>
          </div>
       );
  }

  const isTransitioning = animState !== 'idle';
  const slideClass = animState === 'exiting' ? '-translate-y-[150%] opacity-0 scale-90' : animState === 'entering' ? 'translate-y-[150%] opacity-0 scale-90' : 'translate-y-0 opacity-100 scale-100';
  
  const titleFontSize = getTitleSize(displayTrack.song);

  // Use VH for landscape height scaling, VW for portrait
  const renderVisual = () => {
      switch (settings.spotifyStyle) {
          case 'card':
               return (
                  <div className={`relative flex-shrink-0 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${slideClass} z-10`}>
                       <div className="w-[80vw] h-[80vw] md:w-[45vh] md:h-[45vh] rounded-lg shadow-2xl overflow-hidden border border-white/10 relative group">
                           <img src={displayTrack.album_art_url} alt="Album Art" className="w-full h-full object-cover transition-transform duration-[20s] ease-linear group-hover:scale-110" />
                           {!isPlaying && <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm"><Pause size={64} className="text-white fill-current" /></div>}
                       </div>
                  </div>
               );
          case 'minimal':
               return (
                   <div className={`relative flex-shrink-0 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${slideClass} z-10`}>
                        <div className="w-[40vw] h-[40vw] md:w-[30vh] md:h-[30vh] rounded-lg shadow-2xl overflow-hidden border border-white/10 relative">
                            <img src={displayTrack.album_art_url} alt="Album Art" className="w-full h-full object-cover" />
                        </div>
                   </div>
               );
          case 'vinyl':
          default:
               return (
                  <div className={`relative flex-shrink-0 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${slideClass} z-10`}>
                       <div className="relative group perspective-1000 w-[80vw] h-[80vw] md:w-[38vh] md:h-[38vh] z-10">
                           {settings.showVinylSleeve && (
                               <div className="absolute top-0 bottom-0 left-0 w-full z-20 shadow-2xl transition-transform duration-700 origin-bottom-left" style={{ transform: isPlaying ? 'rotate(-5deg) translateX(-10%)' : 'rotate(0deg) translateX(0px)' }}>
                                  <img src={displayTrack.album_art_url} alt="Album Art" className="w-full h-full object-cover rounded-md shadow-[5px_0_20px_rgba(0,0,0,0.5)] border border-white/10" />
                                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-md pointer-events-none" />
                               </div>
                           )}
                           <div className={`absolute top-[2%] bottom-[2%] right-[-35%] aspect-square rounded-full bg-black shadow-2xl flex items-center justify-center border-[4px] border-zinc-900 transition-transform duration-[2000ms] ${settings.showVinylSleeve ? 'z-10' : 'z-30 right-0'}`}>
                                <div className="absolute inset-2 rounded-full border border-zinc-800 opacity-50" />
                                <div className="absolute inset-4 rounded-full border border-zinc-800 opacity-40" />
                                <div className={`w-[45%] h-[45%] rounded-full overflow-hidden relative shadow-inner ${isPlaying ? 'animate-spin-slow' : ''}`} style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
                                    <img src={displayTrack.album_art_url} className="w-full h-full object-cover" alt="Label" />
                                </div>
                                <div className="absolute w-4 h-4 bg-[#111] rounded-full z-20" />
                                {!isPlaying && <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/40 rounded-full backdrop-blur-[2px] transition-all"><Pause size={48} className="text-white fill-current drop-shadow-lg" /></div>}
                           </div>
                       </div>
                  </div>
               );
      }
  };

  return (
    <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-between gap-16 md:gap-32 lg:gap-48 p-8 md:px-16 lg:px-24 overflow-hidden">
        
        {/* GLOBAL VISUALIZER LAYER (Bottom) */}
        {settings.enableVisualizer && isPlaying && (
            <div className="absolute bottom-0 left-0 right-0 h-[40vh] z-0 pointer-events-none mix-blend-overlay opacity-80 mask-gradient-to-t">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" /> {/* Soften bottom edge */}
                <AudioVisualizer isActive={true} sensitivity={settings.visualizerSensitivity} />
            </div>
        )}

        {/* Toggle Visualizer Button (Corner - Discreet) */}
        <div className="absolute bottom-8 right-8 z-50 flex items-center gap-2 group opacity-20 hover:opacity-100 transition-opacity duration-300">
             <button 
                onClick={() => updateSettings({ enableVisualizer: !settings.enableVisualizer })}
                className={`p-2 rounded-full transition-all ${settings.enableVisualizer ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-white/10 text-zinc-500 hover:text-white'}`}
                title="Toggle Audio Visualizer"
             >
                 {settings.enableVisualizer ? <Mic size={16} /> : <MicOff size={16} />}
             </button>
        </div>

        {isPlaying && (
            <>
                <div className="absolute top-8 left-8 md:top-10 md:left-12 z-20 pointer-events-none select-none animate-fade-in">
                    {settings.mediaShowDate && <div className="text-xs md:text-sm font-bold text-zinc-500 uppercase tracking-[0.2em] opacity-50">{formatMiniDate(currentTime)}</div>}
                </div>
                <div className="absolute top-8 right-8 md:top-10 md:right-12 z-20 pointer-events-none select-none animate-fade-in">
                    <div className="text-xs md:text-sm font-bold text-zinc-500 uppercase tracking-[0.2em] font-mono opacity-50">{formatTime(currentTime)}</div>
                </div>
            </>
        )}

        <div className="flex items-center justify-center flex-shrink-0 z-10">
             {renderVisual()}
        </div>

        <div className={`flex flex-col justify-center items-center md:items-start text-center md:text-left transition-all duration-500 delay-100 ${slideClass} flex-1 min-w-0 px-4 pt-12 md:pt-0 md:pl-24 z-30 w-full max-w-[90vw] md:max-w-[70vw]`}>
            <div className="space-y-6 w-full">
                <h1 className="font-black text-white leading-[1.1] tracking-tighter drop-shadow-2xl w-full pb-2" style={{ fontSize: titleFontSize, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {displayTrack.song}
                </h1>
                <div className="font-bold text-white/60 tracking-tight w-full leading-normal mt-4 text-xl md:text-3xl" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {displayTrack.artist.replace(/; /g, ', ')}
                </div>
                {displayTrack.album !== displayTrack.song && (
                    <div className="font-medium text-white/30 tracking-widest uppercase pt-4 w-full text-lg md:text-xl" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {displayTrack.album}
                    </div>
                )}
            </div>
        </div>
        
        <style>{`
            .perspective-1000 { perspective: 1000px; }
            .animate-spin-slow { animation: spin 8s linear infinite; }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .mask-gradient-to-t { -webkit-mask-image: linear-gradient(to top, black 0%, transparent 100%); mask-image: linear-gradient(to top, black 0%, transparent 100%); }
        `}</style>
    </div>
  );
};
