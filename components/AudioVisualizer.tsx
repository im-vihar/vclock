
import React, { useEffect, useRef, useState } from 'react';
import { MicOff, Activity } from 'lucide-react';

interface AudioVisualizerProps {
    isActive: boolean;
    sensitivity: number;
    height?: string;
    color?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive, sensitivity, height = '100%', color = 'white' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isActive) {
            cleanup();
            return;
        }

        const initAudio = async () => {
            try {
                if (!navigator.mediaDevices?.getUserMedia) {
                    throw new Error("Audio API not supported");
                }

                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                const audioContext = new AudioContextClass();
                
                // CRITICAL: Handle autoplay policy
                if (audioContext.state === 'suspended') {
                    await audioContext.resume();
                }

                audioContextRef.current = audioContext;

                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 128; // Lower FFT size for chunkier bars
                analyser.smoothingTimeConstant = 0.85; // Smoother falloff
                analyser.minDecibels = -90;
                analyser.maxDecibels = -10;
                analyserRef.current = analyser;

                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);
                sourceRef.current = source;

                setError(null);
                draw();
            } catch (err: any) {
                console.error("Visualizer Error:", err);
                setError("Mic Access Denied");
            }
        };

        initAudio();

        return () => cleanup();
    }, [isActive]);

    const cleanup = () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current.mediaStream.getTracks().forEach(track => track.stop());
        }
        if (audioContextRef.current) audioContextRef.current.close();
        
        audioContextRef.current = null;
        analyserRef.current = null;
        sourceRef.current = null;
    };

    const draw = () => {
        const canvas = canvasRef.current;
        const analyser = analyserRef.current;
        if (!canvas || !analyser) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const render = () => {
            analyser.getByteFrequencyData(dataArray);
            
            // Handle high-DPI displays
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);

            const width = rect.width;
            const height = rect.height;
            
            ctx.clearRect(0, 0, width, height);

            const barWidth = (width / bufferLength) * 2.5;
            let x = 0;
            
            // Color Logic
            ctx.fillStyle = color === 'white' ? 'rgba(255, 255, 255, 0.8)' : color;

            // Noise Gate Threshold (0-255)
            // Anything below this volume is considered silence/static
            const noiseThreshold = 10; 

            for (let i = 0; i < bufferLength; i++) {
                let value = dataArray[i]; // 0-255
                
                // Apply Noise Gate
                if (value < noiseThreshold) {
                    value = 0;
                } else {
                    // Smoothly subtract threshold so bars start at 0
                    value = value - noiseThreshold;
                }
                
                // Apply sensitivity multiplier
                // Normalize value (0-255) to percent (0-1.0) then multiply
                const percent = (value / 255) * sensitivity;
                
                // Clamp to reasonable max to prevent screen takeover
                const safePercent = Math.min(percent, 0.8);
                
                const barHeight = safePercent * height;

                // Draw Mirrored Bars (Top and Bottom)
                // Center Y
                const centerY = height / 2;
                
                if (barHeight > 0) {
                    // Rounded caps look better
                    ctx.fillRect(x, centerY - barHeight / 2, barWidth - 2, barHeight);
                }
                
                x += barWidth;
            }

            animationFrameRef.current = requestAnimationFrame(render);
        };

        render();
    };

    if (!isActive) return null;

    if (error) {
        return (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                <div className="bg-red-500/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-red-200 text-xs font-bold uppercase tracking-wider border border-red-500/50">
                    <MicOff size={12} /> {error}
                </div>
            </div>
        );
    }

    return (
        <canvas 
            ref={canvasRef} 
            style={{ height }}
            className="w-full pointer-events-none"
        />
    );
};
