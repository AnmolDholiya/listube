import React from 'react';
import { ArrowRight } from 'lucide-react';

export const FeatureCard = ({ icon: Icon, title, description, category, onTryNow }) => {
  return (
    <div 
      className="editorial-card p-8 md:p-10 flex flex-col justify-between min-w-[280px] sm:min-w-[320px] lg:min-w-0 flex-1 h-[400px] md:h-[420px] bg-white group cursor-default select-none border border-[#E5E7EB]"
    >
      <div>
        {/* Top: Minimal line icon & category */}
        <div className="flex items-center justify-between mb-8">
          <div className="w-12 h-12 rounded-[2px] border border-[#E5E7EB] bg-[#FAFAFA] flex items-center justify-center text-[#111111] group-hover:border-[#111111] transition-colors">
            <Icon className="w-5 h-5 stroke-[1.75]" />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#777777] bg-[#F7F8FA] px-2 py-0.5 rounded-[2px]">
            {category}
          </span>
        </div>

        {/* Title: 28-30px */}
        <h3 className="text-[26px] md:text-[28px] font-medium text-[#111111] leading-tight tracking-[-0.02em] mb-4">
          {title}
        </h3>

        {/* Description: 16-18px */}
        <p className="text-[15px] md:text-[16px] text-[#555555] font-normal leading-relaxed line-clamp-4">
          {description}
        </p>
      </div>

      {/* Outlined rectangular CTA */}
      <div className="pt-6 border-t border-[#F0F2F5]">
        <button
          onClick={onTryNow}
          className="btn-rect w-full py-2.5 text-[14px] font-medium justify-between group-hover:bg-[#111111] group-hover:text-white group-hover:border-[#111111] transition-all cursor-pointer"
        >
          <span>Try now</span>
          <ArrowRight className="w-4 h-4 text-[#777777] group-hover:text-white transition-colors" />
        </button>
      </div>
    </div>
  );
};
