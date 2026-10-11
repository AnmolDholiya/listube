import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Navbar } from '../components/Navbar';
import { ProductLedgerTable } from '../components/ProductLedgerTable';
import { BulkUploadModal } from '../components/BulkUploadModal';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Layers, 
  CheckCheck, 
  AlertOctagon, 
  Clock, 
  Plus,
  Trash2,
  ArrowLeft
} from 'lucide-react';

export const LedgerPage = ({ onNavigateHome }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [page, category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts(page, 20, category, search);
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to fetch catalog ledger:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchProducts();
  };

  const handleClearAllProducts = async () => {
    if (!window.confirm('Are you sure you want to clear all products from your catalog? This will remove existing products so you can upload a fresh CSV.')) {
      return;
    }
    setLoading(true);
    try {
      await api.deleteAllProducts();
      setPage(0);
      await fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to clear products');
    } finally {
      setLoading(false);
    }
  };

  // Count stats from current view/catalog
  const publishedCount = products.filter((p) => p.status === 'PUBLISHED').length;
  const rejectedCount = products.filter((p) => p.status === 'REJECTED').length;
  const pendingCount = products.filter((p) => p.status === 'PENDING' || p.status === 'VALIDATED').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar 
        onOpenBulkUpload={() => setShowBulkModal(true)} 
        onNavigateHome={onNavigateHome}
      />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 md:px-12 py-8 space-y-6">
        {/* Navigation Breadcrumb / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-4">
          <div>
            <h1 className="text-2xl font-medium text-[#111111] tracking-tight">
              Seller Operations Ledger
            </h1>
            <p className="text-xs text-[#555555] mt-0.5">
              Multi-channel catalog status, image compliance, and asynchronous marketplace publishing.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="btn-rect text-xs py-2 px-3.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Landing Page</span>
              </button>
            )}
            <button
              onClick={() => setShowBulkModal(true)}
              className="btn-rect-primary text-xs py-2 px-4 cursor-pointer"
            >
              <span>+ Bulk Ingestion</span>
            </button>
          </div>
        </div>

        {/* Operational Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="editorial-card p-5 bg-white border border-[#E5E7EB] flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#777777]">
                Total SKUs
              </div>
              <div className="text-2xl font-semibold font-mono text-[#111111] mt-1">
                {totalElements}
              </div>
            </div>
            <Layers className="w-5 h-5 text-[#888888]" />
          </div>

          <div className="editorial-card p-5 bg-white border border-[#E5E7EB] flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700">
                Published
              </div>
              <div className="text-2xl font-semibold font-mono text-emerald-700 mt-1">
                {publishedCount}
              </div>
            </div>
            <CheckCheck className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="editorial-card p-5 bg-white border border-[#E5E7EB] flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-700">
                Pending / Ready
              </div>
              <div className="text-2xl font-semibold font-mono text-amber-700 mt-1">
                {pendingCount}
              </div>
            </div>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>

          <div className="editorial-card p-5 bg-white border border-[#E5E7EB] flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-rose-700">
                Rejected / Issues
              </div>
              <div className="text-2xl font-semibold font-mono text-rose-700 mt-1">
                {rejectedCount}
              </div>
            </div>
            <AlertOctagon className="w-5 h-5 text-rose-600" />
          </div>
        </div>

        {/* Filter & Manifest Search Controls */}
        <div className="editorial-card p-4 bg-white border border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[260px] relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#888888]" />
            <input
              type="text"
              placeholder="Search by product title or SKU..."
              className="premium-input pl-10 text-xs w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-[#555555]">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </div>
            <select
              className="premium-input text-xs py-2 pr-8 w-auto cursor-pointer"
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(0); }}
            >
              <option value="">All Categories</option>
              <option value="Apparel > T-Shirts">Apparel &gt; T-Shirts</option>
              <option value="Footwear">Footwear</option>
              <option value="Electronics">Electronics</option>
            </select>

            <button
              onClick={fetchProducts}
              className="btn-rect text-xs p-2"
              title="Refresh ledger"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {totalElements > 0 && (
              <button
                onClick={handleClearAllProducts}
                className="btn-rect text-xs py-2 px-3 text-red-600 border-red-200 hover:border-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-1.5"
                title="Clear all catalog products"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Catalog</span>
              </button>
            )}
          </div>
        </div>

        {/* Master Catalog Ledger Table Sheet */}
        <div className="editorial-card bg-white border border-[#E5E7EB] overflow-hidden">
          <div className="px-5 py-4 bg-[#FAFAFA] border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111111]">
              Flipkart Master Catalog Ledger ({totalElements} SKUs Total)
            </div>
            <div className="text-xs text-[#777777]">
              Click any row to view gap-filling &amp; pre-publish checklist
            </div>
          </div>

          <ProductLedgerTable
            products={products}
            loading={loading}
            onSelectProduct={(product) => setSelectedProduct(product)}
          />

          {/* Ledger Pagination Bar */}
          <div className="px-5 py-3.5 border-t border-[#E5E7EB] bg-[#FAFAFA] flex items-center justify-between text-xs text-[#555555]">
            <div>
              Showing page <strong className="font-mono text-[#111111]">{page + 1}</strong> of <strong className="font-mono text-[#111111]">{totalPages || 1}</strong> ({totalElements} total products)
            </div>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="btn-rect text-xs py-1 px-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="btn-rect text-xs py-1 px-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showBulkModal && (
        <BulkUploadModal
          onClose={() => {
            setShowBulkModal(false);
            fetchProducts();
          }}
          onSuccess={() => {
            setPage(0);
            fetchProducts();
          }}
        />
      )}

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onRefresh={() => fetchProducts()}
        />
      )}
    </div>
  );
};
