import React, { useEffect, useState } from 'react';
import { Target, Eye, Shield, Briefcase, Award, Users, GraduationCap, Globe, Wrench, Sparkles, Quote, Command, Zap, ShieldCheck, CheckCircle2, Infinity } from 'lucide-react';

const CEO_IMAGE_URL = "/images/web img/Founder-CEO.jpg";

const AboutPage = () => {
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);

  const phrases = [
    "Established Excellence",
    "Industry Verified Legacy",
    "Pioneer Placement Framework",
    "Trusted By Global MNCs"
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    const interval = setInterval(() => {
      setActivePhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const sharedValues = [
    {
      icon: Award,
      label: "Excellence & Innovation",
      desc: "Striving for the highest standards in training and placement.",
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      icon: GraduationCap,
      label: "Career-Focused Learning",
      desc: "Curriculum designed to meet real-world industry demands.",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      icon: Shield,
      label: "Integrity & Transparency",
      desc: "Ethical processes with no hidden charges or false promises.",
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    {
      icon: Wrench,
      label: "Practical & Hands On",
      desc: "Emphasis on practical skills and job-readiness.",
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    {
      icon: Globe,
      label: "Global Vision, Local Impact",
      desc: "Connecting local talent with global opportunities.",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen transition-all duration-700 overflow-x-hidden">

      {/* 1. COMMAND CENTER HERO */}
      <section className="bg-[#0a1e4d] text-white pt-60 pb-52 relative overflow-hidden transition-all duration-1000">
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-15%] left-[-5%] w-[700px] h-[700px] bg-indigo-600/20 rounded-full blur-[120px]"></div>

        <div className="absolute inset-0 pointer-events-none">
          <Target className="absolute top-[20%] left-[10%] w-16 h-16 text-blue-400 opacity-10 animate-float" />
          <Shield className="absolute bottom-[20%] right-[10%] w-20 h-20 text-indigo-400 opacity-10 animate-float delay-500" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none pointer-events-none">
          <span className="text-[25vw] font-black tracking-tighter uppercase leading-none">Legacy</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-blue-100 font-black uppercase text-[10px] tracking-[0.3em] mb-10 shadow-2xl relative overflow-hidden group mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Infinity className="w-4 h-4 text-blue-300 animate-pulse shrink-0" />
            <div className="relative h-4 min-w-[260px] overflow-hidden flex items-center">
              {phrases.map((phrase, idx) => (
                <span key={idx} className={`absolute left-0 w-full transition-all duration-700 whitespace-nowrap text-center ${activePhraseIndex === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  {phrase}
                </span>
              ))}
            </div>
          </div>

          <h1 className="text-4xl md:text-8xl font-black mb-6 tracking-tighter uppercase leading-[0.9] reveal active">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-400">Pioneer</span> Spirit
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 italic font-bold max-w-3xl mx-auto opacity-90 uppercase tracking-widest leading-tight reveal active delay-300">
            "Bridging the Gap Between Education and Employment."
          </p>
        </div>
      </section>

      {/* 2. MAIN CONTENT LAYER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 transition-all duration-1000">

        {/* Company Structure Cards */}
        <div className="grid md:grid-cols-2 gap-10 mb-24 -mt-32 relative z-30">
          <div className="bg-white dark:bg-[#0a0f18] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden reveal active">
            <div className="p-8 md:p-12 pb-6 md:pb-8 flex items-center space-x-5">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/40 rounded-2xl text-blue-800 dark:text-blue-400 shadow-sm shrink-0">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Parent Company</h2>
            </div>
            <div className="p-8 md:p-12 pt-2 md:pt-2 space-y-5 text-gray-600 dark:text-gray-400 font-medium leading-relaxed border-t border-gray-50 dark:border-white/5">
              <p>
                Established as a beacon of technical education, <strong className="text-gray-900 dark:text-white">NetTech India</strong> has pioneered professional training paradigms for over a decade. We don't just provide courses; we engineer careers through a rigorous curriculum that mirrors the ever-evolving IT landscape.
              </p>
              <p>
                Our facilities serve as innovation hubs where students master technologies like <strong className="text-blue-600 dark:text-blue-400 font-black">Cisco Networking, Cloud Architecture (AWS/Azure), Cyber Security, and Data Science</strong>. Every program is delivered by industry veterans who bring years of field-verified expertise into the classroom, ensuring our graduates are not just "certified," but truly competent.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0f18] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden reveal active">
            <div className="p-8 md:p-12 pb-6 md:pb-8 flex items-center space-x-5">
              <div className="p-4 bg-green-100 dark:bg-green-900/40 rounded-2xl text-green-800 dark:text-green-400 shadow-sm shrink-0">
                <Briefcase className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Daughter Company</h2>
            </div>
            <div className="p-8 md:p-12 pt-2 md:pt-2 space-y-5 text-gray-600 dark:text-gray-400 font-medium leading-relaxed border-t border-gray-50 dark:border-white/5">
              <p>
                <strong className="text-gray-900 dark:text-white">NetTech India Placement</strong> operates as the specialized recruitment arm of our group, dedicated to managing the transition from student to professional. Our primary objective is to democratize high-tier job access through our landmark <strong className="text-green-600 font-black">Zero-Cost Placement Model</strong>.
              </p>
              <p>
                By maintaining a strategic network of <strong className="text-gray-900 dark:text-white">4,500+ global hiring partners</strong>, we act as a bridge between untapped talent and corporate vacancies. Our placement cell provides end-to-end support, including resume engineering, soft-skills grooming, and rigorous mock interview simulations.
              </p>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <div className="bg-gray-50 dark:bg-[#0a0f18] rounded-[2.5rem] p-10 border-t-8 border-indigo-600 shadow-lg hover:shadow-xl transition-all reveal active flex flex-col">
            <div className="flex items-center mb-8">
              <Eye className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mr-5" />
              <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Our Vision</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed text-lg text-justify">
              To establish a distinguished and industry-aligned placement framework that consistently connects qualified talent with reputable organizations. We are committed to delivering a structured, reliable, and high-quality placement ecosystem that enhances employability, strengthens industry collaboration, and supports long-term career progression.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-[#0a0f18] rounded-[2.5rem] p-10 border-t-8 border-blue-600 shadow-lg hover:shadow-xl transition-all reveal active delay-200 flex flex-col">
            <div className="flex items-center mb-8">
              <Target className="w-12 h-12 text-blue-600 dark:text-blue-400 mr-5" />
              <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Our Mission</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed text-lg text-justify">
              Our mission is to connect skilled talent with the right career opportunities by delivering reliable, industry-focused placement solutions. We are dedicated to identifying, preparing, and aligning candidates with organizational needs through rigorous skill development, expert mentoring, and strong industry networks.
            </p>
          </div>
        </div>

        {/* --- SHARED VALUES SECTION --- */}
        <div className="mb-24 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 reveal active">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Our Shared <span className="text-blue-600">Values</span></h2>
            <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">The foundational principles governing our professional ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sharedValues.map((v, i) => (
              <div key={i} className="flex flex-col bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-lg hover:-translate-y-2 transition-all duration-500 group reveal active relative overflow-hidden">
                <div className="p-8 md:p-10 flex-grow relative z-10">
                  <div className={`p-5 rounded-2xl ${v.bg} ${v.color} mb-8 w-fit group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                    <v.icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-tight text-gray-900 dark:text-white mb-4 leading-tight">{v.label}</h4>
                  <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed text-sm md:text-base">{v.desc}</p>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none">
                  <v.icon className="w-32 h-32 rotate-12" />
                </div>
                <div className="h-1.5 w-0 bg-blue-600 group-hover:w-full transition-all duration-700"></div>
              </div>
            ))}

            {/* CTA Final Value Node */}
            <div className="flex flex-col bg-blue-600 rounded-[2.5rem] border border-blue-500 shadow-2xl hover:-translate-y-2 transition-all duration-500 group reveal active relative overflow-hidden text-white lg:col-span-1 md:col-span-2">
              <div className="p-8 md:p-10 flex-grow relative z-10 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm animate-pulse">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">Integrity Driven</h4>
                <p className="text-blue-100 font-bold uppercase tracking-widest text-[10px]">NetTech India Placement Cell</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Visionary Leadership Section */}
        <div className="mb-24 reveal active">
          <div className="bg-white dark:bg-[#050e26] text-gray-900 dark:text-white rounded-[3.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-2xl relative group transition-colors duration-500">
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="grid lg:grid-cols-12 items-stretch relative z-10">
              <div className="lg:col-span-7 p-10 md:p-16 space-y-10">
                <div className="flex items-center gap-4 reveal active">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none">Strategic Leadership</h2>
                </div>

                <div className="relative reveal active">
                  <Quote className="absolute -top-6 -left-6 w-12 h-12 text-blue-500/10" />
                  <p className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-100 italic leading-snug">
                    "Our goal isn't just to teach, but to transform. We build the gateway where local talent meets global industry standards, ensuring every graduate has a definitive path to professional victory."
                  </p>
                </div>

                <div className="space-y-6 text-gray-600 dark:text-slate-400 font-medium leading-relaxed reveal active">
                  <p>
                    Guided by decades of industry experience, our leadership focuses on <strong className="text-blue-600 dark:text-white">Zero-Gap Employment</strong>. By fostering a culture of integrity and practical excellence, our leaders have successfully onboarded 4,500+ global partners, creating one of India's most robust placement ecosystems.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-6 reveal active">
                  {[
                    { icon: Zap, label: "Agility" },
                    { icon: Globe, label: "Synergy" },
                    { icon: Command, label: "Precision" }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 hover:bg-blue-50 dark:hover:bg-white/10 transition-colors group/item">
                      <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover/item:scale-110 transition-transform" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-400">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-[#020617] min-h-[400px] flex items-center justify-center p-12 overflow-hidden transition-colors duration-500">
                <div className="absolute inset-0 opacity-[0.05] dark:opacity-20" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="relative w-full aspect-square max-w-[300px] rounded-[3rem] overflow-hidden border-8 border-white/50 dark:border-white/5 shadow-2xl reveal active bg-[#050e26]">

                  {!imgFailed ? (
                    <img
                      src={CEO_IMAGE_URL}
                      alt="Founder & CEO"
                      className="w-full h-full object-cover transition-all duration-700"
                      onError={() => setImgFailed(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-7xl font-black">SV</div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-8 left-8 right-8 pointer-events-none">
                    <p className="text-white font-black uppercase text-xs tracking-widest mb-1 drop-shadow-md">Founder & CEO</p>
                    <div className="h-0.5 w-12 bg-blue-400 mb-2 shadow-lg shadow-blue-400/50"></div>
                    <p className="text-blue-100 text-[10px] font-bold uppercase opacity-90 tracking-widest drop-shadow-md">The Pioneer Framework</p>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] border border-blue-500/10 dark:border-blue-500/5 rounded-full animate-spin-slow pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .animate-spin-slow { animation: spin 20s linear infinite; }
      `}</style>
    </div>
  );
};

export default AboutPage;