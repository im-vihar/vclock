
import React, { memo } from 'react';

// Single Digit Flipper
const FlipDigit = ({ digit, label }: { digit: string; label?: string }) => {
  return (
    <div className="flex flex-col items-center mx-1 md:mx-4 group">
      {/* 
         Mobile: w-[18vw] h-[24vw]
         Desktop: w-[22vh] h-[32vh] (using VH to fill vertical space on landscape)
      */}
      <div className="relative w-[18vw] h-[24vw] md:w-[22vh] md:h-[32vh] bg-[#151515] rounded-xl shadow-2xl border border-white/5 overflow-hidden perspective transition-transform active:scale-95 duration-200">
        
        {/* Top Half (Static) */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#202020] overflow-hidden z-0 border-b border-black/50">
           <div className="absolute top-0 left-0 right-0 h-[200%] flex items-center justify-center text-[15vw] md:text-[24vh] font-bold text-zinc-200 leading-none">
             {digit}
           </div>
           {/* Glare */}
           <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
        </div>

        {/* Bottom Half (Static) */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#1a1a1a] overflow-hidden z-0">
           <div className="absolute bottom-0 left-0 right-0 h-[200%] flex items-center justify-center text-[15vw] md:text-[24vh] font-bold text-zinc-200 leading-none">
             {digit}
           </div>
        </div>
        
        {/* Horizontal Split Line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-black/60 z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
      </div>
      
      {label && (
        <span className="mt-4 md:mt-8 text-[10px] md:text-lg font-bold uppercase tracking-[0.2em] text-zinc-600 group-hover:text-zinc-400 transition-colors">
          {label}
        </span>
      )}
    </div>
  );
};

export const FlipClock: React.FC<{ 
    hours: number; 
    minutes: number; 
    seconds: number; 
    showSeconds: boolean;
    amPm?: string;
}> = memo(({ hours, minutes, seconds, showSeconds, amPm }) => {
  
  const format = (v: number) => v.toString().padStart(2, '0');

  return (
    <div className="flex items-end justify-center select-none p-4">
      <FlipDigit digit={format(hours)} label="Hours" />
      
      {/* Separator Dots */}
      <div className="hidden md:flex flex-col justify-center gap-6 h-[32vh] pb-[4vh] mx-2">
         <div className="w-3 h-3 rounded-full bg-zinc-700 animate-pulse" />
         <div className="w-3 h-3 rounded-full bg-zinc-700 animate-pulse" />
      </div>

      <FlipDigit digit={format(minutes)} label="Minutes" />

      {showSeconds && (
        <>
            <div className="hidden md:flex flex-col justify-center gap-6 h-[32vh] pb-[4vh] mx-2">
                <div className="w-3 h-3 rounded-full bg-zinc-700 animate-pulse" />
                <div className="w-3 h-3 rounded-full bg-zinc-700 animate-pulse" />
            </div>
            <div className="scale-75 origin-bottom opacity-80">
                 <FlipDigit digit={format(seconds)} label="Seconds" />
            </div>
        </>
      )}

      {amPm && (
         <div className="ml-4 mb-8 md:mb-16">
            <span className="text-xl md:text-5xl font-black text-zinc-600 tracking-wider">
                {amPm}
            </span>
         </div>
      )}
    </div>
  );
});
