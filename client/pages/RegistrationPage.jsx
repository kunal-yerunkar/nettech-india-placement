import React, { useState, useEffect, useMemo } from 'react';
import { User, Phone, Mail, GraduationCap, Calendar, Building2, CheckCircle, Send, AlertCircle, Briefcase, Code2, RefreshCcw, Sparkles, X, Compass, MousePointer2, Calculator, Server, PencilRuler, Rocket, Globe, ArrowRight, Map, MapPin } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { COLLEGE_LIST } from '../constants';
import CustomDropdown from '../components/CustomDropdown';
import Modal from '../components/Modal';

const RegistrationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const prefillData = location.state || {};

    const [formSchema, setFormSchema] = useState([]);
    const [jobDomains, setJobDomains] = useState([]);
    const [domainClusters, setDomainClusters] = useState({});
    const [stateCityData, setStateCityData] = useState({});

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        highestQualification: '',
        passingYear: '',
        collegeName: '',
        interestedDomain: prefillData.domain || '',
        skills: prefillData.skills || []
    });

    const [isManualCollege, setIsManualCollege] = useState(false);
    const [manualCollegeName, setManualCollegeName] = useState('');
    const [errors, setErrors] = useState({});
    const [submissionError, setSubmissionError] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [wizardInterest, setWizardInterest] = useState(null);

    useEffect(() => {
        const load = async () => {
            const schema = await api.getFormSchema('student');
            const domains = await api.getDomains();
            const geo = await api.getStateCityData();
            const clusters = await api.getDomainClusters();

            setFormSchema(schema);
            setJobDomains(domains);
            setStateCityData(geo);
            setDomainClusters(clusters);

            const dynamicState = {};
            schema.forEach(field => {
                dynamicState[field.name] = '';
            });
            setFormData(prev => ({ ...prev, ...dynamicState }));
        };
        load();
    }, []);

    const indianStates = useMemo(() => Object.keys(stateCityData).sort(), [stateCityData]);

    const activeDomainObj = useMemo(() => {
        return jobDomains.find(d => d.title === formData.interestedDomain);
    }, [formData.interestedDomain, jobDomains]);

    const activeCluster = useMemo(() => {
        if (!activeDomainObj) return null;
        for (const [clusterKey, domainIds] of Object.entries(domainClusters)) {
            if (domainIds.includes(activeDomainObj.id)) return clusterKey;
        }
        return null;
    }, [activeDomainObj, domainClusters]);

    const suggestedSkills = useMemo(() => {
        if (!activeDomainObj || !activeCluster) return [];
        let suggestions = new Set();
        activeDomainObj.skills.forEach(s => suggestions.add(s));
        const clusterDomainIds = domainClusters[activeCluster] || [];
        jobDomains.filter(d => clusterDomainIds.includes(d.id)).forEach(d => {
            d.skills.forEach(s => suggestions.add(s));
            d.roles.forEach(r => r.skills.forEach(rs => suggestions.add(rs)));
        });
        const currentSkillsLow = formData.skills.map(s => s.toLowerCase());
        return Array.from(suggestions)
            .filter(s => !currentSkillsLow.includes(s.toLowerCase()))
            .slice(0, 10);
    }, [activeDomainObj, activeCluster, formData.skills, jobDomains, domainClusters]);

    const profileStrength = useMemo(() => {
        if (!formData.interestedDomain) return 0;
        if (formData.skills.length === 0) return 10;
        const clusterDomainIds = activeCluster ? domainClusters[activeCluster] : [];
        const clusterSkills = new Set();
        jobDomains.filter(d => clusterDomainIds.includes(d.id)).forEach(d => {
            d.skills.forEach(s => clusterSkills.add(s.toLowerCase()));
            d.roles.forEach(r => r.skills.forEach(rs => clusterSkills.add(rs.toLowerCase())));
        });
        const relevantCount = formData.skills.filter(s => clusterSkills.has(s.toLowerCase())).length;
        const ratio = relevantCount / formData.skills.length;
        let score = (relevantCount * 5) + (ratio * 40);
        return Math.min(100, Math.floor(score));
    }, [formData.skills, formData.interestedDomain, activeCluster, jobDomains, domainClusters]);

    const strengthLabel = useMemo(() => {
        if (profileStrength < 30) return { text: 'Diluted', color: 'text-red-500', bg: 'bg-red-500', icon: AlertCircle };
        if (profileStrength < 70) return { text: 'Balanced', color: 'text-orange-500', bg: 'bg-orange-500', icon: CheckCircle };
        if (profileStrength < 90) return { text: 'Professional', color: 'text-emerald-500', bg: 'bg-emerald-500', icon: CheckCircle };
        return { text: 'Corporate Grade', color: 'text-indigo-400', bg: 'bg-indigo-500', icon: Sparkles };
    }, [profileStrength]);

    const handleApplyPath = (domainTitle) => {
        const domainObj = jobDomains.find(d => d.title === domainTitle);
        const basicSkills = domainObj ? domainObj.skills.slice(0, 6) : [];
        setFormData(prev => ({ ...prev, interestedDomain: domainTitle, skills: basicSkills }));
        setIsWizardOpen(false);
    };

    const handleAddSkill = (skill) => {
        if (formData.skills.length >= 12) return;
        if (!formData.skills.find(s => s.toLowerCase() === skill.toLowerCase())) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone' && (!/^\d*$/.test(value) || value.length > 10)) return;
        if (name === 'manualCollegeName') {
            setManualCollegeName(value);
            setFormData(prev => ({ ...prev, collegeName: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        if (submissionError) setSubmissionError(null);
    };

    const handleDropdownChange = (name, value) => {
        if (name === 'interestedDomain') {
            const domainObj = jobDomains.find(d => d.title === value);
            const basicSkills = domainObj ? domainObj.skills.slice(0, 6) : [];
            setFormData(prev => ({ ...prev, [name]: value, skills: basicSkills }));
        } else if (name === 'state') {
            setFormData(prev => ({ ...prev, state: value, city: '' }));
        } else if (name === 'collegeName') {
            if (value === "OTHER (MANUAL ENTRY)") {
                setIsManualCollege(true);
                setFormData(prev => ({ ...prev, [name]: '' }));
                setManualCollegeName('');
            } else {
                setIsManualCollege(false);
                setFormData(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        if (submissionError) setSubmissionError(null);
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Required";
        if (!formData.phone || formData.phone.length !== 10) newErrors.phone = "Valid mobile required";
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email required";
        if (!formData.highestQualification) newErrors.highestQualification = "Required";
        if (!formData.passingYear) newErrors.passingYear = "Required";

        if (!formData.collegeName || !formData.collegeName.trim()) {
            newErrors.collegeName = "Required";
        }

        if (!formData.interestedDomain) newErrors.interestedDomain = "Required";
        if (formData.skills.length === 0) newErrors.skills = "Add skills";

        formSchema.forEach(field => {
            if (field.required && !formData[field.name]?.trim()) {
                newErrors[field.name] = "Required";
            }
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const firstErrorKey = Object.keys(newErrors)[0];
            const element = document.getElementById(`field-${firstErrorKey}`) || document.getElementsByName(firstErrorKey)[0];
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const input = element.querySelector('input');
                if (input) input.focus();
            }
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionError(null);
        if (validate()) {
            setIsSubmitting(true);
            try {
                const payload = { ...formData, skills: formData.skills.join(', ') };
                await api.registerStudent(payload);
                setIsSubmitted(true);
                window.scrollTo(0, 0);
            } catch (error) {
                setSubmissionError(error.message);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const availableCities = useMemo(() => {
        if (!formData.state) return [];
        return stateCityData[formData.state] || [];
    }, [formData.state, stateCityData]);

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-20">
                <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl p-10 text-center border border-gray-100 dark:border-gray-800">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-8" />
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Profile Secured</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-10">Uplink verified. Your deployment roadmap is being processed.</p>
                    <button onClick={() => navigate('/')} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all uppercase tracking-widest text-[10px]">Back to Base</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 transition-colors overflow-x-hidden">
            <section className="bg-[#050e26] text-white pt-52 pb-48 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '45px 45px' }}></div>
                <div className="max-w-4xl mx-auto px-4 relative z-10 reveal active">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-blue-300 font-black uppercase text-[9px] tracking-[0.4em] mb-8">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Authentication Required
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter uppercase leading-[0.9]">Secure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Position</span></h1>
                    <p className="text-lg md:text-2xl text-blue-200 font-bold opacity-80 uppercase tracking-widest leading-none mt-4">Register & Unlock Career Streams</p>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 -mt-24 relative z-20">
                <div className="bg-white dark:bg-[#0a0f18] rounded-[2rem] md:rounded-[3rem] shadow-2xl p-5 sm:p-10 md:p-14 border border-gray-100 dark:border-white/5">

                    {submissionError && (
                        <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-900/50 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="p-3 bg-red-500 rounded-2xl text-white shadow-lg shadow-red-500/20">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase text-red-500 tracking-widest leading-none mb-1">Registration Conflict</p>
                                <p className="text-sm font-bold text-red-700 dark:text-red-400">{submissionError}</p>
                            </div>
                            <button onClick={() => setSubmissionError(null)} className="ml-auto p-2 text-red-400 hover:text-red-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-8">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-[0.2em]">Legal Full Name</label>
                                <div className="relative group w-full">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={`w-full pl-14 pr-4 py-4 border-2 rounded-2xl bg-gray-50 dark:bg-gray-900/50 dark:text-white focus:border-blue-500 outline-none font-bold placeholder:text-gray-300 dark:placeholder:text-gray-700 ${errors.fullName ? 'border-red-500 bg-red-50/50' : 'border-gray-100 dark:border-gray-800'}`} placeholder="As per documents" />
                                </div>
                            </div>
                            <div className="w-full">
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-[0.2em]">Contact Email</label>
                                <div className="relative group w-full">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full pl-14 pr-4 py-4 border-2 rounded-2xl bg-gray-50 dark:bg-gray-900/50 dark:text-white focus:border-blue-500 outline-none font-bold placeholder:text-gray-300 dark:placeholder:text-gray-700 ${errors.email ? 'border-red-500 bg-red-50/50' : 'border-gray-100 dark:border-gray-800'}`} placeholder="Official Email" />
                                </div>
                            </div>
                            <div className="w-full">
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-[0.2em]">Phone (+91)</label>
                                <div className="relative group w-full">
                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`w-full pl-14 pr-4 py-4 border-2 rounded-2xl bg-gray-50 dark:bg-gray-900/50 dark:text-white focus:border-blue-500 outline-none font-bold placeholder:text-gray-300 dark:placeholder:text-gray-700 ${errors.phone ? 'border-red-500 bg-red-50/50' : 'border-gray-100 dark:border-gray-800'}`} placeholder="Mobile Number" />
                                </div>
                            </div>

                            {/* DYNAMIC ADMIN FIELDS */}
                            {(() => {
                                const stateField = formSchema.find(f => f.name.toLowerCase() === 'state');
                                const cityField = formSchema.find(f => f.name.toLowerCase() === 'city');
                                const otherFields = formSchema.filter(f => f.name.toLowerCase() !== 'state' && f.name.toLowerCase() !== 'city');

                                return (
                                    <>
                                        {(stateField || cityField) && (
                                            <div className="md:col-span-2 grid md:grid-cols-2 gap-x-8 gap-y-8">
                                                {stateField && (
                                                    <div className="w-full" id={`field-${stateField.name}`}>
                                                        <CustomDropdown
                                                            label={stateField.label}
                                                            icon={Map}
                                                            options={indianStates}
                                                            value={formData[stateField.name]}
                                                            onChange={(val) => handleDropdownChange(stateField.name, val)}
                                                            placeholder="Select State"
                                                            searchable={true}
                                                            error={errors[stateField.name]}
                                                        />
                                                    </div>
                                                )}
                                                {cityField && (
                                                    <div className="w-full" id={`field-${cityField.name}`}>
                                                        <CustomDropdown
                                                            label={cityField.label}
                                                            icon={MapPin}
                                                            options={availableCities}
                                                            value={formData[cityField.name]}
                                                            onChange={(val) => handleDropdownChange(cityField.name, val)}
                                                            placeholder={formData.state ? "Select City" : "Select State First"}
                                                            searchable={true}
                                                            error={errors[cityField.name]}
                                                            disabled={!formData.state}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {otherFields.map((field, idx) => {
                                            const isLastAndOdd = idx === otherFields.length - 1 && otherFields.length % 2 !== 0;
                                            return (
                                                <div key={field.id} className={`w-full ${isLastAndOdd ? 'md:col-span-2' : 'md:col-span-1'}`}>
                                                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-[0.2em]">{field.label}</label>
                                                    <input
                                                        type={field.type}
                                                        name={field.name}
                                                        value={formData[field.name] || ''}
                                                        onChange={handleChange}
                                                        className={`w-full px-6 py-4 border-2 rounded-2xl bg-gray-50 dark:bg-gray-900/50 dark:text-white focus:border-blue-500 outline-none font-bold placeholder:text-gray-300 dark:placeholder:text-gray-700 ${errors[field.name] ? 'border-red-500 bg-red-50/50' : 'border-gray-100 dark:border-gray-800'}`}
                                                        placeholder={`Enter ${field.label}`}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </>
                                );
                            })()}

                            <div className="w-full" id="field-highestQualification">
                                <CustomDropdown label="Highest Qualification" icon={GraduationCap} options={["B.E / B.Tech", "BCA", "B.Sc IT/CS", "Diploma", "B.Com", "MCA", "Other"]} value={formData.highestQualification} onChange={(val) => handleDropdownChange('highestQualification', val)} error={errors.highestQualification} />
                            </div>
                            <div className="w-full" id="field-passingYear">
                                <CustomDropdown label="Passing Year" icon={Calendar} options={Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() + 2 - i).toString())} value={formData.passingYear} onChange={(val) => handleDropdownChange('passingYear', val)} error={errors.passingYear} />
                            </div>

                            <div className="md:col-span-2" id="field-collegeName">
                                <CustomDropdown
                                    label="Institution Name"
                                    icon={Building2}
                                    options={COLLEGE_LIST}
                                    value={isManualCollege ? "OTHER (MANUAL ENTRY)" : formData.collegeName}
                                    onChange={(val) => handleDropdownChange('collegeName', val)}
                                    searchable={true}
                                    placeholder="Search your college or university"
                                    error={errors.collegeName}
                                />

                                {isManualCollege && (
                                    <div className="mt-4 animate-in slide-in-from-top-2 duration-500">
                                        <label className="block text-[10px] font-black uppercase text-blue-500 mb-2 ml-1 tracking-[0.2em]">Enter Manual Identity</label>
                                        <div className="relative group w-full">
                                            <MousePointer2 className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
                                            <input
                                                type="text"
                                                name="manualCollegeName"
                                                value={manualCollegeName}
                                                onChange={handleChange}
                                                className={`w-full pl-14 pr-4 py-4 border-2 rounded-2xl bg-blue-50/30 dark:bg-blue-900/10 dark:text-white border-blue-200 dark:border-blue-800 focus:border-blue-500 outline-none font-bold placeholder:text-blue-300 ${errors.collegeName ? 'border-red-500 bg-red-50/50' : ''}`}
                                                placeholder="Type full name of your institution"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-800" id="field-interestedDomain">
                                <CustomDropdown label="Target Career Domain" icon={Briefcase} options={jobDomains.map(d => d.title)} value={formData.interestedDomain} onChange={(val) => handleDropdownChange('interestedDomain', val)} searchable={true} error={errors.interestedDomain} />
                                <button type="button" onClick={() => { setWizardInterest(null); setIsWizardOpen(true); }} className="mt-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 ml-1"><Compass className="w-3.5 h-3.5" /> Discovery Engine</button>
                            </div>
                            <div className="md:col-span-2" id="field-skills">
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1 tracking-[0.2em]">Industry Skills ({formData.skills.length}/12)</label>
                                <div className={`p-4 border-2 rounded-[1.5rem] min-h-[100px] flex flex-wrap gap-2 items-start bg-gray-50 dark:bg-gray-900/50 ${errors.skills ? 'border-red-500 bg-red-50/50' : 'border-gray-100 dark:border-gray-800'}`}>
                                    {formData.skills.length === 0 ? <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest p-4 opacity-40">Add competencies below</p> : formData.skills.map((skill, idx) => (
                                        <span key={idx} className="bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg flex items-center gap-2">
                                            {skill} <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveSkill(skill)} />
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {suggestedSkills.map((skill, idx) => (
                                        <button key={idx} type="button" onClick={() => handleAddSkill(skill)} className="px-3 py-1.5 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 text-[10px] font-black rounded-lg border border-gray-100 dark:border-gray-700">+ {skill}</button>
                                    ))}
                                </div>

                                <div className="mt-12 px-6 py-8 bg-gray-50 dark:bg-[#0a0f18] rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-6 shadow-xl transition-colors duration-500">
                                    <div className={`p-4 bg-white dark:bg-[#121926] rounded-2xl border border-gray-100 dark:border-gray-800 ${strengthLabel.color} shadow-sm`}><strengthLabel.icon className="w-8 h-8" /></div>
                                    <div className="flex-1 w-full space-y-2">
                                        <div className="flex justify-between items-center"><p className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest">Career Profile Strength</p><p className={`text-xs font-black uppercase ${strengthLabel.color}`}>{strengthLabel.text} — {profileStrength}%</p></div>
                                        <div className="h-2.5 w-full bg-gray-200 dark:bg-[#1a2333] rounded-full overflow-hidden shadow-inner"><div className={`h-full transition-all duration-1000 ${strengthLabel.bg} shadow-[0_0_10px_rgba(37,99,235,0.4)]`} style={{ width: `${profileStrength}%` }}></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                            <button type="submit" disabled={isSubmitting || profileStrength < 20} className="w-full bg-blue-700 text-white font-black py-6 rounded-2xl hover:bg-blue-700 shadow-xl transition-all disabled:opacity-40 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4">
                                {isSubmitting ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <>Finalize Deployment <Send className="w-5 h-5" /></>}
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <style>{`
                .border-red-500 {
                    border-color: #ef4444 !important;
                    background-color: rgba(254, 242, 242, 0.5) !important;
                }
                .dark .border-red-500 {
                    background-color: rgba(69, 10, 10, 0.2) !important;
                }
            `}</style>

            <Modal isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} title="Path Discovery">
                <div className="space-y-6">
                    {!wizardInterest ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { id: 'dev', label: 'Web Development', icon: Code2, matches: [5, 6, 4] },
                                { id: 'infra', label: 'Cyber Security', icon: Server, matches: [7, 2, 3] },
                                { id: 'data', label: 'Data Analytics', icon: Calculator, matches: [1, 11] },
                                { id: 'design', label: 'Graphic Design', icon: PencilRuler, matches: [15, 8] }
                            ].map(item => (
                                <button key={item.id} onClick={() => setWizardInterest(item)} className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-transparent hover:border-blue-500 transition-all text-left flex items-center gap-4 group">
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl text-blue-600"><item.icon className="w-6 h-6" /></div>
                                    <span className="text-xs font-black uppercase text-gray-900 dark:text-gray-100">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {jobDomains.filter(d => wizardInterest.matches.includes(d.id)).map(domain => (
                                <button key={domain.id} onClick={() => handleApplyPath(domain.title)} className="w-full p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-blue-500">
                                    <div className="text-left"><h4 className="font-black text-gray-900 dark:text-white uppercase text-sm mb-1">{domain.title}</h4><p className="text-[10px] text-gray-500 line-clamp-1">{domain.description}</p></div>
                                    <ArrowRight className="w-5 h-5 text-gray-700 group-hover:text-blue-500" />
                                </button>
                            ))}
                            <button onClick={() => setWizardInterest(null)} className="w-full py-4 text-[9px] font-black uppercase text-gray-500">Go Back</button>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default RegistrationPage;