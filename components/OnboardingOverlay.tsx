
import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { ChevronRight, Music, Layout, Settings, CheckCircle2, Hand, MousePointer2 } from 'lucide-react';

export const OnboardingOverlay: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [step, setStep] = useState(0);

  if (settings.hasCompletedOnboarding) return null;

  const handleComplete = () => {
    updateSettings({ hasCompletedOnboarding: true });
  };

  const steps = [
    {
      title: "Welcome to VCLOCK",
      desc: "Turn your device into a stunning, customizable smart display.",
      icon: <Layout className="w-16 h-16 text-indigo-400 mb-6" />,
      content: "Perfect for secondary monitors, tablets, or just keeping focused at your desk."
    },
    {
      title: "Touch & Gestures",
      desc: "Designed for touchscreens and desktops alike.",
      icon: <Hand className="w-16 h-16 text-emerald-400 mb-6" />,
      content: (
        <ul className="space-y-4 text-left bg-white/5 p-6 rounded-xl border border-white/5">
            <li className="flex items-center gap-3"><span className="p-2 bg-white/10 rounded-lg"><MousePointer2 size={16}/></span> <span><strong>Swipe</strong> left/right to change pages</span></li>
            <li className="flex items-center gap-3"><span className="p-2 bg-white/10 rounded-lg"><MousePointer2 size={16}/></span> <span><strong>Tap</strong> anywhere to wake screensaver</span></li>
            <li className="flex items-center gap-3"><span className="p-2 bg-white/10 rounded-lg"><MousePointer2 size={16}/></span> <span><strong>Buttons</strong> are sized for fingers</span></li>
        </ul>
      )
    },
    {
      title: "Music Integration",
      desc: "Display your Spotify status in real-time.",
      icon: <Music className="w-16 h-16 text-rose-400 mb-6" />,
      content: (
        <div className="text-sm text-zinc-400 max-w-sm mx-auto">
            VCLOCK uses the <strong className="text-white">Lanyard API</strong> to see what you're listening to on Discord.
            <br/><br/>
            Head to <strong className="text-white">Settings</strong> (top left) to enter your Discord User ID.
        </div>
      )
    },
    {
      title: "Customization",
      desc: "Make it yours.",
      icon: <Settings className="w-16 h-16 text-amber-400 mb-6" />,
      content: "Change themes, fonts, backgrounds, clock styles, and enable experimental widgets in the Settings menu."
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
       <div className="w-full max-w-xl bg-zinc-900 border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
           
           {/* Progress Bar */}
           <div className="absolute top-0 left-0 h-1 bg-indigo-500 transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />

           <div className="flex flex-col items-center min-h-[300px] justify-center animate-fade-in key={step}">
               {currentStep.icon}
               <h1 className="text-3xl font-bold text-white mb-4">{currentStep.title}</h1>
               <p className="text-zinc-400 text-lg mb-8">{currentStep.desc}</p>
               <div className="w-full">{currentStep.content}</div>
           </div>

           <div className="mt-12 flex items-center justify-between">
               <div className="flex gap-2">
                   {steps.map((_, i) => (
                       <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-white' : 'bg-zinc-700'}`} />
                   ))}
               </div>
               
               <button 
                  onClick={() => {
                      if (step < steps.length - 1) setStep(step + 1);
                      else handleComplete();
                  }}
                  className="px-8 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
               >
                   {step === steps.length - 1 ? 'Get Started' : 'Next'}
                   {step === steps.length - 1 ? <CheckCircle2 size={18} /> : <ChevronRight size={18} />}
               </button>
           </div>
       </div>
    </div>
  );
};
