import React from 'react';
import { Check, Sparkles } from 'lucide-react';

export const PricingSection = ({ onNavigate, onOpenLedger, isAuthenticated }) => {
  const plans = [
    {
      name: 'Starter',
      badge: null,
      price: '$0',
      period: 'free forever',
      description: 'Ideal for independent apparel creators and boutique sellers getting started.',
      features: [
        'Up to 50 active canonical SKUs',
        'Flipkart Listing API v3 integration',
        'Standard batch CSV bulk ingestion',
        'Rule-based field validation',
        'Community forum support'
      ],
      isPopular: false,
      buttonText: 'Start for free',
      buttonPrimary: false
    },
    {
      name: 'Plus',
      badge: 'Most Popular',
      price: '$29',
      period: 'per month',
      description: 'Built for high-velocity D2C brands publishing multi-marketplace drops.',
      features: [
        'Unlimited canonical SKU catalog',
        'Flipkart v3 + Amazon SP-API adapters',
        'Real-time async thread pool publishing',
        'Automatic image aspect & dimension check',
        'Race-safe background batch reconciliation',
        'Instant multi-channel webhook updates'
      ],
      isPopular: true,
      buttonText: 'Get started with Plus',
      buttonPrimary: true
    },
    {
      name: 'Premium',
      badge: null,
      price: '$99',
      period: 'per month',
      description: 'Enterprise catalog pipeline for large apparel manufacturers & aggregators.',
      features: [
        'Multi-tenant seller data isolation',
        'Dedicated high-throughput thread pool',
        'Custom ERP & warehouse connectors',
        'Myntra & Meesho private beta access',
        'Sub-second batch polling engine',
        'Dedicated account engineer SLA'
      ],
      isPopular: false,
      buttonText: 'Contact Sales',
      buttonPrimary: false
    }
  ];

  const handleSelectPlan = (plan) => {
    if (isAuthenticated) {
      onOpenLedger();
    } else {
      if (onNavigate) onNavigate('register');
    }
  };


  return (
    <section id="pricing" className="py-24 md:py-32 bg-[#FAFAFA] border-b border-[#E5E7EB]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
        {/* Section Heading */}
        <div className="max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#777777] block mb-3 font-mono">
            Transparent Pricing
          </span>
          <h2 className="text-[38px] sm:text-[48px] md:text-[54px] font-medium text-[#111111] leading-[1.05] tracking-[-0.03em]">
            Plans &amp; Pricing
          </h2>
          <p className="mt-4 text-[17px] text-[#555555] font-normal leading-relaxed">
            Choose the catalog plan tailored to your sales volume. Scale smoothly from first drop to enterprise volume.
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto text-left">
          {plans.map((plan, idx) => (
            <div 
              key={idx}
              className={`editorial-card flex flex-col justify-between p-8 sm:p-10 bg-white relative ${
                plan.isPopular 
                  ? 'border-[#111111] shadow-[0_16px_40px_-12px_rgba(96,165,250,0.22)]' 
                  : 'border-[#E5E7EB]'
              }`}
            >
              {/* Subtle top glow highlight for Plus card */}
              {plan.isPopular && (
                <div 
                  className="absolute -top-px left-0 right-0 h-[3px] bg-gradient-to-r from-[#60A5FA] via-[#C4B5FD] to-[#3B82F6]" 
                />
              )}

              <div>
                {/* Header & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-medium text-[#111111]">
                    {plan.name}
                  </h3>
                  {plan.badge && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-[#3B82F6] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-[2px]">
                      <Sparkles className="w-3 h-3" />
                      {plan.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#555555] min-h-[36px] font-normal leading-relaxed">
                  {plan.description}
                </p>

                {/* Price Typography */}
                <div className="mt-6 mb-8 pb-6 border-b border-[#E5E7EB]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[44px] md:text-[50px] font-semibold text-[#111111] leading-none tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-sm text-[#777777] font-normal">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3 text-xs sm:text-[13px] text-[#333333]">
                      <div className="w-4 h-4 rounded-[2px] bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5 text-[#111111]">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3 text-[14px] font-medium transition-all cursor-pointer ${
                    plan.buttonPrimary 
                      ? 'btn-rect-primary' 
                      : 'btn-rect'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
