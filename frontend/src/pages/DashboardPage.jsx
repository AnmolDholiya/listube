import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Layers,
  CheckCheck,
  AlertOctagon,
  Clock,
  Package,
  ShoppingCart,
  TrendingUp,
  RefreshCw,
  ChevronRight,
  ExternalLink,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { StatusStamp } from '../components/StatusStamp';

export const DashboardPage = ({ onNavigate }) => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [flipkartStatus, setFlipkartStatus] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [productData, fkStatus] = await Promise.allSettled([
        api.getProducts(0, 100),
        api.getFlipkartStatus(),
      ]);
      if (productData.status === 'fulfilled') {
        setProducts(productData.value.content || []);
        setTotalProducts(productData.value.totalElements || 0);
      }
      if (fkStatus.status === 'fulfilled') {
        setFlipkartStatus(fkStatus.value);
      }
    } catch (e) {
      console.error('Dashboard load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const publishedCount = products.filter(p => p.status === 'PUBLISHED').length;
  const pendingCount = products.filter(p => ['PENDING', 'VALIDATED', 'IN_PROGRESS'].includes(p.status)).length;
  const failedCount = products.filter(p => p.status === 'REJECTED').length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockProducts = products.filter(p => p.stock <= 5 && p.stock > 0);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-[#111111] border-t-transparent rounded-full mb-3" />
          <div className="text-xs text-[#555555]">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
          <div>
            <h1 className="text-2xl font-medium text-[#111111] tracking-tight">Dashboard</h1>
            <p className="text-xs text-[#555555] mt-0.5">Overview of your multi-channel seller operations.</p>
          </div>
          <button onClick={loadDashboard} className="btn-rect text-xs py-2 px-3 cursor-pointer">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[
            { label: 'Total Products', value: totalProducts, icon: Layers, color: 'text-[#888888]' },
            { label: 'Published', value: publishedCount, icon: CheckCheck, color: 'text-emerald-600' },
            { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-amber-600' },
            { label: 'Failed', value: failedCount, icon: AlertOctagon, color: 'text-rose-600' },
            { label: 'Total Stock', value: totalStock.toLocaleString(), icon: Package, color: 'text-[#888888]' },
            { label: 'Low Stock', value: lowStockProducts.length, icon: TrendingUp, color: lowStockProducts.length > 0 ? 'text-amber-600' : 'text-[#888888]' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="editorial-card p-5 bg-white border border-[#E5E7EB] flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#777777]">{label}</div>
                <div className={`text-2xl font-semibold font-mono mt-1 ${color === 'text-[#888888]' ? 'text-[#111111]' : color}`}>
                  {value}
                </div>
              </div>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Products */}
          <div className="editorial-card bg-white border border-[#E5E7EB] overflow-hidden">
            <div className="px-5 py-4 bg-[#FAFAFA] border-b border-[#E5E7EB] flex items-center justify-between">
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111111]">
                Recent Products
              </div>
              <button onClick={() => onNavigate('products')} className="text-xs text-[#555555] hover:text-[#111111] flex items-center gap-1 cursor-pointer">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            {products.length === 0 ? (
              <div className="p-10 text-center text-[#777777] text-xs">
                No products yet. Import your catalog to get started.
              </div>
            ) : (
              <div className="divide-y divide-[#E5E7EB]">
                {products.slice(0, 5).map(p => (
                  <div key={p.id} className="px-5 py-3 flex items-center justify-between hover:bg-[#F8FAFC] cursor-pointer" onClick={() => onNavigate('products')}>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-[#111111] truncate">{p.title}</div>
                      <div className="text-[11px] text-[#777777] font-mono mt-0.5">{p.sku}</div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span className="text-xs font-mono text-[#555555]">{p.stock} units</span>
                      <StatusStamp status={p.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Marketplace Overview */}
          <div className="editorial-card bg-white border border-[#E5E7EB] overflow-hidden">
            <div className="px-5 py-4 bg-[#FAFAFA] border-b border-[#E5E7EB] flex items-center justify-between">
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111111]">
                Marketplace Connections
              </div>
              <button onClick={() => onNavigate('marketplaces')} className="text-xs text-[#555555] hover:text-[#111111] flex items-center gap-1 cursor-pointer">
                Manage <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="divide-y divide-[#E5E7EB]">
              {/* Flipkart */}
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[2px] bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center text-xs font-bold text-[#111111]">FK</div>
                  <div>
                    <div className="text-[13px] font-medium text-[#111111]">Flipkart</div>
                    <div className="text-[11px] text-[#777777]">
                      {flipkartStatus?.environment?.toUpperCase() || 'SANDBOX'} Environment
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {flipkartStatus?.connected ? (
                    <span className="status-pill status-published"><Wifi className="w-3 h-3" /> Connected</span>
                  ) : (
                    <span className="status-pill status-draft"><WifiOff className="w-3 h-3" /> Not Configured</span>
                  )}
                </div>
              </div>
              {/* Amazon */}
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[2px] bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center text-xs font-bold text-[#111111]">AZ</div>
                  <div>
                    <div className="text-[13px] font-medium text-[#111111]">Amazon</div>
                    <div className="text-[11px] text-[#777777]">Development / Mock</div>
                  </div>
                </div>
                <span className="status-pill status-published"><Wifi className="w-3 h-3" /> Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="editorial-card bg-white border border-[#E5E7EB] overflow-hidden">
            <div className="px-5 py-4 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-amber-600" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-700">
                Low Stock Alerts ({lowStockProducts.length} products)
              </span>
            </div>
            <div className="divide-y divide-[#E5E7EB]">
              {lowStockProducts.slice(0, 5).map(p => (
                <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-medium text-[#111111]">{p.title}</div>
                    <div className="text-[11px] text-[#777777] font-mono">{p.sku}</div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-amber-600">{p.stock} left</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
