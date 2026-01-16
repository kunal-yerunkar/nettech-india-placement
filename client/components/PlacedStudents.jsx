import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, Trophy, Layers, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const PlacedStudents = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await api.getStudents();
      setStudents(data);
    };
    load();
  }, []);

  const recentStudents = students.slice(0, 10);
  const row1 = [...recentStudents, ...recentStudents];

  const StudentCard = ({ student }) => {
    return (
      <div
        className="bg-white dark:bg-[#0a0f18] rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] group hover:-translate-y-2 transition-[transform,shadow,colors] duration-500 w-72 md:w-80 flex-shrink-0 mx-4 md:mx-6 flex flex-col cursor-pointer transform-gpu backface-hidden"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Visual Header / Image Section */}
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

        {/* Content Section */}
        <div className="p-8 space-y-6 flex-grow flex flex-col">
          <div className="min-h-[60px]">
            <h3 className="text-xl font-black text-gray-900 dark:text-white leading-[1.1] mb-2 uppercase group-hover:text-blue-600 transition-colors truncate">
              {student.name}
            </h3>
            <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.05em] truncate">
              {student.role}
            </p>
          </div>

          <div className="h-px w-full bg-gray-100 dark:bg-white/5"></div>

          <div className="space-y-4 flex-grow">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg shrink-0">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate tracking-tight">
                {student.company}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-lg shrink-0">
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                {student.selectionDate}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer Line */}
        <div className="h-1.5 w-0 bg-blue-600 group-hover:w-full transition-all duration-700"></div>
      </div>
    );
  };

  return (
    <section id="placements" className="py-24 bg-gray-50 dark:bg-gray-950 scroll-mt-24 overflow-hidden transition-colors duration-300">
      <style>{`
        @keyframes scroll-left { 
          0% { transform: translate3d(0, 0, 0); } 
          100% { transform: translate3d(-50%, 0, 0); } 
        }
        .animate-scroll-left { 
          animation: scroll-left 40s linear infinite; 
          will-change: transform;
        }
        .animate-scroll-left:hover { 
          animation-play-state: paused; 
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center reveal active">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-6">
            Placement <span className="text-blue-600">Records</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-black uppercase tracking-[0.2em] leading-tight">
            SEE THE LATEST STUDENTS SECURING THEIR DREAM ROLES THROUGH OUR NETWORK.
          </p>
        </div>
      </div>

      <div className="relative reveal active">
        {/* Fade Edges Overlay */}
        <div className="absolute top-0 left-0 h-full w-24 md:w-64 bg-gradient-to-r from-gray-50 dark:from-gray-950 via-gray-50/40 dark:via-gray-950/40 to-transparent z-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 h-full w-24 md:w-64 bg-gradient-to-l from-gray-50 dark:from-gray-950 via-gray-50/40 dark:via-gray-950/40 to-transparent z-20 pointer-events-none"></div>

        <div className="w-full overflow-hidden">
          <div className="flex w-max animate-scroll-left py-12 transform-gpu">
            {row1.length > 0 ? (
              row1.map((student, idx) => (
                <StudentCard key={`${student.id}-${idx}`} student={student} />
              ))
            ) : (
              <div className="w-screen text-center py-20 text-gray-400 font-bold uppercase tracking-widest opacity-20">
                Database Loading...
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-20 reveal active">
        <Link
          to="/success-stories"
          className="group relative inline-flex items-center justify-center px-12 py-5 bg-white dark:bg-gray-900 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 overflow-hidden"
        >
          <span className="relative z-10 flex items-center">
            View Hall of Fame ({students.length} Records)
            <ArrowRight className="w-4 h-4 ml-3 transform group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>
    </section>
  );
};

export default PlacedStudents;