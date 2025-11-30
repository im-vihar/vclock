
export interface WeatherData {
  temp: string;
  condition: string;
  location: string;
  loading: boolean;
  error?: string;
}

// Settings
export type TimeFormat = '12h' | '24h';
export type ThemeMode = 'dark' | 'light';
export type SpotifyStyle = 'minimal' | 'card' | 'background' | 'vinyl';
export type FontOption = 'inter' | 'mono' | 'serif' | 'bebas' | 'oswald' | 'digital';
export type AccentColor = 'indigo' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'white';
export type ClockStyle = 'digital' | 'flip' | 'modern' | 'stack';
export type ClockPosition = 'center' | 'bottom-left';
export type LanyardConnectionMode = 'websocket' | 'polling';
export type MusicProvider = 'lanyard' | 'spotify';

export interface AppSettings {
  timeFormat: TimeFormat;
  discordId: string;
  spotifyStyle: SpotifyStyle;
  showVinylSleeve: boolean;
  locationOverride: string;
  showSeconds: boolean;
  font: FontOption;
  accentColor: AccentColor;
  
  hasCompletedOnboarding: boolean;

  lanyardConnectionMode: LanyardConnectionMode;
  lanyardPollingInterval: number;

  // Spotify Direct Integration
  musicProvider: MusicProvider;
  spotifyClientId: string;
  spotifyAccessToken: string;
  spotifyRefreshToken: string;
  spotifyTokenExpires: number;
  
  clockStyle: ClockStyle;
  clockPosition: ClockPosition;
  hideAmPm: boolean;
  clockTransparency: number;
  clockShowDate: boolean;
  clockShowBattery: boolean;
  clockShowWeather: boolean;
  clockShowNowPlaying: boolean;

  customBackgroundUrl: string;
  predefinedWallpaper: string;
  backgroundBlur: number;
  glassIntensity: 'low' | 'medium' | 'high';
  enableGlassTheme: boolean;
  
  mediaShowDate: boolean;
  enableVisualizer: boolean;
  visualizerSensitivity: number;
  
  keepScreenOn: boolean;
  screensaverTimeout: number; // in minutes, 0 to disable
  
  enableDashboard: boolean;
  enableFocus: boolean;
  enableDeviceInfo: boolean;
  autoSwitchToMedia: boolean;
}

// Data Integrations
export interface SpotifyData {
  track_id: string | null;
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  start: number;
  end: number;
}

export interface SpotifyApiTrack {
    item: {
        id: string;
        name: string;
        artists: { name: string }[];
        album: {
            name:string;
            images: { url: string }[];
        };
        duration_ms: number;
    }
    progress_ms: number;
    is_playing: boolean;
}

export interface LanyardData {
  spotify: SpotifyData | null;
  listening_to_spotify: boolean;
}

export interface SystemStatus {
    online: boolean;
    batteryLevel: number | null;
    isCharging: boolean;
    userAgent: string;
    screenResolution: string;
}
