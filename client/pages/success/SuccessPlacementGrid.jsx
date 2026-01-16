import React from 'react';
import { RefreshCcw, Layers, Calendar, Trophy, CheckCircle2 } from 'lucide-react';

const SuccessPlacementGrid = ({ students, visibleStudents, hasMore, loadMore, isAnimating }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-30 bg-white dark:bg-gray-950">
      <div className="mb-16 reveal active flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-gray-100 dark:border-white/5 pb-12">
        <div className="relative">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none flex flex-wrap gap-x-4">
            <span className="text-[#0f172a] dark:text-white">Deployment</span>
            <span className="text-blue-600">Archives</span>
          </h2>
          <div className="mt-4 h-1.5 w-24 bg-blue-600 rounded-full"></div>
        </div>

        <div className="bg-gray-50/50 dark:bg-white/5 px-8 py-5 rounded-[1.5rem] border border-gray-200 dark:border-white/10 shadow-sm">
          <span className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-[0.2em]">
            Database Records: <span className="text-blue-600 dark:text-blue-400">{students.length}+ Active</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleStudents.map((student, idx) => (
          <div
            key={student.id}
            className="bg-white dark:bg-[#0a0f18] rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] group hover:-translate-y-2 transition-[transform,shadow,colors] duration-500 reveal active transform-gpu"
            style={{
              transitionDelay: `${(idx % 4) * 100}ms`,
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            <div className="aspect-[4/4.5] relative bg-blue-600 overflow-hidden transform-gpu">
              <img
                src={student.image}
                alt={student.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 transform-gpu"
              />
              <div className="absolute top-6 right-6 z-10">
                <div className="bg-blue-700/90 backdrop-blur-md p-2.5 rounded-xl shadow-lg border border-white/20">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="absolute bottom-6 left-6 z-10">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-[#10b981] rounded-lg shadow-xl border border-white/10">
                  <div className="bg-white/20 p-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">Verified Deployment</span>
                </div>
              </div>
            </div>
            <div className="p-7 space-y-5 flex flex-col h-full">
              <div className="min-h-[56px] flex flex-col justify-center">
                <h3 className="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-[1.2] mb-1 uppercase group-hover:text-blue-600 transition-colors line-clamp-2">
                  {student.name}
                </h3>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.05em] truncate">
                  {student.role}
                </p>
              </div>
              <div className="h-px w-full bg-gray-100 dark:bg-white/5"></div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg shrink-0">
                    <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 truncate tracking-tight">
                    {student.company}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-lg shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    {student.selectionDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-24 text-center reveal active">
          <button
            onClick={loadMore}
            disabled={isAnimating}
            className="group relative inline-flex items-center gap-4 px-12 py-5 bg-white dark:bg-gray-900 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {isAnimating ? <RefreshCcw className="w-4 h-4 animate-spin" /> : 'Load More Records'}
          </button>
        </div>
      )}
    </section>
  );
};

export default SuccessPlacementGrid;

