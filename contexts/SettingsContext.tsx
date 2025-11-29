
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings } from '../types';

const DEFAULT_SETTINGS: AppSettings = {
  timeFormat: '24h',
  discordId: '',
  spotifyStyle: 'vinyl',
  showVinylSleeve: true,
  locationOverride: '',
  showSeconds: false,
  font: 'inter',
  accentColor: 'indigo',
  
  clockStyle: 'modern',
  clockPosition: 'bottom-left',
  hideAmPm: true,
  clockTransparency: 1,
  clockShowDate: true,
  clockShowBattery: true,
  clockShowWeather: true,
  clockShowNowPlaying: true,

  customBackgroundUrl: '',
  predefinedWallpaper: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9d869?q=80&w=2532&auto=format&fit=crop',
  backgroundBlur: 40,
  glassIntensity: 'medium',
  enableGlassTheme: false,
  
  mediaShowDate: true,
  
  keepScreenOn: true,
  
  enableDashboard: false,
  enableFocus: false,
  enableDeviceInfo: false,
  autoSwitchToMedia: true,
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('cobalt_settings_v6');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('cobalt_settings_v6', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
