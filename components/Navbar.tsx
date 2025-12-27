
import React, { useState } from 'react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Kezdőlap', value: Page.Home },
    { label: 'Programok', value: Page.Programs },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 glass z-[100] border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => setCurrentPage(Page.Home)}
          >
            {/* Logo Container - Place your logo.png in the root folder */}
            <div className="relative w-16 h-16 mr-4 floating">
              <div className="absolute inset-0 bg-red-500 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform opacity-20"></div>
              <img 
                src="logo.png" 
                alt="Kincsek" 
                className="w-full h-full object-contain rounded-2xl bg-white p-1.5 shadow-md relative z-10"
                onError={(e) => {
                  // Fallback if logo.png is missing
                  e.currentTarget.src = "https://api.dicebear.com/7.x/initials/svg?seed=Kincsek&backgroundColor=ef4444&fontFamily=Plus%20Jakarta%20Sans&fontWeight=800";
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tighter text-[#0f172a] leading-none">
                KINCSEK
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] font-black text-red-500 mt-1">
                Művészeti Klub
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => setCurrentPage(item.value)}
                className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  currentPage === item.value
                    ? 'bg-red-500 text-white shadow-xl shadow-red-200 scale-105'
                    : 'text-gray-600 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 rounded-2xl bg-gray-50 text-gray-800 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass border-t border-white/20 animate-slideDown overflow-hidden">
          <div className="px-4 py-6 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  setCurrentPage(item.value);
                  setIsOpen(false);
                }}
                className={`block w-full text-center py-4 rounded-2xl text-lg font-bold transition-all ${
                  currentPage === item.value
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'text-gray-700 bg-white/50 hover:bg-red-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
