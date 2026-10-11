import React from 'react';

export const TrustedBySection = () => {
  const companies = [
    {
      name: 'FormBold',
      icon: (
        <svg className="w-6 h-6 text-[#111111] shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="26" height="26" rx="3" stroke="currentColor" strokeWidth="2.8" />
          <path d="M10 9H22V13.5H15V16.5H20V20.5H15V24H10V9Z" fill="currentColor" />
        </svg>
      )
    },
    {
      name: 'UIdeck',
      icon: (
        <svg className="w-6 h-6 text-[#111111] shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 3L27.5 9.5V22.5L16 29L4.5 22.5V9.5L16 3Z" stroke="currentColor" strokeWidth="2.8" strokeLinejoin="round" />
          <path d="M11 12L16 9.2L21 12V20L16 22.8L11 20V12Z" fill="currentColor" />
        </svg>
      )
    },
    {
      name: 'TailGrids',
      icon: (
        <svg className="w-6 h-6 text-[#111111] shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="10" height="10" rx="1.5" fill="currentColor" />
          <rect x="18" y="4" width="10" height="10" rx="1.5" fill="currentColor" />
          <rect x="4" y="18" width="10" height="10" rx="1.5" fill="currentColor" />
          <rect x="18" y="18" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="2.8" />
        </svg>
      )
    },
    {
      name: 'Lineicons',
      icon: (
        <svg className="w-6 h-6 text-[#111111] shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2.8" />
          <path d="M11.5 16L15 19.5L21.5 13" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      name: 'GrayGrids',
      icon: (
        <svg className="w-6 h-6 text-[#111111] shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="24" height="24" rx="2.5" stroke="currentColor" strokeWidth="2.8" />
          <path d="M19 10.5H10.5V21.5H21.5V15.5H15.5" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      name: 'PlainAdmin',
      icon: (
        <svg className="w-6 h-6 text-[#111111] shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="5" width="24" height="6.5" rx="1.5" fill="currentColor" />
          <rect x="4" y="15.5" width="10" height="11.5" rx="1.5" stroke="currentColor" strokeWidth="2.8" />
          <rect x="18" y="15.5" width="10" height="11.5" rx="1.5" fill="currentColor" />
        </svg>
      )
    }
  ];

  // Duplicate for seamless 100% infinite marquee loop
  const marqueeList = [...companies, ...companies, ...companies];

  return (
    <section className="py-14 md:py-18 bg-[#FAFAFA] border-b border-[#E5E7EB] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header matching reference: - Trusted by - */}
        <div className="flex items-center justify-center gap-3.5 mb-10 text-center select-none">
          <span className="w-3.5 h-[2px] bg-[#888888] inline-block" />
          <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#666666] font-mono">
            Trusted by
          </h3>
          <span className="w-3.5 h-[2px] bg-[#888888] inline-block" />
        </div>

        {/* Sliding Marquee Track with Smooth Edge Fade */}
        <div className="relative w-full overflow-hidden marquee-gradient-mask">
          <div className="animate-marquee-infinite flex items-center gap-12 sm:gap-16 md:gap-20">
            {marqueeList.map((company, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 text-[#222222] hover:text-[#000000] opacity-80 hover:opacity-100 transition-all duration-200 select-none group cursor-pointer shrink-0"
              >
                <div className="group-hover:scale-105 transition-transform duration-200">
                  {company.icon}
                </div>
                <span className="text-[19px] sm:text-[21px] font-semibold tracking-tight text-[#111111] font-sans">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
