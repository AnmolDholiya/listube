import React, { useRef } from 'react';
import { FeatureCard } from './FeatureCard';
import { 
  ChevronLeft, 
  ChevronRight, 
  Cpu, 
  Send, 
  CheckCircle, 
  RefreshCw,
  Layers,
  Database,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const WhatYouGetSection = ({ onOpenLedger, onNavigate, isAuthenticated }) => {
  const scrollRef = useRef(null);

  const features = [
    {
      icon: Cpu,
      category: 'Ingestion Engine',
      title: 'AI Canonical Schema Mapper',
      description: 'Ingest vendor CSVs and raw product feeds into a single channel-agnostic canonical model. Zero core schema mutations when onboarding new sales channels.'
    },
    {
      icon: Send,
      category: 'Marketplace Sync',
      title: 'Flipkart API v3 Publisher',
      description: 'Asynchronously dispatch listings to Flipkart Listing API v3 with a dedicated bounded thread pool. Live batch polling prevents HTTP socket exhaustion.'
    },
    {
      icon: ShieldCheck,
      category: 'Readiness Guard',
      title: 'Automated Image & Rule Validator',
      description: 'Validate image aspect ratios, pixel density, mandatory HSN codes, and marketplace readiness locally before publishing to avoid rejection loops.'
    },
    {
      icon: RefreshCw,
      category: 'Fault Tolerance',
      title: 'Race-Safe Batch Reconciler',
      description: 'Background reconciliation workers leverage JPA optimistic concurrency control to repair stale batch outcomes without overwriting concurrent writes.'
    },
    {
      icon: Database,
      category: 'Multi-Tenant',
      title: 'Monospaced SKU Ledger',
      description: 'High-density seller inventory ledger with isolated tenant tenancy, instant search filtering, category scoping, and live batch execution statuses.'
    },
    {
      icon: Zap,
      category: 'Extensibility',
      title: 'Multi-Channel Adapters',
      description: 'Pluggable architecture pre-engineered for Amazon SP-API, Myntra, and Meesho via normalized key-value channel attribute extension storage.'
    }
  ];

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  const handleAction = () => {
    if (isAuthenticated) {
      onOpenLedger();
    } else {
      if (onNavigate) onNavigate('login');
    }
  };


  return (
    <section id="what-you-get" className="py-24 md:py-32 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Section Header: Left title + desc, Right prev/next buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-8 pb-8 border-b border-[#E5E7EB]">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#777777] block mb-3 font-mono">
              Core Architecture
            </span>
            <h2 className="text-[38px] sm:text-[48px] md:text-[54px] font-medium text-[#111111] leading-[1.05] tracking-[-0.03em]">
              What You Get
            </h2>
            <p className="mt-4 text-[17px] text-[#555555] font-normal leading-relaxed">
              Describe your idea — the platform creates canonical models, validates marketplace readiness, generates SEO titles, and reconciles batches in real time.
            </p>
          </div>

          {/* Right: Prev / Next Navigation Buttons */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={scrollLeft}
              className="w-12 h-12 flex items-center justify-center bg-white border border-[#D1D5DB] hover:border-[#111111] hover:bg-[#111111] hover:text-white rounded-[2px] transition-all cursor-pointer"
              title="Previous feature"
              aria-label="Previous feature"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              className="w-12 h-12 flex items-center justify-center bg-white border border-[#D1D5DB] hover:border-[#111111] hover:bg-[#111111] hover:text-white rounded-[2px] transition-all cursor-pointer"
              title="Next feature"
              aria-label="Next feature"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel (4 cards visible on desktop) */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 pt-1 scroll-smooth"
        >
          {features.map((feature, idx) => (
            <div key={idx} className="w-[300px] sm:w-[320px] md:w-[350px] lg:w-[calc(25%-18px)] shrink-0">
              <FeatureCard
                icon={feature.icon}
                category={feature.category}
                title={feature.title}
                description={feature.description}
                onTryNow={handleAction}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
