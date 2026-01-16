import React from 'react';
import { Infinity } from 'lucide-react';

const PartnersHero = ({ phrases, activePhraseIndex }) => {
  return (
    <section className="bg-[#050b1a] text-white pt-60 pb-52 text-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      ></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10 reveal active">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-blue-100 font-black uppercase text-[10px] tracking-[0.3em] mb-10 shadow-2xl relative overflow-hidden group mx-auto">
          <Infinity className="w-4 h-4 text-blue-300 animate-pulse shrink-0" />
          <div className="relative h-4 min-w-[260px] overflow-hidden flex items-center">
            {phrases.map((phrase, idx) => (
              <span
                key={idx}
                className={`absolute left-0 w-full transition-all duration-700 whitespace-nowrap text-center ${
                  activePhraseIndex === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>
        <h1 className="text-5xl md:text-[10rem] font-black mb-6 tracking-tighter uppercase leading-[0.8]">
          Hire{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-400">
            Top Talent
          </span>
        </h1>
        <p className="text-lg md:text-2xl text-slate-300 max-w-4xl mx-auto font-bold opacity-80 uppercase tracking-widest leading-tight">
          PARTNER WITH NETTECH INDIA TO ACCESS A POOL OF PRE-SCREENED, SKILLED, AND JOB-READY CANDIDATES AT ZERO COST.
        </p>
      </div>
    </section>
  );
};

export default PartnersHero;

