
import React, { useState, useEffect } from 'react';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('kincsek_cookie_consent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 1500);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('kincsek_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[300] p-4 sm:p-8 animate-slideDown pointer-events-none">
      <div className="max-w-4xl mx-auto glass p-6 sm:p-8 rounded-[35px] shadow-2xl border border-red-100 flex flex-col sm:flex-row items-center gap-6 pointer-events-auto">
        <div className="w-16 h-16 shrink-0 bg-red-50 rounded-2xl flex items-center justify-center text-3xl">🍪</div>
        <div className="flex-grow text-center sm:text-left">
          <h4 className="text-lg font-black text-gray-900 mb-1">Süti figyelmeztetés</h4>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            A weboldalunk sütiket használ a legjobb felhasználói élmény érdekében. Ha tovább böngészel, azzal elfogadod a sütik használatát.
          </p>
        </div>
        <div className="flex gap-4 shrink-0">
          <button 
            onClick={acceptCookies}
            className="px-8 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
          >
            Rendben, elfogadom
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
