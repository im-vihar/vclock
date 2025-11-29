
import React, { useState, useEffect } from 'react';
import { Newspaper } from 'lucide-react';

const MOCK_NEWS = [
    { id: 1, title: "Next-Gen AI Models Show Promise in Reasoning Tasks", source: "TechDaily" },
    { id: 2, title: "Major Breakthrough in Solid State Battery Tech Announced", source: "FutureEnergy" },
    { id: 3, title: "SpaceX Successfully Launches Starship V3", source: "SpaceNews" },
    { id: 4, title: "Global Chip Shortage Officially Ends, Analysts Say", source: "SiliconReview" },
    { id: 5, title: "WebAssembly 2.0 Spec Finalized for All Browsers", source: "DevCorner" }
];

export const NewsWidget: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % MOCK_NEWS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const news = MOCK_NEWS[currentIndex];

    return (
        <div className="p-5 h-full flex flex-col justify-between">
            <div className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-wider mb-2">
                <Newspaper size={16} /> Tech News
            </div>
            
            <div className="flex-1 flex flex-col justify-center animate-fade-in key={currentIndex}">
                <div className="text-xs text-indigo-400 font-bold uppercase tracking-wide mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    Breaking • {news.source}
                </div>
                <h3 className="text-white font-medium text-lg leading-snug line-clamp-3">
                    {news.title}
                </h3>
            </div>
            
            <div className="flex gap-1 mt-2">
                {MOCK_NEWS.map((_, i) => (
                    <div 
                        key={i} 
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i === currentIndex ? 'bg-white' : 'bg-white/10'}`} 
                    />
                ))}
            </div>
        </div>
    );
};
