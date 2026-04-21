import React from 'react';
import { Infinity, Trophy, Star, Award } from 'lucide-react';

const SuccessHero = ({ phrases, activePhraseIndex, studentCount }) => {
  return (
    <section className="bg-[#050b1a] text-white pt-60 pb-52 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '35px 35px' }}
      ></div>

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[140px] animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>

      <div className="absolute inset-0 pointer-events-none">
        <Trophy className="absolute top-[20%] left-[10%] w-20 h-20 text-yellow-400 opacity-10 animate-float" />
        <Star className="absolute bottom-[25%] right-[12%] w-16 h-16 text-blue-300 opacity-15 animate-float delay-500" />
        <Award className="absolute top-[40%] right-[20%] w-12 h-12 text-indigo-300 opacity-10 animate-float delay-200" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none pointer-events-none">
        <span className="text-[25vw] font-black tracking-tighter uppercase leading-none">Hired</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 reveal active">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-blue-100 font-black uppercase text-[10px] tracking-[0.3em] mb-10 shadow-2xl relative overflow-hidden group mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
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

        <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase leading-[0.9]">
          The{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-400">
            Success
          </span>{' '}
          Matrix
        </h1>
        <p className="text-xl text-blue-200 max-w-2xl mx-auto font-bold opacity-80 uppercase tracking-widest leading-tight">
          Celebrating the milestones of our {studentCount || 0}+ students.
        </p>
      </div>
    </section>
  );
};

export default SuccessHero;

