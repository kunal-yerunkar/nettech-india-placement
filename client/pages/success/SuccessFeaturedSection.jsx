import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SuccessFeaturedSection = () => {
  return (
    <section className="max-w-5xl mx-auto px-4 py-24 reveal active">
      <div className="bg-blue-700 dark:bg-blue-900 rounded-[3.5rem] p-10 md:p-20 text-center relative overflow-hidden shadow-[0_40px_100px_rgba(37,99,235,0.3)]">
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(45deg, #fff 12%, transparent 12.5%, transparent 87%, #fff 87.5%, #fff), linear-gradient(-45deg, #fff 12%, transparent 12.5%, transparent 87%, #fff 87.5%, #fff)',
            backgroundSize: '40px 40px'
          }}
        ></div>
        <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
          <Sparkles className="w-40 h-40 text-white" />
        </div>
        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-blue-100 font-black uppercase text-[9px] tracking-[0.4em] mb-4">
            <span className="w-3.5 h-3.5 bg-blue-400 rounded-full animate-pulse" /> Recruitment Stream: Open
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">
            Want to be <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-white">
              Featured Here?
            </span>
          </h2>
          <p className="text-xl text-blue-100 font-bold opacity-80 max-w-2xl mx-auto uppercase tracking-widest leading-tight">
            Your journey to the Hall of Fame begins with a single transmission. Secure your position today.
          </p>
          <div className="pt-10">
            <Link
              to="/register"
              className="group relative inline-flex items-center justify-center px-16 py-6 bg-white text-blue-700 font-black uppercase tracking-[0.3em] text-[11px] rounded-full transition-all shadow-2xl hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-4">
                Initiate Registration <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
              </span>
              <div className="absolute inset-0 bg-blue-50 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessFeaturedSection;

