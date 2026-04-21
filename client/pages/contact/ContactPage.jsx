import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Send, RefreshCcw, Activity, MessageSquare, ExternalLink, Handshake } from 'lucide-react';
import { api } from '../../services/api';
import CustomDropdown from '../../components/CustomDropdown';
import ContactHero from './ContactHero';

const ContactPage = () => {
    const [activePhraseIndex, setActivePhraseIndex] = useState(0);
    const [formSchema, setFormSchema] = useState([]);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

    const phrases = [
      "Secure Transmission Cycle",
      "Mission Control Support",
      "Global Gateway Interface",
      "Strategic Link Activation"
    ];

    const inquirySubjects = [
        "Student Placement Inquiry",
        "Hiring Partnership",
        "Corporate Training",
        "MNC Referral Program",
        "Technical Support",
        "Other Inquiries"
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        const interval = setInterval(() => {
          setActivePhraseIndex((prev) => (prev + 1) % phrases.length);
        }, 3000);

        const loadSchema = async () => {
            const schema = await api.getFormSchema('inquiry');
            setFormSchema(schema);
            const dynamicState = {};
            schema.forEach(field => { dynamicState[field.name] = ''; });
            setFormData(prev => ({ ...prev, ...dynamicState }));
        };
        loadSchema();

        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone' && (!/^\d*$/.test(value) || value.length > 10)) return;
        setFormData({ ...formData, [name]: value });
    };

    const handleDropdownChange = (value) => setFormData({ ...formData, subject: value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.subject) {
            setSubmitStatus({ type: 'error', message: 'Please select an Inquiry Subject.' });
            return;
        }
        setIsSubmitting(true);
        try {
            await api.submitInquiry(formData);
            setSubmitStatus({ type: 'success', message: 'Uplink Established. Response pending.' });
            const resetState = { name: '', phone: '', email: '', subject: '', message: '' };
            formSchema.forEach(f => resetState[f.name] = '');
            setFormData(resetState);
        } catch (error) { 
            setSubmitStatus({ type: 'error', message: error.message || 'Transmission Interrupted.' }); 
        } finally { 
            setIsSubmitting(false); 
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-[#05070a] min-h-screen transition-colors duration-500 overflow-x-hidden">
            <ContactHero phrases={phrases} activePhraseIndex={activePhraseIndex} />

            <section className="max-w-7xl mx-auto px-4 py-20 -mt-32 relative z-30">
                <div className="grid lg:grid-cols-12 gap-10 items-start">
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white dark:bg-[#0a111f] rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-white/5 p-5 sm:p-6 md:p-12 shadow-2xl reveal active transition-colors duration-500">
                            <div className="flex items-center gap-5 mb-10">
                                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20"><Handshake className="w-7 h-7" /></div>
                                <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">We’re Here to Help</h2>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { icon: MapPin, title: 'Address', text: '203, Ratnamani Building, Dada Patil Wadi, Naupada, Thane West, Thane, Maharashtra 400602', color: 'text-blue-500' },
                                    { icon: Phone, title: 'Contact Number', text: '+91 816 938 4252 / +91 75067 43540', color: 'text-emerald-500' },
                                    { icon: Mail, title: 'Email Support', text: 'alliances@nettechindia.com', color: 'text-indigo-500' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start p-4 md:p-6 bg-gray-50 dark:bg-white/5 rounded-2xl md:rounded-[2rem] border border-gray-100 dark:border-white/5 transition-all hover:bg-gray-100 dark:hover:bg-white/10 group">
                                        <div className={`p-2.5 md:p-3.5 rounded-xl md:rounded-2xl bg-white dark:bg-[#050b1a] ${item.color} mr-4 md:mr-5 shadow-sm group-hover:scale-110 transition-transform flex-shrink-0`}><item.icon className="w-5 h-5 md:w-6 md:h-6" /></div>
                                        <div className="min-w-0 flex-1"><h3 className="font-black text-gray-400 dark:text-gray-500 uppercase text-[8px] md:text-[9px] mb-1 tracking-widest">{item.title}</h3><p className="text-gray-700 dark:text-gray-300 font-black text-xs md:text-sm tracking-tight leading-snug break-words">{item.text}</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* --- HQ MAP MARKER --- */}
                        <div className="bg-white dark:bg-[#0a111f] rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-white/5 p-4 overflow-hidden shadow-2xl reveal active">
                           <div className="relative w-full aspect-video md:aspect-square lg:aspect-auto lg:h-[400px] rounded-[1.5rem] overflow-hidden group border border-gray-100 dark:border-white/10">
                              <iframe 
                                src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=NetTech%20India%2C%20102%2C%20Ratnamani%20Building%2C%20Dada%20Patil%20Wadi%2C%20Opp%20ICICI%20ATM%2C%20Near%20Platform%20No.1%2C%20Thane%20West+(NetTech%20India)&t=&z=16&ie=UTF8&iwloc=B&output=embed"
                                className="absolute inset-0 w-full h-full border-0 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                title="NetTech India Office Location"
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                              ></iframe>
                              <div className="absolute bottom-4 right-4 z-10">
                                 <a 
                                  href="https://maps.app.goo.gl/5vcvVtxJMhz5UwEP9" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-blue-700 transition-all active:scale-95 border border-blue-500"
                                 >
                                    Verify Location <ExternalLink className="w-3.5 h-3.5" />
                                 </a>
                              </div>
                           </div>
                           <div className="mt-6 px-4 pb-4">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                                <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Marked: Suite 203, Ratnamani Building</p>
                              </div>
                              <p className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-4">LANDMARK: NAUPADA, THANE WEST</p>
                           </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 bg-white dark:bg-[#0a111f] rounded-[2rem] md:rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-gray-100 dark:border-white/5 p-5 sm:p-8 md:p-16 reveal active delay-200 transition-colors duration-500">
                        <div className="mb-10 space-y-2">
                            <h3 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Send a Message</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px]">We'll get back to you within 24 hours.</p>
                        </div>
                        <form className="space-y-6 md:space-y-10" onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                                <div className="space-y-2">
                                    <label className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 ml-2 tracking-[0.2em]">Full Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-5 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#050b1a] text-gray-900 dark:text-white focus:border-blue-500 outline-none font-black text-xs transition-all" placeholder="JOHN DOE" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 ml-2 tracking-[0.2em]">Primary Contact</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-5 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#050b1a] text-gray-900 dark:text-white focus:border-blue-500 outline-none font-black text-xs transition-all" placeholder="MOBILE NO." required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 ml-2 tracking-[0.2em]">Official Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-5 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#050b1a] text-gray-900 dark:text-white focus:border-blue-500 outline-none font-black text-xs transition-all" placeholder="EMAIL@DOMAIN.COM" required />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                                <div className={`space-y-2 ${formSchema.length === 0 ? 'md:col-span-2' : 'md:col-span-1'}`}>
                                    <CustomDropdown label="Inquiry Subject" icon={MessageSquare} options={inquirySubjects} value={formData.subject} onChange={handleDropdownChange} placeholder="Select subject" />
                                </div>
                                {formSchema.map((field, idx) => (
                                    <div key={field.id} className={`space-y-2 ${(idx === formSchema.length - 1 && (formSchema.length + 1) % 2 !== 0) ? 'md:col-span-2' : 'md:col-span-1'}`}>
                                        <label className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 ml-2 tracking-widest">{field.label}</label>
                                        <input type={field.type} name={field.name} value={formData[field.name] || ''} onChange={handleChange} className="w-full px-5 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#050b1a] text-gray-900 dark:text-white focus:border-blue-500 outline-none font-black text-xs transition-all" placeholder={`ENTER ${field.label.toUpperCase()}`} required={field.required} />
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 ml-2 tracking-[0.2em]">Transmission Payload</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} className="w-full px-5 md:px-8 py-5 md:py-8 rounded-2xl md:rounded-[2.5rem] border-2 border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#050b1a] text-gray-900 dark:text-white focus:border-blue-500 outline-none font-black text-xs transition-all min-h-[180px] resize-none" placeholder="ENTER DETAILED INQUIRY..." required></textarea>
                            </div>
                            {submitStatus.message && (
                                <div className={`p-4 rounded-xl text-center font-black text-[10px] uppercase tracking-widest ${submitStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'}`}>{submitStatus.message}</div>
                            )}
                            <button type="submit" disabled={isSubmitting} className="w-full group relative overflow-hidden bg-blue-700 text-white font-black py-5 md:py-6 rounded-xl md:rounded-full transition-all shadow-2xl hover:bg-blue-600 active:scale-[0.98] flex items-center justify-center gap-4 md:gap-6 text-[10px] md:text-[11px] uppercase tracking-[0.4em]">
                                <span className="relative z-10 flex items-center gap-3 md:gap-4">{isSubmitting ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <>Initiate Uplink <Send className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-2 group-hover:-translate-y-1" /></>}</span>
                                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12"></div>
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;