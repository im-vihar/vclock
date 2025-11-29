
import { useState, useEffect, useCallback } from 'react';

export const useWakeLock = () => {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('wakeLock' in navigator) {
      setIsSupported(true);
    }
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (!isSupported) return;
    try {
      const lock = await navigator.wakeLock.request('screen');
      setWakeLock(lock);
      console.log('Wake Lock active');
      
      lock.addEventListener('release', () => {
        setWakeLock(null);
        console.log('Wake Lock released');
      });
    } catch (err: any) {
      console.error(`${err.name}, ${err.message}`);
    }
  }, [isSupported]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock) {
      await wakeLock.release();
      setWakeLock(null);
    }
  }, [wakeLock]);

  // Re-acquire lock if page visibility changes (e.g. user tabs away and back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !wakeLock) {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock) wakeLock.release();
    };
  }, [wakeLock, requestWakeLock]);

  return { isSupported, requestWakeLock, releaseWakeLock, isLocked: !!wakeLock };
};
