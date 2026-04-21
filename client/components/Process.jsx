import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { QrCode, UserCheck, MonitorPlay, Briefcase, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PROCESS_ICONS = [QrCode, UserCheck, MonitorPlay, Briefcase];

const Process = () => {
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await api.getProcessSteps();
      setSteps(data);
    };
    load();
  }, []);

  return (
    <section id="process" className="py-24 bg-white dark:bg-[#020617] scroll-mt-24 transition-colors duration-500 overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(90deg, #3b82f6 1px, transparent 1px), linear-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 reveal active">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-black uppercase text-[10px] tracking-[0.3em] mb-6">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> The Industrial Pipeline
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-6">
            Placement <span className="text-blue-700 dark:text-blue-400">Workflow</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-bold uppercase tracking-widest leading-tight">
            A precise, high-velocity roadmap from registration to global hiring.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 lg:gap-4 relative">
          <div className="hidden lg:block absolute top-[180px] left-0 w-full h-[1px] bg-blue-100 dark:bg-white/5 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pipeline-flow"></div>
          </div>

          {steps.map((step, idx) => {
            const Icon = PROCESS_ICONS[idx % PROCESS_ICONS.length];
            return (
              <React.Fragment key={step.id}>
                <div className="flex-1 w-full max-w-[320px] mx-auto lg:mx-0 group relative reveal active" style={{ transitionDelay: `${idx * 150}ms` }}>
                  <div className="h-full flex flex-col items-center bg-[#1e40af] text-white p-8 rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:shadow-blue-500/30 relative overflow-hidden border border-white/10">
                    <div className="self-start mb-10 relative">
                      <div className="w-16 h-16 bg-blue-500/40 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    <div className="w-full text-left space-y-6 flex-grow">
                      <h3 className="text-2xl font-black uppercase tracking-tight leading-tight">
                        0{step.id}. <br />
                        <span className="text-blue-200">{step.title}</span>
                      </h3>
                      <p className="text-blue-100/70 text-sm font-medium leading-relaxed">
                        {step.description}
                      </p>

                      {step.details && (
                        <div className="space-y-2 pt-2">
                          {step.details.map((point, pIdx) => (
                            <div key={pIdx} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-300" />
                              <span className="text-[10px] font-bold uppercase tracking-wide text-blue-100">{point}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-8 opacity-40">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-blue-300">Uplink: Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {idx < steps.length - 1 && (
                  <div className="lg:hidden flex flex-col items-center py-4">
                    <div className="w-[1px] h-10 bg-gradient-to-b from-blue-700 to-transparent"></div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="mt-24 text-center reveal active delay-500">
          <Link
            to="/register"
            className="group relative inline-flex items-center justify-center px-16 py-6 bg-blue-700 hover:bg-blue-600 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-full transition-all shadow-[0_20px_50px_rgba(30,64,175,0.3)] active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-4">
              Enter Placement Drive <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
          </Link>
        </div>

      </div>

      <style>{`
        @keyframes pipeline-flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-pipeline-flow {
          animation: pipeline-flow 3s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Process;