import React from 'react';
import { ArrowRight, CheckCircle2, XCircle, Sparkles, TrendingUp, Layers, ShieldCheck, BarChart3 } from 'lucide-react';

export const UseCasesAndScalabilitySection = ({ onOpenLedger }) => {
  const cases = [
    {
      tag: 'PRODUCT DISCOVERY',
      title: 'Find high-velocity products with unmet supply',
      desc: 'Scan categories across Amazon and Flipkart to isolate items with rising search queries and competitor stock-outs.',
      metric: '+42% Faster sourcing',
      metricColor: 'text-[#4563FF] bg-blue-50 border-blue-100'
    },
    {
      tag: 'COMPETITOR ANALYSIS',
      title: 'Benchmark pricing, ratings, and customer sentiment',
      desc: 'Dissect rival SKU pricing variations, negative review pain points, and feature gaps to position superior offerings.',
      metric: '34% Price gap identified',
      metricColor: 'text-emerald-700 bg-emerald-50 border-emerald-100'
    },
    {
      tag: 'MARKET RESEARCH',
      title: 'Understand category dynamics before investing capital',
      desc: 'Evaluate category size, average selling price trajectories, and brand concentration ratios across multiple marketplaces.',
      metric: '18 Data sources merged',
      metricColor: 'text-purple-700 bg-purple-50 border-purple-100'
    },
    {
      tag: 'PRODUCT VALIDATION',
      title: 'Evaluate whether a product is worth launching',
      desc: 'Run pre-launch predictive scoring on cost of goods vs estimated return rates, fulfillment fees, and buy-box difficulty.',
      metric: '92/100 Readiness score',
      metricColor: 'text-amber-700 bg-amber-50 border-amber-100'
    }
  ];

  return (
    <div className="bg-[#FAFAFC] border-b border-gray-200">
      
      {/* ============================================================== */}
      {/* SECTION 17: REAL-WORLD USE CASES */}
      {/* ============================================================== */}
      <section className="py-20 lg:py-28 max-w-[1360px] mx-auto px-6 lg:px-12 border-b border-gray-200" id="case-studies">
        <div className="max-w-3xl mb-16">
          <div className="ced-pill-badge ced-pill-badge-light mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4563FF]" />
            Enterprise Applications
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#05060B] tracking-tight leading-[1.1]">
            Real-World E-Commerce Intelligence Use Cases
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            See how high-growth marketplace sellers, aggregators, and brand teams deploy our automated intelligence layer.
          </p>
        </div>

        {/* 4 Case Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((c, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-gray-300 transition-all group"
            >
              <div>
                {/* Metric pill header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-gray-500 uppercase">
                    {c.tag}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${c.metricColor}`}>
                    {c.metric}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#4563FF] transition-colors leading-snug">
                  {c.title}
                </h3>
                <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#4563FF] group-hover:text-blue-700">
                <span>View Use Case Blueprint</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ============================================================== */}
      {/* SECTION 18 & 31: BEFORE / AFTER & INVESTOR SCALABILITY */}
      {/* ============================================================== */}
      <section className="py-20 lg:py-28 max-w-[1360px] mx-auto px-6 lg:px-12 bg-white">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="ced-pill-badge ced-pill-badge-light mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4563FF]" />
            Efficiency & Scalability
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#05060B] tracking-tight leading-[1.1]">
            From Linear Research Bottleneck to Autonomous Scale
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Manual research scales linearly with headcount. CommerceIntel delivers non-linear operational leverage.
          </p>
        </div>

        {/* Scalability Matrix */}
        <div className="bg-[#FAFAFC] rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 mb-6">
            Operational Scalability Multiplier
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            
            <div className="p-4 rounded-xl bg-white border border-gray-200">
              <div className="text-xs font-bold text-gray-400 uppercase font-mono">Catalog Scale</div>
              <div className="text-xl font-bold text-gray-900 mt-1">1 Product</div>
              <div className="mt-3 text-xs text-gray-500 pt-3 border-t border-gray-100">
                Manual: <span className="font-mono text-gray-700 font-bold">10 min</span>
              </div>
              <div className="mt-1 text-xs text-[#4563FF] font-bold">
                Platform: <span className="font-mono">Automated</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-gray-200">
              <div className="text-xs font-bold text-gray-400 uppercase font-mono">Catalog Scale</div>
              <div className="text-xl font-bold text-gray-900 mt-1">100 Products</div>
              <div className="mt-3 text-xs text-red-600 pt-3 border-t border-gray-100">
                Manual: <span className="font-mono font-bold">16+ Hours</span>
              </div>
              <div className="mt-1 text-xs text-[#4563FF] font-bold">
                Platform: <span className="font-mono">Automated (~5m)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-gray-200">
              <div className="text-xs font-bold text-gray-400 uppercase font-mono">Catalog Scale</div>
              <div className="text-xl font-bold text-gray-900 mt-1">1,000 Products</div>
              <div className="mt-3 text-xs text-red-600 pt-3 border-t border-gray-100">
                Manual: <span className="font-mono font-bold">166+ Hours</span>
              </div>
              <div className="mt-1 text-xs text-[#4563FF] font-bold">
                Platform: <span className="font-mono">Automated (~25m)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
              <div className="text-xs font-bold text-[#4563FF] uppercase font-mono">Enterprise Scale</div>
              <div className="text-xl font-bold text-blue-900 mt-1">10,000+ SKUs</div>
              <div className="mt-3 text-xs text-gray-500 pt-3 border-t border-blue-100">
                Manual: <span className="font-mono font-bold text-red-600">Impossible</span>
              </div>
              <div className="mt-1 text-xs text-[#4563FF] font-bold">
                Platform: <span className="font-mono">Continuous Stream</span>
              </div>
            </div>

          </div>

          <div className="mt-6 text-center text-xs text-gray-400 font-mono">
            * Illustrative workflow comparison based on standard marketplace attribute normalization & competitor matching.
          </div>
        </div>

      </section>

    </div>
  );
};
