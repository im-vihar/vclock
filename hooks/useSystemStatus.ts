
import { useState, useEffect } from 'react';
import { SystemStatus } from '../types';

export const useSystemStatus = () => {
  const [status, setStatus] = useState<SystemStatus>({
    online: navigator.onLine,
    batteryLevel: null,
    isCharging: false,
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`
  });

  useEffect(() => {
    // Network Status
    const updateOnline = () => setStatus(s => ({ ...s, online: navigator.onLine }));
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);

    // Battery Status
    let batteryRef: any;
    const updateBattery = (bat: any) => {
        setStatus(s => ({
            ...s,
            batteryLevel: bat.level,
            isCharging: bat.charging
        }));
    };

    if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((bat: any) => {
            batteryRef = bat;
            updateBattery(bat);
            bat.addEventListener('levelchange', () => updateBattery(bat));
            bat.addEventListener('chargingchange', () => updateBattery(bat));
        });
    }

    // Screen Resize
    const handleResize = () => {
         setStatus(s => ({
             ...s, 
             screenResolution: `${window.screen.width}x${window.screen.height}`
         }));
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('online', updateOnline);
        window.removeEventListener('offline', updateOnline);
        window.removeEventListener('resize', handleResize);
        if (batteryRef) {
             batteryRef.removeEventListener('levelchange', () => updateBattery(batteryRef));
             batteryRef.removeEventListener('chargingchange', () => updateBattery(batteryRef));
        }
    };
  }, []);

  return status;
};
