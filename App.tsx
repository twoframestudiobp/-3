
import React, { useState, useEffect } from 'react';
import { Page, Program, Founder, Announcement } from './types';
import { INITIAL_PROGRAMS, DEFAULT_FOUNDERS } from './constants';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProgramsPage from './components/ProgramsPage';
import AdminPanel from './components/AdminPanel';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import LegalPage from './components/LegalPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [founders, setFounders] = useState<{ edina: Founder, zita: Founder }>(DEFAULT_FOUNDERS);
  const [announcement, setAnnouncement] = useState<Announcement>({
    text: 'Szeretettel várunk mindenkit az új tavaszi foglalkozásainkon! ✨',
    isActive: true,
    type: 'info'
  });

  useEffect(() => {
    // Load Programs
    const savedPrograms = localStorage.getItem('kincsek_programs');
    if (savedPrograms) {
      setPrograms(JSON.parse(savedPrograms));
    } else {
      setPrograms(INITIAL_PROGRAMS);
      localStorage.setItem('kincsek_programs', JSON.stringify(INITIAL_PROGRAMS));
    }

    // Load Founders
    const savedFounders = localStorage.getItem('kincsek_founders');
    if (savedFounders) {
      setFounders(JSON.parse(savedFounders));
    }

    // Load Announcement
    const savedAnnouncement = localStorage.getItem('kincsek_announcement');
    if (savedAnnouncement) {
      setAnnouncement(JSON.parse(savedAnnouncement));
    }

    // Scroll to top on page change
    window.scrollTo(0, 0);
  }, [currentPage]);

  const updatePrograms = (newPrograms: Program[]) => {
    setPrograms(newPrograms);
    localStorage.setItem('kincsek_programs', JSON.stringify(newPrograms));
  };

  const updateFounders = (newFounders: { edina: Founder, zita: Founder }) => {
    setFounders(newFounders);
    localStorage.setItem('kincsek_founders', JSON.stringify(newFounders));
  };

  const updateAnnouncement = (newAnnouncement: Announcement) => {
    setAnnouncement(newAnnouncement);
    localStorage.setItem('kincsek_announcement', JSON.stringify(newAnnouncement));
  };

  const renderContent = () => {
    switch (currentPage) {
      case Page.Home:
        return <Home setPage={setCurrentPage} founders={founders} />;
      case Page.Programs:
        return <ProgramsPage programs={programs} setCurrentPage={setCurrentPage} founders={founders} />;
      case Page.Admin:
        return <AdminPanel 
          programs={programs} 
          setPrograms={updatePrograms} 
          founders={founders}
          setFounders={updateFounders}
          announcement={announcement}
          setAnnouncement={updateAnnouncement}
        />;
      case Page.PrivacyPolicy:
        return <LegalPage type="privacy" />;
      case Page.Terms:
        return <LegalPage type="terms" />;
      default:
        return <Home setPage={setCurrentPage} founders={founders} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      {announcement.isActive && (
        <div className={`py-2 px-6 text-center text-xs font-black uppercase tracking-[0.2em] animate-fadeIn transition-colors relative z-[110] ${
          announcement.type === 'urgent' ? 'bg-red-600 text-white' : 
          announcement.type === 'success' ? 'bg-teal-500 text-white' : 
          'bg-[#0f172a] text-white'
        }`}>
          {announcement.text}
        </div>
      )}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className={`flex-grow ${announcement.isActive ? 'pt-24' : 'pt-16'}`}>
        {renderContent()}
      </main>
      <Chatbot />
      <CookieConsent />
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default App;
