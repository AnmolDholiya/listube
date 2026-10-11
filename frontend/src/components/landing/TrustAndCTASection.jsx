import React from 'react';
import { Star, ShieldCheck, Cpu, Database, RefreshCw, Zap, ArrowRight, Layers, Lock, Server } from 'lucide-react';

export const TrustAndCTASection = ({ onNavigate, onOpenLedger }) => {
  const testimonials = [
    {
      stars: 5,
      quote: "Instead of spending 8 hours a week comparing products and competitor price drops across tabs, our merchandising desk gets a structured market view every morning in minutes.",
      author: "Priya Sharma",
      role: "Head of E-Commerce",
      company: "Apex D2C Brands",
      metrics: "650+ SKUs Monitored"
    },
    {
      stars: 5,
      quote: "The opportunity scoring engine flagged a gap in wireless audio accessories that our legacy tools missed. We launched 3 SKUs and captured buy-box positioning within two weeks.",
      author: "Marcus Vance",
      role: "VP of Marketplace Strategy",
      company: "OmniGrowth Capital",
      metrics: "3.2X Volume Lift"
    },
    {
      stars: 5,
      quote: "Normalizing disparate attribute taxonomies between Amazon and Walmart used to require a dedicated team of junior analysts. The automated schema engine solved this overnight.",
      author: "Devang Patel",
      role: "Catalog Operations Director",
      company: "Global Retailers Network",
      metrics: "86% Less Manual Effort"
    }
  ];

  const trustPillars = [
    { icon: Server, title: 'API-Driven Architecture', desc: 'Direct REST & SP-API webhooks with zero fragile HTML scraping' },
    { icon: Database, title: 'Automated Collection', desc: 'Continuous catalog sync across Amazon, Flipkart, Walmart, Shopify' },
    { icon: Layers, title: 'Structured Intelligence', desc: 'Normalized taxonomy ensuring apples-to-apples SKU comparisons' },
    { icon: Cpu, title: 'AI Opportunity Models', desc: 'Proprietary price elasticity and review sentiment scoring' },
    { icon: RefreshCw, title: 'Scalable Workflows', desc: 'Effortlessly scales from 10 SKUs to 50,000+ catalog items' },
    { icon: Lock, title: 'Enterprise Security', desc: 'Role-based access, encrypted tokens, and SOC2-ready protocols' },
  ];

  return (
    <div>
      
      {/* ============================================================== */}
      {/* SECTION 19: TESTIMONIALS (WHITE THEME)                         */}
      {/* ============================================================== */}
      <section className="py-20 lg:py-28 bg-white border-b border-gray-200" id="testimonials">
        <div className="max-w-[1360px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="ced-pill-badge ced-pill-badge-light mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4563FF]" />
              Seller Experience
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#05060B] tracking-tight leading-[1.1]">
              Built for Faster E-Commerce Decisions
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600">
              Trusted by modern retail operators who refuse to lose margin to manual spreadsheet latency.
            </p>
          </div>

          {/* 3 Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div 
                key={idx}
                className="p-7 rounded-2xl bg-[#FAFAFC] border border-gray-200 flex flex-col justify-between hover:border-gray-300 hover:shadow-md transition-all shadow-xs"
              >
                <div>
                  {/* 5 Stars */}
                  <div className="flex items-center gap-1 text-amber-400 mb-5">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-sm sm:text-[15px] leading-relaxed text-gray-700 font-normal italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-gray-200 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-gray-900">{t.author}</div>
                    <div className="text-xs text-gray-500">{t.role} · {t.company}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-blue-50 text-[#4563FF] border border-blue-200 font-bold">
                    {t.metrics}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <span className="text-[11px] text-gray-400 font-mono">
              * Example testimonial feedback gathered during early beta testing programs.
            </span>
          </div>
        </div>
      </section>


      {/* ============================================================== */}
      {/* SECTION 20: TRUST / ARCHITECTURAL CREDIBILITY (WHITE THEME)   */}
      {/* ============================================================== */}
      <section className="py-20 lg:py-24 bg-[#F4F7FD] border-b border-gray-200">
        <div className="max-w-[1360px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#05060B] tracking-tight">
              Built for Data-Driven E-Commerce Teams
            </h3>
            <p className="mt-3 text-sm text-gray-600">
              Enterprise infrastructure designed for continuous high-throughput catalog processing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustPillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-gray-200/90 hover:border-gray-300 hover:shadow-sm transition-all flex items-start gap-4 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#4563FF] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{p.title}</h4>
                    <p className="mt-1 text-xs text-gray-600 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ============================================================== */}
      {/* SECTION 21: FINAL CTA (DARK ENTERPRISE BANNER)                 */}
      {/* ============================================================== */}
      <section className="py-24 lg:py-36 bg-[#05060B] text-white border-b border-white/10 relative overflow-hidden">
        {/* Subtle electric blue glows */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-[#4563FF]/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-[#635BFF]/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1360px] mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="ced-pill-badge ced-pill-badge-dark mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4563FF]" />
              Get Started Today
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-white">
              Stop collecting data.<br />
              <span className="text-[#4563FF]">Start making decisions.</span>
            </h2>

            <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
              Turn fragmented e-commerce data into actionable product and market intelligence in minutes.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
              <button
                onClick={() => onNavigate && onNavigate('register')}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#05060B] font-bold text-base hover:bg-gray-100 transition shadow-2xl group cursor-pointer"
              >
                <span>Explore the Intelligence Engine</span>
                <span className="w-7 h-7 rounded-full bg-[#05060B] text-white flex items-center justify-center text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  ↗
                </span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full text-gray-300 hover:text-white font-medium text-base transition cursor-pointer"
              >
                <span>See How It Works</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="mt-8 text-xs text-gray-500 font-mono">
              Zero credit card required for 14-day evaluation · Instant sandbox access
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
