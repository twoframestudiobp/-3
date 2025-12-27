
import React, { useState } from 'react';
import { Program, Lead, Page, Founder } from '../types';

interface ProgramsPageProps {
  programs: Program[];
  setCurrentPage: (page: Page) => void;
  founders: { edina: Founder, zita: Founder };
}

const ProgramsPage: React.FC<ProgramsPageProps> = ({ programs, setCurrentPage, founders }) => {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    message: '',
    acceptTerms: false,
    acceptPrivacy: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const closeModal = () => {
    setSelectedProgram(null);
    setIsSubmitted(false);
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      message: '',
      acceptTerms: false,
      acceptPrivacy: false
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      alert("Kérjük, fogadd el az ÁSZF-et és az Adatkezelési nyilatkozatot a jelentkezéshez!");
      return;
    }

    // Fixed: Added missing 'status' property to satisfy the Lead interface
    const newLead: Lead = {
      id: Date.now().toString(),
      programTitle: selectedProgram?.title || 'Ismeretlen program',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      timestamp: new Date().toLocaleString('hu-HU'),
      status: 'new'
    };

    const existingLeadsRaw = localStorage.getItem('kincsek_leads');
    const existingLeads: Lead[] = existingLeadsRaw ? JSON.parse(existingLeadsRaw) : [];
    localStorage.setItem('kincsek_leads', JSON.stringify([newLead, ...existingLeads]));

    setIsSubmitted(true);
  };

  return (
    <div className="py-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Aktuális <span className="text-red-500">Programjaink</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Válogassatok színes palettánkról! Minden foglalkozásunkat úgy alakítjuk ki, hogy az öröm és a fejlődés kéz a kézben járjon.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {programs.map((program) => (
          <div key={program.id} className="group bg-white rounded-[40px] overflow-hidden shadow-lg border border-red-50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
            <div className="h-56 overflow-hidden relative">
              <img src={program.imageUrl} alt={program.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-red-600 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                {program.category}
              </div>
            </div>
            <div className="p-8 flex flex-col flex-grow">
              <div className="flex items-center text-teal-600 text-sm font-bold mb-3">
                <span className="mr-2 text-lg">📅</span> {program.date}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{program.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">
                {program.description}
              </p>
              <button 
                onClick={() => setSelectedProgram(program)}
                className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"
              >
                Érdekel a jelentkezés
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Program Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-[#0f172a]/80 backdrop-blur-md transition-all animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col">
            <div className="relative h-64 sm:h-80 shrink-0">
              <img src={selectedProgram.imageUrl} alt={selectedProgram.title} className="w-full h-full object-cover" />
              <button 
                onClick={closeModal}
                className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-8 sm:p-12 overflow-y-auto">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-4 py-1.5 bg-red-50 text-red-500 text-xs font-bold rounded-full uppercase tracking-widest border border-red-100">
                  {selectedProgram.category}
                </span>
                <span className="flex items-center text-teal-600 font-bold">
                   <span className="mr-2 text-xl">📅</span> {selectedProgram.date}
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
                {selectedProgram.title}
              </h2>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-10 whitespace-pre-wrap">
                {selectedProgram.description}
              </p>

              <div className="mb-10 bg-gray-50 p-8 rounded-[35px] border border-gray-100">
                {isSubmitted ? (
                  <div className="text-center py-6 animate-fadeIn">
                    <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Köszönjük az érdeklődést!</h3>
                    <p className="text-gray-600 font-medium">Hamarosan felvesszük veled a kapcsolatot a megadott elérhetőségeken.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Szeretnél jelentkezni?</h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input
                        required
                        type="text"
                        placeholder="Neved"
                        className="px-6 py-4 rounded-2xl bg-white border border-transparent focus:border-red-500 outline-none transition-all font-medium shadow-sm"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                      <input
                        required
                        type="tel"
                        placeholder="Telefonszámod"
                        className="px-6 py-4 rounded-2xl bg-white border border-transparent focus:border-red-500 outline-none transition-all font-medium shadow-sm"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <input
                      required
                      type="email"
                      placeholder="Email címed"
                      className="w-full px-6 py-4 rounded-2xl bg-white border border-transparent focus:border-red-500 outline-none transition-all font-medium shadow-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <textarea
                      placeholder="Megjegyzés (opcionális)"
                      rows={3}
                      className="w-full px-6 py-4 rounded-2xl bg-white border border-transparent focus:border-red-500 outline-none transition-all font-medium shadow-sm resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />

                    {/* Legal Checkboxes */}
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          required
                          className="mt-1 w-5 h-5 accent-red-500"
                          checked={formData.acceptTerms}
                          onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                        />
                        <span className="text-sm text-gray-600 leading-tight group-hover:text-gray-900 transition-colors">
                          Elolvastam és elfogadom az <button type="button" onClick={() => setCurrentPage(Page.Terms)} className="text-red-500 font-bold hover:underline">Általános Szerződési Feltételeket (ÁSZF)</button>.
                        </span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          required
                          className="mt-1 w-5 h-5 accent-red-500"
                          checked={formData.acceptPrivacy}
                          onChange={(e) => setFormData({...formData, acceptPrivacy: e.target.checked})}
                        />
                        <span className="text-sm text-gray-600 leading-tight group-hover:text-gray-900 transition-colors">
                          Hozzájárulok adataim kezeléséhez az <button type="button" onClick={() => setCurrentPage(Page.PrivacyPolicy)} className="text-red-500 font-bold hover:underline">Adatkezelési nyilatkozatban</button> foglaltak szerint.
                        </span>
                      </label>
                    </div>
                    
                    <button 
                      type="submit"
                      className="w-full py-4 bg-teal-500 text-white font-bold rounded-2xl hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/20"
                    >
                      Jelentkezés elküldése ✨
                    </button>
                  </form>
                )}
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6 bg-red-50/50 p-8 rounded-3xl border border-red-100 mb-10">
                 <div>
                    <h4 className="text-red-600 font-black text-xs uppercase tracking-widest mb-4">Hívd Edinát közvetlenül:</h4>
                    <a href={`tel:${founders.edina.phone}`} className="text-xl font-bold text-gray-800 hover:text-red-500 transition-colors flex items-center gap-3">
                       <span className="text-2xl">📞</span> {founders.edina.phone}
                    </a>
                 </div>
                 <div>
                    <h4 className="text-teal-600 font-black text-xs uppercase tracking-widest mb-4">Hívd Zitát közvetlenül:</h4>
                    <a href={`tel:${founders.zita.phone}`} className="text-xl font-bold text-gray-800 hover:text-teal-500 transition-colors flex items-center gap-3">
                       <span className="text-2xl">📞</span> {founders.zita.phone}
                    </a>
                 </div>
              </div>

              <button 
                onClick={closeModal}
                className="w-full py-5 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
              >
                Vissza a programokhoz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramsPage;
