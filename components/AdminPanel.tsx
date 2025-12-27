
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
  const [activeTab, setActiveTab] = useState<'overview' | 'programs' | 'gallery' | 'leads' | 'founders' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [edinaImg, setEdinaImg] = useState(founders.edina.image);
  const [zitaImg, setZitaImg] = useState(founders.zita.image);
  const [annText, setAnnText] = useState(announcement.text);
  const [annActive, setAnnActive] = useState(announcement.isActive);
  const [annType, setAnnType] = useState(announcement.type);

  useEffect(() => {
    // Load Gallery
    const savedGallery = localStorage.getItem('kincsek_gallery');
    if (savedGallery) {
      setGalleryImages(JSON.parse(savedGallery));
    }
    // Load Leads
    const savedLeads = localStorage.getItem('kincsek_leads');
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads));
    }
  }, [activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') setIsAuthenticated(true);
    else alert('Hibás jelszó!');
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.programTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    const newLeads = leads.map(l => l.id === id ? { ...l, status } : l);
    setLeads(newLeads);
    localStorage.setItem('kincsek_leads', JSON.stringify(newLeads));
  };

  const handleDeleteLead = (id: string) => {
    if (!window.confirm('Töröljük?')) return;
    const newLeads = leads.filter(l => l.id !== id);
    setLeads(newLeads);
    localStorage.setItem('kincsek_leads', JSON.stringify(newLeads));
  };

  const handleSaveFounders = () => {
    setFounders({
      edina: { ...founders.edina, image: edinaImg },
      zita: { ...founders.zita, image: zitaImg }
    });
    alert('Profilképek mentve!');
  };

  const handleSaveAnnouncement = () => {
    setAnnouncement({ text: annText, isActive: annActive, type: annType });
    alert('Közlemény frissítve!');
  };

  // Fixed: Implemented the missing handleSaveProgram function to manage program list updates
  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;

    if (!editingProgram.title || !editingProgram.description) {
      alert('A cím és a leírás megadása kötelező!');
      return;
    }

    let updatedPrograms: Program[];
    if (editingProgram.id) {
      // Update existing program
      updatedPrograms = programs.map(p => 
        p.id === editingProgram.id ? (editingProgram as Program) : p
      );
    } else {
      // Create new program with a unique ID
      const newProgram: Program = {
        id: Date.now().toString(),
        title: editingProgram.title || '',
        description: editingProgram.description || '',
        date: editingProgram.date || '',
        imageUrl: editingProgram.imageUrl || 'https://picsum.photos/seed/art/800/600',
        category: editingProgram.category || 'Általános'
      };
      updatedPrograms = [...programs, newProgram];
    }

    setPrograms(updatedPrograms);
    setEditingProgram(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-gray-50/50">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-red-100 w-full max-w-md text-center animate-scaleUp">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white text-3xl font-black shadow-xl">K</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h2>
          <p className="text-gray-500 mb-8 text-sm">Üdvözlünk újra, Edina és Zita!</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white outline-none transition-all text-center font-bold"
              placeholder="Jelszó..."
            />
            <button className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-red-500/30 active:scale-95">
              Belépés
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 sm:px-12 max-w-7xl mx-auto animate-fadeIn bg-transparent">
      {/* Header & Navigation */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Kezelőfelület</h1>
          <p className="text-gray-500 font-medium">Itt tudjátok irányítani a Kincsek Művészeti Klub digitális életét.</p>
        </div>
        <div className="flex bg-white shadow-sm border border-gray-100 p-1.5 rounded-2xl overflow-x-auto max-w-full">
          {[
            { id: 'overview', label: 'Áttekintés', color: 'text-indigo-500' },
            { id: 'leads', label: 'Jelentkezések', color: 'text-blue-500' },
            { id: 'programs', label: 'Programok', color: 'text-red-500' },
            { id: 'gallery', label: 'Galéria', color: 'text-teal-500' },
            { id: 'founders', label: 'Alapítók', color: 'text-orange-500' },
            { id: 'settings', label: 'Beállítások', color: 'text-gray-600' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? `bg-gray-50 ${tab.color} shadow-inner` : 'text-gray-400 hover:text-gray-800'}`}
            >
              {activeTab === tab.id && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="animate-fadeIn">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-xl mb-4">📬</div>
                <div className="text-3xl font-black text-gray-900">{leads.length}</div>
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Összes jelentkező</div>
              </div>
              <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-xl mb-4">🔔</div>
                <div className="text-3xl font-black text-red-500">{leads.filter(l => l.status === 'new').length}</div>
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Új (feldolgozatlan)</div>
              </div>
              <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="w-12 h-12 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center text-xl mb-4">🎨</div>
                <div className="text-3xl font-black text-gray-900">{programs.length}</div>
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Aktív program</div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center text-sm">✨</span>
                  Legutóbbi jelentkezések
                </h3>
                <div className="space-y-4">
                  {leads.slice(0, 5).map(l => (
                    <div key={l.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <div className="font-bold text-gray-900">{l.name}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">{l.programTitle}</div>
                      </div>
                      <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase ${l.status === 'new' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                        {l.status === 'new' ? 'Új' : 'Kezelt'}
                      </span>
                    </div>
                  ))}
                  {leads.length === 0 && <p className="text-center py-10 text-gray-300 font-bold">Nincs adat.</p>}
                </div>
                <button onClick={() => setActiveTab('leads')} className="w-full mt-6 py-3 text-sm font-bold text-blue-500 hover:bg-blue-50 rounded-xl transition-all">Összes megtekintése</button>
              </div>

              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center text-sm">📢</span>
                  Közlemény állapota
                </h3>
                <div className={`p-6 rounded-3xl mb-6 ${annActive ? 'bg-teal-50 border border-teal-100' : 'bg-gray-50 border border-gray-100'}`}>
                   <p className={`text-sm font-medium ${annActive ? 'text-teal-800' : 'text-gray-400'}`}>
                     {annActive ? `"${annText}"` : "Jelenleg nincs aktív közlemény a weboldalon."}
                   </p>
                </div>
                <button onClick={() => setActiveTab('settings')} className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all">Beállítások módosítása</button>
              </div>
            </div>
          </div>
        )}

        {/* LEADS TAB */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input 
                type="text" 
                placeholder="Keresés név vagy program alapján..." 
                className="flex-grow px-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:border-blue-500 outline-none font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="bg-white rounded-[35px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-4">Státusz</th>
                      <th className="px-8 py-4">Név</th>
                      <th className="px-8 py-4">Program</th>
                      <th className="px-8 py-4">Kapcsolat</th>
                      <th className="px-8 py-4 text-right">Művelet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredLeads.map(l => (
                      <tr key={l.id} className={`hover:bg-gray-50/50 transition-colors ${l.status === 'new' ? 'bg-red-50/10' : ''}`}>
                        <td className="px-8 py-5">
                          <select 
                            value={l.status} 
                            onChange={(e) => updateLeadStatus(l.id, e.target.value as any)}
                            className={`text-[9px] font-black uppercase rounded-full px-3 py-1.5 cursor-pointer outline-none border-none ${
                              l.status === 'new' ? 'bg-red-100 text-red-600' : 
                              l.status === 'contacted' ? 'bg-orange-100 text-orange-600' : 'bg-teal-100 text-teal-600'
                            }`}
                          >
                            <option value="new">Új</option>
                            <option value="contacted">Felhívva</option>
                            <option value="enrolled">Felvéve</option>
                          </select>
                        </td>
                        <td className="px-8 py-5">
                          <div className="font-bold text-gray-900">{l.name}</div>
                          <div className="text-[10px] text-gray-300 font-bold">{l.timestamp}</div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-xs font-bold text-gray-500">{l.programTitle}</span>
                        </td>
                        <td className="px-8 py-5">
                           <div className="text-xs font-bold">{l.phone}</div>
                           <div className="text-[10px] text-gray-400">{l.email}</div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button onClick={() => handleDeleteLead(l.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredLeads.length === 0 && <div className="py-20 text-center text-gray-300 font-bold">Nincs találat.</div>}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-10">
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold mb-8">Weboldal Közlemény</h3>
              <div className="space-y-6">
                <div>
                   <label className="block text-xs font-black text-gray-400 uppercase mb-3">Közlemény szövege</label>
                   <textarea 
                     className="w-full p-6 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-red-500 outline-none font-medium text-gray-900 resize-none"
                     rows={3}
                     value={annText}
                     onChange={(e) => setAnnText(e.target.value)}
                     placeholder="Pl. Karbantartás miatt zárva..."
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-black text-gray-400 uppercase mb-3">Stílus</label>
                     <select 
                       className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none text-sm font-bold"
                       value={annType}
                       onChange={(e) => setAnnType(e.target.value as any)}
                     >
                       <option value="info">Normál (Sötétkék)</option>
                       <option value="urgent">Sürgős (Piros)</option>
                       <option value="success">Örömteli (Zöld)</option>
                     </select>
                   </div>
                   <div className="flex items-center gap-4 pt-8">
                      <button 
                        onClick={() => setAnnActive(!annActive)}
                        className={`w-12 h-6 rounded-full transition-all relative ${annActive ? 'bg-teal-500' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${annActive ? 'left-7' : 'left-1'}`}></div>
                      </button>
                      <span className="text-sm font-bold text-gray-600">{annActive ? 'Látható' : 'Rejtett'}</span>
                   </div>
                </div>
                <button 
                  onClick={handleSaveAnnouncement}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all mt-4"
                >
                  Beállítások mentése
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PROGRAMS TAB */}
        {activeTab === 'programs' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button 
                onClick={() => setEditingProgram({ title: '', description: '', date: '', category: 'Általános', imageUrl: 'https://picsum.photos/seed/art/800/600' })}
                className="px-8 py-3 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 shadow-lg shadow-red-500/20"
              >
                + Új Program
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map(p => (
                <div key={p.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="h-40 rounded-2xl overflow-hidden mb-4 bg-gray-100">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">{p.category}</div>
                  <h4 className="font-bold text-gray-900 mb-2 truncate">{p.title}</h4>
                  <div className="text-xs text-gray-400 font-medium mb-6 line-clamp-2">{p.description}</div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingProgram(p)} className="flex-grow py-2.5 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100">Szerkesztés</button>
                    <button onClick={() => setPrograms(programs.filter(x => x.id !== p.id))} className="px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-xs font-bold hover:bg-red-100">Törlés</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Új kép a galériába</h3>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Kép URL..." 
                  className="flex-grow px-6 py-4 rounded-2xl bg-gray-50 outline-none font-medium"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
                <button onClick={() => { if(newImageUrl) { setGalleryImages([...galleryImages, newImageUrl]); localStorage.setItem('kincsek_gallery', JSON.stringify([...galleryImages, newImageUrl])); setNewImageUrl(''); }}} className="px-8 bg-teal-500 text-white rounded-2xl font-bold hover:bg-teal-600">Hozzáad</button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {galleryImages.map((img, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group border-4 border-white shadow-sm">
                  <img src={img} className="w-full h-full object-cover" />
                  <button onClick={() => { const n = galleryImages.filter((_, idx) => idx !== i); setGalleryImages(n); localStorage.setItem('kincsek_gallery', JSON.stringify(n)); }} className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOUNDERS TAB */}
        {activeTab === 'founders' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold mb-10 text-center">Profilképek frissítése</h3>
              <div className="space-y-12">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <img src={edinaImg} className="w-24 h-24 rounded-3xl object-cover shadow-lg" />
                  <div className="flex-grow w-full">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Edina profilképe</label>
                    <input type="text" value={edinaImg} onChange={(e) => setEdinaImg(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm font-medium" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <img src={zitaImg} className="w-24 h-24 rounded-3xl object-cover shadow-lg" />
                  <div className="flex-grow w-full">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Zita profilképe</label>
                    <input type="text" value={zitaImg} onChange={(e) => setZitaImg(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl outline-none text-sm font-medium" />
                  </div>
                </div>
                <button onClick={handleSaveFounders} className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 shadow-xl shadow-orange-500/20">Mentés</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Program Edit Modal */}
      {editingProgram && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-6 z-[200]">
          <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-2xl animate-scaleUp overflow-y-auto max-h-[90vh]">
            <h2 className="text-3xl font-black mb-8">{editingProgram.id ? 'Szerkesztés' : 'Új Program'}</h2>
            <div className="grid gap-6">
              <input value={editingProgram.title} onChange={(e) => setEditingProgram({...editingProgram, title: e.target.value})} placeholder="Cím" className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-red-500" />
              <div className="grid grid-cols-2 gap-4">
                <input value={editingProgram.date} onChange={(e) => setEditingProgram({...editingProgram, date: e.target.value})} placeholder="Időpont" className="p-4 bg-gray-50 rounded-xl font-bold outline-none" />
                <input value={editingProgram.category} onChange={(e) => setEditingProgram({...editingProgram, category: e.target.value})} placeholder="Kategória" className="p-4 bg-gray-50 rounded-xl font-bold outline-none" />
              </div>
              <input value={editingProgram.imageUrl} onChange={(e) => setEditingProgram({...editingProgram, imageUrl: e.target.value})} placeholder="Kép URL" className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none" />
              <textarea value={editingProgram.description} onChange={(e) => setEditingProgram({...editingProgram, description: e.target.value})} placeholder="Leírás" className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none h-32 resize-none" />
              <div className="flex gap-4 mt-6">
                <button onClick={() => setEditingProgram(null)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold text-gray-500">Mégse</button>
                <button onClick={() => { handleSaveProgram({ preventDefault: () => {} } as any); }} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold">Mentés</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
