import React from 'react';
import { Network } from 'lucide-react';

const ContactHero = ({ phrases, activePhraseIndex }) => {
  return (
    <section className="relative bg-blue-900 dark:bg-[#020617] text-white pt-60 pb-52 text-center overflow-hidden transition-colors duration-500">
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      ></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 reveal active">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20 text-blue-100 font-black uppercase text-[10px] tracking-[0.3em] mb-12 shadow-2xl relative overflow-hidden group mx-auto">
          <Network className="w-3.5 h-3.5 text-blue-300 animate-pulse shrink-0" />
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

        <div className="mb-8">
          <span className="text-blue-400 font-black uppercase text-xs tracking-[0.6em] block mb-4 animate-fade-in">
            Connect with us
          </span>
          <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.85] drop-shadow-[0_0_80px_rgba(37,99,235,0.4)]">
            Global <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-500">
              Gateway
            </span>
          </h1>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto px-4">
          <p className="text-base sm:text-xl md:text-3xl text-white font-black uppercase tracking-tight leading-tight">
            Have questions? Our team is ready to support your career journey.
          </p>
          <p className="text-sm sm:text-base md:text-xl text-blue-50/60 font-bold uppercase tracking-widest">
            Reach our mission control for career acceleration.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;

