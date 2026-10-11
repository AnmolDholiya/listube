import React, { useState } from 'react';
import { ChevronRight, ShieldCheck, ShoppingBag, Filter, Megaphone, CheckCircle2 } from 'lucide-react';

export const CompetitorAnalyticsSection = ({ onNavigate, onOpenLedger }) => {
  // Set default active tab to 'Error resolution' to match the reference screenshot exactly
  const [activeTab, setActiveTab] = useState('Error resolution');

  const services = [
    {
      id: 'Listing optimization',
      title: 'Improve listing performance',
      desc: 'Amazon A+, EBC, rich media, brand story, and listing SEO',
      icon: ShoppingBag,
    },
    {
      id: 'A+/Rich media',
      title: 'Convert more shoppers',
      desc: 'Storefront design, PDP improvements, trust content',
      icon: Filter,
    },
    {
      id: 'Ad campaign management',
      title: 'Scale paid advertising',
      desc: 'Marketplace ads, keyword strategy, campaign optimization',
      icon: Megaphone,
    },
    {
      id: 'Error resolution',
      title: 'Remove growth blockers',
      desc: 'Account reinstatement, listing errors, issue resolution',
      icon: ShieldCheck,
      isShield: true,
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white text-gray-900 border-b border-gray-200" id="solutions">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-12">
        
        {/* Main Two-Column Grid matching CedCommerce Reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* ============================================================== */}
          {/* LEFT COLUMN: Eyebrow, Headline, Paragraph, 4 Cards & Button   */}
          {/* ============================================================== */}
          <div className="lg:col-span-6 flex flex-col items-start pr-0 lg:pr-4">
            
            {/* Pill Eyebrow: • MARKETPLACE GROWTH SERVICES */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 shadow-xs mb-6">
              <span className="w-2 h-2 rounded-full bg-[#3F5BFF]" />
              <span className="text-[11px] font-bold tracking-wider text-gray-700 uppercase font-mono">
                MARKETPLACE GROWTH SERVICES
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#05060B] tracking-[-0.03em] leading-[1.08]">
              Turn marketplace presence into <span className="text-[#3F5BFF]">performance</span>
            </h2>

            {/* Paragraph */}
            <p className="mt-6 text-base sm:text-[17px] text-[#64748B] leading-relaxed max-w-[540px]">
              Improve marketplace visibility, conversions, and revenue with expert-led listing optimization, marketplace advertising, storefront design, and complete marketplace support.
            </p>

            {/* 4 Service Cards Stack (Matching Reference Styling & Active Selection) */}
            <div className="mt-10 space-y-3.5 w-full max-w-[540px]">
              {services.map((svc) => {
                const isSelected = activeTab === svc.id;
                const Icon = svc.icon;
                return (
                  <div
                    key={svc.id}
                    onClick={() => setActiveTab(svc.id)}
                    className={`p-4 sm:p-5 rounded-2xl transition-all cursor-pointer flex items-center justify-between border ${
                      isSelected
                        ? 'bg-blue-50/20 border-2 border-[#3F5BFF] shadow-xs'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        svc.isShield
                          ? 'bg-[#3F5BFF] text-white shadow-xs'
                          : 'bg-[#05060B] text-white shadow-xs'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="text-base font-bold text-gray-900 leading-snug">
                          {svc.title}
                        </h3>
                        <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                          {svc.desc}
                        </p>
                      </div>
                    </div>

                    {/* Right Chevron */}
                    <div className="text-gray-400 pl-2">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Button: Explore growth services ↗ (Dark Pill Button from Reference) */}
            <div className="mt-8">
              <button
                onClick={() => onNavigate && onNavigate('register')}
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#05060B] hover:bg-neutral-800 text-white font-bold text-sm transition-all shadow-md group cursor-pointer"
              >
                <span>Explore growth services</span>
                <span className="w-6 h-6 rounded-full bg-white text-[#05060B] flex items-center justify-center text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  ↗
                </span>
              </button>
            </div>

          </div>


          {/* ============================================================== */}
          {/* RIGHT COLUMN: CedCommerce Dark Analytics Card                  */}
          {/* ============================================================== */}
          <div className="lg:col-span-6 w-full flex justify-center">
            <div className="w-full max-w-[560px] bg-[#080912] rounded-[32px] border border-white/10 p-6 sm:p-8 shadow-2xl text-white flex flex-col justify-between min-h-[500px]">
              
              <div>
                {/* 1. Header inside Dark Card */}
                <div className="flex items-center justify-between pb-5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3F5BFF] shadow-[0_0_8px_#3F5BFF]" />
                    <span className="text-[11px] font-mono tracking-wider text-gray-300 uppercase">
                      MARKETPLACE PERFORMANCE IMPROVEMENT
                    </span>
                  </div>
                  <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase font-semibold">
                    LIVE · DEMO
                  </span>
                </div>

                {/* 2. Filter Pills Row */}
                <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1">
                  {['Listing optimization', 'A+/Rich media', 'Ad campaign management', 'Error resolution'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                        activeTab === t 
                          ? 'bg-[#3F5BFF] text-white shadow-md' 
                          : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* 3. Card Body: Dynamic View based on Active Tab */}
                {activeTab === 'Error resolution' ? (
                  /* VIEW MATCHING THE REFERENCE SCREENSHOT EXACTLY */
                  <div className="mt-8">
                    {/* Header line */}
                    <div className="flex items-center justify-between text-xs text-gray-400 font-mono uppercase tracking-wider mb-2">
                      <span>ISSUE RESOLUTION QUEUE</span>
                      <span className="text-gray-400 font-sans">18 resolved · 24h</span>
                    </div>

                    {/* Big KPI Headline */}
                    <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight mb-6">
                      6 active
                    </div>

                    {/* 3 Issue Rows inside Card */}
                    <div className="space-y-3">
                      
                      {/* Row 1: Suppressed listings */}
                      <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                          <span className="text-gray-200 font-medium">Suppressed listings</span>
                        </div>
                        <span className="font-mono font-bold text-white text-base">4</span>
                      </div>

                      {/* Row 2: Pricing errors */}
                      <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-[#3F5BFF]" />
                          <span className="text-gray-200 font-medium">Pricing errors</span>
                        </div>
                        <span className="font-mono font-bold text-white text-base">2</span>
                      </div>

                      {/* Row 3: Account health */}
                      <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                          <span className="text-gray-200 font-medium">Account health</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-400 text-base">A+</span>
                      </div>

                    </div>

                    {/* Average Resolution Time */}
                    <div className="mt-6 text-xs text-gray-400 font-mono">
                      Average resolution time: <span className="text-white font-bold">11.4 hours</span>
                    </div>
                  </div>
                ) : (
                  /* LISTING OPTIMIZATION / PERFORMANCE CHART VIEW */
                  <div className="mt-8">
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider font-mono">
                          Listing Quality Score
                        </div>
                        <div className="text-4xl font-black text-white mt-1 font-mono">
                          92<span className="text-xl text-gray-500 font-normal">/100</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        +24 pts this month
                      </span>
                    </div>

                    {/* Gradient Bar Chart */}
                    <div className="flex items-end justify-between gap-3 h-28 px-1 pt-2">
                      {[38, 48, 56, 64, 76, 88, 92].map((v, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <div 
                            className="w-full rounded-t-md transition-all duration-300"
                            style={{
                              height: `${v}%`,
                              background: i === 6 ? '#3F5BFF' : '#1E293B'
                            }}
                          />
                          <span className="text-[10px] text-gray-500 font-mono">M{i+1}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <span className="text-gray-400 block text-[11px]">SEO Score</span>
                        <span className="font-bold font-mono text-white text-sm">94%</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[11px]">Image Quality</span>
                        <span className="font-bold font-mono text-white text-sm">88%</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[11px]">Content Depth</span>
                        <span className="font-bold font-mono text-white text-sm">96%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Sub-Footer inside Dark Card */}
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-500 font-mono">
                <span>Real client snapshot · 90-day window</span>
                <span className="text-emerald-400 font-bold">+28% MoM ↑</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
