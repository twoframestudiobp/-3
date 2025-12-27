
import React, { useState, useEffect } from 'react';
import { Page, Founder } from '../types';
import { generateDrawingFromGemini } from '../services/geminiService';

interface HomeProps {
  setPage: (page: Page) => void;
  founders: { edina: Founder, zita: Founder };
}

const Home: React.FC<HomeProps> = ({ setPage, founders }) => {
  const [ideaInput, setIdeaInput] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const savedGallery = localStorage.getItem('kincsek_gallery');
    if (savedGallery) {
      setGalleryImages(JSON.parse(savedGallery));
    } else {
      setGalleryImages([
        'https://picsum.photos/seed/k1/800/600',
        'https://picsum.photos/seed/k2/800/600',
        'https://picsum.photos/seed/k3/800/600',
        'https://picsum.photos/seed/k4/800/600'
      ]);
    }
  }, []);

  const handleGenerateDrawing = async () => {
    if (!ideaInput.trim()) return;
    setIsGenerating(true);
    setGeneratedImageUrl(null);
    const imageUrl = await generateDrawingFromGemini(ideaInput);
    if (imageUrl) {
      setGeneratedImageUrl(imageUrl);
    } else {
      alert("Hoppá, a kis ceruzánk most kifogyott... Próbáld újra egy kicsit később!");
    }
    setIsGenerating(false);
  };

  const faqs = [
    { q: "Hány éves kortól lehet jelentkezni?", a: "Foglalkozásaink többsége 3-tól 10 éves korig ajánlott, de a néptánc csoportjainkban már az egészen piciket is szívesen látjuk szülői kísérettel." },
    { q: "Mit kell hozni a foglalkozásokra?", a: "Kényelmes váltóruha és egy kis innivaló mindenképpen ajánlott. A kézműves foglalkozásokhoz minden eszközt mi biztosítunk." },
    { q: "Van lehetőség próbaalkalomra?", a: "Természetesen! Hiszünk abban, hogy a gyermeknek és a szülőnek is éreznie kell a hely hangulatát. Az első alkalom után eldönthetitek, szeretnétek-e csatlakozni a kincskeresőkhöz." },
    { q: "Hol tudok parkolni?", a: "A Tűzoltó utcában és a környező utcákban hétköznap fizetős a parkolás, de általában könnyen található szabad hely a közelben." }
  ];

  const testimonials = [
    { name: "Katalin", text: "A kisfiam minden kedden már reggel a tánccipőjét keresi. Edina energiája egyszerűen magával ragadó!", icon: "🌟" },
    { name: "Péter", text: "Zita néni türelme és az érzelmi műhely segített a lányomnak, hogy bátrabban fejezze ki magát.", icon: "❤️" },
    { name: "Eszter", text: "Végre egy hely, ahol a hagyomány nem unalmas, hanem egy hatalmas közös játék!", icon: "🎨" }
  ];

  return (
    <div className="animate-fadeIn pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-500/10 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest mb-8">
              🏠 Ahol otthon érzed magad
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#0f172a] leading-[1.05] mb-8 tracking-tighter">
              Kicsi kezek, <br/><span className="gradient-text">óriási</span> álmok.
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg font-medium">
              Suki Edina és Zita vár titeket egy olyan helyen, ahol a gyerekek szabadon alkothatnak, táncolhatnak és önmaguk lehetnek.
            </p>
            <div className="flex flex-wrap gap-5">
              <button 
                onClick={() => setPage(Page.Programs)}
                className="px-10 py-5 bg-red-500 text-white font-bold rounded-[20px] shadow-2xl hover:bg-red-600 transform hover:-translate-y-1 transition-all flex items-center gap-3 text-lg"
              >
                Válogass a programokból!
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="glass rounded-[50px] p-5 border-red-100/50 shadow-2xl">
               <img 
                src="https://picsum.photos/seed/kids-happy/1000/1000" 
                alt="Boldog gyerekek" 
                className="rounded-[35px] shadow-inner"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 glass p-8 rounded-[35px] shadow-2xl z-20 border-teal-100 hidden sm:block animate-bounce-slow">
              <span className="block text-4xl font-black text-teal-600 mb-1">Család</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Minden mozdulatban</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-red-50/40 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Szülők, akik már <span className="text-red-500">megérkeztek</span></h2>
            <div className="w-20 h-1.5 bg-red-200 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[40px] shadow-xl border border-red-50 hover:-translate-y-2 transition-all duration-500">
                <div className="text-5xl mb-6">{t.icon}</div>
                <p className="text-gray-600 italic text-lg leading-relaxed mb-8 font-medium">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold">{t.name[0]}</div>
                  <p className="font-black text-gray-900">{t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Gyakori <span className="text-teal-600">kérdések</span></h2>
          <p className="text-gray-500 font-medium">Minden, amit tudni érdemes az első látogatás előtt.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-8 py-6 text-left flex justify-between items-center group"
              >
                <span className="font-bold text-gray-800 group-hover:text-red-500 transition-colors">{faq.q}</span>
                <span className={`text-2xl transition-transform duration-300 ${openFaq === idx ? 'rotate-45 text-red-500' : 'text-gray-300'}`}>+</span>
              </button>
              <div className={`px-8 transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-96 pb-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-600 leading-relaxed font-medium">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Drawing Generator */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-teal-500/5 rounded-full blur-[150px]"></div>
        <div className="max-w-4xl mx-auto glass p-8 sm:p-12 rounded-[50px] shadow-2xl border-2 border-red-50 relative z-10">
           <div className="text-center mb-12">
              <div className="w-16 h-16 bg-teal-500 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg shadow-teal-500/20">🎨</div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">Digitális <span className="text-teal-600">Rajzlap</span></h2>
              <p className="text-gray-500 text-lg font-medium">Írd be, mit rajzoljon az AI művészünk neked!</p>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-5 mb-10">
              <input 
                type="text" 
                placeholder="Pl: egy piros sárkány, vidám kutyus..." 
                className="flex-grow px-8 py-5 rounded-2xl bg-white border-2 border-red-50 focus:border-red-500 outline-none transition-all shadow-sm text-lg font-medium"
                value={ideaInput}
                onChange={(e) => setIdeaInput(e.target.value)}
              />
              <button 
                onClick={handleGenerateDrawing}
                disabled={isGenerating}
                className="px-10 py-5 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600 disabled:opacity-50 transition-all flex items-center justify-center shadow-xl shadow-red-500/20 text-lg"
              >
                {isGenerating ? 'Rajzolok...' : 'Rajzold le!'}
              </button>
           </div>

           {(isGenerating || generatedImageUrl) && (
             <div className="mt-4 p-4 bg-white rounded-[45px] border-8 border-red-50 shadow-inner flex flex-col items-center justify-center min-h-[350px] animate-fadeIn">
                {isGenerating ? (
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 border-8 border-red-100 border-t-red-500 rounded-full animate-spin mb-6"></div>
                    <p className="text-red-500 font-bold animate-pulse">Keresem a színes ceruzákat...</p>
                  </div>
                ) : (
                  <div className="w-full relative group">
                    <img 
                      src={generatedImageUrl!} 
                      alt="Generált rajz" 
                      className="w-full max-w-[500px] mx-auto rounded-[30px] shadow-lg animate-scaleUp"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-black text-red-500 uppercase tracking-widest shadow-sm">
                      ✨ Kincsek Alkotás
                    </div>
                  </div>
                )}
             </div>
           )}
        </div>
      </section>

      {/* Founders */}
      <section id="founders" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Várunk titeket <span className="text-red-500">szeretettel</span></h2>
          <div className="w-20 h-1.5 bg-teal-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {[founders.edina, founders.zita].map((founder, idx) => (
            <div key={idx} className="group glass p-12 rounded-[50px] hover:bg-white transition-all duration-700 border border-red-50 hover:shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center gap-10 mb-10">
                <div className="relative">
                  <div className="absolute -inset-4 bg-teal-500/10 rounded-[50px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <img src={founder.image} alt={founder.name} className="w-48 h-48 rounded-[40px] object-cover shadow-2xl border-4 border-white relative z-10 group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{founder.name}</h3>
                  <p className="text-red-500 font-black text-xs uppercase tracking-[0.3em] mb-4">{founder.role}</p>
                  <a href={`tel:${founder.phone}`} className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-50 text-red-600 font-black hover:bg-red-500 hover:text-white transition-all shadow-sm">
                    <span>📞</span> {founder.phone}
                  </a>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg font-medium opacity-90">
                {founder.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Gallery Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
         <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-2">Pillanatképek</h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Így alkotunk mi</p>
            </div>
         </div>
         <div className="flex flex-nowrap md:grid md:grid-cols-4 lg:grid-cols-4 gap-6 overflow-x-auto pb-8 snap-x scroll-smooth">
            {galleryImages.map((url, i) => (
              <div key={i} className={`min-w-[300px] h-[400px] bg-gray-100 rounded-[45px] overflow-hidden shadow-xl snap-center group relative border-8 border-white ${i % 2 !== 0 ? 'md:translate-y-8' : ''}`}>
                <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Galéria kép" />
                <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default Home;
