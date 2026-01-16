import React, { useState, useEffect, useRef } from 'react';
import {
    Activity, ArrowRight, CheckCircle2,
    Cpu, Layers, Zap, Sparkles, Globe,
    Target, Rocket, MousePointer2,
    Scan, BarChart3, Users, Briefcase,
    Network, Database, ShieldCheck, Code2, Server,
    ExternalLink, Trophy, Star, RefreshCcw, Loader2
} from 'lucide-react';
import { PROCESS_STEPS } from '../constants';
import { PLACED_STUDENTS } from '../data/successData';
import { Link } from 'react-router-dom';

const TECH_VISUALS = [
    "https://img.freepik.com/free-vector/network-infrastructure-concept-illustration_114360-7052.jpg",
    "https://img.freepik.com/free-vector/cloud-computing-concept-illustration_114360-1282.jpg",
    "https://img.freepik.com/free-vector/software-tester-concept-illustration_114360-1714.jpg",
    "https://img.freepik.com/free-vector/business-team-goals-concept-illustration_114360-5175.jpg"
];

const TestInteractive = () => {
    const [uxOption, setUxOption] = useState('SUCCESS_MATRIX');
    const [visibleStepIds, setVisibleStepIds] = useState([]);
    const [lineHeight, setLineHeight] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Simulation state for Loader
    const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);
    const [simProgress, setSimProgress] = useState(0);

    const containerRef = useRef(null);
    const stepRefs = useRef([]);

    useEffect(() => {
        window.scrollTo(0, 0);

        const handleScroll = () => {
            if (!containerRef.current) return;
            const scrollY = window.scrollY;
            const winH = window.innerHeight;
            const contTop = containerRef.current.offsetTop;
            const contH = containerRef.current.offsetHeight;
            const trigger = winH * 0.7;
            const relative = scrollY + trigger - contTop;

            setLineHeight(Math.max(0, Math.min(relative, contH)));

            PROCESS_STEPS.forEach((step, i) => {
                const el = stepRefs.current[i];
                if (el && relative > el.offsetTop + 100) {
                    setVisibleStepIds(prev => prev.includes(step.id) ? prev : [...prev, step.id]);
                }
            });
        };

        const handleMouseMove = (e) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);
        setTimeout(handleScroll, 100);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [uxOption]);

    const runLoaderSim = () => {
        setIsSimulatingLoad(true);
        setSimProgress(0);

        setTimeout(() => setSimProgress(40), 200);
        setTimeout(() => setSimProgress(85), 600);
        setTimeout(() => {
            setSimProgress(100);
            setTimeout(() => setIsSimulatingLoad(false), 800);
        }, 1200);
    };

    const matrixStudents = PLACED_STUDENTS.slice(0, 8);

    return (
        <div className="min-h-screen bg-white dark:bg-[#020617] transition-colors duration-500 overflow-x-hidden pb-40">

            {/* Simulation Status Overlay (Top Loading Demo) */}
            {isSimulatingLoad && (
                <div className="fixed top-0 left-0 w-full h-[4px] z-[5000] pointer-events-none">
                    <div
                        className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all duration-700 ease-out"
                        style={{ width: `${simProgress}%` }}
                    ></div>
                </div>
            )}

            {/* --- PROTOTYPE HUD --- */}
            <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[1000] p-1.5 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl flex items-center gap-1 scale-90 md:scale-100">
                {[
                    { id: 'SUCCESS_MATRIX', label: 'Success Matrix', icon: Trophy },
                    { id: 'NAVBAR_LOADER', label: 'Navbar Preloader', icon: Loader2 },
                    { id: 'TECH_PIPELINE', label: 'Domain Pipeline', icon: Network },
                    { id: 'PARALLAX_PORTAL', label: 'Parallax Portal', icon: MousePointer2 },
                ].map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => {
                            setUxOption(opt.id);
                            setVisibleStepIds([]);
                            setLineHeight(0);
                        }}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${uxOption === opt.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <opt.icon className={`w-3.5 h-3.5 ${uxOption === opt.id && opt.id === 'NAVBAR_LOADER' ? 'animate-spin' : ''}`} /> {opt.label}
                    </button>
                ))}
            </div>

            {/* --- HERO --- */}
            <section className="bg-[#050b1a] text-white pt-60 pb-40 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(90deg, #fff 1px, transparent 1px), linear-gradient(#fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
                <div className="relative z-10 px-4">
                    <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-400 font-black uppercase text-[10px] tracking-[0.3em] mb-10 animate-pulse">
                        <Rocket className="w-4 h-4" /> Lab Protocol v2.5
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
                        {uxOption === 'SUCCESS_MATRIX' ? 'Success ' : uxOption === 'NAVBAR_LOADER' ? 'Network ' : 'Visual '}
                        <span className="text-blue-600">{uxOption === 'SUCCESS_MATRIX' ? 'Matrix' : uxOption === 'NAVBAR_LOADER' ? 'Uplink' : 'Logic'}</span>
                    </h1>
                    <p className="text-blue-200/60 font-bold uppercase tracking-[0.5em] text-xs">
                        {uxOption === 'SUCCESS_MATRIX' ? 'The Industry Verified Records Module' : uxOption === 'NAVBAR_LOADER' ? 'Simulating Route Transitions & Micro-Interactions' : 'Transforming Career Pathways into Interactive Realities'}
                    </p>
                </div>
            </section>

            {/* --- CONTENT LAYERS --- */}
            <div className="max-w-7xl mx-auto px-4 py-20 min-h-[500px]">

                {/* 1. NAVBAR PRELOADER DEMO */}
                {uxOption === 'NAVBAR_LOADER' && (
                    <div className="max-w-2xl mx-auto space-y-12 reveal active">
                        <div className="bg-[#0a0f18] rounded-[2.5rem] p-10 md:p-16 border border-white/5 shadow-2xl text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="relative z-10 space-y-8">
                                <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20">
                                    <Zap className={`w-10 h-10 text-blue-500 ${isSimulatingLoad ? 'animate-pulse scale-110' : ''}`} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Transition Simulator</h3>
                                    <p className="text-gray-400 font-medium leading-relaxed max-w-md mx-auto">
                                        Trigger a manual "Transmission Cycle" to see the subtle top-mounted progress bar in the global navigation layer.
                                    </p>
                                </div>

                                <div className="pt-6">
                                    <button
                                        onClick={runLoaderSim}
                                        disabled={isSimulatingLoad}
                                        className="group relative inline-flex items-center gap-4 px-12 py-5 bg-blue-600 text-white rounded-full font-black uppercase tracking-[0.3em] text-[10px] hover:bg-blue-700 transition-all shadow-[0_20px_60px_rgba(37,99,235,0.3)] active:scale-95 disabled:opacity-50"
                                    >
                                        {isSimulatingLoad ? <RefreshCcw className="w-4 h-4 animate-spin" /> : 'Simulate Transmission'}
                                    </button>
                                </div>
                            </div>

                            {/* Decorative HUD Details */}
                            <div className="absolute bottom-6 left-8 right-8 flex justify-between opacity-20 font-mono text-[8px] uppercase text-blue-400">
                                <span>Network_Status: {isSimulatingLoad ? 'Syncing...' : 'Ready'}</span>
                                <span>Protocol: Net_Link_v3</span>
                            </div>
                        </div>

                        {/* Explanation Card */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-8 bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-4" />
                                <h4 className="text-gray-900 dark:text-white font-black uppercase text-xs tracking-widest mb-2">Passive Loading</h4>
                                <p className="text-gray-500 text-xs font-medium leading-relaxed">The bar automatically increments on location changes, providing constant feedback to users during route swaps.</p>
                            </div>
                            <div className="p-8 bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                                <Scan className="w-6 h-6 text-blue-500 mb-4" />
                                <h4 className="text-gray-900 dark:text-white font-black uppercase text-xs tracking-widest mb-2">Visual Precision</h4>
                                <p className="text-gray-500 text-xs font-medium leading-relaxed">Using CSS cubic-bezier transitions for a 'snappy' feel that slows down near the end to manage perceived latency.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. SUCCESS MATRIX (Updated) */}
                {uxOption === 'SUCCESS_MATRIX' && (
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 reveal active">
                        {matrixStudents.map((student, idx) => (
                            <div
                                key={idx}
                                className="break-inside-avoid relative group bg-[#0a0f18] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_80px_rgba(37,99,235,0.2)]"
                            >
                                <div className="aspect-[4/5] relative overflow-hidden">
                                    <img
                                        src={student.image}
                                        alt={student.name}
                                        className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-transparent to-transparent opacity-90"></div>
                                    <div className="absolute bottom-[35%] left-8 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] animate-pulse"></div>
                                        <span className="text-[9px] font-black text-[#10b981] uppercase tracking-[0.25em]">Deployed Successful</span>
                                    </div>
                                    <div className="absolute bottom-8 left-8 right-8">
                                        <h3 className="text-2xl md:text-3xl font-black text-white leading-none tracking-tight mb-2 uppercase">{student.name}</h3>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">{student.role}</p>
                                        <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{student.company}</span>
                                            <ExternalLink className="w-4 h-4 text-gray-600 transition-colors group-hover:text-blue-500" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-1/4 w-full -translate-y-full group-hover:animate-scan pointer-events-none"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 3. OTHER MODES (Existing Logic) */}
                {uxOption === 'TECH_PIPELINE' && (
                    <section className="max-w-7xl mx-auto py-12 relative" ref={containerRef}>
                        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-100 dark:bg-white/5 transform -translate-x-1/2 z-0 hidden md:block"></div>
                        <div className="absolute left-1/2 top-0 w-[2px] bg-blue-600 transform -translate-x-1/2 z-10 hidden md:block transition-all duration-300 ease-out shadow-[0_0_15px_#2563eb]" style={{ height: `${lineHeight}px` }}></div>
                        <div className="space-y-64 relative z-20">
                            {PROCESS_STEPS.map((step, idx) => (
                                <div key={step.id} ref={el => stepRefs.current[idx] = el} className={`flex flex-col md:flex-row items-center justify-between gap-16 md:gap-0 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                    <div className={`w-full md:w-[42%] transition-all duration-1000 transform ${visibleStepIds.includes(step.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                                        <div className="space-y-6 text-center md:text-left">
                                            <div className="inline-block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                                                <span className="text-4xl font-black text-blue-600">0{step.id}</span>
                                            </div>
                                            <h3 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{step.title}</h3>
                                            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{step.description}</p>
                                        </div>
                                    </div>
                                    <div className={`w-full md:w-[48%] transition-all duration-1000 delay-300 transform ${visibleStepIds.includes(step.id) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                        <div className="relative group bg-[#0a0f18] rounded-[3.5rem] shadow-2xl overflow-hidden aspect-square flex items-center justify-center border border-gray-800">
                                            <div className="absolute inset-0 grid grid-cols-2 h-full w-full">
                                                <div className="relative bg-[#0d1525] flex flex-col justify-end p-8 border-r border-gray-800 overflow-hidden group/left">
                                                    <img src="https://img.freepik.com/free-vector/server-room-concept-illustration_114360-234.jpg" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover/left:scale-110 transition-transform duration-1000" alt="Infrastructure" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1525] via-transparent to-transparent"></div>
                                                    <div className="relative z-10 text-white space-y-2">
                                                        <h4 className="text-xl font-black uppercase tracking-tighter leading-none">Net_Infra <br /> Systems</h4>
                                                        <p className="text-[8px] font-bold uppercase opacity-60 tracking-widest">Routing & Switching Protocol</p>
                                                    </div>
                                                </div>
                                                <div className="relative bg-[#0f172a] flex flex-col justify-end p-8 overflow-hidden group/right">
                                                    <img src="https://img.freepik.com/free-vector/software-tester-concept-illustration_114360-1123.jpg" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover/right:scale-110 transition-transform duration-1000" alt="Software Engineering" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
                                                    <div className="relative z-10 text-white space-y-2 text-right">
                                                        <h4 className="text-xl font-black uppercase tracking-tighter leading-none">Logic <br /> Engineering</h4>
                                                        <p className="text-[8px] font-bold uppercase opacity-60 tracking-widest">Scalable Software Architecture</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-6 right-6 bg-blue-700 p-6 rounded-[2rem] shadow-[0_0_40px_rgba(37,99,235,0.4)] border border-white/20 z-20">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <ShieldCheck className="w-3 h-3 text-blue-200" />
                                                    <p className="text-[9px] font-black text-blue-100 uppercase tracking-widest opacity-60">Verified Rate</p>
                                                </div>
                                                <p className="text-4xl font-black text-white leading-none">98%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {uxOption === 'PARALLAX_PORTAL' && (
                    <div className="max-w-4xl mx-auto reveal active">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {TECH_VISUALS.map((url, i) => (
                                <div
                                    key={i}
                                    className="relative bg-gray-50 dark:bg-[#0a0f18] p-8 rounded-[4rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden group h-[400px] flex items-center justify-center"
                                    style={{ perspective: '1000px' }}
                                >
                                    <div
                                        className="transition-transform duration-200 ease-out"
                                        style={{ transform: `rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)` }}
                                    >
                                        <img src={url} className="w-full h-auto max-h-[300px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]" alt="Visual" />
                                    </div>
                                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                                        <span className="text-[9px] font-black uppercase text-blue-600 tracking-[0.4em] bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-900/30">Module_0{i + 1}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(400%); } }
                .animate-scan { animation: scan 4s linear infinite; }
            `}</style>
        </div>
    );
};

export default TestInteractive;