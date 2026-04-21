import React from 'react';
import { GraduationCap, Award, Users, Star, Infinity } from 'lucide-react';

const ProcessHero = ({ phrases, activePhraseIndex }) => {
  return (
    <section className="bg-blue-900 text-white pt-40 pb-32 text-center reveal active relative overflow-hidden transition-all duration-700">
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      ></div>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-[10%] animate-float opacity-10 delay-100">
          <GraduationCap className="w-24 h-24 rotate-12" />
        </div>
        <div className="absolute bottom-10 right-[15%] animate-float opacity-10 delay-500">
          <Award className="w-32 h-32 -rotate-12" />
        </div>
        <div className="absolute top-1/2 left-[5%] animate-float opacity-[0.05] delay-300">
          <Users className="w-20 h-20" />
        </div>
        <div className="absolute top-1/4 right-[8%] animate-float opacity-[0.08] delay-200">
          <Star className="w-16 h-16 fill-current" />
        </div>
      </div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] -ml-48 -mb-48"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-blue-100 font-black uppercase text-[10px] tracking-[0.3em] mb-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <Infinity className="w-4 h-4 text-blue-300 animate-pulse shrink-0" />
          <div className="relative h-4 min-w-[260px] overflow-hidden flex items-center">
            {phrases.map((phrase, idx) => (
              <span
                key={idx}
                className={`absolute left-0 w-full transition-all duration-700 whitespace-nowrap text-left ${
                  activePhraseIndex === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>
        <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter uppercase leading-none drop-shadow-2xl">
          Your Pathway to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-white">
            Employment
          </span>
        </h1>
        <p className="text-lg md:text-2xl text-blue-200 max-w-2xl mx-auto font-bold opacity-90 leading-tight uppercase tracking-tight">
          Follow our simple 4-step process to secure your dream job at no cost.
        </p>
      </div>
    </section>
  );
};

export default ProcessHero;

