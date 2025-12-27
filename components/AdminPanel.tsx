
import React, { useState, useEffect } from 'react';
import { Program, Lead, Founder, Announcement } from '../types';

interface AdminPanelProps {
  programs: Program[];
  setPrograms: (programs: Program[]) => void;
  founders: { edina: Founder, zita: Founder };
  setFounders: (founders: { edina: Founder, zita: Founder }) => void;
  announcement: Announcement;
  setAnnouncement: (a: Announcement) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  programs, setPrograms, founders, setFounders, announcement, setAnnouncement 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [editingProgram, setEditingProgram] = useState<Partial<Program> | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'programs' | 'gallery' | 'settings'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Form states for settings
  const [edinaImg, setEdinaImg] = useState(founders.edina.image);
  const [zitaImg, setZitaImg] = useState(founders.zita.image);
  const [annText, setAnnText] = useState(announcement.text);
  const [annActive, setAnnActive] = useState(announcement.isActive);
  const [annType, setAnnType] = useState(announcement.type);

  useEffect(() => {
    const savedGallery = localStorage.getItem('kincsek_gallery');
    if (savedGallery) setGalleryImages(JSON.parse(savedGallery));
    
    const savedLeads = localStorage.getItem('kincsek_leads');
    if (savedLeads) setLeads(JSON.parse(savedLeads));
  }, [activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') setIsAuthenticated(true);
    else alert('Hibás jelszó!');
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;

    let updated: Program[];
    if (editingProgram.id) {
      updated = programs.map(p => p.id === editingProgram.id ? (editingProgram as Program) : p);
    } else {
      updated = [...programs, { ...editingProgram, id: Date.now().toString() } as Program];
    }
    setPrograms(updated);
    setEditingProgram(null);
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    const updated = leads.map(l => l.id === id ? { ...l, status } : l);
    setLeads(updated);
    localStorage.setItem('kincsek_leads', JSON.stringify(updated));
  };

  const handleDeleteLead = (id: string) => {
    if (!window.confirm('Biztosan törlöd?')) return;
    const updated = leads.filter(l => l.id !== id);
    setLeads(updated);
    localStorage.setItem('kincsek_leads', JSON.stringify(updated));
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.programTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Összes jelentkező', value: leads.length, icon: '📬', color: 'from-blue-500 to-indigo-600' },
    { label: 'Új üzenet', value: leads.filter(l => l.status === 'new').length, icon: '🔔', color: 'from-red-500 to-rose-600' },
    { label: 'Aktív program', value: programs.length, icon: '🎨', color: 'from-teal-500 to-emerald-600' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-red-50 w-full max-w-md text-center animate-scaleUp">
          <div className="w-24 h-24 bg-red-500 rounded-[35px] mx-auto mb-8 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-red-500/20">K</div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Admin Panel</h2>
          <p className="text-gray-500 mb-10 font-medium">Add meg a jelszót a belépéshez!</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white outline-none transition-all text-center font-bold text-xl"
              placeholder="••••••"
            />
            <button className="w-full py-5 bg-red-500 text-white font-black rounded-3xl hover:bg-red-600 transition-all shadow-xl shadow-red-500/30">
              Belépés
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] -mt-16 sm:-mt-24">
      {/* Sidebar Navigation */}
      <aside className="w-20 lg:w-72 bg-white border-r border-gray-100 flex flex-col pt-32 pb-10 px-4 transition-all duration-300">
        <div className="flex-grow space-y-2">
          {[
            { id: 'dashboard', label: 'Irányítópult', icon: '🏠' },
            { id: 'leads', label: 'Jelentkezések', icon: '📬', badge: leads.filter(l => l.status === 'new').length },
            { id: 'programs', label: 'Programok', icon: '🗓️' },
            { id: 'gallery', label: 'Galéria', icon: '📸' },
            { id: 'settings', label: 'Beállítások', icon: '⚙️' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-4 lg:px-6 py-4 rounded-2xl transition-all group relative ${
                activeTab === item.id 
                  ? 'bg-red-50 text-red-600 shadow-sm' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="hidden lg:block font-bold text-sm tracking-tight">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="absolute top-3 right-3 lg:static lg:ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
              {activeTab === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-red-500 rounded-r-full hidden lg:block"></div>
              )}
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="w-full flex items-center gap-4 px-4 lg:px-6 py-4 rounded-2xl text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <span className="text-xl">🚪</span>
          <span className="hidden lg:block font-bold text-sm">Kijelentkezés</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow pt-32 p-6 lg:p-12 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto animate-fadeIn">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-10">
              <header>
                <h1 className="text-4xl font-black text-gray-900 mb-2">Jó reggelt, Edina & Zita! 👋</h1>
                <p className="text-gray-500 font-medium">Íme egy gyors áttekintés a Kincsek Művészeti Klub mai állapotáról.</p>
              </header>

              <div className="grid sm:grid-cols-3 gap-6">
                {stats.map((s, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                    <div className={`w-20 h-20 bg-gradient-to-br ${s.color} rounded-[30px] flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                      {s.icon}
                    </div>
                    <div>
                      <div className="text-4xl font-black text-gray-900 mb-1">{s.value}</div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-10">
                {/* Recent Activity */}
                <div className="bg-white p-10 rounded-[45px] shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold mb-8 flex items-center justify-between">
                    <span>Legutóbbi jelentkezők</span>
                    <button onClick={() => setActiveTab('leads')} className="text-xs font-black text-red-500 uppercase tracking-widest hover:underline">Összes</button>
                  </h3>
                  <div className="space-y-6">
                    {leads.slice(0, 4).map((l) => (
                      <div key={l.id} className="flex items-center gap-4 p-4 rounded-3xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm">👤</div>
                        <div className="flex-grow">
                          <div className="font-bold text-gray-900 text-sm">{l.name}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">{l.programTitle}</div>
                        </div>
                        <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase ${l.status === 'new' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {l.status === 'new' ? 'Új' : 'Kezelt'}
                        </span>
                      </div>
                    ))}
                    {leads.length === 0 && <p className="text-center py-10 text-gray-300 italic">Még nincs jelentkező.</p>}
                  </div>
                </div>

                {/* Announcement Preview Widget */}
                <div className="bg-[#0f172a] p-10 rounded-[45px] text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-3xl group-hover:bg-red-500/40 transition-all"></div>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm">📢</span>
                    Aktív Közlemény
                  </h3>
                  <div className={`p-6 rounded-3xl mb-8 border ${annActive ? 'bg-white/5 border-white/10' : 'bg-red-500/10 border-red-500/20 opacity-50'}`}>
                    <p className="text-sm font-medium leading-relaxed italic">
                      {annActive ? `"${annText}"` : "Jelenleg nincs aktív közlemény a weboldalon."}
                    </p>
                  </div>
                  <button onClick={() => setActiveTab('settings')} className="w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                    Szerkesztés
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LEADS TAB */}
          {activeTab === 'leads' && (
            <div className="space-y-8">
              <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-900">Jelentkezések</h2>
                  <p className="text-gray-500 font-medium">Kezeld a beérkező kincskeresőket!</p>
                </div>
                <div className="w-full sm:w-auto">
                  <input 
                    type="text" 
                    placeholder="Keresés név vagy program..." 
                    className="w-full sm:w-72 px-6 py-3.5 rounded-2xl bg-white border border-gray-200 outline-none focus:border-red-500 transition-all font-medium text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </header>

              <div className="bg-white rounded-[45px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <tr>
                        <th className="px-10 py-5">Állapot</th>
                        <th className="px-10 py-5">Jelentkező</th>
                        <th className="px-10 py-5">Program</th>
                        <th className="px-10 py-5">Elérhetőség</th>
                        <th className="px-10 py-5 text-right">Művelet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredLeads.map(l => (
                        <tr key={l.id} className={`group hover:bg-gray-50/50 transition-colors ${l.status === 'new' ? 'bg-red-50/10' : ''}`}>
                          <td className="px-10 py-6">
                            <select 
                              value={l.status} 
                              onChange={(e) => updateLeadStatus(l.id, e.target.value as any)}
                              className={`text-[9px] font-black uppercase rounded-full px-4 py-2 cursor-pointer outline-none border-none shadow-sm ${
                                l.status === 'new' ? 'bg-red-500 text-white' : 
                                l.status === 'contacted' ? 'bg-orange-400 text-white' : 'bg-teal-500 text-white'
                              }`}
                            >
                              <option value="new">Új</option>
                              <option value="contacted">Hívva</option>
                              <option value="enrolled">Felvéve</option>
                            </select>
                          </td>
                          <td className="px-10 py-6">
                            <div className="font-bold text-gray-900">{l.name}</div>
                            <div className="text-[10px] text-gray-400 font-black uppercase mt-0.5">{l.timestamp}</div>
                          </td>
                          <td className="px-10 py-6">
                            <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">{l.programTitle}</span>
                          </td>
                          <td className="px-10 py-6">
                            <div className="text-xs font-bold text-gray-700">{l.phone}</div>
                            <div className="text-[10px] text-gray-400">{l.email}</div>
                          </td>
                          <td className="px-10 py-6 text-right">
                            <button onClick={() => handleDeleteLead(l.id)} className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredLeads.length === 0 && <div className="py-24 text-center text-gray-300 font-black uppercase tracking-widest">Nincs találat</div>}
              </div>
            </div>
          )}

          {/* PROGRAMS TAB */}
          {activeTab === 'programs' && (
            <div className="space-y-8">
              <header className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-gray-900">Programok</h2>
                  <p className="text-gray-500 font-medium">Aktív foglalkozások kezelése</p>
                </div>
                <button 
                  onClick={() => setEditingProgram({ title: '', description: '', date: '', category: 'Általános', imageUrl: 'https://picsum.photos/seed/art/800/600' })}
                  className="px-8 py-4 bg-red-500 text-white font-black rounded-3xl hover:bg-red-600 shadow-xl shadow-red-500/20 transition-all flex items-center gap-2"
                >
                  <span>+</span> Új Program
                </button>
              </header>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {programs.map(p => (
                  <div key={p.id} className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all group">
                    <div className="h-48 rounded-[30px] overflow-hidden mb-6 bg-gray-100 relative">
                      <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 right-4 px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black text-red-500 uppercase tracking-widest shadow-sm">
                        {p.category}
                      </div>
                    </div>
                    <h4 className="font-bold text-xl text-gray-900 mb-2 truncate">{p.title}</h4>
                    <p className="text-xs text-gray-400 font-medium mb-8 line-clamp-3 leading-relaxed">{p.description}</p>
                    <div className="flex gap-3">
                      <button onClick={() => setEditingProgram(p)} className="flex-grow py-3 bg-gray-50 text-gray-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all">Szerkesztés</button>
                      <button onClick={() => {if(window.confirm('Törlöd?')) setPrograms(programs.filter(x => x.id !== p.id))}} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-12">
              <header className="text-center">
                <h2 className="text-3xl font-black text-gray-900">Rendszerbeállítások</h2>
                <p className="text-gray-500 font-medium">A weboldal globális tartalmának kezelése</p>
              </header>

              {/* Announcement Editor */}
              <div className="bg-white p-12 rounded-[50px] shadow-sm border border-gray-100">
                <h3 className="text-xl font-black mb-8 flex items-center gap-4">
                  <span className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center text-lg">📢</span>
                  Felső Közlemény (Banner)
                </h3>
                <div className="space-y-8">
                  <textarea 
                    className="w-full p-8 rounded-[35px] bg-gray-50 border-none focus:ring-4 focus:ring-red-100 outline-none font-bold text-gray-900 resize-none transition-all shadow-inner"
                    rows={4}
                    value={annText}
                    onChange={(e) => setAnnText(e.target.value)}
                    placeholder="Írd ide a fontos üzenetet..."
                  />
                  <div className="grid sm:grid-cols-2 gap-8 items-end">
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Banner stílusa</label>
                      <div className="flex gap-2">
                        {['info', 'urgent', 'success'].map(type => (
                          <button
                            key={type}
                            onClick={() => setAnnType(type as any)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                              annType === type 
                                ? 'bg-[#0f172a] text-white shadow-lg' 
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            {type === 'info' ? 'Kék' : type === 'urgent' ? 'Piros' : 'Zöld'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 p-6 rounded-3xl border border-gray-100">
                      <span className="text-sm font-bold text-gray-700">Banner állapota: <span className={annActive ? 'text-teal-600' : 'text-red-500'}>{annActive ? 'Aktív' : 'Inaktív'}</span></span>
                      <button 
                        onClick={() => setAnnActive(!annActive)}
                        className={`w-14 h-8 rounded-full transition-all relative ${annActive ? 'bg-teal-500' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-1.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${annActive ? 'left-7.5 ml-0.5' : 'left-1.5'}`}></div>
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setAnnouncement({ text: annText, isActive: annActive, type: annType }); alert('Mentve!'); }}
                    className="w-full py-5 bg-[#0f172a] text-white rounded-[30px] font-black text-xs uppercase tracking-[0.3em] hover:bg-red-500 transition-all shadow-xl shadow-red-500/10"
                  >
                    Közlemény mentése
                  </button>
                </div>
              </div>

              {/* Founders Profiler */}
              <div className="bg-white p-12 rounded-[50px] shadow-sm border border-gray-100">
                <h3 className="text-xl font-black mb-10 flex items-center gap-4">
                  <span className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center text-lg">👩‍🏫</span>
                  Profilképek kezelése
                </h3>
                <div className="grid sm:grid-cols-2 gap-12">
                  <div className="space-y-6 text-center">
                    <div className="w-40 h-40 mx-auto rounded-[40px] overflow-hidden border-8 border-gray-50 shadow-lg">
                      <img src={edinaImg} className="w-full h-full object-cover" />
                    </div>
                    <input type="text" value={edinaImg} onChange={(e) => setEdinaImg(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl border-none text-xs font-bold text-center outline-none focus:ring-2 focus:ring-red-100" placeholder="Edina kép URL" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Suki Edina</p>
                  </div>
                  <div className="space-y-6 text-center">
                    <div className="w-40 h-40 mx-auto rounded-[40px] overflow-hidden border-8 border-gray-50 shadow-lg">
                      <img src={zitaImg} className="w-full h-full object-cover" />
                    </div>
                    <input type="text" value={zitaImg} onChange={(e) => setZitaImg(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl border-none text-xs font-bold text-center outline-none focus:ring-2 focus:ring-teal-100" placeholder="Zita kép URL" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Suki Zita</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setFounders({...founders, edina: {...founders.edina, image: edinaImg}, zita: {...founders.zita, image: zitaImg}}); alert('Profilok frissítve!'); }}
                  className="w-full mt-12 py-5 bg-[#0f172a] text-white rounded-[30px] font-black text-xs uppercase tracking-[0.3em] hover:bg-teal-600 transition-all shadow-xl shadow-teal-500/10"
                >
                  Profilképek mentése
                </button>
              </div>
            </div>
          )}

          {/* GALLERY TAB */}
          {activeTab === 'gallery' && (
            <div className="space-y-10">
              <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-900">Galéria</h2>
                  <p className="text-gray-500 font-medium">A weboldal vizuális albuma</p>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                  <input 
                    type="text" 
                    placeholder="Új kép URL..." 
                    className="flex-grow sm:w-64 px-6 py-3.5 rounded-2xl bg-white border border-gray-200 outline-none focus:border-teal-500 font-medium text-sm shadow-sm"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                  />
                  <button 
                    onClick={() => { if(newImageUrl) { const n = [...galleryImages, newImageUrl]; setGalleryImages(n); localStorage.setItem('kincsek_gallery', JSON.stringify(n)); setNewImageUrl(''); }}}
                    className="px-8 py-3.5 bg-teal-500 text-white font-black rounded-2xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/20"
                  >
                    Hozzáad
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {galleryImages.map((img, i) => (
                  <div key={i} className="aspect-square rounded-[35px] overflow-hidden relative group border-4 border-white shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <button 
                      onClick={() => { const n = galleryImages.filter((_, idx) => idx !== i); setGalleryImages(n); localStorage.setItem('kincsek_gallery', JSON.stringify(n)); }}
                      className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-2xl flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all shadow-lg rotate-12 hover:rotate-0"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Program Edit Modal (Visual Update) */}
      {editingProgram && (
        <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-xl flex items-center justify-center p-6 z-[300]">
          <div className="bg-white p-12 rounded-[55px] shadow-2xl w-full max-w-2xl animate-scaleUp overflow-y-auto max-h-[90vh]">
            <h2 className="text-3xl font-black mb-10 text-gray-900 border-l-8 border-red-500 pl-6">{editingProgram.id ? 'Módosítás' : 'Új Alkotás'}</h2>
            <form onSubmit={handleSaveProgram} className="grid gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Program megnevezése</label>
                <input required value={editingProgram.title} onChange={(e) => setEditingProgram({...editingProgram, title: e.target.value})} className="w-full p-6 bg-gray-50 rounded-[25px] font-bold outline-none border-2 border-transparent focus:border-red-500 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Időpont</label>
                  <input required value={editingProgram.date} onChange={(e) => setEditingProgram({...editingProgram, date: e.target.value})} className="w-full p-6 bg-gray-50 rounded-[25px] font-bold outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Kategória</label>
                  <input required value={editingProgram.category} onChange={(e) => setEditingProgram({...editingProgram, category: e.target.value})} className="w-full p-6 bg-gray-50 rounded-[25px] font-bold outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Kép hivatkozása (URL)</label>
                <input required value={editingProgram.imageUrl} onChange={(e) => setEditingProgram({...editingProgram, imageUrl: e.target.value})} className="w-full p-6 bg-gray-50 rounded-[25px] font-bold outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Részletes leírás</label>
                <textarea required value={editingProgram.description} onChange={(e) => setEditingProgram({...editingProgram, description: e.target.value})} className="w-full p-8 bg-gray-50 rounded-[35px] font-bold outline-none h-40 resize-none transition-all" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setEditingProgram(null)} className="flex-1 py-5 bg-gray-100 rounded-[25px] font-black text-gray-500 hover:bg-gray-200 transition-all text-xs uppercase tracking-widest">Mégse</button>
                <button type="submit" className="flex-1 py-5 bg-red-500 text-white rounded-[25px] font-black text-xs uppercase tracking-widest hover:bg-red-600 shadow-xl shadow-red-500/30 transition-all">Mentés ✨</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
