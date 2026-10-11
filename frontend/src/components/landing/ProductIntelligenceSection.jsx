import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, ExternalLink, Star, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';

export const ProductIntelligenceSection = ({ onNavigate, onOpenLedger }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const products = [
    {
      name: 'Wireless ANC Earbuds Pro',
      sku: 'SKU-AUD-8821',
      category: 'Electronics',
      price: '₹1,499',
      origPrice: '₹2,999',
      rating: 4.6,
      reviews: '12.4K',
      competition: 'Medium',
      compColor: 'text-amber-600 bg-amber-50 border-amber-200',
      demand: 'High',
      demandColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      score: 92,
      marketSignal: '+24% search growth'
    },
    {
      name: 'Smart Hydration Bottle (LED)',
      sku: 'SKU-HOM-1934',
      category: 'Home & Kitchen',
      price: '₹899',
      origPrice: '₹1,499',
      rating: 4.4,
      reviews: '8.2K',
      competition: 'Low',
      compColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      demand: 'High',
      demandColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      score: 88,
      marketSignal: 'Low competitor inventory'
    },
    {
      name: 'Portable USB-C Blender',
      sku: 'SKU-KIT-5591',
      category: 'Home & Kitchen',
      price: '₹1,299',
      origPrice: '₹2,199',
      rating: 4.5,
      reviews: '6.7K',
      competition: 'Medium',
      compColor: 'text-amber-600 bg-amber-50 border-amber-200',
      demand: 'High',
      demandColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      score: 86,
      marketSignal: 'High viral traction'
    },
    {
      name: 'Dual-Sided Ergonomic Desk Mat',
      sku: 'SKU-OFF-3211',
      category: 'Office',
      price: '₹749',
      origPrice: '₹1,199',
      rating: 4.7,
      reviews: '9.1K',
      competition: 'Low',
      compColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      demand: 'Medium',
      demandColor: 'text-blue-700 bg-blue-50 border-blue-200',
      score: 84,
      marketSignal: 'Steady B2B volume'
    },
    {
      name: 'Cardioid Podcast USB Mic',
      sku: 'SKU-AUD-9912',
      category: 'Electronics',
      price: '₹2,199',
      origPrice: '₹3,499',
      rating: 4.3,
      reviews: '4.8K',
      competition: 'Medium',
      compColor: 'text-amber-600 bg-amber-50 border-amber-200',
      demand: 'Medium',
      demandColor: 'text-blue-700 bg-blue-50 border-blue-200',
      score: 79,
      marketSignal: 'Moderate price elasticity'
    }
  ];

  const filtered = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category.includes(selectedCategory);
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-gray-200" id="product-intelligence">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="ced-pill-badge ced-pill-badge-light mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4563FF]" />
              Product Intelligence
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#05060B] tracking-tight leading-[1.1]">
              Know which products are worth your attention
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600">
              Compare products across marketplaces using pricing, reviews, ratings, competition, and real-time market signals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLedger}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#05060B] text-white font-semibold text-xs hover:bg-gray-800 transition cursor-pointer shadow-sm"
            >
              <span>Explore Live Table</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Dashboard Filter Bar */}
        <div className="bg-[#FAFAFC] p-4 rounded-t-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['All', 'Electronics', 'Home & Kitchen', 'Office'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-white text-[#4563FF] shadow-xs border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, SKUs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-[#4563FF]"
            />
          </div>
        </div>

        {/* Realistic Product Intelligence Table */}
        <div className="overflow-x-auto border-x border-b border-gray-200 rounded-b-2xl bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <th className="py-3 px-5">Product & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Rating & Reviews</th>
                <th className="py-3 px-4">Competition</th>
                <th className="py-3 px-4">Market Demand</th>
                <th className="py-3 px-5 text-right">Opportunity Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.map((item, idx) => (
                <tr key={idx} className="hover:bg-blue-50/20 transition-colors group">
                  {/* Product */}
                  <td className="py-4 px-5">
                    <div className="font-bold text-gray-900 group-hover:text-[#4563FF] transition-colors">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                      {item.sku} · <span className="text-blue-600 font-medium">{item.marketSignal}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4 text-xs font-medium text-gray-600">
                    {item.category}
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-gray-900 font-mono">{item.price}</div>
                    <div className="text-[11px] text-gray-400 line-through font-mono">{item.origPrice}</div>
                  </td>

                  {/* Rating */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-xs text-gray-900 font-mono">{item.rating}</span>
                      <span className="text-[11px] text-gray-400">({item.reviews})</span>
                    </div>
                  </td>

                  {/* Competition */}
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold border ${item.compColor}`}>
                      {item.competition}
                    </span>
                  </td>

                  {/* Demand */}
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold border ${item.demandColor}`}>
                      {item.demand}
                    </span>
                  </td>

                  {/* Opportunity Score */}
                  <td className="py-4 px-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-2 hidden sm:block overflow-hidden">
                        <div 
                          className="bg-[#4563FF] h-full rounded-full" 
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#4563FF] font-black text-xs font-mono">
                        {item.score}/100
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table summary note */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 font-mono gap-2">
          <span>Showing 5 of 1,248 analyzed SKUs</span>
          <span>Aggregated from Amazon SP-API, Flipkart v3, Walmart Marketplace</span>
        </div>

      </div>
    </section>
  );
};
