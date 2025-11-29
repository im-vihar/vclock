
import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { FlipClock } from './FlipClock';
import { Battery, BatteryCharging, Zap, Wifi, Music } from 'lucide-react';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { getWeather } from '../services/weatherService';
import { SpotifyData } from '../types';

interface ClockWidgetProps {
  spotify?: SpotifyData | null;
}

export const ClockWidget: React.FC<ClockWidgetProps> = ({ spotify }) => {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState({ temp: '--', condition: '' });
  const { settings } = useSettings();
  const system = useSystemStatus();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!settings.clockShowWeather) return;
    navigator.geolocation?.getCurrentPosition(async (pos) => {
        const w = await getWeather(pos.coords.latitude, pos.coords.longitude);
        setWeather({ temp: w.temp, condition: w.condition });
    });
  }, [settings.clockShowWeather]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const getAmPm = (date: Date) => date.getHours() >= 12 ? 'PM' : 'AM';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: settings.showSeconds ? '2-digit' : undefined,
      hour12: settings.timeFormat === '12h',
    }).replace(/AM|PM/, '').trim();
  };

  const isNestMode = settings.clockPosition === 'bottom-left';
  
  const batteryLevel = system.batteryLevel !== null ? Math.round(system.batteryLevel * 100) : 0;
  const isLowBattery = batteryLevel <= 20 && !system.isCharging;
  const isFullBattery = batteryLevel === 100;
  
  const batteryColor = isLowBattery ? 'text-red-500 animate-pulse' : isFullBattery ? 'text-green-400' : 'text-zinc-400';

  return (
    <div 
        className={`w-full h-full flex flex-col transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] p-8 md:p-12 lg:p-24 pb-32
        ${isNestMode ? 'items-start justify-end' : 'items-center justify-center'}`}
        style={{ opacity: settings.clockTransparency }}
    >
      
      {/* Clock Content */}
      <div className="flex-1 flex flex-col justify-center relative">
          
          {/* Date */}
          {settings.clockShowDate && (
            <div className={`text-zinc-400 font-medium tracking-wide drop-shadow-lg transition-all duration-500
                ${isNestMode 
                    ? 'text-2xl md:text-3xl lg:text-4xl mb-2 lg:mb-4' 
                    : 'text-center text-[3vw] lg:text-[2vw] mb-4 lg:mb-8 uppercase tracking-[0.3em]'} 
                animate-in fade-in slide-in-from-bottom-4 duration-1000`}>
                {formatDate(time)}
            </div>
          )}

          {/* Clock Styles */}
          {settings.clockStyle === 'flip' ? (
              <FlipClock 
                hours={settings.timeFormat === '12h' ? (time.getHours() % 12 || 12) : time.getHours()} 
                minutes={time.getMinutes()} 
                seconds={time.getSeconds()} 
                showSeconds={settings.showSeconds}
                amPm={settings.timeFormat === '12h' && !settings.hideAmPm ? getAmPm(time) : undefined}
              />
          ) : settings.clockStyle === 'stack' ? (
               <div className="flex flex-col items-center leading-[0.85]">
                   <span className="text-[35vw] font-black text-white tracking-tighter drop-shadow-2xl">
                       {(settings.timeFormat === '12h' ? (time.getHours() % 12 || 12) : time.getHours()).toString().padStart(2, '0')}
                   </span>
                   <span className="text-[35vw] font-black text-white/90 tracking-tighter drop-shadow-2xl">
                       {time.getMinutes().toString().padStart(2, '0')}
                   </span>
               </div>
          ) : (
              /* Modern & Digital */
              <div className="relative leading-none flex items-baseline group">
                <span className={`font-bold tracking-tighter text-white drop-shadow-2xl transition-all duration-500
                    ${isNestMode 
                        ? 'text-[20vw] lg:text-[14rem]' 
                        : (settings.showSeconds ? 'text-[18vw]' : 'text-[28vw]')}
                    ${settings.clockStyle === 'modern' ? 'bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 animate-breathing' : ''}
                `}>
                  {formatTime(time)}
                </span>
                {settings.timeFormat === '12h' && !settings.hideAmPm && (
                    <span className={`font-medium text-zinc-500 ml-4
                        ${isNestMode ? 'text-3xl' : 'text-[4vw]'}`}>
                        {getAmPm(time)}
                    </span>
                )}
              </div>
          )}
      </div>

      {/* Status Line (Now visible in center mode too) */}
      <div className={`flex flex-wrap gap-6 text-zinc-400 transition-opacity items-center mt-8
          ${isNestMode ? 'justify-start opacity-100' : 'justify-center opacity-80'}
      `}>
          {settings.clockShowBattery && (
              <div className={`flex items-center gap-2 ${batteryColor}`}>
                {system.isCharging ? <Zap size={20} className="fill-current" /> : <Battery size={20} />}
                <span className="text-base font-bold">{batteryLevel}%</span>
              </div>
          )}
          
          {settings.clockShowWeather && (
               <div className="flex items-center gap-2">
                   <span className="text-base font-medium">{weather.temp} • {weather.condition}</span>
               </div>
          )}

          {settings.clockShowNowPlaying && spotify && (
               <div className="flex items-center gap-2 text-zinc-300 bg-white/5 px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
                   <Music size={16} className="animate-pulse text-indigo-400" />
                   <span className="text-sm md:text-base font-medium max-w-[200px] md:max-w-[400px] truncate">
                       {spotify.song} <span className="text-zinc-500 mx-1">•</span> <span className="text-zinc-400 text-xs uppercase tracking-wider">{spotify.artist}</span>
                   </span>
               </div>
          )}
      </div>

      <style>{`
          .animate-breathing { animation: breathing 8s ease-in-out infinite; }
          @keyframes breathing {
              0%, 100% { opacity: 1; transform: scale(1); filter: brightness(1); }
              50% { opacity: 0.85; transform: scale(0.99); filter: brightness(0.95); }
          }
      `}</style>
    </div>
  );
};
