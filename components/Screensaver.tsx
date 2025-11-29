
import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export const Screensaver: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const [position, setPosition] = useState({ top: '50%', left: '50%' });
    const { settings } = useSettings();

    useEffect(() => {
        const timeInterval = setInterval(() => setTime(new Date()), 1000);
        
        // Move clock every minute to prevent burn-in
        const moveInterval = setInterval(() => {
            const top = Math.floor(Math.random() * 80) + 10; // 10% to 90%
            const left = Math.floor(Math.random() * 80) + 10;
            setPosition({ top: `${top}%`, left: `${left}%` });
        }, 60000);

        return () => {
            clearInterval(timeInterval);
            clearInterval(moveInterval);
        };
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: settings.timeFormat === '12h',
        }).replace(/AM|PM/, '').trim();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black cursor-none flex items-start justify-start overflow-hidden animate-fade-in">
            <div 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-[2000ms] ease-in-out"
                style={{ top: position.top, left: position.left }}
            >
                <div className="flex flex-col items-center opacity-70">
                    <div className="text-[15vw] md:text-[8rem] font-bold text-zinc-400/50 leading-none font-mono">
                        {formatTime(time)}
                    </div>
                    {settings.clockShowDate && (
                        <div className="text-xl text-zinc-600 font-medium mt-4 tracking-widest uppercase">
                            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="absolute bottom-8 w-full text-center text-zinc-800 text-sm font-bold uppercase tracking-widest animate-pulse">
                Tap to wake
            </div>
        </div>
    );
};
