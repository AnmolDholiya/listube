import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Search, ChevronRight } from 'lucide-react';

export const LandingNavbar = ({ onNavigate, onOpenLedger, currentView, setCurrentView }) => {
  const { isAuthenticated, businessName, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (currentView !== 'landing') {
      if (setCurrentView) setCurrentView('landing');
      if (onNavigate) onNavigate('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigate = (view) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (setCurrentView) {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 1. Top Announcement Bar - Directly from CedCommerce Reference */}
      {showAnnouncement && (
        <div className="bg-[#080912] border-b border-white/10 text-xs text-gray-300 py-2.5 px-4 text-center relative z-50 transition-all">
          <div className="max-w-[1360px] mx-auto flex items-center justify-center gap-2 pr-6">
            <span>Ready for your biggest quarter? Expand to Multi-Marketplace with automated AI intelligence.</span>
            <button 
              onClick={() => handleNavigate('register')}
              className="font-semibold text-white underline underline-offset-2 hover:text-[#4563FF] transition cursor-pointer"
            >
              Get started
            </button>
          </div>
          <button 
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition p-1 cursor-pointer"
            aria-label="Close banner"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <header 
        className={`sticky top-0 z-40 transition-all duration-200 ${
          scrolled 
            ? 'bg-[#05060B]/95 backdrop-blur-md border-b border-white/10 shadow-lg' 
            : 'bg-[#05060B] border-b border-white/5'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between gap-6">
          
          {/* LEFT: CedCommerce-Style Boxed Brand Wordmark */}
          <div className="flex items-center gap-3.5 shrink-0">
            <button 
              onClick={() => handleNavigate('landing')}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              {/* Geometric Monogram Emblem (Diamond/Hexagon inspired by reference) */}
              <div className="w-10 h-10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 3L32 17L18 31L4 17L18 3Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
                  <path d="M11 24L18 31L25 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 3V17" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M4 17H18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>

              {/* Framed Wordmark box - Identical composition to CED COMMERCE */}
              <div className="border border-white/80 px-2.5 py-1 rounded-[2px] leading-tight">
                <div className="text-[11px] font-bold tracking-[0.28em] text-white font-mono uppercase">
                  COMMERCE
                </div>
                <div className="text-[9px] font-semibold tracking-[0.24em] text-gray-300 font-mono uppercase mt-0.5 border-t border-white/30 pt-0.5">
                  INTELLIGENCE
                </div>
              </div>
            </button>
          </div>

          {/* CENTER: Navigation Links (CedCommerce Labels & Spacing) */}
          <nav className="hidden xl:flex items-center gap-9 text-[14px] font-medium text-gray-200">
            <button
              onClick={() => scrollToSection('platform-overview')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Sell on Marketplaces
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Our Technology
            </button>
            <button
              onClick={() => scrollToSection('solutions')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('data-sources')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Integrations
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Company
            </button>
            
            {/* Search Icon button */}
            <button 
              onClick={() => scrollToSection('platform-overview')}
              className="text-gray-300 hover:text-white transition cursor-pointer p-1"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </nav>

          {/* RIGHT: Actions */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 font-mono truncate max-w-[130px]">
                  {businessName || 'Connected'}
                </span>
                <button
                  onClick={onOpenLedger}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#05060B] font-semibold text-xs hover:bg-gray-100 transition shadow-sm cursor-pointer"
                >
                  Open Dashboard
                  <span className="w-5 h-5 rounded-full bg-[#05060B] text-white flex items-center justify-center text-[10px]">↗</span>
                </button>
                <button
                  onClick={logout}
                  className="text-xs text-gray-400 hover:text-white transition cursor-pointer px-2 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <button
                  onClick={() => handleNavigate('login')}
                  className="text-sm font-medium text-gray-300 hover:text-white transition cursor-pointer"
                >
                  Sign In
                </button>
                
                {/* Primary Button styled identically to reference */}
                <button
                  onClick={() => handleNavigate('register')}
                  className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white hover:bg-gray-100 text-[#05060B] font-semibold text-sm transition-all shadow-md group cursor-pointer"
                >
                  <span>Get Started</span>
                  <span className="w-6 h-6 rounded-full bg-[#05060B] text-white flex items-center justify-center text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    ↗
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#080910] border-b border-white/10 px-6 py-6 flex flex-col gap-4 text-sm animate-in fade-in slide-in-from-top-2">
            <button
              onClick={() => scrollToSection('platform-overview')}
              className="text-left text-gray-300 hover:text-white py-2"
            >
              Sell on Marketplaces
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left text-gray-300 hover:text-white py-2"
            >
              Our Technology
            </button>
            <button
              onClick={() => scrollToSection('solutions')}
              className="text-left text-gray-300 hover:text-white py-2"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('data-sources')}
              className="text-left text-gray-300 hover:text-white py-2"
            >
              Integrations
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-left text-gray-300 hover:text-white py-2"
            >
              Company
            </button>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={onOpenLedger}
                    className="w-full py-3 rounded-full bg-white text-[#05060B] font-semibold text-center flex items-center justify-center gap-2"
                  >
                    Open Dashboard <span>↗</span>
                  </button>
                  <button
                    onClick={logout}
                    className="w-full py-2 text-center text-gray-400 hover:text-white text-xs"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigate('login')}
                    className="w-full py-2.5 rounded-lg border border-white/10 text-white font-medium text-center"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleNavigate('register')}
                    className="w-full py-3 rounded-full bg-white text-[#05060B] font-semibold text-center flex items-center justify-center gap-2 shadow-md"
                  >
                    Get Started <span className="w-5 h-5 rounded-full bg-[#05060B] text-white flex items-center justify-center text-xs">↗</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
