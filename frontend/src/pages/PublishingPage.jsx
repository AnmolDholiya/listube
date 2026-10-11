import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatusStamp } from '../components/StatusStamp';
import { RefreshCw, Send, ChevronDown, ChevronUp, PackageX } from 'lucide-react';

export const PublishingPage = () => {
  const [products, setProducts] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBatch, setExpandedBatch] = useState(null);
  const [pollingIds, setPollingIds] = useState(new Set());

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts(0, 100);
      setProducts(data.content || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const pollBatch = async (batchId) => {
    try {
      const status = await api.getPublishStatus(batchId);
      setBatches(prev => {
        const existing = prev.find(b => b.batchId === batchId);
        if (existing) return prev.map(b => b.batchId === batchId ? status : b);
        return [...prev, status];
      });
      if (['PENDING', 'IN_PROGRESS'].includes(status.status)) {
        setTimeout(() => pollBatch(batchId), 2000);
      } else {
        setPollingIds(prev => { const n = new Set(prev); n.delete(batchId); return n; });
        loadData();
      }
    } catch (e) {
      console.error('Poll error:', e);
      setPollingIds(prev => { const n = new Set(prev); n.delete(batchId); return n; });
    }
  };

  const handlePublishAll = async (channel) => {
    const validProducts = products.filter(p => p.status === 'VALIDATED' || p.status === 'DRAFT');
    if (validProducts.length === 0) {
      alert('No products available for publishing. Validate products first.');
      return;
    }
    try {
      const res = await api.publishProducts(channel, validProducts.map(p => p.id));
      if (res.batchId) {
        setBatches(prev => [...prev, { batchId: res.batchId, status: 'PENDING', totalCount: res.totalCount, completedCount: 0, channel, createdAt: new Date().toISOString(), results: [] }]);
        setPollingIds(prev => new Set(prev).add(res.batchId));
        pollBatch(res.batchId);
      }
    } catch (e) { alert(e.message); }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-[#111111] border-t-transparent rounded-full mb-3" />
          <div className="text-xs text-[#555555]">Loading publishing data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-4">
          <div>
            <h1 className="text-2xl font-medium text-[#111111] tracking-tight">Publishing</h1>
            <p className="text-xs text-[#555555] mt-0.5">Monitor asynchronous marketplace publishing batches.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handlePublishAll('FLIPKART')} className="btn-rect-primary text-xs py-2 px-4 cursor-pointer">
              <Send className="w-3.5 h-3.5" /><span>Publish to Flipkart</span>
            </button>
            <button onClick={loadData} className="btn-rect text-xs py-2 px-3 cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Batch List */}
        <div className="editorial-card bg-white border border-[#E5E7EB] overflow-hidden">
          <div className="px-5 py-4 bg-[#FAFAFA] border-b border-[#E5E7EB]">
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111111]">
              Publishing Jobs ({batches.length})
            </div>
          </div>

          {batches.length === 0 ? (
            <div className="p-16 text-center text-[#555555] space-y-2">
              <PackageX className="w-10 h-10 mx-auto text-[#999999] mb-2" />
              <div className="font-medium text-base text-[#111111]">No publishing jobs yet</div>
              <p className="text-xs text-[#777777] max-w-sm mx-auto">
                Use "Publish to Flipkart" to create a new batch publishing job.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E5E7EB]">
              {batches.map(batch => {
                const isExpanded = expandedBatch === batch.batchId;
                const progress = batch.totalCount > 0 ? Math.round((batch.completedCount / batch.totalCount) * 100) : 0;
                const successCount = batch.results?.filter(r => r.status === 'PUBLISHED').length || 0;
                const failCount = batch.results?.filter(r => r.status === 'REJECTED').length || 0;
                const isPolling = pollingIds.has(batch.batchId);
                return (
                  <div key={batch.batchId}>
                    <div className="px-5 py-4 flex items-center justify-between hover:bg-[#F8FAFC] cursor-pointer"
                      onClick={() => setExpandedBatch(isExpanded ? null : batch.batchId)}>
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div>
                          <div className="text-[13px] font-medium text-[#111111] font-mono truncate">{batch.batchId?.substring(0, 8)}...</div>
                          <div className="text-[11px] text-[#777777] mt-0.5">{batch.channel || 'FLIPKART'} • {batch.createdAt ? new Date(batch.createdAt).toLocaleString() : ''}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right mr-3 hidden sm:block">
                          <div className="text-[11px] text-[#777777] font-mono">{batch.completedCount}/{batch.totalCount} items</div>
                          <div className="w-24 h-1.5 bg-[#E5E7EB] rounded-full mt-1 overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${batch.status === 'FAILED' ? 'bg-rose-500' : batch.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                              style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                        <StatusStamp status={batch.status} />
                        {isPolling && <div className="animate-spin w-4 h-4 border-2 border-[#111111] border-t-transparent rounded-full" />}
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-[#999999]" /> : <ChevronDown className="w-4 h-4 text-[#999999]" />}
                      </div>
                    </div>
                    {isExpanded && batch.results && batch.results.length > 0 && (
                      <div className="bg-[#FAFAFA] border-t border-[#E5E7EB] px-5 py-3">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-[#777777] mb-2">
                          Item Results — {successCount} successful, {failCount} failed
                        </div>
                        <div className="space-y-1">
                          {batch.results.map((r, i) => (
                            <div key={i} className="flex items-center justify-between py-1.5 text-xs">
                              <div className="font-mono text-[#333333]">{r.sku || `Product #${r.productId}`}</div>
                              <div className="flex items-center gap-3">
                                {r.errorMessage && <span className="text-[11px] text-rose-600 max-w-xs truncate">{r.errorMessage}</span>}
                                <StatusStamp status={r.status} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
