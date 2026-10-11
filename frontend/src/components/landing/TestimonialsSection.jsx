import React from 'react';

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Marcus Thompson',
      handle: '@m_thompson',
      role: 'Head of E-Commerce, ThreadCraft',
      avatar: 'MT',
      quote: 'The AI catalog engine saves our operations team over 15 hours every week during seasonal drops. Catalog errors fell from 14% to practically zero.'
    },
    {
      name: 'Priya Sharma',
      handle: '@priya_d2c',
      role: 'Founder, Aura Apparel India',
      avatar: 'PS',
      quote: 'Zero rejection rate on Flipkart Listing v3 after we started utilizing their pre-flight image dimension and HSN rule engine. Essential tool.'
    },
    {
      name: 'Alex Rivera',
      handle: '@arivera_ecom',
      role: 'Catalog Lead, UrbanPulse Retail',
      avatar: 'AR',
      quote: 'The canonical schema abstraction is genius. We only upload product data once, and it maps cleanly to Amazon and Flipkart without touching our core database.'
    },
    {
      name: 'Ananya Sen',
      handle: '@ananya_fashion',
      role: 'Operations Director, Loom & Stitch',
      avatar: 'AS',
      quote: 'The race-safe reconciliation and background batch polling give us peace of mind during flash sales. We never lose track of asynchronous publish jobs.'
    },
    {
      name: 'Liam Chen',
      handle: '@liamchen_ops',
      role: 'Growth Architect, Omnichannel D2C',
      avatar: 'LC',
      quote: 'Cleanest, most responsive catalog ledger interface I have ever experienced. Fast, minimalistic, and built for real high-throughput commerce.'
    },
    {
      name: 'Sneha Kapoor',
      handle: '@sneha_labels',
      role: 'Founder, Kora Organic Studio',
      avatar: 'SK',
      quote: 'Bulk CSV ingestion with instantaneous schema validation and live batch telemetry turned what was a multi-day spreadsheet chore into a 5-minute task.'
    }
  ];

  return (
    <section id="community" className="py-24 md:py-32 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
        {/* Section Heading */}
        <div className="max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#777777] block mb-3 font-mono">
            Seller Community
          </span>
          <h2 className="text-[38px] sm:text-[48px] md:text-[54px] font-medium text-[#111111] leading-[1.05] tracking-[-0.03em]">
            Hear From Our Community
          </h2>
          <p className="mt-4 text-[17px] text-[#555555] font-normal leading-relaxed">
            Discover how fashion brands, D2C merchants, and catalog operators scale across multi-channel marketplaces.
          </p>
        </div>

        {/* 6 Testimonial Cards in 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
          {testimonials.map((item, idx) => (
            <div 
              key={idx}
              className="editorial-card p-7 sm:p-8 bg-white border border-[#E5E7EB] flex flex-col justify-between"
            >
              {/* Quote */}
              <p className="text-[15px] sm:text-[16px] text-[#333333] leading-relaxed mb-6 font-normal">
                "{item.quote}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#F3F4F6]">
                <div className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center font-mono text-xs font-semibold shrink-0">
                  {item.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#111111] leading-tight">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#777777] mt-0.5">
                    <span className="font-mono">{item.handle}</span>
                    <span>•</span>
                    <span className="line-clamp-1">{item.role}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
