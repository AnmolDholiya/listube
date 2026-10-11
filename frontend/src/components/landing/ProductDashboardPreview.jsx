import React, { useState } from 'react';
import { 
  ArrowRight, 
  TrendingUp, 
  Database, 
  Sparkles, 
  Activity, 
  Layers, 
  CheckCircle2, 
  ChevronRight,
  Clock,
  Zap,
  BarChart3,
  RefreshCw,
  ShieldCheck,
  Search,
  Check,
  Star,
  DollarSign,
  LayoutDashboard,
  Package,
  Globe2,
  Users2,
  Tag,
  Compass,
  FileText,
  Settings,
  Plus,
  ArrowUpRight,
  Sliders,
  Filter,
  CheckCircle
} from 'lucide-react';

export const ProductDashboardPreview = ({ onNavigate, onOpenLedger, isAuthenticated }) => {
  const [activeSidebarItem, setActiveSidebarItem] = useState('Overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const sidebarItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Product Intelligence', icon: Package },
    { name: 'Market Research', icon: Globe2 },
    { name: 'Competitor Analysis', icon: Users2 },
    { name: 'Price Intelligence', icon: Tag },
    { name: 'Opportunity Finder', icon: Compass },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Reports', icon: FileText },
    { name: 'Settings', icon: Settings },
  ];

  const kpis = [
    {
      label: 'TIME SAVED',
      value: '86%',
      subtext: 'Research time reduction',
      detailLeft: 'Manual: 7h 34m',
      detailRight: 'Platform: 52m',
      highlight: 'emerald'
    },
    {
      label: 'PRODUCTS ANALYZED',
      value: '1,248',
      subtext: 'Across multiple sources',
      detailLeft: 'Multi-channel',
      detailRight: '14 categories',
      highlight: 'blue'
    },
    {
      label: 'DATA SOURCES',
      value: '18',
      subtext: 'Connected sources',
      detailLeft: 'APIs & Feeds',
      detailRight: 'Real-time sync',
      highlight: 'purple'
    },
    {
      label: 'OPPORTUNITY SCORE',
      value: '92/100',
      subtext: 'High potential',
      detailLeft: 'Top decile',
      detailRight: '+8.4% WoW',
      highlight: 'emerald'
    }
  ];

  const products = [
    { name: 'Wireless Earbuds', category: 'Electronics', price: '₹999', rating: '4.4', reviews: '8.2K', competition: 'High', opportunity: 'Strong', score: 92 },
    { name: 'Smart Watch', category: 'Electronics', price: '₹1,499', rating: '4.3', reviews: '5.7K', competition: 'Medium', opportunity: 'Strong', score: 89 },
    { name: 'Travel Backpack', category: 'Fashion', price: '₹1,299', rating: '4.5', reviews: '3.4K', competition: 'Medium', opportunity: 'High', score: 87 },
    { name: 'Kitchen Organizer', category: 'Home', price: '₹699', rating: '4.2', reviews: '2.1K', competition: 'Low', opportunity: 'High', score: 84 },
  ];

  const topOpportunities = [
    { rank: '01', name: 'Wireless Earbuds', score: '92 / 100', status: 'High Potential', statusColor: 'emerald' },
    { rank: '02', name: 'Travel Backpack', score: '89 / 100', status: 'High Potential', statusColor: 'emerald' },
    { rank: '03', name: 'Kitchen Organizer', score: '84 / 100', status: 'Strong Potential', statusColor: 'blue' },
    { rank: '04', name: 'Smart Watch', score: '81 / 100', status: 'Moderate Potential', statusColor: 'purple' }
  ];

  const activityFeed = [
    { title: 'Product discovery completed', desc: '124 products found', time: '2 min ago', success: true },
    { title: 'Competitor analysis completed', desc: '86 competitors identified', time: '3 min ago', success: true },
    { title: 'Price intelligence updated', desc: '1,248 prices analyzed', time: '5 min ago', success: true },
    { title: 'Opportunity scoring completed', desc: '23 opportunities identified', time: '7 min ago', success: true }
  ];

  const pipeline = [
    { name: 'DISCOVER', status: 'Complete' },
    { name: 'COLLECT', status: 'Complete' },
    { name: 'NORMALIZE', status: 'Complete' },
    { name: 'DEDUPLICATE', status: 'Complete' },
    { name: 'ENRICH', status: 'Complete' },
    { name: 'COMPARE', status: 'Complete' },
    { name: 'ANALYZE', status: 'Complete' },
    { name: 'SCORE', status: 'Complete' },
    { name: 'RECOMMEND', status: 'Ready', highlight: true }
  ];

  const handleCta = () => {
    if (isAuthenticated) {
      if (onOpenLedger) onOpenLedger();
    } else {
      if (onNavigate) onNavigate('register');
    }
  };

  const handleLearnMore = () => {
    const el = document.getElementById('what-you-get');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 md:py-32 bg-[#FFFFFF] border-b border-[#E5E7EB] relative overflow-hidden">
      {/* Background Soft Glow Effect */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[980px] md:w-[1380px] h-[780px] md:h-[980px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.08) 0%, rgba(139, 92, 246, 0.06) 40%, transparent 70%)',
          filter: 'blur(80px)'
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAFAFA] border border-[#E5E7EB] rounded-[4px] mb-4 text-xs font-mono text-[#555555]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
            <span>Illustrative product preview</span>
          </div>
          <h2 className="text-[38px] sm:text-[46px] md:text-[52px] font-medium text-[#111827] leading-[1.04] tracking-[-0.03em]">
            E-Commerce Intelligence, Without the Manual Work
          </h2>
          <p className="mt-4 text-[17px] text-[#64748B] font-normal leading-relaxed max-w-2xl mx-auto">
            Discover products, compare competitors, analyze market signals and turn fragmented e-commerce data into actionable intelligence.
          </p>
        </div>

        {/* CedCommerce-Inspired Product Dashboard Frame (1250-1320px) */}
        <div className="max-w-[1300px] mx-auto">
          <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[8px] overflow-hidden shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            
            {/* Top Browser / Window Header */}
            <div className="px-5 py-3 bg-[#FAFAFA] border-b border-[#E5E7EB] flex items-center justify-between select-none">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
                </div>
                <span className="text-xs font-mono font-medium text-[#111827] pl-1 hidden sm:inline">
                  E-Commerce Intelligence Platform
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-[#16A34A] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-[3px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                <span>● Analysis Complete</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#64748B] hidden md:inline">
                  Demo Analysis
                </span>
                <button
                  onClick={handleRefresh}
                  className="p-1.5 text-[#64748B] hover:text-[#111827] hover:bg-[#E2E8F0] rounded-[3px] transition-colors cursor-pointer"
                  title="Refresh simulation"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Structured CedCommerce-Style Layout: Left Sidebar + Main Dashboard */}
            <div className="flex flex-col lg:flex-row">
              
              {/* Left Professional Sidebar */}
              <aside className="w-full lg:w-[220px] bg-[#F8FAFC] border-b lg:border-b-0 lg:border-r border-[#E5E7EB] p-4 flex flex-col justify-between shrink-0">
                <div className="space-y-1">
                  <div className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] font-bold hidden lg:block">
                    Navigation
                  </div>
                  <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1 hide-scrollbar">
                    {sidebarItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeSidebarItem === item.name;
                      return (
                        <button
                          key={item.name}
                          onClick={() => setActiveSidebarItem(item.name)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-medium transition-all cursor-pointer whitespace-nowrap text-left ${
                            isActive
                              ? 'bg-[#2563EB] text-white shadow-xs font-semibold'
                              : 'text-[#475569] hover:bg-[#E2E8F0] hover:text-[#111827]'
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#64748B]'}`} />
                          <span>{item.name}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Sidebar Bottom: Engine Status */}
                <div className="hidden lg:block pt-6 border-t border-[#E2E8F0] mt-4">
                  <div className="p-3 bg-white border border-[#E5E7EB] rounded-[6px]">
                    <div className="flex items-center justify-between text-[11px] font-medium text-[#111827]">
                      <span className="truncate">AI Intelligence Engine</span>
                      <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                    </div>
                    <div className="text-[10px] text-[#16A34A] font-mono mt-0.5">
                      ● Connected (18 Sources)
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Dashboard Workspace */}
              <main className="flex-1 bg-white p-5 sm:p-7 space-y-6 overflow-hidden">
                
                {/* Dashboard Top Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-[#111827] tracking-tight">
                      E-Commerce Intelligence
                    </h3>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      AI-powered market and product research • Real-time synthesis
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#16A34A] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-[4px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                      <span>Live</span>
                    </div>

                    <button
                      onClick={handleRefresh}
                      className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-[4px] shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Analysis</span>
                    </button>

                    <div className="w-8 h-8 rounded-full bg-[#F1F5F9] border border-[#CBD5E1] text-[#334155] flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      SA
                    </div>
                  </div>
                </div>

                {/* 4 Hero KPI Cards (Equal Height) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {kpis.map((kpi, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white border border-[#E5E7EB] hover:border-[#CBD5E1] rounded-[6px] flex flex-col justify-between h-[120px] transition-colors group select-none shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                        <span className="font-semibold tracking-wider text-[#111827]">{kpi.label}</span>
                        <span className={`font-semibold px-1.5 py-0.5 rounded-[2px] ${
                          kpi.highlight === 'emerald'
                            ? 'text-[#16A34A] bg-emerald-50 border border-emerald-200'
                            : kpi.highlight === 'blue'
                            ? 'text-[#2563EB] bg-blue-50 border border-blue-200'
                            : 'text-[#8B5CF6] bg-purple-50 border border-purple-200'
                        }`}>
                          {kpi.highlight === 'emerald' ? '-86%' : 'Live'}
                        </span>
                      </div>

                      <div>
                        <div className="text-[26px] font-bold font-mono text-[#111827] tracking-tight leading-none">
                          {kpi.value}
                        </div>
                        <div className="text-xs text-[#64748B] mt-1 truncate">
                          {kpi.subtext}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] border-t border-[#F1F5F9] pt-1.5">
                        <span>{kpi.detailLeft}</span>
                        <span className="font-medium text-[#111827]">{kpi.detailRight}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Main Analytics Row: Research Efficiency (60%) & Market Overview (40%) (Equal Height) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left: Research Efficiency Card (7 cols / ~60%) */}
                  <div className="lg:col-span-7 p-5 bg-white border border-[#E5E7EB] rounded-[6px] flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h4 className="text-sm font-semibold text-[#111827]">
                            Research Efficiency
                          </h4>
                          <p className="text-xs text-[#64748B]">
                            Time required for the same e-commerce research task
                          </p>
                        </div>
                        <span className="text-xs font-mono font-semibold text-[#16A34A] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[3px]">
                          86% less research time
                        </span>
                      </div>

                      {/* Comparative Horizontal Bars */}
                      <div className="mt-5 space-y-3.5">
                        <div>
                          <div className="flex justify-between text-xs font-mono mb-1">
                            <span className="font-medium text-[#64748B]">MANUAL WORKFLOW</span>
                            <span className="font-bold text-[#111827]">7h 34m</span>
                          </div>
                          <div className="w-full h-6 bg-[#F1F5F9] rounded-[3px] overflow-hidden flex items-center px-2.5">
                            <div className="h-3.5 bg-[#94A3B8] rounded-[2px]" style={{ width: '100%' }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-mono mb-1">
                            <span className="font-medium text-[#2563EB] flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                              <span>PLATFORM AUTOMATION</span>
                            </span>
                            <span className="font-bold text-[#16A34A]">52m</span>
                          </div>
                          <div className="w-full h-6 bg-blue-50/60 border border-blue-100 rounded-[3px] overflow-hidden flex items-center px-2.5">
                            <div className="h-3.5 bg-gradient-to-r from-[#2563EB] to-[#16A34A] rounded-[2px]" style={{ width: '14%' }} />
                          </div>
                        </div>
                      </div>

                      {/* Workflow Sequence Contrast */}
                      <div className="mt-5 pt-4 border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[4px]">
                          <span className="font-mono text-[10px] font-semibold text-[#64748B] block mb-0.5">
                            Manual Workflow:
                          </span>
                          <div className="text-[#475569] font-mono text-[11px] leading-relaxed">
                            Search → Copy → Clean → Compare → Analyze
                          </div>
                        </div>
                        <div className="p-2.5 bg-blue-50/60 border border-blue-200 rounded-[4px]">
                          <span className="font-mono text-[10px] font-semibold text-[#2563EB] block mb-0.5">
                            Platform Workflow:
                          </span>
                          <div className="text-[#1E293B] font-mono text-[11px] leading-relaxed">
                            API → Enrich → Analyze → Recommend
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-[#94A3B8] font-mono mt-3">
                      *Illustrative benchmark • Calculated across 1,248 multi-channel products
                    </div>
                  </div>

                  {/* Right: Market Overview Card (5 cols / ~40%) */}
                  <div className="lg:col-span-5 p-5 bg-white border border-[#E5E7EB] rounded-[6px] flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-[#111827]">
                          Market Overview
                        </h4>
                        <span className="text-[11px] font-mono text-[#64748B] bg-[#F8FAFC] px-2 py-0.5 rounded-[3px]">
                          Active Scope
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mb-4">
                        Consolidated multi-source catalog telemetry
                      </p>

                      {/* CedCommerce Aligned Data Rows */}
                      <div className="divide-y divide-[#F1F5F9] text-xs">
                        <div className="py-2 flex items-center justify-between">
                          <span className="text-[#64748B]">Products Analyzed</span>
                          <span className="font-mono font-semibold text-[#111827]">1,248</span>
                        </div>
                        <div className="py-2 flex items-center justify-between">
                          <span className="text-[#64748B]">Competitors Tracked</span>
                          <span className="font-mono font-semibold text-[#111827]">86</span>
                        </div>
                        <div className="py-2 flex items-center justify-between">
                          <span className="text-[#64748B]">Product Categories</span>
                          <span className="font-mono font-semibold text-[#111827]">14</span>
                        </div>
                        <div className="py-2 flex items-center justify-between">
                          <span className="text-[#64748B]">Average Price</span>
                          <span className="font-mono font-semibold text-[#111827]">₹1,849</span>
                        </div>
                        <div className="py-2 flex items-center justify-between">
                          <span className="text-[#64748B]">Average Rating</span>
                          <span className="font-mono font-semibold text-[#111827]">4.2 ★</span>
                        </div>
                        <div className="py-2 flex items-center justify-between">
                          <span className="text-[#64748B]">Review Volume</span>
                          <span className="font-mono font-semibold text-[#111827]">248K+ reviews</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-[#94A3B8] font-mono pt-2 border-t border-[#F1F5F9]">
                      Multi-marketplace coverage • Flipkart, Amazon, D2C
                    </div>
                  </div>
                </div>

                {/* Product Intelligence Table & Top Opportunities Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left: Product Intelligence Table (7 cols / ~60%) */}
                  <div className="lg:col-span-7 p-5 bg-white border border-[#E5E7EB] rounded-[6px] flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-semibold text-[#111827]">
                            Product Intelligence
                          </h4>
                          <p className="text-xs text-[#64748B]">
                            Enriched multi-marketplace product metrics
                          </p>
                        </div>
                        <span className="text-[11px] font-mono text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-[3px]">
                          4 Sample Products
                        </span>
                      </div>

                      {/* Clean CedCommerce Data Table */}
                      <div className="border border-[#E5E7EB] rounded-[4px] overflow-x-auto hide-scrollbar">
                        <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                          <thead>
                            <tr className="bg-[#FAFAFA] border-b border-[#E5E7EB] font-mono text-[11px] text-[#64748B]">
                              <th className="py-2 px-3 font-semibold">Product</th>
                              <th className="py-2 px-3 font-semibold">Category</th>
                              <th className="py-2 px-3 font-semibold">Price</th>
                              <th className="py-2 px-3 font-semibold">Rating</th>
                              <th className="py-2 px-3 font-semibold">Reviews</th>
                              <th className="py-2 px-3 font-semibold">Competition</th>
                              <th className="py-2 px-3 font-semibold">Opportunity</th>
                              <th className="py-2 px-3 font-semibold text-right">Score</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#F1F5F9]">
                            {products.map((p, idx) => (
                              <tr 
                                key={p.name}
                                onMouseEnter={() => setHoveredProduct(idx)}
                                onMouseLeave={() => setHoveredProduct(null)}
                                className={`transition-colors ${hoveredProduct === idx ? 'bg-[#F8FAFC]' : 'bg-white'}`}
                              >
                                <td className="py-2 px-3 font-medium text-[#111827] whitespace-nowrap">{p.name}</td>
                                <td className="py-2 px-3 text-[#64748B]">{p.category}</td>
                                <td className="py-2 px-3 font-mono text-[#111827]">{p.price}</td>
                                <td className="py-2 px-3 font-mono text-[#111827]">{p.rating} ★</td>
                                <td className="py-2 px-3 font-mono text-[#64748B]">{p.reviews}</td>
                                <td className="py-2 px-3 text-[#64748B]">{p.competition}</td>
                                <td className="py-2 px-3">
                                  <span className={`px-1.5 py-0.5 rounded-[2px] text-[10px] font-mono font-semibold ${
                                    p.opportunity === 'Strong' 
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                                  }`}>
                                    {p.opportunity}
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-right font-mono font-bold text-[#2563EB]">{p.score}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="text-[10px] text-[#94A3B8] font-mono mt-3">
                      Real-time SKU scoring with category demand signals
                    </div>
                  </div>

                  {/* Right: Opportunity Panel & Score Breakdown (5 cols / ~40%) */}
                  <div className="lg:col-span-5 p-5 bg-white border border-[#E5E7EB] rounded-[6px] flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-[#111827]">
                          Top Opportunities
                        </h4>
                        <span className="text-[11px] font-mono text-[#2563EB] font-bold">
                          92 / 100 Score
                        </span>
                      </div>

                      {/* 4 Ranked Opportunities */}
                      <div className="space-y-2 mb-4">
                        {topOpportunities.map((item) => (
                          <div key={item.rank} className="p-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[4px] flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono font-bold text-[#64748B] text-[11px]">{item.rank}</span>
                              <span className="font-medium text-[#111827]">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-2 font-mono">
                              <span className="font-semibold text-[#111827]">{item.score}</span>
                              <span className="text-[10px] font-semibold text-[#16A34A] bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded-[2px]">
                                {item.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Opportunity Score Breakdown Progress Bars */}
                      <div className="pt-3 border-t border-[#F1F5F9] space-y-2 text-xs font-mono">
                        <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                          Score Breakdown:
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] text-[#475569] mb-0.5">
                            <span>Demand</span>
                            <span className="font-semibold text-[#111827]">92%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#F1F5F9] rounded-[2px] overflow-hidden">
                            <div className="h-full bg-[#2563EB] rounded-[1px]" style={{ width: '92%' }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-[#475569] mb-0.5">
                            <span>Competition</span>
                            <span className="font-semibold text-[#111827]">71%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#F1F5F9] rounded-[2px] overflow-hidden">
                            <div className="h-full bg-[#94A3B8] rounded-[1px]" style={{ width: '71%' }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-[#475569] mb-0.5">
                            <span>Price Opportunity</span>
                            <span className="font-semibold text-[#111827]">84%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#F1F5F9] rounded-[2px] overflow-hidden">
                            <div className="h-full bg-[#16A34A] rounded-[1px]" style={{ width: '84%' }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-[#475569] mb-0.5">
                            <span>Review Sentiment</span>
                            <span className="font-semibold text-[#111827]">88%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#F1F5F9] rounded-[2px] overflow-hidden">
                            <div className="h-full bg-[#8B5CF6] rounded-[1px]" style={{ width: '88%' }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-[#475569] mb-0.5">
                            <span>Market Growth</span>
                            <span className="font-semibold text-[#111827]">78%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#F1F5F9] rounded-[2px] overflow-hidden">
                            <div className="h-full bg-[#3B82F6] rounded-[1px]" style={{ width: '78%' }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-[#94A3B8] font-mono mt-3">
                      Multi-factor AI weighting layer
                    </div>
                  </div>
                </div>

                {/* Competitive Intelligence + Data Quality & Recent Activity Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left: Competitor Intelligence & Data Quality (7 cols / ~60%) */}
                  <div className="lg:col-span-7 p-5 bg-white border border-[#E5E7EB] rounded-[6px] flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-semibold text-[#111827]">
                            Competitive Intelligence &amp; Data Quality
                          </h4>
                          <p className="text-xs text-[#64748B]">
                            86 competitors identified • Price gap ₹4,500
                          </p>
                        </div>
                        <span className="text-[11px] font-mono text-[#16A34A] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[3px]">
                          High Quality
                        </span>
                      </div>

                      {/* Competitor Price Summary Strip */}
                      <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono my-3">
                        <div className="p-2 bg-[#F8FAFC] rounded-[4px] border border-[#E5E7EB]">
                          <span className="text-[10px] text-[#64748B] block">Average</span>
                          <span className="font-bold text-[#111827]">₹1,849</span>
                        </div>
                        <div className="p-2 bg-[#F8FAFC] rounded-[4px] border border-[#E5E7EB]">
                          <span className="text-[10px] text-[#64748B] block">Lowest</span>
                          <span className="font-bold text-[#16A34A]">₹499</span>
                        </div>
                        <div className="p-2 bg-[#F8FAFC] rounded-[4px] border border-[#E5E7EB]">
                          <span className="text-[10px] text-[#64748B] block">Highest</span>
                          <span className="font-bold text-[#8B5CF6]">₹4,999</span>
                        </div>
                        <div className="p-2 bg-[#F8FAFC] rounded-[4px] border border-[#E5E7EB]">
                          <span className="text-[10px] text-[#64748B] block">Price Gap</span>
                          <span className="font-bold text-[#111827]">₹4,500</span>
                        </div>
                      </div>

                      {/* Data Quality Metrics Grid */}
                      <div className="pt-3 border-t border-[#F1F5F9]">
                        <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-2 font-mono">
                          Data Quality Assurance:
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                          <div className="p-2 bg-white border border-[#E5E7EB] rounded-[4px]">
                            <span className="text-base font-bold font-mono text-[#111827]">96%</span>
                            <span className="text-[10px] text-[#64748B] block">Validated</span>
                          </div>
                          <div className="p-2 bg-white border border-[#E5E7EB] rounded-[4px]">
                            <span className="text-base font-bold font-mono text-[#111827]">94%</span>
                            <span className="text-[10px] text-[#64748B] block">Duplicate-free</span>
                          </div>
                          <div className="p-2 bg-white border border-[#E5E7EB] rounded-[4px]">
                            <span className="text-base font-bold font-mono text-[#111827]">91%</span>
                            <span className="text-[10px] text-[#64748B] block">Enriched</span>
                          </div>
                          <div className="p-2 bg-white border border-[#E5E7EB] rounded-[4px]">
                            <span className="text-base font-bold font-mono text-[#111827]">98%</span>
                            <span className="text-[10px] text-[#64748B] block">Availability</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-[#94A3B8] font-mono mt-3">
                      Illustrative demo metrics • Validated with automatic schema reconciliation
                    </div>
                  </div>

                  {/* Right: Operational Activity Feed (CedCommerce style, 5 cols / ~40%) */}
                  <div className="lg:col-span-5 p-5 bg-white border border-[#E5E7EB] rounded-[6px] flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-[#111827]">
                          Recent Analysis Activity
                        </h4>
                        <span className="text-[11px] font-mono text-[#16A34A] flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Operational</span>
                        </span>
                      </div>

                      {/* Activity Feed Items */}
                      <div className="space-y-3">
                        {activityFeed.map((item, idx) => (
                          <div key={idx} className="p-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[4px] flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5 text-[#16A34A]">
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-[#111827] truncate">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-[#64748B]">
                                {item.desc}
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-[#94A3B8] shrink-0">
                              {item.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-[10px] text-[#94A3B8] font-mono mt-3 pt-2 border-t border-[#F1F5F9]">
                      Automated audit log • Real-time event streaming
                    </div>
                  </div>
                </div>

                {/* Bottom Full-Width Automation Pipeline */}
                <div className="p-5 bg-white border border-[#E5E7EB] rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#2563EB]" />
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111827] font-mono">
                        Intelligence Pipeline: From Research to Recommendation
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono text-[#16A34A] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Recommendation Ready</span>
                    </span>
                  </div>

                  {/* Horizontal Pipeline Sequence */}
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-1 text-center">
                    {pipeline.map((step, idx, arr) => (
                      <React.Fragment key={step.name}>
                        <div 
                          className={`flex-1 py-2 px-1.5 rounded-[4px] border text-center transition-all ${
                            step.highlight
                              ? 'bg-blue-50 border-[#2563EB] text-[#2563EB] shadow-[0_0_12px_rgba(37,99,235,0.2)]'
                              : 'bg-[#FAFAFA] border-[#E5E7EB] text-[#475569]'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <Check className={`w-3 h-3 ${step.highlight ? 'text-[#2563EB]' : 'text-[#16A34A]'}`} />
                            <span className="text-[10px] font-mono font-semibold tracking-tight">
                              {step.name}
                            </span>
                          </div>
                        </div>

                        {idx < arr.length - 1 && (
                          <div className="hidden lg:flex items-center text-[#CBD5E1]">
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Credibility Demo Label */}
                <div className="text-center text-[11px] text-[#94A3B8] font-mono">
                  Illustrative product preview • Demo data — actual results vary by source, workflow and data volume.
                </div>
              </main>
            </div>
          </div>
        </div>

        {/* Before / After Two-Column Contrast Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#64748B]">
              Transformation Contrast
            </span>
            <h3 className="text-2xl sm:text-3xl font-medium text-[#111827] tracking-tight mt-1">
              From Manual Research to Automated Intelligence
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* TRADITIONAL */}
            <div className="p-6 bg-white border border-red-200 rounded-[6px] shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-red-100 mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-700">
                  TRADITIONAL RESEARCH
                </span>
                <span className="font-mono text-base font-bold text-red-700">
                  7h 34m
                </span>
              </div>
              <ul className="space-y-2 text-xs text-[#475569]">
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">✕</span> Multiple browser tabs open simultaneously
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">✕</span> Manual copy-pasting product attributes
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">✕</span> Fragile, disconnected spreadsheets
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">✕</span> Error-prone human price comparisons
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">✕</span> Slow, subjective decision making
                </li>
              </ul>
            </div>

            {/* OUR PLATFORM */}
            <div className="p-6 bg-white border border-emerald-300 rounded-[6px] shadow-xs bg-gradient-to-br from-white to-emerald-50/20">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16A34A] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>OUR PLATFORM</span>
                </span>
                <span className="font-mono text-base font-bold text-[#16A34A]">
                  52m (-86%)
                </span>
              </div>
              <ul className="space-y-2 text-xs text-[#1E293B] font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" /> Single unified intelligence workflow
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" /> Automated multi-source data collection
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" /> Normalized, duplicate-free structured data
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" /> Automated competitor benchmarking &amp; pricing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" /> AI-calculated opportunity scores &amp; action plan
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Final Investor Message & CTA */}
        <div className="mt-14 text-center max-w-2xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-medium text-[#111827] tracking-tight mb-3">
            One workflow. Multiple sources. Actionable intelligence.
          </h3>
          <p className="text-[15px] sm:text-[16px] text-[#64748B] font-normal leading-relaxed mb-8">
            Instead of spending hours collecting and comparing e-commerce data manually, our platform turns fragmented market information into structured, analyzed and decision-ready intelligence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={handleCta}
              className="btn-rect-primary text-xs py-2.5 px-6 font-medium cursor-pointer"
            >
              <span>Explore the Intelligence Engine</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
            <button
              onClick={handleLearnMore}
              className="btn-rect text-xs py-2.5 px-5 font-medium cursor-pointer"
            >
              <span>See How It Works</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
