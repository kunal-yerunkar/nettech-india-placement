import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Building, MessageSquare, LogOut, LayoutDashboard,
  Search, RefreshCw, Plus, Edit2, Trash2, Video,
  CheckCircle, AlertCircle, TrendingUp, Save, X, Image as ImageIcon,
  UserCheck, Briefcase, Mail, Calendar, GraduationCap, ClipboardList,
  Layers, ChevronUp, ChevronDown, Wand2, Eye, Upload, FileVideo,
  FileImage, Trash, PlayCircle, ImageOff, MapPin, Hash, BookOpen, User,
  Download, FileSpreadsheet, BriefcaseIcon, Sparkles, Map, School, Settings2,
  ToggleLeft, ToggleRight, Type as TypeIcon, FileJson, Zap, Activity, Filter,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { JOB_DOMAINS, DOMAIN_CLUSTERS } from '../constants';

const XLSX = window.XLSX;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('archives');
  const [architectTab, setArchitectTab] = useState('student');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewOnly, setViewOnly] = useState(false);
  const [toast, setToast] = useState(null);

  const [filePreview, setFilePreview] = useState(null);
  const [currentRoles, setCurrentRoles] = useState([]);
  const fileInputRef = useRef(null);

  const [tempSkills, setTempSkills] = useState('');
  const [tempDomain, setTempDomain] = useState('');

  const [archives, setArchives] = useState([]);
  const [reels, setReels] = useState([]);
  const [partners, setPartners] = useState([]);
  const [domains, setDomains] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [partnerLeads, setPartnerLeads] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  const [studentSchema, setStudentSchema] = useState([]);
  const [partnerSchema, setPartnerSchema] = useState([]);
  const [inquirySchema, setInquirySchema] = useState([]);

  // Workflow Dropdown State
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Pending');
  const workflowRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { navigate('/admin'); return; }
    loadAllData();

    const handleClickOutside = (e) => {
      if (workflowRef.current && !workflowRef.current.contains(e.target)) {
        setIsWorkflowOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [navigate]);

  const loadAllData = async () => {
    setArchives(await api.getStudents());
    setReels(await api.getReels());
    setPartners(await api.getPartners());
    setDomains(await api.getDomains());
    setRegistrations(await api.getStudentLeads());
    setPartnerLeads(await api.getPartnerLeads());
    setInquiries(await api.getInquiries());

    setStudentSchema(await api.getFormSchema('student'));
    setPartnerSchema(await api.getFormSchema('partner'));
    setInquirySchema(await api.getFormSchema('inquiry'));
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const statusConfigs = {
    partner: {
      'Pending': { label: 'INITIAL UPLINK', color: 'text-amber-500', bg: 'bg-amber-500/10' },
      'Qualified': { label: 'QUALIFIED', color: 'text-blue-500', bg: 'bg-blue-500/10' },
      'Negotiation': { label: 'CONTRACT PENDING', color: 'text-purple-500', bg: 'bg-purple-500/10' },
      'Active': { label: 'ONBOARDED', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
      'Rejected': { label: 'ARCHIVED', color: 'text-red-500', bg: 'bg-red-500/10' }
    },
    inquiry: {
      'Pending': { label: 'UNREAD', color: 'text-amber-500', bg: 'bg-amber-500/10' },
      'Processing': { label: 'PROCESSING', color: 'text-blue-500', bg: 'bg-blue-500/10' },
      'Responded': { label: 'RESPONDED', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
      'Resolved': { label: 'RESOLVED', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
      'Spam': { label: 'SPAM FILTER', color: 'text-red-500', bg: 'bg-red-500/10' }
    }
  };

  const profileStrength = useMemo(() => {
    if (!tempDomain) return 0;
    const skillsArray = tempSkills.split(',').map(s => s.trim().toLowerCase()).filter(s => s);
    if (skillsArray.length === 0) return 10;
    const domainObj = JOB_DOMAINS.find(d => d.title === tempDomain);
    if (!domainObj) return 10;
    let activeClusterKey = null;
    for (const [key, ids] of Object.entries(DOMAIN_CLUSTERS)) {
      if (ids.includes(domainObj.id)) { activeClusterKey = key; break; }
    }
    const clusterDomainIds = activeClusterKey ? DOMAIN_CLUSTERS[activeClusterKey] : [domainObj.id];
    const clusterSkills = new Set();
    JOB_DOMAINS.filter(d => clusterDomainIds.includes(d.id)).forEach(d => {
      d.skills.forEach(s => clusterSkills.add(s.toLowerCase()));
      d.roles.forEach(r => r.skills.forEach(rs => clusterSkills.add(rs.toLowerCase())));
    });
    const relevantCount = skillsArray.filter(s => clusterSkills.has(s)).length;
    const ratio = relevantCount / skillsArray.length;
    let score = (relevantCount * 5) + (ratio * 40);
    return Math.min(100, Math.floor(score));
  }, [tempSkills, tempDomain]);

  const strengthLabel = useMemo(() => {
    if (profileStrength < 30) return { text: 'Diluted', color: 'text-red-500', bg: 'bg-red-500', icon: AlertCircle };
    if (profileStrength < 70) return { text: 'Balanced', color: 'text-orange-500', bg: 'bg-orange-500', icon: CheckCircle };
    if (profileStrength < 90) return { text: 'Professional', color: 'text-emerald-500', bg: 'bg-emerald-500', icon: CheckCircle };
    return { text: 'Corporate Grade', color: 'text-indigo-400', bg: 'bg-indigo-500', icon: Sparkles };
  }, [profileStrength]);

  const getFormattedDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][now.getMonth()];
    return `${day}_${month}_${now.getFullYear()}`;
  };

  const sanitizeDataForExcel = (data) => {
    return data.map(item => {
      const { image, logo, url, roles, ...sanitized } = item;
      return sanitized;
    });
  };

  const handleExportCurrent = () => {
    if (!XLSX) { showToast("Excel Engine unavailable."); return; }
    const data = getFilteredData();
    if (!data.length) { showToast("No records."); return; }
    const sanitized = sanitizeDataForExcel(data);
    const worksheet = XLSX.utils.json_to_sheet(sanitized);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeTab);
    XLSX.writeFile(workbook, `NetTech_${activeTab}_${getFormattedDate()}.xlsx`);
    showToast("Export transmission complete.");
  };

  const handleExportMasterLeads = () => {
    if (!XLSX) { showToast("Excel Engine unavailable."); return; }
    const workbook = XLSX.utils.book_new();
    if (registrations.length) XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(sanitizeDataForExcel(registrations)), "Student Leads");
    if (partnerLeads.length) XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(sanitizeDataForExcel(partnerLeads)), "Partner Leads");
    if (inquiries.length) XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(sanitizeDataForExcel(inquiries)), "Web Inquiries");
    if (workbook.SheetNames.length === 0) { showToast("Master archive empty."); return; }
    XLSX.writeFile(workbook, `NetTech_Master_Leads_${getFormattedDate()}.xlsx`);
    showToast("Master archive generated.");
  };

  const handleOpenModal = (item, readOnly = false) => {
    setEditingItem(item);
    setViewOnly(readOnly);
    setSelectedStatus(item.status || 'Pending');
    setFilePreview(item.image || item.logo || item.url || null);
    setCurrentRoles(item.roles ? JSON.parse(JSON.stringify(item.roles)) : []);
    if (activeTab === 'student-leads') {
      setTempSkills(item.skills || '');
      setTempDomain(item.interestedDomain || '');
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFilePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData(e.target);
    const item = Object.fromEntries(formDataObj.entries());

    if (filePreview) {
      if (activeTab === 'archives') item.image = filePreview;
      if (activeTab === 'partners') item.logo = filePreview;
      if (activeTab === 'reels') item.url = filePreview;
    }

    if (activeTab === 'domain-hub') {
      if (item.skills_raw) {
        item.skills = item.skills_raw.split(',').map(s => s.trim()).filter(s => s);
        delete item.skills_raw;
      }
      item.roles = currentRoles;
    }

    // Capture manual status if applicable
    if (['partner-leads', 'web-inquiries'].includes(activeTab)) {
      item.status = selectedStatus;
    }

    const finalItem = { ...editingItem, ...item };
    const keyMap = {
      'archives': 'nt_students', 'reels': 'nt_reels', 'partners': 'nt_partners',
      'student-leads': 'nt_registrations', 'partner-leads': 'nt_partner_leads',
      'web-inquiries': 'nt_web_inquiries', 'domain-hub': 'nt_domains'
    };

    // Granular uniqueness validation for Student Leads in manual admin entry
    if (activeTab === 'student-leads') {
      const emailConflict = registrations.find(l => l.email === finalItem.email && l.id !== finalItem.id);
      const phoneConflict = registrations.find(l => l.phone === finalItem.phone && l.id !== finalItem.id);

      if (emailConflict && phoneConflict) {
        alert("Both this Email and Phone already exist in another lead.");
        return;
      } else if (emailConflict) {
        alert("This Email is already registered with another lead.");
        return;
      } else if (phoneConflict) {
        alert("This Phone Number is already registered with another lead.");
        return;
      }
    }

    await api.saveRecord(keyMap[activeTab], finalItem);
    await loadAllData();
    setIsModalOpen(false);
    setEditingItem(null);
    setFilePreview(null);
    showToast("Sync successful.");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirm deletion?")) return;
    const keyMap = {
      'archives': 'nt_students', 'reels': 'nt_reels', 'partners': 'nt_partners',
      'student-leads': 'nt_registrations', 'partner-leads': 'nt_partner_leads',
      'web-inquiries': 'nt_web_inquiries', 'domain-hub': 'nt_domains'
    };
    await api.deleteRecord(keyMap[activeTab], id);
    await loadAllData();
    showToast("Record scrubbed.");
  };

  // --- NESTED ROLES LOGIC ---
  const addRole = () => setCurrentRoles([...currentRoles, { title: '', description: '', skills: [] }]);
  const updateRoleField = (index, field, value) => {
    const updated = [...currentRoles];
    if (field === 'skills_raw') updated[index].skills = value.split(',').map(s => s.trim()).filter(s => s);
    else updated[index][field] = value;
    setCurrentRoles(updated);
  };
  const removeRole = (index) => setCurrentRoles(currentRoles.filter((_, i) => i !== index));

  // --- FORM ARCHITECT LOGIC ---
  const currentSchema = useMemo(() => {
    if (architectTab === 'student') return studentSchema;
    if (architectTab === 'partner') return partnerSchema;
    return inquirySchema;
  }, [architectTab, studentSchema, partnerSchema, inquirySchema]);

  const addFormField = async () => {
    const newField = { id: Date.now(), label: 'New Field', name: 'custom_' + Date.now(), type: 'text', required: false };
    const newSchema = [...currentSchema, newField];
    await api.saveFormSchema(architectTab, newSchema);
    await loadAllData();
    showToast(`${architectTab.toUpperCase()} schema extended.`);
  };

  const updateFormField = async (id, updates) => {
    const newSchema = currentSchema.map(f => f.id === id ? { ...f, ...updates } : f);
    await api.saveFormSchema(architectTab, newSchema);
    await loadAllData();
  };

  const deleteFormField = async (id) => {
    if (!window.confirm("Delete field? Existing lead data for this field will be hidden.")) return;
    const newSchema = currentSchema.filter(f => f.id !== id);
    await api.saveFormSchema(architectTab, newSchema);
    await loadAllData();
    showToast("Field scrubbed from schema.");
  };

  const getFilteredData = () => {
    const term = searchTerm.toLowerCase();
    const dataMap = {
      'archives': archives, 'reels': reels, 'partners': partners,
      'student-leads': registrations, 'partner-leads': partnerLeads,
      'web-inquiries': inquiries, 'domain-hub': domains
    };
    const data = dataMap[activeTab] || [];
    return data.filter(i =>
      (i.name || i.fullName || i.companyName || i.title || "").toLowerCase().includes(term) ||
      (i.company || i.email || i.contactPerson || i.role || i.interestedDomain || i.collegeName || "").toLowerCase().includes(term)
    );
  };

  const Field = ({ label, name, value, type = "text", required = false, placeholder = "", onChange = null, readOnly = false }) => (
    <div className="space-y-2">
      <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">{label}</label>
      {viewOnly || readOnly ? (
        <p className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-[12px] font-bold text-blue-400 break-all min-h-[52px] flex items-center">{value || 'UNSPECIFIED'}</p>
      ) : (
        <input name={name} defaultValue={value} type={type} placeholder={placeholder} onChange={onChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-[11px] font-bold focus:border-blue-600 outline-none transition-all placeholder:text-gray-600" required={required} />
      )}
    </div>
  );

  const MediaField = ({ label, type = "image" }) => {
    const isVideo = type === "video";
    return (
      <div className="space-y-4">
        <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest">{label}</label>
        {filePreview ? (
          <div className="relative group rounded-[2rem] overflow-hidden border-2 border-blue-500/20 bg-black/60 flex items-center justify-center p-4 min-h-[256px]">
            {isVideo ? (
              <video src={filePreview} controls className="w-full aspect-video object-contain" />
            ) : (
              <img src={filePreview} className="max-w-full max-h-64 object-contain rounded-2xl" alt="Preview" />
            )}
            {!viewOnly && (
              <button type="button" onClick={() => setFilePreview(null)} className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"><Trash className="w-4 h-4" /></button>
            )}
          </div>
        ) : !viewOnly && (
          <div onClick={() => fileInputRef.current?.click()} className="w-full h-48 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 transition-all">
            {isVideo ? <FileVideo className="w-8 h-8 text-gray-500" /> : <FileImage className="w-8 h-8 text-gray-500" />}
            <p className="text-[10px] font-black uppercase text-gray-400">Click to Upload Media</p>
            <input type="file" ref={fileInputRef} className="hidden" accept={isVideo ? "video/*" : "image/*"} onChange={handleFileChange} />
          </div>
        )}
      </div>
    );
  };

  const StatusBadge = ({ type, status }) => {
    const config = statusConfigs[type][status || 'Pending'];
    if (!config) return <span className="px-3 py-1 bg-white/5 text-gray-400 rounded-full text-[8px] font-black uppercase tracking-widest">UNKNOWN</span>;
    return (
      <span className={`px-3 py-1 ${config.bg} ${config.color} rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit`}>
        <div className={`w-1 h-1 rounded-full ${config.color.replace('text-', 'bg-')} animate-pulse`} />
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex flex-col md:flex-row font-sans text-gray-100 overflow-hidden">
      {toast && <div className="fixed bottom-10 right-10 z-[1000] bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 font-black uppercase text-[10px] tracking-widest flex items-center gap-3"><RefreshCw className="w-4 h-4 animate-spin" /> {toast}</div>}

      <aside className="w-full md:w-80 bg-[#0a0f18] border-r border-white/5 flex flex-col z-50">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/20"><LayoutDashboard className="w-6 h-6 text-white" /></div>
            <div><span className="text-lg font-black uppercase tracking-tighter block">Command Centre</span><span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em]">NetTech Infrastructure</span></div>
          </div>
          <nav className="space-y-1.5 overflow-y-auto max-h-[60vh] custom-scrollbar">
            {[
              { id: 'archives', label: 'Student Archives', icon: UserCheck },
              { id: 'reels', label: 'Success Reels', icon: Video },
              { id: 'partners', label: 'Hiring Network', icon: Building },
              { id: 'domain-hub', label: 'Domain Matrix', icon: Layers },
              { id: 'form-architect', label: 'Form Architect', icon: Settings2 },
              { id: 'student-leads', label: 'Applicant Leads', icon: Users, badge: registrations.length },
              { id: 'partner-leads', label: 'Partner Requests', icon: Briefcase, badge: partnerLeads.length },
              { id: 'web-inquiries', label: 'Web Inquiries', icon: Mail, badge: inquiries.length },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}>
                <div className="flex items-center gap-4"><tab.icon className="w-4 h-4" /> {tab.label}</div>
                {tab.badge > 0 && <span className="px-2 py-0.5 bg-red-500 text-white rounded-md text-[8px] animate-pulse">{tab.badge}</span>}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-8 border-t border-white/5 space-y-3">
          <button onClick={handleExportMasterLeads} className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest border border-emerald-500/20"><FileSpreadsheet className="w-4 h-4" /> Export All Leads</button>
          <button onClick={() => navigate('/test')} className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest border border-indigo-500/20"><Wand2 className="w-4 h-4" /> AI Resume Engine</button>
          <button onClick={() => { localStorage.removeItem('accessToken'); navigate('/admin'); }} className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"><LogOut className="w-4 h-4" /> Terminate</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto h-screen custom-scrollbar bg-[#05070a] relative">
        <header className="sticky top-0 bg-[#05070a]/80 backdrop-blur-xl border-b border-white/5 z-40 px-10 py-8 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-black uppercase tracking-tighter">{activeTab.replace('-', ' ')}</h2>
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto">
            {activeTab !== 'form-architect' && (
              <div className="relative flex-1 lg:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input type="text" placeholder="Search data node..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest focus:border-blue-600 outline-none transition-all" />
              </div>
            )}
            <div className="flex gap-2">
              {['student-leads', 'partner-leads', 'web-inquiries'].includes(activeTab) && (
                <button onClick={handleExportCurrent} className="px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 whitespace-nowrap"><Download className="w-4 h-4 mr-2 inline" /> Export Excel</button>
              )}
              {['archives', 'reels', 'partners', 'domain-hub', 'student-leads'].includes(activeTab) && (
                <button onClick={() => handleOpenModal({ id: Date.now() })} className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/20 whitespace-nowrap"><Plus className="w-4 h-4 mr-2 inline" /> New Record</button>
              )}
              {activeTab === 'form-architect' && (
                <button onClick={addFormField} className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 whitespace-nowrap"><Plus className="w-4 h-4 mr-2 inline" /> Add Custom Field</button>
              )}
            </div>
          </div>
        </header>

        <div className="p-10">
          {activeTab === 'form-architect' ? (
            <div className="grid gap-8">
              <div className="flex flex-wrap gap-2 bg-[#0a0f18] p-2 rounded-[2rem] border border-white/5 w-fit">
                {[
                  { id: 'student', label: 'Student Form', icon: GraduationCap },
                  { id: 'partner', label: 'Partner Form', icon: Building },
                  { id: 'inquiry', label: 'Inquiry Form', icon: Mail }
                ].map(tab => (
                  <button key={tab.id} onClick={() => setArchitectTab(tab.id)} className={`flex items-center gap-3 px-6 py-3 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all ${architectTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                    <tab.icon className="w-4 h-4" /> {tab.label}
                  </button>
                ))}
              </div>

              <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[2.5rem]">
                <h3 className="text-xl font-black uppercase tracking-tight mb-2 flex items-center gap-3"><FileJson className="w-5 h-5" /> Schema Controller: {architectTab.toUpperCase()}</h3>
                <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest leading-relaxed">Modify the data ingestion structure for the public-facing {architectTab} portal.</p>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentSchema.map((field) => (
                  <div key={field.id} className="bg-[#0a0f18] p-8 rounded-[2.5rem] border border-white/5 shadow-xl space-y-6 relative group/field">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-500"><TypeIcon className="w-5 h-5" /></div>
                      {!field.system && (
                        <button onClick={() => deleteFormField(field.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase text-gray-600 tracking-widest">Field Label</label>
                        <input value={field.label} onChange={(e) => updateFormField(field.id, { label: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black focus:border-blue-600 outline-none transition-all" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-gray-600 tracking-widest">Type</label>
                          <select value={field.type} onChange={(e) => updateFormField(field.id, { type: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black focus:border-blue-600 outline-none appearance-none">
                            <option value="text">TEXT</option>
                            <option value="email">EMAIL</option>
                            <option value="tel">PHONE</option>
                            <option value="url">URL</option>
                            <option value="number">NUMBER</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-gray-600 tracking-widest">Req.</label>
                          <button onClick={() => updateFormField(field.id, { required: !field.required })} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${field.required ? 'border-indigo-600/50 bg-indigo-600/10 text-indigo-400' : 'border-white/10 text-gray-500'}`}>
                            <span className="text-[9px] font-black uppercase">{field.required ? 'YES' : 'NO'}</span>
                            {field.required ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    {field.system && <div className="absolute top-2 right-2 px-2 py-0.5 bg-gray-800 text-[7px] font-black uppercase tracking-widest rounded-full text-gray-500 border border-white/5">System Node</div>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#0a0f18] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5">
                    <tr className="border-b border-white/5">
                      {activeTab === 'archives' && <><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Student Profile</th><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Hiring Company</th><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Selection Date</th></>}
                      {activeTab === 'partners' && <><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Partner Logo</th><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Company Name</th><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Verified</th></>}
                      {activeTab === 'reels' && <><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Reel Identity</th><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Tag / Category</th><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Display Order</th></>}
                      {activeTab === 'domain-hub' && <><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Domain Title</th><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Job Pathways</th><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Skill Count</th></>}
                      {activeTab === 'student-leads' && <><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Applicant Name</th><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Institution</th><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Qualification</th><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Track</th></>}
                      {activeTab === 'partner-leads' && <><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Workflow Node</th><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Organization</th><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Contact Lead</th><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Email Address</th></>}
                      {activeTab === 'web-inquiries' && <><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">System State</th><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Sender</th><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Subject</th><th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Inquiry Date</th></>}
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {getFilteredData().map((item) => (
                      <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                        {activeTab === 'archives' && <><td className="px-8 py-6"><div className="flex items-center gap-4"><img src={item.image} className="w-10 h-10 rounded-xl object-cover bg-white/5" alt="" /><div><p className="font-black text-sm uppercase">{item.name}</p><p className="text-[10px] font-bold text-blue-500 uppercase">{item.role}</p></div></div></td><td className="px-8 py-6 font-black text-gray-300 text-[10px] uppercase">{item.company}</td><td className="px-8 py-6 font-mono text-[10px] text-gray-500 uppercase">{item.selectionDate}</td></>}
                        {activeTab === 'partners' && <><td className="px-8 py-6"><div className="w-16 h-10 bg-white rounded-lg p-1 flex items-center justify-center overflow-hidden"><img src={item.logo} className="max-h-full max-w-full object-contain" alt="" /></div></td><td className="px-8 py-6 font-black text-gray-200 text-xs uppercase">{item.name}</td><td className="px-8 py-6"><span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[8px] font-black uppercase tracking-widest">Active Partner</span></td></>}
                        {activeTab === 'reels' && <><td className="px-8 py-6"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Video className="w-4 h-4 text-white" /></div><span className="font-bold text-gray-300 text-[10px] uppercase max-w-[150px] truncate">{item.title}</span></div></td><td className="px-8 py-6"><span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase text-blue-400">{item.tag}</span></td><td className="px-8 py-6 font-mono text-xs text-gray-500">Order: {item.order || 'N/A'}</td></>}
                        {activeTab === 'domain-hub' && <><td className="px-8 py-6 font-black text-sm uppercase text-white">{item.title}</td><td className="px-8 py-6"><span className="px-3 py-1 bg-blue-600/10 text-blue-400 rounded-lg text-[9px] font-black uppercase">{item.roles?.length || 0} Pathways</span></td><td className="px-8 py-6 font-mono text-[9px] text-gray-600 uppercase">{item.skills?.length || 0} Core Skills</td></>}
                        {activeTab === 'student-leads' && (
                          <>
                            <td className="px-8 py-6 font-black text-sm uppercase text-white">{item.fullName}</td>
                            <td className="px-8 py-6 font-bold text-gray-300 text-[10px] uppercase">{item.collegeName || 'N/A'}</td>
                            <td className="px-8 py-6 font-bold text-indigo-400 text-[10px] uppercase">{item.highestQualification}</td>
                            <td className="px-8 py-6 min-w-[180px]"><span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-[9px] font-black uppercase whitespace-nowrap">{item.interestedDomain}</span></td>
                          </>
                        )}
                        {activeTab === 'partner-leads' && <><td className="px-8 py-6"><StatusBadge type="partner" status={item.status} /></td><td className="px-8 py-6 font-black text-sm uppercase text-white">{item.companyName}</td><td className="px-8 py-6 font-bold text-gray-400 text-[10px] uppercase">{item.contactPerson}</td><td className="px-8 py-6 font-bold text-blue-500 text-[10px] uppercase">{item.email}</td></>}
                        {activeTab === 'web-inquiries' && <><td className="px-8 py-6"><StatusBadge type="inquiry" status={item.status} /></td><td className="px-8 py-6 font-black text-sm uppercase text-white">{item.name}</td><td className="px-8 py-6 font-bold text-blue-500 text-[10px] uppercase">{item.subject}</td><td className="px-8 py-6 font-mono text-[9px] text-gray-600 uppercase">{item.timestamp}</td></>}
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleOpenModal(item, true)} className="p-3 bg-white/5 hover:bg-emerald-600/20 text-gray-500 hover:text-emerald-500 rounded-xl transition-all" title="View Details"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => handleOpenModal(item, false)} className="p-3 bg-white/5 hover:bg-blue-600/20 text-gray-500 hover:text-blue-500 rounded-xl transition-all" title="Modify Record"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-3 bg-white/5 hover:bg-red-600/20 text-gray-500 hover:text-red-500 rounded-xl transition-all" title="Delete Record"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0a0f18] w-full max-w-3xl rounded-[3rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,1)] overflow-hidden">
            <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">{viewOnly ? 'Inspect Record' : 'Modify Record'}</h3>
                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.3em]">{activeTab.toUpperCase()}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <form className="p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar" onSubmit={handleSave}>

              {/* MEDIA BLOCKS */}
              {['archives', 'partners', 'reels'].includes(activeTab) && (
                <MediaField label={activeTab === 'reels' ? "Direct Video Payload" : "Direct Image Payload"} type={activeTab === 'reels' ? "video" : "image"} />
              )}

              {/* CUSTOM WORKFLOW DROPDOWN FIX */}
              {!viewOnly && ['partner-leads', 'web-inquiries'].includes(activeTab) && (
                <div className="p-8 bg-blue-600/5 border border-blue-500/20 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <h4 className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Workflow Controller</h4>
                  </div>

                  <div className="relative" ref={workflowRef}>
                    <button
                      type="button"
                      onClick={() => setIsWorkflowOpen(!isWorkflowOpen)}
                      className="w-full bg-[#050b1a] border border-white/10 rounded-xl px-6 py-5 text-[11px] font-black focus:border-blue-600 outline-none text-white flex items-center justify-between transition-all hover:bg-white/5 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${statusConfigs[activeTab === 'partner-leads' ? 'partner' : 'inquiry'][selectedStatus]?.color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]`} />
                        <span className="uppercase tracking-widest">{statusConfigs[activeTab === 'partner-leads' ? 'partner' : 'inquiry'][selectedStatus]?.label}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-blue-500 transition-transform duration-300 ${isWorkflowOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isWorkflowOpen && (
                      <div className="absolute z-[110] left-0 right-0 mt-2 bg-[#0a0f18] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,1)] py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl">
                        {Object.entries(statusConfigs[activeTab === 'partner-leads' ? 'partner' : 'inquiry']).map(([key, val]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              setSelectedStatus(key);
                              setIsWorkflowOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-6 py-4 text-[10px] font-black tracking-widest transition-all hover:bg-white/5 ${selectedStatus === key ? 'text-blue-400 bg-blue-600/5' : 'text-gray-400'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-1.5 h-1.5 rounded-full ${val.color.replace('text-', 'bg-')}`} />
                              <span>{val.label}</span>
                            </div>
                            {selectedStatus === key && <Check className="w-3 h-3 text-blue-500" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input type="hidden" name="status" value={selectedStatus} />
                </div>
              )}

              {/* TAB SPECIFIC FORM FIELDS */}
              {activeTab === 'student-leads' && (
                <div className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 flex items-center gap-3 mb-2"><User className="w-4 h-4 text-blue-500" /><h4 className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Personal Identification</h4></div>
                    <Field label="Full Name" name="fullName" value={editingItem?.fullName} required />
                    <Field label="Phone" name="phone" value={editingItem?.phone} required />
                    <Field label="Email" name="email" value={editingItem?.email} required />
                    <Field label="ID" name="id" value={editingItem?.id} readOnly />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 flex items-center gap-3 mb-2"><Map className="w-4 h-4 text-indigo-500" /><h4 className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">Extended Context</h4></div>
                    {studentSchema.map(f => (
                      <Field key={f.id} label={f.label} name={f.name} value={editingItem?.[f.name]} type={f.type} required={f.required} />
                    ))}
                    <div className="md:col-span-2">
                      <Field label="Institution Name" name="collegeName" value={editingItem?.collegeName} required />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Field label="Qualification" name="highestQualification" value={editingItem?.highestQualification} required />
                    <Field label="Passing Year" name="passingYear" value={editingItem?.passingYear} required />
                    <div className="md:col-span-2">
                      <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Track</label>
                      {viewOnly ? (
                        <p className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-[12px] font-bold text-blue-400 break-all min-h-[52px] flex items-center">{editingItem?.interestedDomain || 'UNSPECIFIED'}</p>
                      ) : (
                        <select name="interestedDomain" defaultValue={editingItem?.interestedDomain} onChange={(e) => setTempDomain(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-[11px] font-bold focus:border-blue-600 outline-none text-white appearance-none">
                          <option value="">SELECT DOMAIN</option>
                          {JOB_DOMAINS.map(d => <option key={d.id} value={d.title} className="bg-gray-900">{d.title}</option>)}
                        </select>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest block">Skills Matrix</label>
                      {viewOnly && <Zap className="w-3 h-3 text-indigo-500 animate-pulse" />}
                    </div>
                    {viewOnly ? (
                      <div className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-wrap gap-2 min-h-[100px]">
                        {editingItem?.skills ? editingItem.skills.split(',').map(s => s.trim()).filter(s => s).map((skill, sidx) => (
                          <span key={sidx} className="bg-blue-600/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm cursor-default">
                            {skill}
                          </span>
                        )) : (
                          <div className="flex flex-col items-center justify-center w-full opacity-20 py-4">
                            <AlertCircle className="w-8 h-8 mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Zero Competencies Logged</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <textarea name="skills" defaultValue={editingItem?.skills} onChange={(e) => setTempSkills(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-[11px] font-bold focus:border-blue-600 outline-none placeholder:text-gray-600 min-h-[100px] resize-none" required placeholder="Enter skills separated by commas..." />
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'archives' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <Field label="Legal Name" name="name" value={editingItem?.name} required />
                  <Field label="Hiring Organization" name="company" value={editingItem?.company} required />
                  <div className="md:col-span-2"><Field label="Designation" name="role" value={editingItem?.role} required /></div>
                  <Field label="Selection Cycle" name="selectionDate" value={editingItem?.selectionDate} />
                </div>
              )}

              {activeTab === 'reels' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2"><Field label="Reel Title" name="title" value={editingItem?.title} required /></div>
                  <Field label="Strategic Tag" name="tag" value={editingItem?.tag} required />
                  <Field label="Display Priority" name="order" value={editingItem?.order} type="number" required />
                </div>
              )}

              {activeTab === 'partners' && (
                <div className="space-y-6"><Field label="Organization Title" name="name" value={editingItem?.name} required /></div>
              )}

              {activeTab === 'domain-hub' && (
                <div className="space-y-8">
                  <Field label="Domain Title" name="title" value={editingItem?.title} required />
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Description</label>
                    {viewOnly ? <p className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-gray-300">{editingItem?.description}</p> : <textarea name="description" defaultValue={editingItem?.description} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-[11px] font-bold focus:border-blue-600 outline-none min-h-[120px]" required />}
                  </div>
                  <Field label="Global Competencies (CSV)" name="skills_raw" value={editingItem?.skills?.join(', ')} />

                  <div className="pt-8 border-t border-white/5">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3"><BriefcaseIcon className="w-4 h-4 text-blue-500" /><h4 className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Job Pathways</h4></div>
                      {!viewOnly && <button type="button" onClick={addRole} className="px-4 py-2 bg-blue-600/10 text-blue-500 rounded-lg text-[9px] font-black uppercase border border-blue-600/20 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all"><Plus className="w-3 h-3" /> New Role</button>}
                    </div>
                    <div className="space-y-6">
                      {currentRoles.map((role, rIdx) => (
                        <div key={rIdx} className="bg-white/5 border border-white/5 rounded-[2rem] p-8 space-y-6 relative group/role overflow-hidden">
                          {!viewOnly && <button type="button" onClick={() => removeRole(rIdx)} className="absolute top-6 right-6 p-2 text-gray-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>}
                          {viewOnly ? (
                            <div className="space-y-4">
                              <h5 className="text-sm font-black uppercase text-white">{role.title || 'Untitled Role'}</h5>
                              <p className="text-[11px] text-gray-400 italic">"{role.description || 'No description'}"</p>
                              <div className="flex flex-wrap gap-1.5">{role.skills?.map((s, si) => <span key={si} className="px-2 py-0.5 bg-blue-600/10 text-blue-400 text-[8px] font-black uppercase rounded border border-blue-600/20">{s}</span>)}</div>
                            </div>
                          ) : (
                            <div className="grid gap-6">
                              <Field label="Role Title" value={role.title} onChange={(e) => updateRoleField(rIdx, 'title', e.target.value)} />
                              <div className="space-y-1"><label className="text-[8px] font-black uppercase text-gray-600">Role Intel</label><textarea value={role.description} onChange={(e) => updateRoleField(rIdx, 'description', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] focus:border-blue-600 outline-none" /></div>
                              <Field label="Target Skills (CSV)" value={role.skills?.join(', ')} onChange={(e) => updateRoleField(rIdx, 'skills_raw', e.target.value)} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'partner-leads' && (
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Field label="Org" name="companyName" value={editingItem?.companyName} readOnly={viewOnly} />
                    </div>
                    <Field label="Lead" name="contactPerson" value={editingItem?.contactPerson} readOnly={viewOnly} />
                    <Field label="Phone" name="phone" value={editingItem?.phone} readOnly={viewOnly} />
                    <div className="md:col-span-2">
                      <Field label="Email" name="email" value={editingItem?.email} readOnly={viewOnly} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {partnerSchema.map(f => <Field key={f.id} label={f.label} name={f.name} value={editingItem?.[f.name]} readOnly={viewOnly} />)}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Requirements</label>
                    {viewOnly ? (
                      <p className="w-full bg-white/5 border border-white/5 rounded-[2rem] px-8 py-6 text-[13px] italic">"{editingItem?.requirements}"</p>
                    ) : (
                      <textarea name="requirements" defaultValue={editingItem?.requirements} className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 text-[13px] focus:border-blue-600 outline-none min-h-[150px]" />
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'web-inquiries' && (
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Field label="Name" name="name" value={editingItem?.name} readOnly={viewOnly} />
                    </div>
                    <div className="md:col-span-2">
                      <Field label="Subject" name="subject" value={editingItem?.subject} readOnly={viewOnly} />
                    </div>
                    <Field label="Email" name="email" value={editingItem?.email} readOnly={viewOnly} />
                    <Field label="Timestamp" value={editingItem?.timestamp} readOnly />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {inquirySchema.map(f => <Field key={f.id} label={f.label} name={f.name} value={editingItem?.[f.name]} readOnly={viewOnly} />)}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Message</label>
                    {viewOnly ? (
                      <p className="w-full bg-white/5 border border-white/5 rounded-[2rem] px-8 py-6 text-[13px] italic">"{editingItem?.message}"</p>
                    ) : (
                      <textarea name="message" defaultValue={editingItem?.message} className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 text-[13px] focus:border-blue-600 outline-none min-h-[150px]" />
                    )}
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-white/5 flex gap-4">
                {!viewOnly && (
                  <button type="submit" className="flex-1 bg-blue-600 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-blue-700 shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"><Save className="w-4 h-4" /> Commit Changes</button>
                )}
                <button type="button" onClick={() => setIsModalOpen(false)} className={`flex-1 bg-white/5 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all ${viewOnly ? 'bg-blue-600/10 text-blue-500' : ''}`}>{viewOnly ? 'Terminate Stream' : 'Abort'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;