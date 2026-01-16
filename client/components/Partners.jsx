import React from 'react';
import { PARTNER_BENEFITS } from '../constants';
import { TrendingUp, Users, Building, DollarSign, Award, FileText, Handshake, Settings } from 'lucide-react';
import partnerslogo from '../images/partnerlogo';

const icons = [TrendingUp, Users, Building, DollarSign, Award, FileText, Handshake, Settings];

const Partners = () => {
  const partners = partnerslogo;
  const midPoint = Math.ceil(partners.length / 2);
  const group1 = partners.slice(0, midPoint);
  const group2 = partners.slice(midPoint);
  const row1 = [...group1, ...group1];
  const row2 = [...group2, ...group2];

  const getSafeUrl = (path) => {
    if (!path) return '';
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return '/' + cleanPath.split('/').map(part => encodeURIComponent(part)).join('/');
  };

  const PartnerLogo = ({ name, logo }) => (
    <div className="flex items-center justify-center h-16 w-32 md:h-24 md:w-48 bg-white dark:bg-white rounded-xl mx-2 md:mx-4 flex-shrink-0 border border-gray-100 dark:border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 group cursor-pointer p-4 relative overflow-hidden">
      <span className="absolute text-gray-200 text-xs font-bold z-0 text-center w-full px-1">{name}</span>
      <img
        src={getSafeUrl(logo)}
        alt={name}
        className="max-h-full max-w-full object-contain relative z-10 filter md:grayscale md:opacity-60 grayscale-0 opacity-100 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"
        onError={(e) => { e.currentTarget.style.opacity = '0'; }}
      />
    </div>
  );

  return (
    <section id="partners" className="py-24 bg-gray-50 dark:bg-gray-800 scroll-mt-24 overflow-hidden transition-colors duration-300">
      <style>{`
        @keyframes scroll-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes scroll-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .animate-scroll-left { animation: scroll-left 60s linear infinite; }
        .animate-scroll-right { animation: scroll-right 60s linear infinite; }
        .pause-on-hover:hover { animation-play-state: paused; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-24">
          <div className="text-center mb-16 reveal active">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-6">
              Strategic <span className="text-blue-600">Partnerships</span>
            </h2>
            <p className="text-gray-500 font-black uppercase tracking-[0.25em] text-[10px] md:text-xs">JOIN OUR NETWORK OF 4,500+ HIRING PARTNERS AND ACCESS EXCEPTIONAL TALENT.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal active">
            {PARTNER_BENEFITS.map((benefit, idx) => {
              const Icon = icons[idx % icons.length];
              return (
                <div key={idx} className="flex items-center p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group">
                  <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-black text-gray-800 dark:text-gray-200 text-[10px] uppercase tracking-widest leading-tight">{benefit}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Animated Partner Logos */}
        <div className="bg-white dark:bg-gray-900 py-20 rounded-[3.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden reveal active">
          <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-12 text-center uppercase tracking-tighter">Trusted By <span className="text-blue-600">Industry Leaders</span></h3>

          <div className="relative">
            <div className="absolute top-0 left-0 h-full w-24 md:w-64 bg-gradient-to-r from-white dark:from-gray-900 via-white/40 dark:via-gray-900/40 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute top-0 right-0 h-full w-24 md:w-64 bg-gradient-to-l from-white dark:from-gray-900 via-white/40 dark:via-gray-900/40 to-transparent z-20 pointer-events-none"></div>

            <div className="mb-10 w-full overflow-hidden">
              <div className="flex w-max animate-scroll-right pause-on-hover">
                {row1.map((p, i) => (
                  <PartnerLogo key={`r1-${i}`} name={p.name} logo={p.logo} />
                ))}
              </div>
            </div>

            <div className="w-full overflow-hidden">
              <div className="flex w-max animate-scroll-left pause-on-hover">
                {row2.map((p, i) => (
                  <PartnerLogo key={`r2-${i}`} name={p.name} logo={p.logo} />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Partners;