
import React from 'react';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { Smartphone, Laptop, Monitor, Maximize, Activity } from 'lucide-react';
import { WidgetCard } from './WidgetCard';

export const DeviceInfoPage: React.FC = () => {
  const status = useSystemStatus();
  
  // Simple heuristic for icon/image
  const isMobile = /Mobi|Android/i.test(status.userAgent);
  const isTablet = /Tablet|iPad/i.test(status.userAgent);
  
  let DeviceIcon = Laptop;
  let deviceType = "Desktop Workstation";
  let imageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2671&auto=format&fit=crop"; // Laptop

  if (isMobile) {
      DeviceIcon = Smartphone;
      deviceType = "Mobile Device";
      imageUrl = "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2670&auto=format&fit=crop";
  } else if (isTablet) {
      DeviceIcon = Monitor; // Using Monitor as placeholder for tablet
      deviceType = "Tablet";
      imageUrl = "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=2662&auto=format&fit=crop";
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-8 md:p-12 overflow-y-auto">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Col: Visual */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] md:h-auto group">
                <img src={imageUrl} alt="Device" className="w-full h-full object-cover transition-transform duration-[20s] ease-linear group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-8 left-8">
                    <div className="flex items-center gap-3 text-white mb-2">
                        <DeviceIcon size={32} />
                        <h1 className="text-3xl font-bold">{deviceType}</h1>
                    </div>
                    <p className="text-zinc-400 font-mono text-xs max-w-sm truncate">{status.userAgent}</p>
                </div>
            </div>

            {/* Right Col: Stats */}
            <div className="grid grid-cols-1 gap-6 content-center">
                
                <WidgetCard title="Display" className="bg-white/5 border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
                            <Maximize size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{status.screenResolution}</div>
                            <div className="text-zinc-500 text-sm">Resolution</div>
                        </div>
                    </div>
                </WidgetCard>

                <WidgetCard title="Connectivity" className="bg-white/5 border-white/10">
                     <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${status.online ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            <Activity size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{status.online ? 'Online' : 'Offline'}</div>
                            <div className="text-zinc-500 text-sm">Network Status</div>
                        </div>
                    </div>
                </WidgetCard>

                <WidgetCard title="Power" className="bg-white/5 border-white/10">
                    <div className="flex flex-col gap-2">
                         <div className="flex justify-between items-end">
                            <div className="text-3xl font-bold text-white">
                                {status.batteryLevel !== null ? `${Math.round(status.batteryLevel * 100)}%` : 'AC Power'}
                            </div>
                            <div className="text-sm font-mono text-zinc-500">{status.isCharging ? 'CHARGING' : 'DISCHARGING'}</div>
                         </div>
                         {status.batteryLevel !== null && (
                             <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mt-2">
                                 <div 
                                    className={`h-full ${status.batteryLevel <= 0.2 ? 'bg-red-500' : 'bg-green-500'}`} 
                                    style={{ width: `${status.batteryLevel * 100}%` }} 
                                 />
                             </div>
                         )}
                    </div>
                </WidgetCard>

            </div>
        </div>
    </div>
  );
};
