import { ArrowUpRight, Globe, Share2 } from 'lucide-react';

export const FooterSection = ({ onNavigate, onOpenLedger }) => {
  return (
    <footer className="bg-white text-gray-900 border-t border-gray-200">
      
      {/* Pre-Footer Banner (Dark Accent Band inspired by reference) */}
      <div className="bg-[#05060B] text-white py-14 px-6 lg:px-12 border-b border-white/10">
        <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              One platform to discover, analyze, and understand e-commerce opportunities.
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Transform hours of multi-tab marketplace research into automated decision intelligence.
            </p>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('register')}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-[#05060B] font-bold text-sm hover:bg-gray-100 transition shadow-md shrink-0 cursor-pointer group"
          >
            <span>Get Started</span>
            <span className="w-6 h-6 rounded-full bg-[#05060B] text-white flex items-center justify-center text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              ↗
            </span>
          </button>
        </div>
      </div>

      {/* Main 5-Column Navigation Footer */}
      <div className="max-w-[1360px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          
          {/* Brand info */}
          <div className="col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#05060B] flex items-center justify-center text-white font-bold text-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4563FF" stroke="#4563FF" strokeWidth="1.5"/>
                  <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2"/>
                  <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-[#05060B] font-mono tracking-tight">
                COMMERCE<span className="text-[#4563FF]">INTEL</span>
              </span>
            </div>

            <p className="mt-4 text-xs text-gray-500 leading-relaxed max-w-sm">
              Enterprise-grade AI intelligence layer connecting Amazon, Flipkart, Walmart, Shopify and global marketplaces into decision-ready catalog analytics.
            </p>

            <div className="mt-6 flex items-center gap-3 text-gray-500">
              <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:text-black hover:border-black transition text-xs font-bold font-mono">
                in
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:text-black hover:border-black transition text-xs font-bold font-mono">
                X
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:text-black hover:border-black transition text-xs font-bold font-mono">
                YT
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:text-black hover:border-black transition text-xs font-bold font-mono">
                GH
              </a>
            </div>
          </div>

          {/* Col 1: PRODUCT */}
          <div>
            <div className="text-xs font-mono font-bold tracking-wider text-gray-900 uppercase mb-4">
              Product
            </div>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li><a href="#platform-overview" className="hover:text-black transition">Multi-Channel Sync</a></li>
              <li><a href="#solutions" className="hover:text-black transition">Market Research</a></li>
              <li><a href="#solutions" className="hover:text-black transition">Competitor Analysis</a></li>
              <li><a href="#how-it-works" className="hover:text-black transition">Automated Workflows</a></li>
              <li><a href="#" onClick={onOpenLedger} className="hover:text-black transition">Analytics Dashboard</a></li>
              <li><a href="#" className="hover:text-black transition">Scheduled Reports</a></li>
            </ul>
          </div>

          {/* Col 2: PLATFORM */}
          <div>
            <div className="text-xs font-mono font-bold tracking-wider text-gray-900 uppercase mb-4">
              Platform
            </div>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li><a href="#how-it-works" className="hover:text-black transition">How It Works</a></li>
              <li><a href="#data-sources" className="hover:text-black transition">Data Sources</a></li>
              <li><a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer" className="hover:text-black transition inline-flex items-center gap-1">API Integrations <ArrowUpRight className="w-3 h-3 text-gray-400" /></a></li>
              <li><a href="#solutions" className="hover:text-black transition">AI Intelligence</a></li>
              <li><a href="#how-it-works" className="hover:text-black transition">Automation Pipeline</a></li>
            </ul>
          </div>

          {/* Col 3: RESOURCES */}
          <div>
            <div className="text-xs font-mono font-bold tracking-wider text-gray-900 uppercase mb-4">
              Resources
            </div>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li><a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer" className="hover:text-black transition">Documentation</a></li>
              <li><a href="#" className="hover:text-black transition">Industry Blog</a></li>
              <li><a href="#" className="hover:text-black transition">Sellers Guides</a></li>
              <li><a href="#case-studies" className="hover:text-black transition">Case Studies</a></li>
              <li><a href="#" className="hover:text-black transition">Help Center</a></li>
            </ul>
          </div>

          {/* Col 4: COMPANY */}
          <div>
            <div className="text-xs font-mono font-bold tracking-wider text-gray-900 uppercase mb-4">
              Company
            </div>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li><a href="#" className="hover:text-black transition">About Us</a></li>
              <li><a href="#" className="hover:text-black transition">Contact Sales</a></li>
              <li><a href="#" className="hover:text-black transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-black transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-black transition">Security & Compliance</a></li>
            </ul>
          </div>

        </div>

        {/* Sub-Footer */}
        <div className="mt-14 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div className="font-mono">
            © 2026 COMMERCEINTEL AI · All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>SOC2 Type II Certified</span>
            <span>•</span>
            <span>GDPR Compliant</span>
            <span>•</span>
            <span>99.98% API Uptime</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
