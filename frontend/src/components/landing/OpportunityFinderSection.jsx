import React from 'react';
import { ArrowRight, TrendingUp, Sparkles, Zap, Award } from 'lucide-react';

export const OpportunityFinderSection = ({ onOpenLedger, onNavigate }) => {
  const opportunities = [
    {
      title: 'Portable USB-C Blender',
      score: 92,
      badge: 'HIGH OPPORTUNITY',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      demand: 'High',
      competition: 'Medium',
      priceOpportunity: '₹400 Margin Gap',
      sentiment: '88% Positive',
      marketGrowth: '+18% MoM',
      description: 'Rising search velocity on Flipkart and Amazon with fragmented seller landscape.'
    },
    {
      title: 'Smart Hydration LED Bottle',
      score: 88,
      badge: 'UNMET DEMAND',
      badgeColor: 'bg-blue-50 text-[#4563FF] border-blue-200',
      demand: 'High',
      competition: 'Low',
      priceOpportunity: '₹350 Margin Gap',
      sentiment: '92% Positive',
      marketGrowth: '+24% MoM',
      description: 'High customer inquiry volume with few prime-eligible listings meeting rating thresholds.'
    },
    {
      title: 'Active Noise Cancelling Earbuds',
      score: 84,
      badge: 'VOLUME DRIVER',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      demand: 'Very High',
      competition: 'Medium',
      priceOpportunity: '₹600 Margin Gap',
      sentiment: '82% Positive',
      marketGrowth: '+12% MoM',
      description: 'Evergreen volume tier with sub-₹2,000 price point opening up after competitor stockouts.'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#FAFAFC] border-b border-gray-200">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="ced-pill-badge ced-pill-badge-light mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4563FF]" />
            Opportunity Detection
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#05060B] tracking-tight leading-[1.1]">
            Find the opportunities hidden inside the data
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Our multi-layer scoring algorithms correlate supply, price elasticity, and consumer review sentiment to flag high-margin niches.
          </p>
        </div>

        {/* 3 Opportunity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {opportunities.map((opp, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 p-7 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-gray-300 transition-all group"
            >
              <div>
                {/* Top Badge & Score */}
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className={`px-2.5 py-1 rounded text-[11px] font-bold font-mono border ${opp.badgeColor}`}>
                    {opp.badge}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-black text-[#4563FF] font-mono">{opp.score}</span>
                    <span className="text-xs text-gray-400 font-mono">/100</span>
                  </div>
                </div>

                {/* Score progress bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
                  <div 
                    className="h-full bg-[#4563FF] rounded-full transition-all duration-700" 
                    style={{ width: `${opp.score}%` }} 
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#4563FF] transition-colors">
                  {opp.title}
                </h3>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  {opp.description}
                </p>

                {/* Key Metrics Breakdown */}
                <div className="mt-6 pt-5 border-t border-gray-100 space-y-2.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Demand Velocity:</span>
                    <span className="font-bold text-gray-900">{opp.demand}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Competitor Density:</span>
                    <span className="font-bold text-gray-900">{opp.competition}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Target Price Advantage:</span>
                    <span className="font-bold text-emerald-600 font-mono">{opp.priceOpportunity}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Market Growth (MoM):</span>
                    <span className="font-bold text-[#4563FF] font-mono">{opp.marketGrowth}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="mt-7 pt-5 border-t border-gray-100">
                <button
                  onClick={onOpenLedger}
                  className="w-full py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-[#05060B] hover:text-white text-gray-800 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>View Opportunity Breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
