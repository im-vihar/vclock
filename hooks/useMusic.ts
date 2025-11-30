
import { useState, useEffect, useRef } from 'react';
import { LanyardData, SpotifyData, SpotifyApiTrack } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { getCurrentlyPlaying, refreshAccessToken, setSpotifyClientId } from '../services/spotifyService';

const initialData: LanyardData = {
    spotify: null,
    listening_to_spotify: false,
};

// A custom hook to abstract away music provider logic
export const useMusic = () => {
  const { settings, updateSettings } = useSettings();
  const [data, setData] = useState<LanyardData>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const lanyardHeartbeatRef = useRef<number | null>(null);

  useEffect(() => {
    const cleanup = () => {
        // Lanyard WS cleanup
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        if (lanyardHeartbeatRef.current) {
            clearInterval(lanyardHeartbeatRef.current);
            lanyardHeartbeatRef.current = null;
        }
        // Reset state
        setData(initialData);
        setIsLoading(true);
        setError(null);
    };

    // --- LANYARD PROVIDER ---
    if (settings.musicProvider === 'lanyard') {
        if (!settings.discordId) {
            setIsLoading(false);
            return;
        }
        
        const connectLanyard = () => {
             if (wsRef.current) wsRef.current.close();

             const ws = new WebSocket('wss://api.lanyard.rest/socket');
             wsRef.current = ws;

             ws.onopen = () => {
                ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: settings.discordId } }));
             };

             ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.t === 'INIT_STATE' || message.t === 'PRESENCE_UPDATE') {
                    setData({ spotify: message.d.spotify, listening_to_spotify: message.d.listening_to_spotify });
                    setIsLoading(false);
                }
                if (message.op === 1) {
                    const interval = message.d.heartbeat_interval;
                    if (lanyardHeartbeatRef.current) clearInterval(lanyardHeartbeatRef.current);
                    lanyardHeartbeatRef.current = window.setInterval(() => ws.send(JSON.stringify({ op: 3 })), interval);
                }
             };

             ws.onclose = () => setTimeout(connectLanyard, 5000);
             ws.onerror = () => ws.close();
        }
        connectLanyard();
        
    } 

    // --- SPOTIFY PROVIDER ---
    else if (settings.musicProvider === 'spotify') {
        if (!settings.spotifyAccessToken) {
            setIsLoading(false);
            return;
        }

        setSpotifyClientId(settings.spotifyClientId);

        const fetchSpotify = async () => {
            let token = settings.spotifyAccessToken;

            // 1. Check if token is expired
            if (Date.now() >= settings.spotifyTokenExpires) {
                try {
                    const { access_token, new_refresh_token } = await refreshAccessToken(settings.spotifyRefreshToken);
                    token = access_token;
                    updateSettings({
                        spotifyAccessToken: access_token,
                        spotifyTokenExpires: Date.now() + 3600 * 1000,
                        spotifyRefreshToken: new_refresh_token || settings.spotifyRefreshToken, // Keep old one if not provided
                    });
                } catch (e) {
                    console.error("Couldn't refresh Spotify token", e);
                    setError('Spotify connection expired. Please reconnect.');
                    updateSettings({ spotifyAccessToken: '', spotifyRefreshToken: '', spotifyTokenExpires: 0 });
                    return;
                }
            }

            // 2. Fetch data
            try {
                const trackData: SpotifyApiTrack | null = await getCurrentlyPlaying(token);
                if (trackData) {
                     const transformed: SpotifyData = {
                        track_id: trackData.item.id,
                        song: trackData.item.name,
                        artist: trackData.item.artists.map(a => a.name).join('; '),
                        album: trackData.item.album.name,
                        album_art_url: trackData.item.album.images[0]?.url || '',
                        start: Date.now() - trackData.progress_ms,
                        end: Date.now() - trackData.progress_ms + trackData.item.duration_ms,
                     };
                     setData({ spotify: transformed, listening_to_spotify: trackData.is_playing });
                } else {
                     setData({ spotify: null, listening_to_spotify: false });
                }
                setError(null);
            } catch (e) {
                console.error("Spotify fetch error", e);
                setError('Failed to fetch from Spotify.');
            }
            setIsLoading(false);
        };
        
        fetchSpotify();
        const interval = setInterval(fetchSpotify, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }
    
    else {
        setIsLoading(false);
    }

    return cleanup;

  }, [settings.musicProvider, settings.discordId, settings.spotifyAccessToken]);

  return { data, isLoading, error };
};
