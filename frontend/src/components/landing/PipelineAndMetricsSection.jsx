import React from 'react';
import { Zap, TrendingUp, BarChart3, DollarSign } from 'lucide-react';

export const PipelineAndMetricsSection = () => {
  return (
    <div className="bg-[#05060B] text-white border-b border-white/10" id="growth-metrics">
      {/* ============================================================== */}
      {/* TIME & EFFICIENCY METRICS (CedCommerce Screenshot 5 Style)     */}
      {/* ============================================================== */}
      <section className="py-20 lg:py-28 max-w-[1360px] mx-auto px-6 lg:px-12 bg-[#05060B]">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.1]">
            What <span className="text-[#4563FF]">Marketplace Growth</span> Looks Like With CommerceIntel
          </h2>
          <p className="mt-3 text-sm text-gray-400">
            Real throughput gains experienced when moving from spreadsheet research to automated intelligence.
          </p>
        </div>

        {/* 4 Large Vibrant Blue Cards styled after CedCommerce Screenshot 5 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="rounded-2xl bg-[#4563FF] text-white p-7 flex flex-col justify-between shadow-xl min-h-[190px]">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white mb-6">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight">
                5X
              </div>
              <div className="mt-1 text-sm font-semibold text-white/90">
                Faster Listing Activation
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl bg-[#4563FF] text-white p-7 flex flex-col justify-between shadow-xl min-h-[190px]">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white mb-6">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight">
                20–40%
              </div>
              <div className="mt-1 text-sm font-semibold text-white/90">
                Higher CVR & Buy-Box Win
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl bg-[#4563FF] text-white p-7 flex flex-col justify-between shadow-xl min-h-[190px]">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white mb-6">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight">
                25–35%
              </div>
              <div className="mt-1 text-sm font-semibold text-white/90">
                Quarterly GMV Growth
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl bg-[#4563FF] text-white p-7 flex flex-col justify-between shadow-xl min-h-[190px]">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white mb-6">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight">
                60%
              </div>
              <div className="mt-1 text-sm font-semibold text-white/90">
                Overall Sales Lift
              </div>
            </div>
          </div>

        </div>

        {/* Pill banner below cards styled like CedCommerce Screenshot 5 */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <div className="px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-gray-300 flex items-center gap-3">
            <span>All at 50 to 70% lower rates than legacy enterprise tools</span>
            <span className="px-3 py-1 rounded-full bg-[#4563FF] text-white font-bold text-[10px] uppercase tracking-wider">
              Enterprise Capabilities · SMB Pricing
            </span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <span className="text-[11px] text-gray-500 font-mono">
            * Illustrative platform metrics modeled on cross-listing catalog cohorts.
          </span>
        </div>

      </section>
    </div>
  );
};
