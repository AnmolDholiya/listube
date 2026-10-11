import React from 'react';
import { ChevronRight } from 'lucide-react';

export const HeroSection = ({ onNavigate, onOpenLedger, isAuthenticated }) => {
  const handlePrimaryClick = () => {
    if (isAuthenticated) {
      if (onOpenLedger) onOpenLedger();
    } else {
      if (onNavigate) onNavigate('register');
    }
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-[#05060B] text-white pt-10 pb-20 lg:pt-16 lg:pb-28 overflow-hidden">
      {/* Ambient background glow */}
      <div 
        className="absolute top-1/4 right-1/4 w-[600px] h-[500px] pointer-events-none opacity-20 blur-[130px]"
        style={{
          background: 'radial-gradient(circle, #2563EB 0%, #1E1B4B 60%, transparent 80%)'
        }}
      />

      <div className="max-w-[1360px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* TOP TWO-COLUMN HERO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[560px]">
          
          {/* ============================================================== */}
          {/* LEFT SIDE: CedCommerce-Identical Headline, Eyebrow & Buttons */}
          {/* ============================================================== */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start pr-0 lg:pr-4">
            
            {/* Pill Eyebrow Tag: • CROSS-LIST · SYNC · GROW */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111827]/80 border border-blue-500/30 text-[11px] font-semibold tracking-wider text-blue-400 mb-6 uppercase shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#3B82F6] shadow-[0_0_8px_#3B82F6]" />
              <span>CROSS-LIST · SYNC · GROW</span>
            </div>

            {/* Dominant Headline (Identical scale and line-break rhythm to reference) */}
            <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-extrabold tracking-[-0.03em] leading-[1.0] text-white">
              Frictionless<br />
              Multichannel<br />
              Expansion<br />
              Partner
            </h1>

            {/* Editorial Subtitle Paragraph */}
            <p className="mt-6 text-[15px] sm:text-[17px] leading-relaxed text-[#94A3B8] max-w-[560px] font-normal">
              CommerceIntel, a Next-Gen platform, is your business's end-to-end eCommerce partner for cross-listing, channel expansion, and growth through listing optimization, AI intelligence, and managed marketplace services.
            </p>

            {/* Buttons: Get Started ↗ and Talk to an expert › */}
            <div className="mt-9 flex items-center gap-6">
              {/* Primary Pill Button */}
              <button
                onClick={handlePrimaryClick}
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-white hover:bg-gray-100 text-[#05060B] font-bold text-sm sm:text-base transition-all shadow-lg group cursor-pointer"
              >
                <span>Get Started</span>
                <span className="w-7 h-7 rounded-full bg-[#05060B] text-white flex items-center justify-center text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  ↗
                </span>
              </button>

              {/* Secondary Link */}
              <button
                onClick={scrollToHowItWorks}
                className="inline-flex items-center gap-1.5 text-[#94A3B8] hover:text-white font-medium text-sm sm:text-base transition cursor-pointer group"
              >
                <span>Talk to an expert</span>
                <span className="text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all">›</span>
              </button>
            </div>
          </div>


          {/* ============================================================== */}
          {/* RIGHT SIDE: CedCommerce-Identical Floating Ecosystem Tree       */}
          {/* (NO enclosing card box! Floats freely on the dark canvas)      */}
          {/* ============================================================== */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-center justify-center relative w-full pt-4">
            <div className="w-full max-w-[520px] relative flex flex-col items-center">
              
              {/* 1. TOP ROW: 3 Clean White Marketplace Cards */}
              <div className="flex items-center justify-between w-full max-w-[460px] gap-3 px-2 z-20">
                
                {/* amazon */}
                <div className="flex-1 py-2.5 px-4 rounded-xl bg-white text-black shadow-lg flex items-center justify-center border border-gray-100">
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-base font-black tracking-tighter lowercase font-sans">amazon</span>
                    <svg width="24" height="6" viewBox="0 0 32 8" fill="none" className="-mt-0.5">
                      <path d="M2 2C10 7 22 7 30 2" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>

                {/* Walmart ✻ */}
                <div className="flex-1 py-2.5 px-4 rounded-xl bg-white text-black shadow-lg flex items-center justify-center border border-gray-100">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-black tracking-tight text-[#0071DC]">Walmart</span>
                    <span className="text-xs text-[#FFC220] font-bold">✻</span>
                  </div>
                </div>

                {/* 🛍 shopify */}
                <div className="flex-1 py-2.5 px-4 rounded-xl bg-white text-black shadow-lg flex items-center justify-center border border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-[#95BF47] font-bold">🛍</span>
                    <span className="text-sm font-black tracking-tight lowercase">shopify</span>
                  </div>
                </div>
              </div>


              {/* 2. TOP BRANCHING CONNECTOR SVG LINES */}
              <div className="w-full h-16 relative flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 520 64" fill="none" preserveAspectRatio="none">
                  {/* Left branch from Amazon */}
                  <path d="M 115 0 C 115 35, 260 25, 260 64" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1.5" />
                  {/* Center branch from Walmart */}
                  <path d="M 260 0 L 260 64" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1.5" />
                  {/* Right branch from Shopify */}
                  <path d="M 405 0 C 405 35, 260 25, 260 64" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1.5" />
                </svg>
              </div>


              {/* 3. CENTER EMBLEM: Large White Circle with Geometric Brand Mark */}
              <div className="relative z-20 my-1">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white text-[#05060B] flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.22)] border-2 border-white group">
                  {/* CedCommerce-style geometric diamond emblem */}
                  <svg width="48" height="48" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 4L30 16L18 28L6 16L18 4Z" stroke="#05060B" strokeWidth="3" strokeLinejoin="round"/>
                    <path d="M12 22L18 28L24 22" stroke="#05060B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 4V16" stroke="#05060B" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M6 16H18" stroke="#05060B" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>


              {/* 4. CONNECTOR FROM CENTER DOWN TO BUS BAR */}
              <div className="w-full h-12 relative flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 520 48" fill="none" preserveAspectRatio="none">
                  {/* Vertical stem from center */}
                  <line x1="260" y1="0" x2="260" y2="24" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />
                  {/* Horizontal distributor bar across all 6 nodes */}
                  <line x1="42" y1="24" x2="478" y2="24" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />
                  
                  {/* 6 vertical drops to cards */}
                  <line x1="42" y1="24" x2="42" y2="48" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />
                  <line x1="129" y1="24" x2="129" y2="48" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />
                  <line x1="216" y1="24" x2="216" y2="48" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />
                  <line x1="304" y1="24" x2="304" y2="48" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />
                  <line x1="391" y1="24" x2="391" y2="48" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />
                  <line x1="478" y1="24" x2="478" y2="48" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />
                </svg>

                {/* Glowing Yellow/Gold Connector Dots from CedCommerce Reference */}
                <div className="absolute top-[21px] left-[42px] -translate-x-1/2 w-2 h-2 rounded-full bg-[#EAB308] shadow-[0_0_6px_#EAB308]" />
                <div className="absolute top-[21px] left-[129px] -translate-x-1/2 w-2 h-2 rounded-full bg-[#EAB308] shadow-[0_0_6px_#EAB308]" />
                <div className="absolute top-[21px] left-[216px] -translate-x-1/2 w-2 h-2 rounded-full bg-[#EAB308] shadow-[0_0_6px_#EAB308]" />
                <div className="absolute top-[21px] left-[304px] -translate-x-1/2 w-2 h-2 rounded-full bg-[#EAB308] shadow-[0_0_6px_#EAB308]" />
                <div className="absolute top-[21px] left-[391px] -translate-x-1/2 w-2 h-2 rounded-full bg-[#EAB308] shadow-[0_0_6px_#EAB308]" />
                <div className="absolute top-[21px] left-[478px] -translate-x-1/2 w-2 h-2 rounded-full bg-[#EAB308] shadow-[0_0_6px_#EAB308]" />
              </div>


              {/* 5. BOTTOM ROW: 6 Compact White Marketplace Cards */}
              <div className="grid grid-cols-6 gap-2 w-full max-w-[500px] z-20">
                {/* 1. Walmart spark */}
                <div className="py-2 px-1 rounded-lg bg-white text-black shadow-md flex items-center justify-center border border-gray-100" title="Walmart">
                  <span className="text-xs font-bold text-[#FFC220]">✻</span>
                </div>

                {/* 2. TikTok Shop */}
                <div className="py-2 px-1 rounded-lg bg-white text-black shadow-md flex items-center justify-center border border-gray-100" title="TikTok Shop">
                  <span className="text-xs font-bold text-black">♫</span>
                </div>

                {/* 3. ebay */}
                <div className="py-2 px-1 rounded-lg bg-white text-black shadow-md flex items-center justify-center border border-gray-100" title="eBay">
                  <span className="text-xs font-black tracking-tighter">
                    <span className="text-[#E53238]">e</span>
                    <span className="text-[#0064D2]">b</span>
                    <span className="text-[#F5AF02]">a</span>
                    <span className="text-[#86B817]">y</span>
                  </span>
                </div>

                {/* 4. Amazon 'a' */}
                <div className="py-2 px-1 rounded-lg bg-white text-black shadow-md flex items-center justify-center border border-gray-100" title="Amazon">
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-xs font-black text-black">a</span>
                    <div className="w-2.5 h-0.5 bg-[#FF9900] rounded-full mt-0.5" />
                  </div>
                </div>

                {/* 5. TEMU */}
                <div className="py-2 px-1 rounded-lg bg-white text-black shadow-md flex items-center justify-center border border-gray-100" title="TEMU">
                  <span className="text-[10px] font-black text-[#FB7701] tracking-tight">TEMU</span>
                </div>

                {/* 6. SHEIN */}
                <div className="py-2 px-1 rounded-lg bg-white text-black shadow-md flex items-center justify-center border border-gray-100" title="SHEIN">
                  <span className="text-[9px] font-black text-black tracking-wider">SHEIN</span>
                </div>
              </div>


              {/* 6. CONNECTOR LINES TO MCF AND MCS */}
              <div className="w-full h-8 relative flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 520 32" fill="none" preserveAspectRatio="none">
                  <line x1="200" y1="0" x2="200" y2="32" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1.5" />
                  <line x1="320" y1="0" x2="320" y2="32" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1.5" />
                </svg>
              </div>


              {/* 7. BOTTOM PILLS: MCF and MCS (CedCommerce Reference Badges) */}
              <div className="flex items-center justify-center gap-16 z-20">
                <div className="py-1.5 px-6 rounded-lg bg-white text-black font-extrabold text-xs tracking-wider shadow-lg border border-gray-100">
                  MCF
                </div>
                <div className="py-1.5 px-6 rounded-lg bg-white text-black font-extrabold text-xs tracking-wider shadow-lg border border-gray-100">
                  MCS
                </div>
              </div>

            </div>
          </div>

        </div>


        {/* ============================================================== */}
        {/* HERO METRICS ROW (CedCommerce Screenshot 2 Style)              */}
        {/* Directly beneath hero content with clean enterprise spacing    */}
        {/* ============================================================== */}
        <div className="mt-20 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              10K+
            </div>
            <div className="mt-2 text-xs sm:text-sm text-[#94A3B8] font-medium leading-snug">
              Global Sellers & Catalogs
            </div>
          </div>

          <div>
            <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              50+
            </div>
            <div className="mt-2 text-xs sm:text-sm text-[#94A3B8] font-medium leading-snug">
              Marketplace & Platform Integrations
            </div>
          </div>

          <div>
            <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              8+
            </div>
            <div className="mt-2 text-xs sm:text-sm text-[#94A3B8] font-medium leading-snug">
              Top Global Marketplaces Support
            </div>
          </div>

          <div>
            <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              10+
            </div>
            <div className="mt-2 text-xs sm:text-sm text-[#94A3B8] font-medium leading-snug">
              Years Multichannel Expansion Experience
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
