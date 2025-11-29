import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Brain } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface FocusWidgetProps {
  isVisible: boolean;
}

export const FocusWidget: React.FC<FocusWidgetProps> = ({ isVisible }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const { settings } = useSettings();

  // Keyboard controls
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
            e.preventDefault();
            setIsActive(p => !p);
        }
        if (e.key.toLowerCase() === 'r') {
            setIsActive(false);
            setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, mode]);

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getAccentColor = () => {
      switch(settings.accentColor) {
          case 'indigo': return 'text-indigo-400';
          case 'emerald': return 'text-emerald-400';
          case 'rose': return 'text-rose-400';
          case 'amber': return 'text-amber-400';
          case 'cyan': return 'text-cyan-400';
          default: return 'text-white';
      }
  };

  const getButtonColor = () => {
      switch(settings.accentColor) {
          case 'indigo': return 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/20';
          case 'emerald': return 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20';
          case 'rose': return 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20';
          case 'amber': return 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20';
          case 'cyan': return 'bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/20';
          default: return 'bg-white text-black hover:bg-zinc-200 shadow-white/20';
      }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl">
      <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-12 w-full text-center shadow-2xl animate-scale-in">
          
          <div className={`flex justify-center items-center gap-2 mb-8 ${getAccentColor()} transition-colors`}>
             <Brain size={24} />
             <span className="uppercase tracking-[0.2em] text-sm font-semibold">{mode} mode</span>
          </div>

          <div className="text-[15vw] md:text-[8rem] font-mono font-bold text-white leading-none tracking-tighter mb-10 tabular-nums">
            {formatTime(timeLeft)}
          </div>
          
          <div className="flex justify-center gap-6">
            <button 
              onClick={toggleTimer}
              className={`p-6 rounded-full transition-all duration-300 shadow-lg ${isActive ? 'bg-zinc-800 text-red-400 hover:bg-zinc-700' : `${getButtonColor()} text-white hover:scale-110`}`}
            >
              {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </button>
            <button 
              onClick={resetTimer}
              className="p-6 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all hover:rotate-180 duration-500"
            >
              <RotateCcw size={32} />
            </button>
          </div>
          
          <div className="mt-12 flex justify-center gap-4">
             <button 
                onClick={() => { setMode('focus'); setTimeLeft(25*60); setIsActive(false); }}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === 'focus' ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
             >
                Pomodoro
             </button>
             <button 
                onClick={() => { setMode('break'); setTimeLeft(5*60); setIsActive(false); }}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === 'break' ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
             >
                Short Break
             </button>
          </div>
          
          <div className="mt-6 text-[10px] text-zinc-600 uppercase tracking-widest font-mono">
              Press SPACE to Toggle • R to Reset
          </div>
      </div>
    </div>
  );
};