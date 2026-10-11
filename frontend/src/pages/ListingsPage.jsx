import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatusStamp } from '../components/StatusStamp';
import {
  List,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  PackageX,
  X,
} from 'lucide-react';

export const ListingsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('ALL'); // ALL, FLIPKART, AMAZON
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [syncDetails, setSyncDetails] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts(0, 100);
      setProducts(data.content || []);
    } catch (e) {
      console.error('Failed to load listings:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = async (product) => {
    setSelectedProduct(product);
    setSyncDetails(null);
    try {
      const details = await api.getChannelSyncStatus(product.id);
      setSyncDetails(details);
    } catch (e) {
      console.error('Failed to fetch sync status:', e);
    }
  };

  const handleRetryPublish = async (productId, channel) => {
    setActionLoading(true);
    setFeedbackMsg(null);
    try {
      await api.retryPublish(productId, channel);
      setFeedbackMsg({ type: 'success', text: `Retry publish dispatched for ${channel}` });
      await loadProducts();
      if (selectedProduct?.id === productId) {
        const details = await api.getChannelSyncStatus(productId);
        setSyncDetails(details);
      }
    } catch (e) {
      setFeedbackMsg({ type: 'error', text: e.message || 'Retry failed' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetMockStatus = async (productId, channel) => {
    setActionLoading(true);
    setFeedbackMsg(null);
    try {
      await api.setMockChannelStatus(productId, channel);
      setFeedbackMsg({ type: 'success', text: `Mock listing status set to PUBLISHED for ${channel}` });
      await loadProducts();
      if (selectedProduct?.id === productId) {
        const details = await api.getChannelSyncStatus(productId);
        setSyncDetails(details);
      }
    } catch (e) {
      setFeedbackMsg({ type: 'error', text: e.message || 'Mock status update failed' });
    } finally {
      setActionLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PUBLISHED' && p.status === 'PUBLISHED') ||
      (statusFilter === 'REJECTED' && p.status === 'REJECTED') ||
      (statusFilter === 'PENDING' && (p.status === 'PENDING' || p.status === 'VALIDATED'));

    return matchesSearch && matchesStatus;
  });

  const publishedCount = products.filter((p) => p.status === 'PUBLISHED').length;
  const inProgressCount = products.filter((p) => p.status === 'PENDING' || p.status === 'VALIDATED').length;
  const rejectedCount = products.filter((p) => p.status === 'REJECTED').length;

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-4">
          <div>
            <h1 className="text-2xl font-medium text-[#111111] tracking-tight">Active Listings</h1>
            <p className="text-xs text-[#555555] mt-0.5">
              Live multi-channel listing syndication across Flipkart Sandbox and Amazon marketplaces.
            </p>
          </div>
          <button
            onClick={loadProducts}
            className="btn-rect text-xs py-2 px-3.5 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Listings</span>
          </button>
        </div>

        {/* Operational Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="editorial-card p-5 bg-white border border-[#E5E7EB]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#777777]">Total Tracked</div>
            <div className="text-2xl font-semibold font-mono text-[#111111] mt-1">{products.length}</div>
          </div>
          <div className="editorial-card p-5 bg-white border border-[#E5E7EB]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700">Live Published</div>
            <div className="text-2xl font-semibold font-mono text-emerald-700 mt-1">{publishedCount}</div>
          </div>
          <div className="editorial-card p-5 bg-white border border-[#E5E7EB]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-amber-700">Ready / Syncing</div>
            <div className="text-2xl font-semibold font-mono text-amber-700 mt-1">{inProgressCount}</div>
          </div>
          <div className="editorial-card p-5 bg-white border border-[#E5E7EB]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-rose-700">Validation Errors</div>
            <div className="text-2xl font-semibold font-mono text-rose-700 mt-1">{rejectedCount}</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="editorial-card p-4 bg-white border border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[260px] relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#888888]" />
            <input
              type="text"
              placeholder="Filter listings by SKU or product title..."
              className="premium-input pl-10 text-xs w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-[#555555]">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
            </div>
            <select
              className="premium-input text-xs py-2 pr-8 w-auto cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="PENDING">Pending / Ready</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Listings Ledger Table */}
        <div className="editorial-card bg-white border border-[#E5E7EB] overflow-hidden">
          <div className="px-5 py-4 bg-[#FAFAFA] border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111111]">
              Marketplace Listings Index ({filteredProducts.length} Entries)
            </div>
            <div className="text-xs text-[#777777]">Click row to open syndication inspector</div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-16 text-center text-[#555555] space-y-2">
              <PackageX className="w-10 h-10 mx-auto text-[#999999] mb-2" />
              <div className="font-medium text-base text-[#111111]">No listings found</div>
              <p className="text-xs text-[#777777] max-w-sm mx-auto">
                No catalog items match your selected filter criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAFAFA] border-b border-[#E5E7EB] text-[#555555] font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">SKU / Code</th>
                    <th className="py-3 px-4 font-semibold">Product Title</th>
                    <th className="py-3 px-4 font-semibold w-28 text-right">Price (INR)</th>
                    <th className="py-3 px-4 font-semibold w-20 text-center">Stock</th>
                    <th className="py-3 px-4 font-semibold w-36 text-center">Flipkart</th>
                    <th className="py-3 px-4 font-semibold w-36 text-center">Amazon</th>
                    <th className="py-3 px-4 font-semibold w-24 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => handleSelectProduct(p)}
                      className="hover:bg-[#F8FAFC] cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono text-[11px] font-medium text-[#111111]">
                        {p.sku}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[13px] text-[#111111] line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-[#777777] mt-0.5">
                          {p.category}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-right text-[#111111]">
                        ₹{Number(p.sellingPrice).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-center text-[#333333]">
                        {p.stock}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <StatusStamp status={p.status} />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="status-pill status-draft">SYNCED</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectProduct(p);
                          }}
                          className="btn-rect text-xs py-1 px-2.5 cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Listing Syndication Inspector Modal */}
      {selectedProduct && (
        <div className="modal-overlay">
          <div className="bg-white border border-[#E5E7EB] w-full max-w-[620px] rounded-[2px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#FAFAFA] border-b border-[#E5E7EB] flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#777777]">
                  Channel Syndication Inspector
                </div>
                <div className="text-base font-semibold text-[#111111] mt-0.5 font-mono">
                  {selectedProduct.sku}
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 text-[#888888] hover:text-[#111111] rounded-[2px] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {feedbackMsg && (
                <div
                  className={`p-3 text-xs rounded-[2px] border ${
                    feedbackMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {feedbackMsg.text}
                </div>
              )}

              {/* Product Info Summary */}
              <div className="editorial-card p-4 bg-[#FAFAFA] border border-[#E5E7EB] space-y-2">
                <div className="text-sm font-medium text-[#111111]">{selectedProduct.title}</div>
                <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-[#E5E7EB] font-mono">
                  <div>
                    <span className="text-[#777777]">Category: </span>
                    <span className="text-[#111111]">{selectedProduct.category}</span>
                  </div>
                  <div>
                    <span className="text-[#777777]">Selling: </span>
                    <span className="text-[#111111]">₹{selectedProduct.sellingPrice}</span>
                  </div>
                  <div>
                    <span className="text-[#777777]">Stock: </span>
                    <span className="text-[#111111]">{selectedProduct.stock} units</span>
                  </div>
                </div>
              </div>

              {/* Marketplace Channels Status Cards */}
              <div className="space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#777777]">
                  Marketplace Channel Endpoints
                </div>

                {/* Flipkart Channel Card */}
                <div className="editorial-card p-4 bg-white border border-[#E5E7EB] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-[2px] bg-[#111111] text-white flex items-center justify-center font-bold text-[10px]">
                        FK
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#111111]">Flipkart Self-Access Sandbox</div>
                        <div className="text-[11px] text-[#777777] font-mono">Listing v3 API</div>
                      </div>
                    </div>
                    <StatusStamp status={selectedProduct.status} />
                  </div>

                  {selectedProduct.errorMessage && (
                    <div className="text-xs p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-[2px]">
                      <div className="font-semibold text-[11px]">Rejection Reason:</div>
                      <div>{selectedProduct.errorMessage}</div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-[#E5E7EB]">
                    <button
                      disabled={actionLoading}
                      onClick={() => handleRetryPublish(selectedProduct.id, 'FLIPKART')}
                      className="btn-rect text-xs py-1.5 px-3 flex-1 cursor-pointer disabled:opacity-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry Publish Pipeline</span>
                    </button>
                  </div>
                </div>

                {/* Amazon Channel Card */}
                <div className="editorial-card p-4 bg-white border border-[#E5E7EB] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-[2px] bg-[#FAFAFA] border border-[#D1D5DB] text-[#111111] flex items-center justify-center font-bold text-[10px]">
                        AZ
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#111111]">Amazon Marketplace</div>
                        <div className="text-[11px] text-[#777777] font-mono">SP-API Local Mock (Port 8081)</div>
                      </div>
                    </div>
                    <span className="status-pill status-published">MOCK PUBLISHED</span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#E5E7EB]">
                    <button
                      disabled={actionLoading}
                      onClick={() => handleSetMockStatus(selectedProduct.id, 'AMAZON')}
                      className="btn-rect text-xs py-1.5 px-3 flex-1 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Set Active Mock Status</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-[#FAFAFA] border-t border-[#E5E7EB] flex justify-end">
              <button
                onClick={() => setSelectedProduct(null)}
                className="btn-rect text-xs py-1.5 px-4 cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
