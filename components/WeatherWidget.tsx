
import React, { useState, useEffect, useCallback } from 'react';
import { getWeather } from '../services/weatherService';
import { CloudRain, Sun, Cloud, Loader2, Zap } from 'lucide-react';
import { WeatherData } from '../types';

export const WeatherWidget: React.FC = () => {
  const [data, setData] = useState<WeatherData>({
    temp: '--',
    condition: '',
    location: '',
    loading: true,
  });

  const fetchWeather = useCallback(async () => {
    if (!navigator.geolocation) {
      setData(prev => ({ ...prev, loading: false, error: 'No Geo' }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const result = await getWeather(latitude, longitude);
          setData({ ...result, loading: false });
        } catch (err) {
          setData(prev => ({ ...prev, loading: false, error: 'Error' }));
        }
      },
      () => setData(prev => ({ ...prev, loading: false, error: 'Denied' }))
    );
  }, []);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  if (data.error) return null;

  return (
    <button onClick={fetchWeather} className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-white/5 transition-all">
      <div className="text-zinc-400">
        {data.loading ? <Loader2 size={16} className="animate-spin" /> : 
         data.condition.includes('Rain') ? <CloudRain size={16} /> : 
         data.condition.includes('Cloud') ? <Cloud size={16} /> : 
         data.condition.includes('Storm') ? <Zap size={16} /> :
         <Sun size={16} />}
      </div>
      <div className="text-lg font-medium text-zinc-400">
        {data.temp} <span className="mx-2 opacity-50">|</span> {data.condition}
      </div>
    </button>
  );
};
