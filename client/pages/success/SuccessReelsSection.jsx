import React from 'react';
import { Video, Play } from 'lucide-react';

const SuccessReelsSection = ({ reels }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-30 border-t border-gray-100 dark:border-white/5">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 reveal active">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-600 dark:text-blue-400 font-black uppercase text-[8px] tracking-[0.3em] mb-4">
            <Video className="w-3 h-3" /> Live Deployments
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
            Success <span className="text-blue-600">Reels</span>
          </h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs max-w-sm">
          Captured moments of career transformation and industry interaction.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal active delay-200">
        {reels.map((reel) => (
          <div
            key={reel.id}
            className="group relative bg-black rounded-[2rem] aspect-[9/16] overflow-hidden shadow-2xl border border-white/5"
          >
            <video
              src={reel.url}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
              muted
              loop
              playsInline
              onMouseOver={(e) => e.target.play()}
              onMouseOut={(e) => {
                e.target.pause();
                e.target.currentTime = 0;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

            <div className="absolute top-6 left-6">
              <span className="px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">
                {reel.tag}
              </span>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <h4 className="text-white font-black uppercase tracking-tighter text-xl leading-none mb-2">
                {reel.title}
              </h4>
              <div className="flex items-center gap-2 opacity-60">
                <Play className="w-3 h-3 text-blue-400 fill-current" />
                <span className="text-[9px] font-black text-blue-100 uppercase tracking-widest">
                  Hover to preview
                </span>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent h-1/4 w-full -translate-y-full group-hover:animate-scan pointer-events-none"></div>
          </div>
        ))}
        {reels.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-20 font-black uppercase tracking-[0.5em]">
            Initializing Neural Stream...
          </div>
        )}
      </div>
    </section>
  );
};

export default SuccessReelsSection;

