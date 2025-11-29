import { useState, useEffect, useRef } from 'react';
import { LanyardData, SpotifyData } from '../types';

const LANYARD_WS = 'wss://api.lanyard.rest/socket';

export const useLanyard = (discordId: string) => {
  const [data, setData] = useState<LanyardData>({
    spotify: null,
    listening_to_spotify: false,
  });
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<number | null>(null);

  useEffect(() => {
    if (!discordId) return;

    const connect = () => {
      const ws = new WebSocket(LANYARD_WS);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        // Initialize
        ws.send(JSON.stringify({
          op: 2,
          d: { subscribe_to_id: discordId }
        }));
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const { op, t, d } = message;

        // Hello / Heartbeat setup
        if (op === 1) {
          heartbeatRef.current = window.setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ op: 3 }));
            }
          }, d.heartbeat_interval);
        }

        // Init State or Update
        if (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') {
          const presence = t === 'INIT_STATE' ? d[discordId] : d;
          if (presence) {
            setData({
              spotify: presence.spotify,
              listening_to_spotify: presence.listening_to_spotify,
            });
          }
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        // Reconnect after 5s
        setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [discordId]);

  return { data, isConnected };
};
