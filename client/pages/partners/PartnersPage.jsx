import React, { useEffect, useState } from 'react';
import {
    TrendingUp, Users, Building,
    DollarSign, Award, FileText, Handshake,
    Settings, ArrowRight, CheckCircle,
    RefreshCcw,
    Cpu, Globe, Zap, Building2, Briefcase,
    Mail, Phone, ChevronDown,
    Rocket, ShieldCheck, CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api';
import PartnersHero from './PartnersHero';

const PartnersPage = () => {
    const [activePhraseIndex, setActivePhraseIndex] = useState(0);
    const [formSchema, setFormSchema] = useState([]);
    const [partners, setPartners] = useState([]);
    const [formData, setFormData] = useState({ companyName: '', contactPerson: '', email: '', phone: '', requirements: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [mobileVisibleCount, setMobileVisibleCount] = useState(6);
    const [isMobile, setIsMobile] = useState(false);
    
    const phrases = ["Alliances Ecosystem", "Strategic Hiring Nodes", "Zero-Cost Talent Pipeline", "Global Enterprise Trust"];
    
    const detailedBenefits = [
        { title: "ENHANCED PLACEMENT RECORD", desc: "Improve your campus placement statistics with our vast pool of job-ready candidates tailored for modern industry needs.", icon: Award },
        { title: "INCREASED ADMISSION RATE", desc: "Boost your college admissions by demonstrating strong, guaranteed career outcomes and high-tier placement records to students.", icon: TrendingUp },
        { title: "BOOST INSTITUTIONAL REPUTATION", desc: "Partner with an industry leader to elevate your institution's profile among top recruiters and global corporate networks.", icon: ShieldCheck },
        { title: "ZERO-COST PARTNERSHIP", desc: "Access our premium recruitment and placement services without any financial investment from your institution or organization.", icon: DollarSign },
        { title: "EXCLUSIVE PLACEMENT DRIVE", desc: "Organize dedicated hiring events and on-campus recruitment cycles specifically tailored for your unique student demographics.", icon: Rocket },
        { title: "REGULAR PLACEMENT REPORTS", desc: "Stay informed with detailed analytical reports on hiring trends, candidate status, and real-time student placement progress.", icon: FileText },
        { title: "STRONG INDUSTRY TIE-UPS", desc: "Leverage our direct, pre-verified relationships with over 4,500+ domestic and global hiring partners across all sectors.", icon: Handshake },
        { title: "CUSTOMIZED PLACEMENT SUPPORT", desc: "Receive personalized assistance and career coaching strategies to streamline your organization's talent acquisition lifecycle.", icon: Settings }
    ];

    const industries = [
        { category: "SOFTWARE & INFRA", title: "INFORMATION TECHNOLOGY" },
        { category: "FINTECH & ERP", title: "BANKING & FINANCE" },
        { category: "MARKETING & UI/UX", title: "DIGITAL AGENCIES" },
        { category: "INDUSTRIAL DESIGN", title: "MANUFACTURING (CAD)" },
        { category: "RETAIL & LOGISTICS", title: "E-COMMERCE" },
        { category: "NETWORKS & 5G", title: "TELECOMMUNICATIONS" }
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        handleResize();
        window.addEventListener('resize', handleResize);

        const load = async () => {
            const schema = await api.getFormSchema('partner');
            setFormSchema(schema || []);
            setPartners(await api.getPartners());
            
            const dynamicState = {};
            (schema || []).forEach(field => { dynamicState[field.name] = ''; });
            setFormData(prev => ({ ...prev, ...dynamicState }));
        };
        load();

        const interval = setInterval(() => {
          setActivePhraseIndex((prev) => (prev + 1) % phrases.length);
        }, 3000);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone' && (!/^\d*$/.test(value) || value.length > 10)) return;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.registerPartner(formData);
            setIsSubmitted(true);
            const resetState = { companyName: '', contactPerson: '', email: '', phone: '', requirements: '' };
            formSchema.forEach(f => resetState[f.name] = '');
            setFormData(resetState);
        } catch (error) { console.error(error); } finally { setIsSubmitting(false); }
    };

    const displayedLogos = isMobile ? partners.slice(0, mobileVisibleCount) : partners;

    const PartnerLogo = ({ name, logo }) => (
        <div className="flex items-center justify-center bg-white dark:bg-slate-50 rounded-2xl border border-gray-100 dark:border-white/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer p-5 aspect-[3/2] relative overflow-hidden">
          <img src={logo} alt={name} className="max-h-full max-w-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110" onError={(e) => { e.target.style.opacity = '0.2'; }} />
          <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </div>
    );

    return (
        <div className="bg-white dark:bg-[#020617] min-h-screen transition-colors duration-500 overflow-x-hidden">
            {/* 1. HERO SECTION */}
            <PartnersHero phrases={phrases} activePhraseIndex={activePhraseIndex} />

            {/* 2. STRATEGIC BENEFITS */}
            <section className="max-w-7xl mx-auto px-4 py-32">
                <div className="text-center mb-24 reveal active">
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">Strategic <span className="text-blue-600">Benefits</span></h2>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Empowering Institutional & Corporate Recruitment Cycles.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {detailedBenefits.map((benefit, idx) => {
                        const Icon = benefit.icon;
                        return (
                            <div key={idx} className="bg-white dark:bg-[#0a0f18] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl hover:-translate-y-2 transition-all duration-500 reveal active group flex flex-col h-full" style={{ transitionDelay: `${idx * 50}ms` }}>
                                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:rotate-6 transition-transform"><Icon className="w-6 h-6" /></div>
                                <h3 className="font-black text-gray-900 dark:text-white mb-3 uppercase text-[11px] tracking-widest leading-tight">{benefit.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium leading-relaxed flex-grow">{benefit.desc}</p>
                                <div className="mt-6 h-1 w-12 bg-blue-600 rounded-full group-hover:w-full transition-all duration-500"></div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 3. INDUSTRIES WE SERVE - HEADER CENTERED */}
            <section className="max-w-7xl mx-auto px-4 py-32 reveal active">
                <div className="text-center mb-20 space-y-4">
                    <span className="text-blue-600 font-black uppercase text-[10px] tracking-[0.5em] block">Global Industry Reach</span>
                    <h2 className="text-4xl md:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
                        Industries <span className="text-blue-600">We Serve</span>
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row items-start gap-16 xl:gap-24">
                    {/* Left Content Side */}
                    <div className="lg:w-1/2 space-y-12">
                        <div className="space-y-6 text-gray-500 dark:text-gray-400 font-medium leading-relaxed text-lg">
                            <p>
                                At NetTech India, we recognize that every industry has unique technical requirements and operational challenges. Our comprehensive training programs are meticulously designed to produce versatile candidates who excel across diverse domains. From high-growth tech startups seeking agile developers to established Fortune 500 MNCs looking for robust system administrators, we bridge the skill gap effectively.
                            </p>
                            <p>
                                By maintaining a constant pulse on the global market, we ensure our talent pool is equipped with the latest framework knowledge and soft skills necessary for immediate workplace integration. Our graduates don't just fill positions; they drive innovation and stability in the departments they join.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {industries.map((ind, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-5 bg-white dark:bg-[#0a0f18] rounded-[1.5rem] border border-gray-100 dark:border-white/5 shadow-md hover:shadow-xl transition-all duration-300 group">
                                    <div className="w-6 h-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <p className="text-blue-600 dark:text-blue-400 font-black text-[11px] uppercase tracking-widest leading-none mb-1">{ind.category}</p>
                                        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{ind.title}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Illustration Side */}
                    <div className="lg:w-1/2 relative w-full">
                        <div className="relative z-10 p-4 md:p-8 bg-white dark:bg-gray-900 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-white/5 overflow-hidden group">
                           <img 
                                src="/images/web img/Industries We Serve.jpg" 
                            alt="Industry Technical Illustration" 
                            className="w-full h-auto rounded-[2rem] transform group-hover:scale-105 transition-transform duration-1000"
                           />
                           <div className="absolute inset-0 bg-blue-600/5 pointer-events-none"></div>
                        </div>
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 -z-10"></div>
                        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50 -z-10"></div>
                    </div>
                </div>
            </section>

            {/* 4. GLOBAL NETWORK (PARTNERS) */}
            <section className="py-32 bg-gray-50 dark:bg-[#050b1a]">
                <div className="max-w-7xl mx-auto px-4 mb-20 text-center reveal active">
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">Trusted By <br className="md:hidden" /><span className="text-blue-600">Industry Leaders</span></h2>
                    <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">JOIN 4,500+ CORPORATE LEADERS IN OUR GLOBAL PARTNERSHIP NETWORK</p>
                </div>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8 reveal active">{displayedLogos.map((p, i) => (<PartnerLogo key={p.id || i} name={p.name} logo={p.logo} />))}</div>
                    {isMobile && mobileVisibleCount < partners.length && (
                        <div className="mt-16 text-center"><button onClick={() => setMobileVisibleCount(prev => prev + 12)} className="group relative inline-flex items-center gap-4 px-12 py-5 bg-white dark:bg-gray-900 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95">Load More Partners <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" /></button></div>
                    )}
                </div>
            </section>

            {/* 5. INTAKE FORM */}
            <section className="py-32 max-w-6xl mx-auto px-4">
                <div className="bg-blue-700 dark:bg-blue-800 rounded-[4rem] p-10 md:p-24 shadow-[0_40px_100px_rgba(37,99,235,0.3)] relative overflow-hidden reveal active">
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                    <div className="relative z-10 text-center mb-20 text-white">
                        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">Join The <br />Hiring Network</h2>
                        <p className="text-blue-100 font-bold uppercase tracking-widest text-sm max-w-2xl mx-auto">Fill the intake form below. Our relationship managers will initiate the uplink within 24 business hours.</p>
                    </div>
                    {isSubmitted ? (
                        <div className="text-center py-20 text-white bg-white/10 backdrop-blur-xl rounded-[3rem] border border-white/20 animate-in zoom-in duration-500">
                            <CheckCircle className="w-24 h-24 mx-auto mb-8 text-emerald-300" />
                            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Uplink Established</h3>
                            <p className="text-xl font-medium text-blue-100">Partnership request has been queued for verification.</p>
                            <button onClick={() => setIsSubmitted(false)} className="mt-12 px-10 py-4 bg-white text-blue-700 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-blue-50 transition-all">New Request</button>
                        </div>
                    ) : (
                        <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-blue-200 ml-2 tracking-widest flex items-center gap-2"><Building2 className="w-3 h-3" /> Organization Name</label>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-8 py-6 rounded-3xl border-2 border-white/10 bg-white/5 text-white focus:border-blue-500 focus:bg-white/10 outline-none font-black text-sm placeholder:text-blue-300/30 transition-all" placeholder="ENTER COMPANY NAME" required />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-blue-200 ml-2 tracking-widest flex items-center gap-2"><Users className="w-3 h-3" /> Contact Lead</label>
                                    <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full px-8 py-6 rounded-3xl border-2 border-white/10 bg-white/5 text-white focus:border-blue-500 focus:bg-white/10 outline-none font-black text-sm placeholder:text-blue-300/30 transition-all placeholder:text-blue-300/30" placeholder="FULL NAME / DESIGNATION" required />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-blue-200 ml-2 tracking-widest flex items-center gap-2"><Mail className="w-3 h-3" /> Official Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-8 py-6 rounded-3xl border-2 border-white/10 bg-white/5 text-white focus:border-blue-500 focus:bg-white/10 outline-none font-black text-sm placeholder:text-blue-300/30 transition-all placeholder:text-blue-300/30" placeholder="EMAIL@DOMAIN.COM" required />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-blue-200 ml-2 tracking-widest flex items-center gap-2"><Phone className="w-3 h-3" /> Mobile Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-8 py-6 rounded-3xl border-2 border-white/10 bg-white/5 text-white focus:border-blue-500 focus:bg-white/10 outline-none font-black text-sm placeholder:text-blue-300/30 transition-all placeholder:text-blue-300/30" placeholder="+91 0000000000" required />
                                </div>
                                {formSchema.map((field, idx) => (
                                    <div key={field.id} className={`space-y-3 ${idx === formSchema.length - 1 && formSchema.length % 2 !== 0 ? 'md:col-span-2' : 'md:col-span-1'}`}>
                                        <label className="text-[10px] font-black uppercase text-blue-200 ml-2 tracking-widest flex items-center gap-2"><Zap className="w-3 h-3" /> {field.label}</label>
                                        <input type={field.type} name={field.name} value={formData[field.name] || ''} onChange={handleChange} className="w-full px-8 py-6 rounded-3xl border-2 border-white/10 bg-white/5 text-white focus:border-blue-500 focus:bg-white/10 outline-none font-black text-sm placeholder:text-blue-300/30 transition-all placeholder:text-blue-300/30" placeholder={`ENTER ${field.label.toUpperCase()}`} required={field.required} />
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-blue-200 ml-2 tracking-widest flex items-center gap-2"><Briefcase className="w-3 h-3" /> Hiring Requirements</label>
                                <textarea name="requirements" value={formData.requirements} onChange={handleChange} className="w-full px-8 py-8 rounded-[2.5rem] border-2 border-white/10 bg-white/5 text-white focus:border-blue-500 focus:bg-white/10 outline-none font-black text-sm placeholder:text-blue-300/30 transition-all min-h-[200px] resize-none" placeholder="DESCRIBE THE ROLES YOU ARE LOOKING TO FILL..." required></textarea>
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full group relative overflow-hidden bg-white text-blue-700 font-black py-8 rounded-[2rem] transition-all shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:bg-blue-50 active:scale-[0.98] flex items-center justify-center gap-5 text-[12px] uppercase tracking-[0.4em]">
                                <span className="relative z-10 flex items-center gap-4">{isSubmitting ? <RefreshCcw className="w-6 h-6 animate-spin" /> : <>Initiate Partnership Uplink <ArrowRight className="w-5 h-5" /></>}</span>
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </div>
    );
};

export default PartnersPage;