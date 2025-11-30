
import React, { useState, useEffect, useRef } from 'react';
import { ClockWidget } from './components/ClockWidget';
import { FocusWidget } from './components/FocusWidget';
import { MediaWidget } from './components/MediaWidget';
import { WidgetsPage } from './components/WidgetsPage';
import { DeviceInfoPage } from './components/DeviceInfoPage';
import { Carousel } from './components/Carousel';
import { SettingsModal } from './components/SettingsModal';
import { Screensaver } from './components/Screensaver';
import { OnboardingOverlay } from './components/OnboardingOverlay';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { useMusic } from './hooks/useMusic';
import { useWakeLock } from './hooks/useWakeLock';
import { Settings, Maximize2, Minimize2 } from 'lucide-react';
import { getAccessToken, setSpotifyClientId } from './services/spotifyService';

const TopBarClock = () => {
    const [time, setTime] = useState(new Date());
    const { settings } = useSettings();
    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="text-xl md:text-3xl font-bold text-white/80 font-mono">
            {time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: settings.timeFormat === '12h' }).replace(/AM|PM/, '').trim()}
        </div>
    );
};

const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  
  const { settings, updateSettings } = useSettings();
  const { data: musicData, isLoading: isMusicLoading, error: musicError } = useMusic();
  const { requestWakeLock, releaseWakeLock } = useWakeLock();
  
  const prevListeningRef = useRef(musicData.listening_to_spotify);
  const idleTimerRef = useRef<number | null>(null);

  useEffect(() => {
      const handleSpotifyCallback = async () => {
          const params = new URLSearchParams(window.location.search);
          const code = params.get('code');

          if (code) {
              try {
                  if (settings.spotifyClientId) {
                    setSpotifyClientId(settings.spotifyClientId);
                    const { access_token, refresh_token } = await getAccessToken(code);
                    updateSettings({
                        spotifyAccessToken: access_token,
                        spotifyRefreshToken: refresh_token,
                        spotifyTokenExpires: Date.now() + 3600 * 1000,
                        musicProvider: 'spotify', // Switch to spotify automatically
                    });
                    // Open settings to show the user it worked
                    setIsSettingsOpen(true);
                  }
              } catch (error) {
                  console.error("Error getting Spotify token:", error);
              }
              // Clean up URL
              window.history.replaceState({}, document.title, window.location.pathname);
          }
      };

      handleSpotifyCallback();
  }, [settings.spotifyClientId, updateSettings]);

  // Define Pages dynamically
  const pages = [
      { 
          id: 'clock', 
          component: <div className="w-full h-full relative flex flex-col"><div className="flex-1 w-full h-full"><ClockWidget spotify={musicData.spotify} /></div></div> 
      },
      { 
          id: 'media', 
          component: <div className="w-full h-full flex items-center justify-center p-0">
              <MediaWidget 
                spotify={musicData.spotify} 
                style={settings.spotifyStyle} 
                isPlaying={musicData.listening_to_spotify} 
                isLoading={isMusicLoading}
                error={musicError}
              />
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

  // Idle Timer / Screensaver Logic
  useEffect(() => {
      const resetIdle = () => {
          setIsIdle(false);
          if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
          if (settings.screensaverTimeout > 0) {
              idleTimerRef.current = window.setTimeout(() => {
                  setIsIdle(true);
              }, settings.screensaverTimeout * 60 * 1000);
          }
      };

      // Events that reset idle
      window.addEventListener('mousemove', resetIdle);
      window.addEventListener('keydown', resetIdle);
      window.addEventListener('touchstart', resetIdle);
      window.addEventListener('click', resetIdle);

      // Init timer
      resetIdle();

      return () => {
          window.removeEventListener('mousemove', resetIdle);
          window.removeEventListener('keydown', resetIdle);
          window.removeEventListener('touchstart', resetIdle);
          window.removeEventListener('click', resetIdle);
          if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      };
  }, [settings.screensaverTimeout]);

  // Auto Switch Logic
  useEffect(() => {
      const isListening = musicData.listening_to_spotify;
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
  }, [musicData.listening_to_spotify, settings.autoSwitchToMedia, pages, activePage]);

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
  const defaultBg = settings.customBackgroundUrl || settings.predefinedWallpaper;
  const musicBg = musicData.spotify?.album_art_url;
  const isPlayingMusic = musicData.listening_to_spotify && musicBg;
  
  const bgBlur = settings.backgroundBlur;

  const activePageId = pages[activePage]?.id;
  // Hide top clock on 'clock' page (redundant) and 'media' page (has its own clock)
  const shouldHideTopClock = activePageId === 'media' || activePageId === 'clock' || isIdle;

  return (
    <div className={`h-screen w-screen bg-[#020202] text-zinc-100 overflow-hidden relative selection:bg-white/20 ${settings.enableGlassTheme ? 'theme-liquid' : ''}`}>
      
      <OnboardingOverlay />

      {/* Screensaver Overlay */}
      {isIdle && settings.screensaverTimeout > 0 && <Screensaver />}

      {/* Background Layer 1: Default Wallpaper */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-[3000ms] ease-in-out transform"
        style={{ 
            backgroundImage: `url(${defaultBg})`, 
            filter: `blur(${bgBlur}px) brightness(0.4)`,
            opacity: 1, // Always visible underneath
            transform: isPlayingMusic ? 'scale(1.0)' : 'scale(1.05)'
        }}
      />

      {/* Background Layer 2: Album Art (Overlay) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-[3000ms] ease-in-out transform"
        style={{ 
            backgroundImage: `url(${musicBg})`, 
            filter: `blur(60px) brightness(0.4)`,
            opacity: isPlayingMusic ? 1 : 0,
            transform: isPlayingMusic ? 'scale(1.05)' : 'scale(1.0)' // Breathing effect: scales up when active, scales down when fading out
        }}
      />
      
      {/* Top Bar - Large Touch Targets - Adjusted for Landscape */}
      {!isIdle && (
        <div className="absolute top-0 left-0 right-0 z-50 p-6 landscape:p-4 md:p-8 flex justify-between items-start pointer-events-none">
            <div className={`pointer-events-auto flex items-center gap-4 transition-opacity duration-500 ${shouldHideTopClock ? 'opacity-0' : 'opacity-100'}`}>
                {/* Mini Clock - Hidden on Media Page & Clock Page */}
                <div className={`px-6 py-4 rounded-full backdrop-blur-md border border-white/5 ${settings.enableGlassTheme ? 'bg-white/10 shadow-xl' : 'bg-white/5'}`}>
                    <TopBarClock />
                </div>
            </div>
            <div className="flex gap-4 pointer-events-auto opacity-0 hover:opacity-100 transition-opacity duration-300">
                <button 
                    onClick={() => setIsSettingsOpen(true)} 
                    className="p-6 landscape:p-4 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md transition-colors active:scale-90 duration-200 border border-white/5 shadow-lg"
                    aria-label="Settings"
                >
                    <Settings size={32}/>
                </button>
                <button 
                    onClick={() => isFullscreen ? document.exitFullscreen() : document.documentElement.requestFullscreen()} 
                    className="p-6 landscape:p-4 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md transition-colors active:scale-90 duration-200 border border-white/5 shadow-lg"
                    aria-label="Fullscreen Toggle"
                >
                    {isFullscreen ? <Minimize2 size={32}/> : <Maximize2 size={32}/>}
                </button>
            </div>
        </div>
      )}

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
      {!isIdle && (
        <div className="absolute bottom-8 landscape:bottom-4 left-1/2 transform -translate-x-1/2 z-40 flex gap-6 landscape:gap-4 pointer-events-auto mix-blend-overlay p-6 landscape:p-2">
            {pages.map((_, i) => (
                <button 
                    key={i} 
                    onClick={() => setActivePage(i)}
                    className={`h-3 rounded-full transition-all duration-500 ease-out cursor-pointer shadow-lg ${activePage === i ? 'w-16 bg-white shadow-[0_0_20px_white]' : 'w-4 bg-white/30 hover:bg-white/50'}`}
                    aria-label={`Go to page ${i + 1}`}
                />
            ))}
        </div>
      )}

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
