
import React, { useState, useEffect, useRef } from 'react';
import { ClockWidget } from './components/ClockWidget';
import { FocusWidget } from './components/FocusWidget';
import { MediaWidget } from './components/MediaWidget';
import { WidgetsPage } from './components/WidgetsPage';
import { DeviceInfoPage } from './components/DeviceInfoPage';
import { Carousel } from './components/Carousel';
import { SettingsModal } from './components/SettingsModal';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { useLanyard } from './hooks/useLanyard';
import { useWakeLock } from './hooks/useWakeLock';
import { Settings, Maximize2, Minimize2 } from 'lucide-react';

const TopBarClock = () => {
    const [time, setTime] = useState(new Date());
    const { settings } = useSettings();
    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="text-xl md:text-2xl font-bold text-white/80 font-mono">
            {time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: settings.timeFormat === '12h' }).replace(/AM|PM/, '').trim()}
        </div>
    );
};

const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { settings } = useSettings();
  const { data: lanyardData } = useLanyard(settings.discordId);
  const { requestWakeLock, releaseWakeLock } = useWakeLock();
  
  const prevListeningRef = useRef(lanyardData.listening_to_spotify);

  // Define Pages dynamically
  const pages = [
      { 
          id: 'clock', 
          component: <div className="w-full h-full relative flex flex-col"><div className="flex-1 w-full h-full"><ClockWidget spotify={lanyardData.spotify} /></div></div> 
      },
      { 
          id: 'media', 
          component: <div className="w-full h-full flex items-center justify-center p-0 md:p-8">
              <MediaWidget spotify={lanyardData.spotify} style={settings.spotifyStyle} isPlaying={lanyardData.listening_to_spotify} />
          </div> 
      },
  ];

  if (settings.enableDashboard) {
      pages.push({ id: 'dashboard', component: <div className="w-full h-full flex items-center justify-center pt-24 pb-8"><WidgetsPage /></div> });
  }
  if (settings.enableFocus) {
      pages.push({ id: 'focus', component: <div className="w-full h-full flex items-center justify-center p-8"><FocusWidget isVisible={false} /></div> });
  }
  if (settings.enableDeviceInfo) {
      pages.push({ id: 'device', component: <div className="w-full h-full flex items-center justify-center pt-24"><DeviceInfoPage /></div> });
  }

  // Wake Lock
  useEffect(() => {
    if (settings.keepScreenOn) requestWakeLock();
    else releaseWakeLock();
  }, [settings.keepScreenOn, requestWakeLock, releaseWakeLock]);

  // Global ESC Handler
  useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
              setIsSettingsOpen(false);
          }
      };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Auto Switch Logic
  useEffect(() => {
      const isListening = lanyardData.listening_to_spotify;
      const wasListening = prevListeningRef.current;
      
      const mediaIndex = pages.findIndex(p => p.id === 'media');
      const clockIndex = pages.findIndex(p => p.id === 'clock');

      if (settings.autoSwitchToMedia) {
          // Started playing -> Go to Media
          if (isListening && !wasListening && mediaIndex !== -1) {
              setActivePage(mediaIndex);
          }
          // Stopped playing -> Go back to Clock (if currently on Media)
          if (!isListening && wasListening && activePage === mediaIndex && clockIndex !== -1) {
              setActivePage(clockIndex);
          }
      }
      prevListeningRef.current = isListening;
  }, [lanyardData.listening_to_spotify, settings.autoSwitchToMedia, pages, activePage]);

  // Keyboard Nav
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      
      if (e.key === 'ArrowRight') setActivePage(p => Math.min(p + 1, pages.length - 1));
      if (e.key === 'ArrowLeft') setActivePage(p => Math.max(p - 1, 0));
      
      if (e.key.toLowerCase() === 's') setIsSettingsOpen(true);
      
      if (e.key.toLowerCase() === 'f') {
          if (!document.fullscreenElement) document.documentElement.requestFullscreen();
          else document.exitFullscreen();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [pages.length]);

  // Fullscreen Sync
  useEffect(() => {
    const fn = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', fn);
    return () => document.removeEventListener('fullscreenchange', fn);
  }, []);

  // Background Logic
  let bgImage = settings.predefinedWallpaper ? `url(${settings.predefinedWallpaper})` : undefined;
  if (settings.customBackgroundUrl) bgImage = `url(${settings.customBackgroundUrl})`;
  
  let bgBlur = settings.backgroundBlur;

  // Use current song for background if available
  if (lanyardData.spotify?.album_art_url) {
      bgImage = `url(${lanyardData.spotify.album_art_url})`;
      bgBlur = 60;
  }
  
  const activePageId = pages[activePage]?.id;
  // Hide top clock on 'clock' page (redundant) and 'media' page (has its own clock)
  const shouldHideTopClock = activePageId === 'media' || activePageId === 'clock';

  return (
    <div className={`h-screen w-screen bg-[#020202] text-zinc-100 overflow-hidden relative selection:bg-white/20 ${settings.enableGlassTheme ? 'theme-liquid' : ''}`}>
      
      {/* Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-[2000ms] transform scale-105"
        style={{ backgroundImage: bgImage, filter: `blur(${bgBlur}px) brightness(0.4)` }}
      />
      
      {/* Top Bar - Large Touch Targets */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 md:p-8 flex justify-between items-start pointer-events-none">
        <div className={`pointer-events-auto flex items-center gap-4 transition-opacity duration-500 ${shouldHideTopClock ? 'opacity-0' : 'opacity-100'}`}>
             {/* Mini Clock - Hidden on Media Page & Clock Page */}
            <div className={`px-6 py-3 rounded-full backdrop-blur-md border border-white/5 ${settings.enableGlassTheme ? 'bg-white/10 shadow-xl' : 'bg-white/5'}`}>
                <TopBarClock />
            </div>
        </div>
        <div className="flex gap-4 pointer-events-auto opacity-0 hover:opacity-100 transition-opacity duration-300">
             <button 
                onClick={() => setIsSettingsOpen(true)} 
                className="p-5 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md transition-colors active:scale-90 duration-200 border border-white/5 shadow-lg"
             >
                <Settings size={28}/>
             </button>
             <button 
                onClick={() => isFullscreen ? document.exitFullscreen() : document.documentElement.requestFullscreen()} 
                className="p-5 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md transition-colors active:scale-90 duration-200 border border-white/5 shadow-lg"
             >
                {isFullscreen ? <Minimize2 size={28}/> : <Maximize2 size={28}/>}
             </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 w-full h-full">
        <Carousel activeIndex={activePage} onChange={setActivePage}>
            {pages.map((page, idx) => (
                <div key={idx} className="w-full h-full">
                    {page.component}
                </div>
            ))}
        </Carousel>
      </main>

      {/* Page Indicators - Touch Friendly */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex gap-4 pointer-events-auto mix-blend-overlay p-4">
          {pages.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActivePage(i)}
                className={`h-2 rounded-full transition-all duration-500 ease-out cursor-pointer ${activePage === i ? 'w-12 bg-white shadow-[0_0_15px_white]' : 'w-3 bg-white/30 hover:bg-white/50'}`}
                aria-label={`Go to page ${i + 1}`}
              />
          ))}
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default function App() {
    return (
        <SettingsProvider>
            <AppContent />
        </SettingsProvider>
    )
}
