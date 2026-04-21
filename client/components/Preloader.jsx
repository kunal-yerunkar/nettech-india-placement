import React, { useState, useEffect } from 'react';
import { Activity, Cpu } from 'lucide-react';

const Preloader = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2500);

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) return 100;
                return prev + 1.5;
            });
        }, 20);

        return () => {
            clearTimeout(timer);
            clearInterval(progressInterval);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-[#020617] flex items-center justify-center overflow-hidden">
            {/* Background Layer: Grid */}
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

            {/* 
          SCALING WRAPPER
          Ensures everything stays perfectly centered and scales together
      */}
            <div className="relative flex flex-col items-center justify-center w-full h-full p-6">

                {/* Spinner Core */}
                <div className="relative w-32 h-32 mb-12 flex items-center justify-center">
                    {/* Pulsing Outer Ring */}
                    <div className="absolute inset-0 border-[4px] border-blue-500/10 rounded-full"></div>
                    {/* Spinning Rings */}
                    <div className="absolute inset-0 border-t-[4px] border-blue-600 rounded-full animate-spin shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
                    <div className="absolute inset-3 border-b-[4px] border-indigo-400 rounded-full animate-spin-reverse opacity-40"></div>

                    <div className="relative z-10 bg-[#020617] p-4 rounded-full">
                        <Cpu className="w-12 h-12 text-blue-400 animate-pulse" />
                    </div>
                </div>

                {/* Textual Feedback Stack */}
                <div className="max-w-sm w-full space-y-8 text-center">
                    <div className="space-y-3">
                        <h2 className="text-blue-500 font-black text-[14px] uppercase tracking-[0.8em] animate-pulse leading-none">
                            Initializing Pioneer
                        </h2>
                        <div className="flex items-center gap-2 justify-center text-blue-200/20 text-[9px] font-black uppercase tracking-[0.4em]">
                            <Activity className="w-3 h-3" /> System Link Secured
                        </div>
                    </div>

                    {/* Precision Progress Bar Container */}
                    <div className="space-y-4">
                        <div className="relative h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 bg-[length:200%_100%] animate-shimmer transition-all duration-300 ease-out shadow-[0_0_15px_#2563eb]"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        <div className="flex justify-between items-center text-blue-500/40 font-mono text-[10px] tracking-widest uppercase">
                            <span className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-blue-500/40 rounded-full animate-ping"></span>
                                Kernel_Load
                            </span>
                            <span className="text-blue-400 font-bold">{Math.floor(progress)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Corner HUD - Positioned to not distract from center */}
            <div className="absolute bottom-12 left-12 text-blue-500/5 text-[9px] font-mono space-y-1 hidden md:block uppercase">
                <p>Mem_Map: Stability_OK</p>
                <p>Node_Placement: 4.5k_Live</p>
            </div>

            <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .animate-shimmer { animation: shimmer 3s linear infinite; }
        .animate-spin-reverse { animation: spin 2s linear infinite reverse; }
      `}</style>
        </div>
    );
};

export default Preloader;