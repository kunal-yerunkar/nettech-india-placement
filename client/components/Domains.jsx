import React, { useState, useMemo, useEffect } from 'react';
import { api } from '../services/api';
import { Search, ArrowRight, BookOpen, Briefcase, CheckCircle, Sparkles, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './Modal';

const Domains = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const data = await api.getDomains();
      setDomains(data);
    };
    load();
  }, []);

  const filteredDomains = useMemo(() => {
    if (!searchTerm.trim()) return domains.slice(0, 6);
    const term = searchTerm.toLowerCase();
    return domains.filter(domain => {
      if (domain.title.toLowerCase().includes(term)) return true;
      if (domain.skills.some(skill => skill.toLowerCase().includes(term))) return true;
      return domain.roles.some(role =>
        role.title.toLowerCase().includes(term) ||
        role.skills.some(skill => skill.toLowerCase().includes(term))
      );
    });
  }, [searchTerm, domains]);

  const handleOpenDomain = (domain) => {
    setSelectedDomain(domain);
    setSelectedRole(null);
  };

  const handleOpenRole = (role) => {
    setSelectedRole(role);
  };

  const closeModals = () => {
    setSelectedDomain(null);
    setSelectedRole(null);
  };

  const closeRoleModal = () => {
    setSelectedRole(null);
  };

  const handleApply = () => {
    if (selectedRole && selectedDomain) {
      navigate('/register', {
        state: {
          domain: selectedDomain.title,
          skills: selectedRole.skills
        }
      });
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
    <section id="domains" className="py-24 bg-gray-50 dark:bg-[#0f172a] scroll-mt-24 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 reveal active">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-6">
            Industry <span className="text-blue-600">Domains</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-bold uppercase tracking-widest leading-tight mb-12">
            Map your potential to specialized professional tracks vetted by global hiring partners.
          </p>

          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-10 group-focus-within:opacity-30 transition duration-1000"></div>
            <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-full shadow-xl overflow-hidden px-2 border border-gray-100 dark:border-gray-800">
              <div className="pl-6 pr-2"><Search className="h-5 w-5 text-blue-600" /></div>
              <input
                type="text"
                placeholder="Search job roles, domains, or competencies..."
                className="block w-full py-5 pr-12 border-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 outline-none text-sm font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDomains.map((domain, index) => (
            <div
              key={domain.id}
              className="bg-white dark:bg-[#1a2332] rounded-[2.5rem] shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 flex flex-col h-full border border-gray-100 dark:border-gray-800 reveal active group hover:-translate-y-3 overflow-hidden"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="p-10 flex-grow">
                <div className="flex justify-between items-start mb-8 gap-4">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase">
                    {domain.title}
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-600/10 border border-blue-100 dark:border-blue-500/20 px-4 py-2 rounded-full shrink-0 shadow-inner">
                    <span className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                      {domain.roles.length} Pathways
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-10 line-clamp-3 font-medium">
                  {domain.description}
                </p>
                <div className="pt-8 border-t border-gray-100 dark:border-gray-700/40">
                  <h4 className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mb-5">Skill Matrix</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {domain.skills.slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700">
                        {skill}
                      </span>
                    ))}
                    {domain.skills.length > 4 && (
                      <span className="text-[10px] text-gray-400 font-bold ml-2 flex items-center">+{domain.skills.length - 4}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-10 pb-10">
                <button
                  onClick={() => handleOpenDomain(domain)}
                  className="w-full flex items-center justify-center bg-blue-700 hover:bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all active:scale-95 group/btn shadow-lg shadow-blue-500/20"
                >
                  Enter Roadmap
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center reveal active">
          <Link
            to="/domains"
            className="group relative inline-flex items-center justify-center px-12 py-5 bg-white dark:bg-gray-900 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              View All Portfolios
              <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>

      {/* --- DOMAIN MODAL --- */}
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

      {/* --- ROLE DETAIL MODAL --- */}
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
                {getRelatedRoles(selectedRole, domains).length > 0 ? (
                  getRelatedRoles(selectedRole, domains).map((item, idx) => (
                    <div key={idx} className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl hover:bg-white dark:hover:bg-gray-800 transition-all border border-gray-100 dark:border-gray-800 group/alt relative overflow-hidden shadow-sm">
                      <div className="absolute inset-y-0 left-0 w-1.5 bg-blue-500 transform -translate-x-full group-hover/alt:translate-x-0 transition-transform"></div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-tight group-hover/alt:text-blue-600 transition-colors mb-1">{item.role.title}</p>
                          <p className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mb-4">Domain: {item.domainTitle}</p>

                          <div className="flex flex-wrap gap-1.5">
                            {item.matchingSkills.map((mSkill, mIdx) => (
                              <span key={mIdx} className="text-[9px] font-black uppercase px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md border border-blue-100 dark:border-blue-900/40">
                                {mSkill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (selectedDomain?.title === item.domainTitle) {
                              handleOpenRole(item.role);
                            } else {
                              const newDomain = domains.find(d => d.title === item.domainTitle);
                              if (newDomain) {
                                setSelectedDomain(newDomain);
                                handleOpenRole(item.role);
                              }
                            }
                          }}
                          className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg active:scale-90 transition-all hover:bg-blue-700 shrink-0 border border-blue-500/20 flex items-center justify-center"
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
    </section>
  );
};

export default Domains;