import React, { useState, useEffect, useMemo } from 'react';
import { Search, BookOpen, Briefcase, CheckCircle, ArrowRight, XCircle, Code2, Filter, X, Sparkles, Layers, Cpu, Network, Database, Smartphone, Globe, ShieldCheck, Infinity, Zap } from 'lucide-react';
import { JOB_DOMAINS } from '../constants';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';

const DomainsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const [activePhraseIndex, setActivePhraseIndex] = useState(0);
  const phrases = [
    "Find Your Future Pathway",
    "MNC Vetted Job Tracks",
    "High-Impact Roles Matrix",
    "Elite Skill Mapping"
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    const interval = setInterval(() => {
      setActivePhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredDomains = useMemo(() => {
    if (!searchTerm.trim()) return JOB_DOMAINS;
    const keywords = searchTerm.split(/[,| ]+/).map(k => k.trim().toLowerCase()).filter(k => k.length > 0);
    return JOB_DOMAINS.filter(domain => {
      return keywords.some(keyword => {
        if (domain.title.toLowerCase().includes(keyword)) return true;
        if (domain.skills.some(skill => skill.toLowerCase().includes(keyword))) return true;
        return domain.roles.some(role =>
          role.title.toLowerCase().includes(keyword) ||
          role.skills.some(skill => skill.toLowerCase().includes(keyword))
        );
      });
    });
  }, [searchTerm]);

  const handleOpenDomain = (domain) => {
    setSelectedDomain(domain);
    setSelectedRole(null);
  };

  const handleOpenRole = (role) => setSelectedRole(role);
  const closeModals = () => { setSelectedDomain(null); setSelectedRole(null); };
  const closeRoleModal = () => setSelectedRole(null);

  const handleApply = () => {
    if (selectedRole && selectedDomain) {
      navigate('/register', { state: { domain: selectedDomain.title, skills: selectedRole.skills } });
    }
  };

  const getRelatedRoles = (currentRole, allDomains) => {
    if (!currentRole) return [];
    const related = [];
    const currentSkills = new Set(currentRole.skills.map(s => s.toLowerCase()));

    allDomains.forEach(d => {
      d.roles.forEach(r => {
        if (r.title === currentRole.title) return;
        const matchingSkills = r.skills.filter(s => currentSkills.has(s.toLowerCase()));
        if (matchingSkills.length >= 1) {
          related.push({
            role: r,
            domainTitle: d.title,
            matchingSkills: matchingSkills
          });
        }
      });
    });
    return related.sort((a, b) => b.matchingSkills.length - a.matchingSkills.length).slice(0, 4);
  };

  return (
    <div className="bg-gray-50 dark:bg-[#0f172a] min-h-screen pb-32 transition-colors duration-500">
      {/* Standardized Hero */}
      <section className="bg-[#0a1e4d] text-white pt-60 pb-52 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-15%] left-[-5%] w-[700px] h-[700px] bg-indigo-600/20 rounded-full blur-[120px]"></div>

        <div className="absolute inset-0 z-0 pointer-events-none">
          <Cpu className="absolute top-[15%] left-[8%] w-12 h-12 text-blue-400 opacity-20 animate-float" />
          <Network className="absolute bottom-[20%] right-[10%] w-16 h-16 text-indigo-400 opacity-10 animate-float delay-500" />
          <Globe className="absolute top-[20%] right-[40%] w-8 h-8 text-blue-200 opacity-20 animate-float delay-700" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-blue-100 font-black uppercase text-[10px] tracking-[0.3em] mb-10 shadow-2xl relative overflow-hidden group mx-auto">
            <Infinity className="w-4 h-4 text-blue-300 animate-pulse shrink-0" />
            <div className="relative h-4 min-w-[280px] overflow-hidden flex items-center">
              {phrases.map((phrase, idx) => (
                <span key={idx} className={`absolute left-0 w-full transition-all duration-700 whitespace-nowrap text-center ${activePhraseIndex === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  {phrase}
                </span>
              ))}
            </div>
          </div>

          <h1 className="text-4xl md:text-8xl font-black mb-8 tracking-tighter uppercase leading-[0.9] reveal active">
            Map Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-400">Career Destiny</span>
          </h1>

          <p className="text-lg md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto font-bold opacity-80 leading-tight reveal active delay-100">
            Select a specialized track from our industry-vetted <span className="text-blue-300">156+ job roles</span> across top MNCs.
          </p>

          <div className="max-w-3xl mx-auto relative reveal active delay-300">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-focus-within:opacity-60 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-white rounded-full shadow-2xl overflow-hidden px-2 ring-1 ring-black/5">
                <div className="pl-6 pr-2"><Search className="h-6 w-6 text-blue-600" /></div>
                <input
                  type="text" placeholder="Search by role, domain, or required skill..."
                  className="block w-full py-6 pr-12 border-none bg-transparent text-gray-900 placeholder-gray-400 focus:ring-0 outline-none text-base md:text-xl font-bold"
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDomains.map((domain) => (
            <div key={domain.id} className="bg-white dark:bg-[#1a2332] rounded-[2.5rem] shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 flex flex-col h-full border border-gray-100 dark:border-gray-800 reveal group hover:-translate-y-3 overflow-hidden">
              <div className="p-10 flex-grow">
                <div className="flex justify-between items-start mb-8 gap-4">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{domain.title}</h3>
                  <div className="bg-blue-50 dark:bg-blue-600/10 border border-blue-100 dark:border-blue-500/20 px-4 py-2 rounded-full shrink-0 shadow-inner">
                    <span className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{domain.roles.length} Pathways</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-10 line-clamp-3 font-medium">{domain.description}</p>
                <div className="pt-8 border-t border-gray-100 dark:border-gray-700/40">
                  <h4 className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-5">Skill Matrix</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {domain.skills.slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-10 pb-10">
                <button onClick={() => handleOpenDomain(domain)} className="w-full flex items-center justify-center bg-blue-700 hover:bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all active:scale-95 group/btn shadow-lg shadow-blue-500/20">
                  Enter Roadmap <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Domain Roadmap Modal */}
      <Modal isOpen={!!selectedDomain && !selectedRole} onClose={closeModals} title={selectedDomain?.title}>
        {selectedDomain && (
          <div className="space-y-10">
            <div>
              <h4 className="text-lg font-black text-gray-900 dark:text-white mb-3 flex items-center uppercase tracking-tighter">
                <BookOpen className="w-5 h-5 mr-3 text-blue-600" />
                Strategic Overview
              </h4>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 font-medium">
                {selectedDomain.description}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center uppercase tracking-tighter">
                <Zap className="w-5 h-5 mr-3 text-blue-600" />
                Domain Skill Matrix
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedDomain.skills.map((skill, idx) => (
                  <span key={idx} className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-900/40">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center uppercase tracking-tighter">
                <Briefcase className="w-5 h-5 mr-3 text-blue-600" />
                Available Specializations
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {selectedDomain.roles.map((role, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOpenRole(role)}
                    className="text-left p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transition-all bg-white dark:bg-gray-900 group active:scale-[0.98]"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-tight group-hover:text-blue-600 transition-colors">{role.title}</h5>
                      <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-700 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2 font-medium leading-relaxed">{role.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Role Detail Modal */}
      <Modal isOpen={!!selectedRole} onClose={closeRoleModal} title={selectedRole?.title}>
        {selectedRole && (
          <div className="space-y-10">
            <button
              onClick={closeRoleModal}
              className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 mb-2 transition-colors active:translate-x-[-4px]"
            >
              ← Back to {selectedDomain?.title || 'Domain'}
            </button>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-[2rem] border border-blue-100 dark:border-blue-900/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><Sparkles className="w-20 h-20" /></div>
              <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] mb-4">Role Intelligence</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-bold italic text-lg">
                "{selectedRole.description}"
              </p>
            </div>

            <div>
              <h4 className="text-lg font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tighter">Required Competencies</h4>
              <ul className="grid sm:grid-cols-2 gap-3">
                {selectedRole.skills.map((skill, idx) => (
                  <li key={idx} className="flex items-center text-gray-900 dark:text-white bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm font-black uppercase text-[10px] tracking-widest">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Alternative Pathways</h4>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                  <Zap className="w-3 h-3 text-blue-500" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Intelligence Matrix</span>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                {getRelatedRoles(selectedRole, JOB_DOMAINS).length > 0 ? (
                  getRelatedRoles(selectedRole, JOB_DOMAINS).map((item, idx) => (
                    <div key={idx} className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl hover:bg-white dark:hover:bg-gray-800 transition-all border border-gray-100 dark:border-gray-800 group/alt relative overflow-hidden shadow-sm">
                      <div className="absolute inset-y-0 left-0 w-1.5 bg-blue-500 transform -translate-x-full group-hover/alt:translate-x-0 transition-transform"></div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-center sm:text-left">
                        <div className="flex-1">
                          <p className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-tight group-hover/alt:text-blue-600 transition-colors mb-1">{item.role.title}</p>
                          <p className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mb-4">Domain: {item.domainTitle}</p>

                          <div className="space-y-2">
                            <p className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">Matched Competencies</p>
                            <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                              {item.matchingSkills.map((mSkill, mIdx) => (
                                <span key={mIdx} className="text-[9px] font-black uppercase px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md border border-blue-100 dark:border-blue-900/40">
                                  {mSkill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (selectedDomain?.title === item.domainTitle) {
                              handleOpenRole(item.role);
                            } else {
                              const newDomain = JOB_DOMAINS.find(d => d.title === item.domainTitle);
                              if (newDomain) {
                                setSelectedDomain(newDomain);
                                handleOpenRole(item.role);
                              }
                            }
                          }}
                          className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg active:scale-90 transition-all hover:bg-blue-700 shrink-0 border border-blue-500/20 flex items-center justify-center mx-auto sm:mx-0"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl opacity-40">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Zero Direct Substitutions Found</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-gray-100 dark:border-gray-800 text-center">
              <button
                onClick={handleApply}
                className="w-full group relative inline-flex items-center justify-center bg-blue-700 text-white font-black py-6 px-12 rounded-full hover:bg-blue-800 transition-all duration-300 shadow-2xl active:scale-95 uppercase tracking-[0.2em] text-xs overflow-hidden"
              >
                <span className="relative z-10">Activate Application</span>
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"></div>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DomainsPage;