
import React, { useEffect, useState } from 'react';
import { SpotifyData, SpotifyStyle } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { Disc, Music, ArrowRight, Pause } from 'lucide-react';

interface MediaWidgetProps {
  spotify: SpotifyData | null;
  style: SpotifyStyle;
  isPlaying?: boolean;
}

export const MediaWidget: React.FC<MediaWidgetProps> = ({ spotify, isPlaying = true }) => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [displayTrack, setDisplayTrack] = useState<SpotifyData | null>(spotify);
  const [animState, setAnimState] = useState<'idle' | 'exiting' | 'entering'>('idle');
  const [idInput, setIdInput] = useState('');
  
  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatMiniTime = (ms: number) => {
      return new Date(ms).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: settings.timeFormat === '12h' 
      }).replace(/AM|PM/, '').trim();
  };
  
  const formatMiniDate = (ms: number) => {
      return new Date(ms).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric'
      });
  };

  // Transition Logic
  useEffect(() => {
    if (spotify?.track_id !== displayTrack?.track_id) {
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
             setDisplayTrack(prev => ({ ...spotify, start: spotify.start, end: spotify.end }));
        }
    }
  }, [spotify?.track_id, spotify?.start]); 
  
  const handleIdShortcut = (val: string) => {
      if (val === 'vv' || val === 'vm') return '1156381555875385484';
      return val;
  };

  // State 1: No ID set
  if (!settings.discordId) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-8">
              <div className="p-8 bg-white/5 rounded-full backdrop-blur-xl border border-white/10 shadow-xl animate-pulse">
                  <Disc size={64} className="text-zinc-500" />
              </div>
              <h2 className="text-4xl font-bold text-white tracking-tight">Connect Lanyard</h2>
              <div className="flex gap-4 w-full max-w-lg">
                  <input 
                    type="text" 
                    placeholder="Enter Discord ID..."
                    className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-white/30 transition-all font-mono text-lg text-white placeholder:text-white/30"
                    value={idInput}
                    onChange={(e) => setIdInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') updateSettings({ discordId: handleIdShortcut(idInput) });
                    }}
                  />
                  <button 
                    onClick={() => updateSettings({ discordId: handleIdShortcut(idInput) })}
                    className="p-5 bg-white text-black rounded-2xl hover:bg-zinc-200 transition-colors shadow-lg active:scale-95 duration-200"
                  >
                      <ArrowRight size={28} />
                  </button>
              </div>
              <p className="text-base text-zinc-500 max-w-md">Enable "Display current activity as status message" in Discord settings to sync.</p>
          </div>
      );
  }

  // State 2: ID set but no music
  if (!displayTrack) {
    return (
      <div className="flex flex-col items-center justify-center h-full select-none">
         <div className="relative mb-12 group active:scale-95 transition-transform duration-300">
             <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full animate-pulse opacity-50" />
             <div className="relative p-12 bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
                 <Music size={80} className="text-zinc-400" />
             </div>
         </div>
         <h2 className="text-5xl font-bold text-white tracking-tight mb-4">Ready to Play</h2>
         <p className="text-zinc-500 font-medium tracking-wide uppercase text-sm animate-pulse">Waiting for Spotify...</p>
      </div>
    );
  }

  // --- PLAYING STATE ---

  const isExiting = animState === 'exiting';
  const isEntering = animState === 'entering';
  
  const containerClass = `
    transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform
    ${isExiting ? '-translate-y-20 opacity-0 scale-95' : ''}
    ${isEntering ? 'translate-y-20 opacity-0 scale-95' : ''}
    ${animState === 'idle' ? 'translate-y-0 opacity-100 scale-100' : ''}
  `;

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden p-6 md:p-8 lg:p-12">
        
        {/* Top Left Date */}
        {settings.mediaShowDate && (
             <div className="absolute top-8 left-8 z-50 text-left mix-blend-overlay pointer-events-none">
                 <div className="text-2xl md:text-3xl font-bold text-white/60 tracking-tight uppercase">{formatMiniDate(currentTime)}</div>
             </div>
        )}

        {/* Top Right Mini Clock */}
        <div className="absolute top-8 right-8 z-50 text-right mix-blend-overlay pointer-events-none">
             <div className="text-3xl md:text-4xl font-bold text-white/60 tracking-tight font-variant-numeric tabular-nums">{formatMiniTime(currentTime)}</div>
        </div>

        {/* Content Wrapper */}
        <div className={`flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 lg:gap-24 w-full h-full ${containerClass}`}>
            
            {/* Vinyl & Sleeve Section - SCALED UP MASSIVELY */}
            <div className="relative group flex-shrink-0 perspective-1000 flex items-center justify-center md:h-full">
                 <div className="relative flex items-center justify-center transition-transform active:scale-95 duration-500">
                     {/* SLEEVE */}
                     {settings.showVinylSleeve && (
                        <div className="relative z-20 w-[70vw] h-[70vw] md:w-[55vh] md:h-[55vh] lg:w-[65vh] lg:h-[65vh] shadow-[0_40px_80px_rgba(0,0,0,0.7)] rounded-xl overflow-hidden bg-[#111] transition-all duration-700">
                             <img src={displayTrack.album_art_url} className="w-full h-full object-cover opacity-90" alt="Sleeve" />
                             <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                             <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-white/5 to-black/40" />
                        </div>
                     )}

                     {/* VINYL DISC */}
                     <div className={`
                        relative z-10 w-[68vw] h-[68vw] md:w-[54vh] md:h-[54vh] lg:w-[64vh] lg:h-[64vh] rounded-full 
                        transition-all duration-1000 ease-out shadow-2xl
                        ${settings.showVinylSleeve ? '-ml-[25vw] md:-ml-[25vh]' : ''}
                     `}>
                        <div className={`w-full h-full ${isPlaying ? 'animate-spin-slow' : ''}`}>
                            <div className="absolute inset-0 rounded-full bg-[#0a0a0a] shadow-xl border border-[#222]">
                                <div className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(#111_0px,#111_2px,#1a1a1a_3px)] opacity-80" />
                            </div>
                            <div className="absolute inset-[30%] rounded-full overflow-hidden border-2 border-[#111]">
                                <img src={displayTrack.album_art_url} className="w-full h-full object-cover" alt="Label" />
                            </div>
                            <div className="absolute inset-[47%] rounded-full bg-[#0a0a0a] border border-[#222]" />
                        </div>
                        
                        {/* Pause Overlay */}
                        {!isPlaying && (
                             <div className="absolute inset-0 flex items-center justify-center z-50">
                                 <div className="bg-black/40 backdrop-blur-md p-6 rounded-full border border-white/10 shadow-2xl">
                                     <Pause className="text-white fill-current" size={48} />
                                 </div>
                             </div>
                        )}
                     </div>
                 </div>
            </div>

            {/* Metadata Section - MAXIMIZED */}
            <div className="flex flex-col items-center md:items-start justify-center w-full md:max-w-[40vw] text-center md:text-left space-y-4 min-w-0">
                
                <div className="space-y-4 w-full min-w-0">
                    <h1 
                        className="font-black text-white tracking-tight leading-[0.9] drop-shadow-2xl break-words line-clamp-3 md:line-clamp-4"
                        style={{ fontSize: `clamp(3.5rem, 8vw, 8rem)` }}
                    >
                        {displayTrack.song}
                    </h1>
                    <p 
                        className="font-bold text-white/60 tracking-wide truncate"
                        style={{ fontSize: `clamp(1.5rem, 4vw, 4rem)` }}
                    >
                        {displayTrack.artist}
                    </p>
                </div>
            </div>

        </div>

        <style>{`
            .animate-spin-slow { animation: spin 8s linear infinite; }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .perspective-1000 { perspective: 1000px; }
        `}</style>
    </div>
  );
};
