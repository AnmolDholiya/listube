import React, { useState } from 'react';
import { Zap, ShieldCheck, RefreshCw, LayoutDashboard, ChevronDown } from 'lucide-react';

export const WorkflowAndEngineSection = ({ onNavigate, onOpenLedger }) => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { num: 1, label: 'Connect source & target' },
    { num: 2, label: 'Map marketplace attributes' },
    { num: 3, label: 'Validate listings before submission' },
    { num: 4, label: 'Publish to marketplaces' },
    { num: 5, label: 'Sync inventory and orders' }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#F4F7FD] border-b border-gray-200" id="platform-overview">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ============================================================== */}
          {/* LEFT COLUMN: CedCommerce Unicon Layout & 2x2 Feature Grid      */}
          {/* ============================================================== */}
          <div className="lg:col-span-6 flex flex-col items-start pr-0 lg:pr-6">
            
            {/* Pill Eyebrow: • UNICON BY CEDCOMMERCE */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-blue-200 shadow-xs mb-6">
              <span className="w-2 h-2 rounded-full bg-[#3F5BFF]" />
              <span className="text-[11px] font-bold tracking-wider text-blue-700 uppercase font-mono">
                UNICON BY COMMERCEINTEL
              </span>
            </div>

            {/* Dominant Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#05060B] tracking-[-0.03em] leading-[1.08]">
              Cross-list without rebuilding your catalog
            </h2>

            {/* Subtitle Paragraph */}
            <p className="mt-6 text-base sm:text-[17px] text-[#64748B] leading-relaxed max-w-[540px]">
              Build once, list everywhere. UniCon helps sellers turn one shared catalog into marketplace-ready listings, keep inventory and orders in sync, and manage marketplace expansion from one dashboard.
            </p>

            {/* 2x2 Feature Cards Grid (Exact CedCommerce Reference Layout) */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[540px]">
              
              {/* Card 1: List faster */}
              <div className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md transition flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#3F5BFF] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <span className="text-sm font-bold text-gray-900">List faster</span>
              </div>

              {/* Card 2: Catch errors before submission */}
              <div className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md transition flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#3F5BFF] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-gray-900">Catch errors before submission</span>
              </div>

              {/* Card 3: Keep operations in sync */}
              <div className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md transition flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#3F5BFF] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-gray-900">Keep operations in sync</span>
              </div>

              {/* Card 4: One dashboard for listings, inventory & orders */}
              <div className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-xs hover:shadow-md transition flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#3F5BFF] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-gray-900 leading-snug">
                  One dashboard for listings, inventory & orders
                </span>
              </div>

            </div>

            {/* Bottom Link: Start your 14-day free trial ▾ */}
            <div className="mt-8">
              <button
                onClick={() => onNavigate && onNavigate('register')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#3F5BFF] hover:text-blue-700 transition cursor-pointer"
              >
                <span>Start your 14-day free trial</span>
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </div>

          </div>


          {/* ============================================================== */}
          {/* RIGHT COLUMN: CedCommerce Interactive Stepper & Channel Card   */}
          {/* ============================================================== */}
          <div className="lg:col-span-6 w-full flex justify-center">
            <div className="w-full max-w-[560px] bg-white rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-6 sm:p-10 flex flex-col justify-between min-h-[480px]">
              
              {/* 1. TOP 5-STEP STEPPER WITH DOTTED CONNECTORS */}
              <div>
                <div className="flex items-start justify-between relative mb-8">
                  {steps.map((st, idx) => {
                    const isSelected = st.num === activeStep;
                    const isDone = st.num < activeStep;
                    return (
                      <React.Fragment key={st.num}>
                        <div 
                          className="flex flex-col items-center flex-1 cursor-pointer group"
                          onClick={() => setActiveStep(st.num)}
                        >
                          {/* Circular step badge */}
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                            isSelected 
                              ? 'bg-[#3F5BFF] text-white shadow-md scale-110' 
                              : isDone
                                ? 'bg-blue-100 text-[#3F5BFF]'
                                : 'border border-gray-300 text-gray-400 bg-white group-hover:border-gray-400'
                          }`}>
                            {isDone ? '✓' : st.num}
                          </div>

                          {/* Step title label underneath */}
                          <span className={`text-[10px] mt-2 text-center leading-tight max-w-[70px] ${
                            isSelected ? 'text-[#3F5BFF] font-bold' : 'text-gray-400 font-medium'
                          }`}>
                            {st.label}
                          </span>
                        </div>

                        {/* Dotted connector line between steps */}
                        {idx < steps.length - 1 && (
                          <div className="flex-1 flex items-center justify-center pt-3.5 px-0.5">
                            <div className="w-full border-t border-dashed border-gray-300" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* 2. CENTER CONTENT: 3 Stacked White Channel Cards */}
                <div className="my-6 space-y-3.5 max-w-[380px] mx-auto">
                  
                  {/* shopify */}
                  <div className="bg-white border border-gray-200/90 rounded-2xl py-3 px-6 shadow-xs flex items-center justify-center hover:shadow-md transition">
                    <div className="flex items-center gap-2">
                      <span className="text-xl text-[#95BF47] font-bold">🛍</span>
                      <span className="text-xl font-black lowercase tracking-tight text-gray-900 font-sans">
                        shopify
                      </span>
                    </div>
                  </div>

                  {/* amazon */}
                  <div className="bg-white border border-gray-200/90 rounded-2xl py-3 px-6 shadow-xs flex items-center justify-center hover:shadow-md transition">
                    <div className="flex flex-col items-center leading-none">
                      <span className="text-xl font-black lowercase tracking-tighter text-gray-900 font-sans">
                        amazon
                      </span>
                      <svg width="30" height="7" viewBox="0 0 32 8" fill="none" className="-mt-0.5">
                        <path d="M2 2C10 7 22 7 30 2" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Walmart ✻ */}
                  <div className="bg-white border border-gray-200/90 rounded-2xl py-3 px-6 shadow-xs flex items-center justify-center hover:shadow-md transition">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg font-black tracking-tight text-[#0071DC]">Walmart</span>
                      <span className="text-base text-[#FFC220] font-bold">✻</span>
                    </div>
                  </div>

                </div>

                {/* Carousel Pagination Dots */}
                <div className="flex items-center justify-center gap-1.5 mt-6 mb-8">
                  <div className="w-2 h-2 rounded-full bg-[#3F5BFF]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                </div>
              </div>

              {/* 3. BOTTOM NOTIFICATION BANNER */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#3F5BFF] text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                  <Zap className="w-3.5 h-3.5 fill-white" />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#1E1B4B]">
                  <span className="font-extrabold text-[#3F5BFF]">48 hours</span> from connect to first live listing
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
