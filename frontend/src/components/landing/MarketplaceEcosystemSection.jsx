import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Gift, ArrowUpRight } from 'lucide-react';

export const MarketplaceEcosystemSection = ({ onNavigate }) => {
  const [scrollIdx, setScrollIdx] = useState(0);

  const ecosystems = [
    {
      name: 'amazon',
      label: 'Amazon SP-API',
      color: '#FF9900',
      badge: 'TOP VOLUME',
      sub: 'US, UK, DE, IN, JP'
    },
    {
      name: 'Walmart',
      label: 'Walmart Marketplace',
      color: '#0071DC',
      badge: 'FASTEST GROWING',
      sub: 'US, CA, MX'
    },
    {
      name: 'ebay',
      label: 'eBay Global Exchange',
      color: '#E53238',
      badge: 'CROSS-BORDER',
      sub: '190+ Countries'
    },
    {
      name: 'Etsy',
      label: 'Etsy Maker Feed',
      color: '#F16521',
      badge: 'NICHE CRAFTS',
      sub: 'Global Buyer Base'
    },
    {
      name: 'TikTok Shop',
      label: 'TikTok Social Commerce',
      color: '#000000',
      badge: 'VOUCHER ACTIVE',
      sub: 'Social Viral Discovery'
    },
    {
      name: 'shopify',
      label: 'Shopify Storefronts',
      color: '#95BF47',
      badge: 'D2C CANONICAL',
      sub: 'Private Label Catalogs'
    },
    {
      name: 'AliExpress',
      label: 'AliExpress Wholesale',
      color: '#FF4747',
      badge: 'SUPPLY CHAIN',
      sub: 'Global Dropship & OEM'
    },
    {
      name: 'Target Plus',
      label: 'Target Curated Sellers',
      color: '#CC0000',
      badge: 'INVITATION ONLY',
      sub: 'Premium Retail Channels'
    }
  ];

  const handlePrev = () => {
    setScrollIdx((prev) => (prev > 0 ? prev - 1 : ecosystems.length - 4));
  };

  const handleNext = () => {
    setScrollIdx((prev) => (prev < ecosystems.length - 4 ? prev + 1 : 0));
  };

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-gray-200" id="data-sources">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-12 text-center">
        
        {/* Title styled like CedCommerce Screenshot 5 */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#05060B] tracking-tight">
          Our <span className="text-[#4563FF]">Marketplace Ecosystem</span>
        </h2>

        <p className="mt-4 text-xs sm:text-sm font-bold tracking-wider text-gray-500 uppercase font-mono">
          FOR YOUR CROSS-CHANNEL GROWTH ACROSS US, UK, AND EU.
        </p>

        {/* Pill badge from reference */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 shadow-xs">
          <Gift className="w-4 h-4 text-[#4563FF]" />
          <span>View live seller referral programs</span>
          <span className="w-2.5 h-2.5 rounded-full bg-black ml-1" />
        </div>

        {/* Carousel Container */}
        <div className="mt-14 relative flex items-center justify-center">
          
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:text-black hover:border-gray-400 transition cursor-pointer z-10 shrink-0 mr-3"
            aria-label="Previous marketplace"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Cards Display */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
            {ecosystems.slice(scrollIdx, scrollIdx + 5).concat(
              scrollIdx + 5 > ecosystems.length 
                ? ecosystems.slice(0, (scrollIdx + 5) - ecosystems.length) 
                : []
            ).map((item, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:shadow-md hover:border-gray-300 transition-all flex flex-col items-center justify-center min-h-[140px] group relative"
              >
                {item.badge && (
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-[#4563FF] border border-blue-100">
                    {item.badge}
                  </span>
                )}
                
                {/* Marketplace logo styling */}
                <div 
                  className="text-2xl font-black tracking-tight"
                  style={{ color: item.color }}
                >
                  {item.name}
                </div>

                <div className="mt-2 text-xs font-bold text-gray-700">
                  {item.label}
                </div>
                <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                  {item.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:text-black hover:border-gray-400 transition cursor-pointer z-10 shrink-0 ml-3"
            aria-label="Next marketplace"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

        <div className="mt-8 text-xs text-gray-400 font-mono">
          Direct REST APIs · Webhook Feeds · Automated Schema Normalization · Zero manual scrapers
        </div>

      </div>
    </section>
  );
};
