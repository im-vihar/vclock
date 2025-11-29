
import { useState, useEffect, useRef } from 'react';
import { LanyardData } from '../types';
import { useSettings } from '../contexts/SettingsContext';

export const useLanyard = (discordId: string) => {
  const { settings } = useSettings();
  const [data, setData] = useState<LanyardData>({
    spotify: null,
    listening_to_spotify: false,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(!!discordId);
  
  // Refs for WebSocket
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<number | null>(null);

  useEffect(() => {
    if (!discordId) {
        setIsConnected(false);
        setIsLoading(false);
        setData({ spotify: null, listening_to_spotify: false });
        return;
    }

    setIsLoading(true);

    // --- MODE: POLLING ---
    if (settings.lanyardConnectionMode === 'polling') {
        const fetchLanyard = async () => {
          try {
            const response = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
            const body = await response.json();

            if (body.success && body.data) {
              setData({
                spotify: body.data.spotify,
                listening_to_spotify: body.data.listening_to_spotify,
              });
              setIsConnected(true);
            } else {
                setIsConnected(false);
            }
          } catch (error) {
            console.error('Lanyard Poll Error:', error);
            setIsConnected(false);
          } finally {
             setIsLoading(false);
          }
        };

        fetchLanyard();
        const intervalId = setInterval(fetchLanyard, settings.lanyardPollingInterval);
        return () => clearInterval(intervalId);
    } 
    
    // --- MODE: WEBSOCKET ---
    else {
        let reconnectTimeout: number;

        const connect = () => {
            if (wsRef.current?.readyState === WebSocket.OPEN) return;

            const ws = new WebSocket('wss://api.lanyard.rest/socket');
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('Lanyard WS Connected');
                setIsConnected(true);
                // Initialize
                ws.send(JSON.stringify({
                    op: 2,
                    d: { subscribe_to_id: discordId }
                }));
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    
                    // Init State
                    if (message.t === 'INIT_STATE' || message.t === 'PRESENCE_UPDATE') {
                        const d = message.d;
                        setData({
                            spotify: d.spotify,
                            listening_to_spotify: d.listening_to_spotify,
                        });
                        setIsLoading(false);
                    }

                    // Heartbeat
                    if (message.op === 1) {
                         const interval = message.d.heartbeat_interval;
                         if (heartbeatRef.current) window.clearInterval(heartbeatRef.current);
                         heartbeatRef.current = window.setInterval(() => {
                             if (ws.readyState === WebSocket.OPEN) {
                                 ws.send(JSON.stringify({ op: 3 }));
                             }
                         }, interval);
                    }
                } catch (e) {
                    console.error('Lanyard Parse Error', e);
                }
            };

            ws.onclose = () => {
                console.log('Lanyard WS Closed');
                setIsConnected(false);
                if (heartbeatRef.current) clearInterval(heartbeatRef.current);
                // Try reconnect
                reconnectTimeout = window.setTimeout(connect, 3000);
            };

            ws.onerror = () => {
                ws.close();
                setIsLoading(false); // Stop loading on error so UI shows error state
            };
        };

        connect();

        return () => {
            if (wsRef.current) wsRef.current.close();
            if (heartbeatRef.current) clearInterval(heartbeatRef.current);
            clearTimeout(reconnectTimeout);
        };
    }

  }, [discordId, settings.lanyardConnectionMode, settings.lanyardPollingInterval]);

  return { data, isConnected, isLoading };
};
