import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CheckCircle2, AlertCircle, ArrowRightCircle } from 'lucide-react';

const Features = () => {
  const [whyChooseUs, setWhyChooseUs] = useState([]);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const load = async () => {
      setWhyChooseUs(await api.getWhyChooseUs());
      setChallenges(await api.getChallenges());
    };
    load();
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-32 reveal active">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <img
                src="/images/web img/Why Choose Us.svg"
                alt="Students succeeding"
                className="rounded-[3rem] shadow-2xl w-full object-cover h-[450px] hover:shadow-blue-500/10 transition-shadow duration-300 border-8 border-gray-50 dark:border-gray-800"
              />
            </div>
            <div className="lg:w-1/2 space-y-10">
              <div>
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-6">
                  Why Choose <span className="text-blue-600">Us?</span>
                </h2>
                <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-xs">JOIN 4,500+ COMPANIES WHO TRUST US FOR THEIR HIRING NEEDS.</p>
              </div>
              <div className="grid sm:grid-cols-1 gap-5">
                {whyChooseUs.map((item, idx) => (
                  <div key={idx} className="flex items-center group p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent hover:border-blue-500/20 transition-all duration-300">
                    <div className="bg-green-500 p-1.5 rounded-full mr-4 shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-bold uppercase text-xs tracking-wide">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0f172a] rounded-[3.5rem] p-10 md:p-20 shadow-2xl reveal active border border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="text-center mb-20 relative z-10">
            <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6">
              Challenges <span className="text-blue-600">vs Solutions</span>
            </h2>
            <p className="text-blue-100/50 font-black uppercase tracking-[0.3em] text-xs">HOW WE TRANSFORM YOUR CAREER TRAJECTORY WITH PRECISION.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-12 relative z-10">
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="bg-blue-600 p-4 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.6)] animate-pulse border-4 border-[#0f172a]">
                <ArrowRightCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="md:w-1/2 bg-white/5 backdrop-blur-md p-10 rounded-[2.5rem] border-l-8 border-red-500 hover:shadow-red-500/10 transition-all duration-300 group">
              <h3 className="text-2xl font-black text-red-500 mb-8 flex items-center uppercase tracking-tight">
                <AlertCircle className="w-7 h-7 mr-3" />
                Industry Blockers
              </h3>
              <ul className="space-y-5">
                {challenges.map((challenge, idx) => (
                  <li key={idx} className="flex items-center text-blue-100/70 font-bold uppercase text-[10px] tracking-widest group-hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-4 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 bg-blue-700/20 backdrop-blur-md p-10 rounded-[2.5rem] border-l-8 border-green-500 transform hover:-translate-y-2 transition-all duration-300 group">
              <h3 className="text-2xl font-black text-green-500 mb-8 flex items-center uppercase tracking-tight">
                <CheckCircle2 className="w-7 h-7 mr-3" />
                Optimized Output
              </h3>
              <p className="text-blue-100 leading-relaxed text-lg font-medium">
                Our tailored placement solutions connect students directly with the right companies based on their skills and interests.
                With access to <strong className="text-white">4,500+ partner organizations</strong>, we match each candidate to suitable job roles, ensuring faster hiring and successful career beginnings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
