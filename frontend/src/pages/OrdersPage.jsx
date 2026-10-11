import React, { useState, useEffect } from 'react';
import { api, BASE_URL } from '../services/api';
import {
  ShoppingCart,
  Send,
  Zap,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Layers,
  Clock,
  ArrowDownRight,
  TrendingUp,
  Package,
} from 'lucide-react';

export const OrdersPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([
    {
      id: 'OD-FK-9921401',
      channel: 'FLIPKART',
      sku: 'TSHIRT-BLK-M',
      title: 'Classic Crewneck Cotton T-Shirt - Black (M)',
      quantity: 1,
      totalAmount: 599.00,
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      status: 'PROCESSED',
      syncStatus: 'SYNCED',
    },
    {
      id: 'OD-AZ-4410294',
      channel: 'AMAZON',
      sku: 'SNEAKER-WHT-42',
      title: 'Minimalist Leather Sneakers - White 42',
      quantity: 2,
      totalAmount: 3998.00,
      timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
      status: 'PROCESSED',
      syncStatus: 'SYNCED',
    },
    {
      id: 'OD-FK-8830112',
      channel: 'FLIPKART',
      sku: 'AUDIO-ANC-BLK',
      title: 'Wireless Active Noise Cancelling Headphones',
      quantity: 1,
      totalAmount: 3499.00,
      timestamp: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
      status: 'PROCESSED',
      syncStatus: 'SYNCED',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedSku, setSelectedSku] = useState('');
  const [orderQty, setOrderQty] = useState(1);
  const [orderChannel, setOrderChannel] = useState('FLIPKART');
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts(0, 50);
      const items = data.content || [];
      setProducts(items);
      if (items.length > 0 && !selectedSku) {
        setSelectedSku(items[0].sku);
      }
    } catch (e) {
      console.error('Failed to load products for orders:', e);
    }
  };

  const handleSimulateWebhook = async (e) => {
    e.preventDefault();
    if (!selectedSku) return;

    setSimulating(true);
    setSimResult(null);

    const product = products.find((p) => p.sku === selectedSku);
    const channelOrderId = `OD-${orderChannel === 'FLIPKART' ? 'FK' : 'AZ'}-${Math.floor(1000000 + Math.random() * 9000000)}`;

    try {
      // Direct call to Order Webhook Controller endpoint
      const response = await fetch(`${BASE_URL}/api/webhooks/flipkart/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': 'flipkart-secret-webhook-key-2026',
        },
        body: JSON.stringify({
          channelOrderId,
          sku: selectedSku,
          quantity: Number(orderQty),
        }),
      });

      const resData = await response.json().catch(() => ({}));

      if (response.ok) {
        setSimResult({
          type: 'success',
          message: `Inbound order ${channelOrderId} received! Stock decremented and multi-channel inventory sync fired.`,
        });

        // Add to order log
        const newOrder = {
          id: channelOrderId,
          channel: orderChannel,
          sku: selectedSku,
          title: product ? product.title : selectedSku,
          quantity: Number(orderQty),
          totalAmount: product ? Number(product.sellingPrice) * Number(orderQty) : 499 * Number(orderQty),
          timestamp: new Date().toISOString(),
          status: 'PROCESSED',
          syncStatus: 'SYNCED',
        };
        setOrders((prev) => [newOrder, ...prev]);
        loadProducts(); // refresh stock in state
      } else {
        setSimResult({
          type: 'error',
          message: resData.message || resData.error || `Webhook error (${response.status})`,
        });
      }
    } catch (err) {
      setSimResult({
        type: 'error',
        message: err.message || 'Network error triggering webhook',
      });
    } finally {
      setSimulating(false);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalUnits = orders.reduce((sum, o) => sum + (o.quantity || 0), 0);
  const fkOrdersCount = orders.filter((o) => o.channel === 'FLIPKART').length;
  const azOrdersCount = orders.filter((o) => o.channel === 'AMAZON').length;

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-4">
          <div>
            <h1 className="text-2xl font-medium text-[#111111] tracking-tight">Marketplace Orders</h1>
            <p className="text-xs text-[#555555] mt-0.5">
              Live inbound order webhooks and automated multi-channel inventory synchronization.
            </p>
          </div>
          <button
            onClick={loadProducts}
            className="btn-rect text-xs py-2 px-3.5 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Ledger</span>
          </button>
        </div>

        {/* Operational Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="editorial-card p-5 bg-white border border-[#E5E7EB]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#777777]">Orders Processed</div>
            <div className="text-2xl font-semibold font-mono text-[#111111] mt-1">{orders.length}</div>
          </div>
          <div className="editorial-card p-5 bg-white border border-[#E5E7EB]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700">Units Fulfilled</div>
            <div className="text-2xl font-semibold font-mono text-emerald-700 mt-1">{totalUnits}</div>
          </div>
          <div className="editorial-card p-5 bg-white border border-[#E5E7EB]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#777777]">Gross Volume</div>
            <div className="text-2xl font-semibold font-mono text-[#111111] mt-1">₹{totalRevenue.toLocaleString()}</div>
          </div>
          <div className="editorial-card p-5 bg-white border border-[#E5E7EB]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-blue-700">Channel Distribution</div>
            <div className="text-xs font-mono font-medium text-[#111111] mt-2">
              FK: {fkOrdersCount} • AZ: {azOrdersCount}
            </div>
          </div>
        </div>

        {/* Live Inbound Order Webhook Simulator Card */}
        <div className="editorial-card p-5 bg-white border border-[#E5E7EB] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111111]">
                Inbound Webhook Simulator (Flipkart / Amazon)
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#777777] bg-[#F7F8FA] px-2 py-0.5 border border-[#E5E7EB]">
              Endpoint: /api/webhooks/flipkart/order
            </span>
          </div>

          <p className="text-xs text-[#555555]">
            Simulate an incoming order from a marketplace to verify optimistic lock stock decrement and event-driven multi-channel inventory sync.
          </p>

          <form onSubmit={handleSimulateWebhook} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-[11px] font-medium text-[#333333] mb-1">Originating Channel</label>
              <select
                value={orderChannel}
                onChange={(e) => setOrderChannel(e.target.value)}
                className="premium-input text-xs w-full cursor-pointer"
              >
                <option value="FLIPKART">Flipkart Marketplace</option>
                <option value="AMAZON">Amazon Marketplace</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#333333] mb-1">Target SKU</label>
              <select
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="premium-input text-xs w-full cursor-pointer font-mono"
              >
                {products.length === 0 && <option value="">No products available</option>}
                {products.map((p) => (
                  <option key={p.id} value={p.sku}>
                    {p.sku} (Stock: {p.stock})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#333333] mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                max="50"
                value={orderQty}
                onChange={(e) => setOrderQty(e.target.value)}
                className="premium-input text-xs w-full font-mono"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={simulating || !selectedSku}
                className="btn-rect-primary text-xs py-2.5 px-4 w-full cursor-pointer disabled:opacity-50"
              >
                {simulating ? 'Processing...' : 'Simulate Inbound Order'}
              </button>
            </div>
          </form>

          {simResult && (
            <div
              className={`p-3 text-xs rounded-[2px] border flex items-start gap-2 ${
                simResult.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {simResult.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              )}
              <div>{simResult.message}</div>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="editorial-card bg-white border border-[#E5E7EB] overflow-hidden">
          <div className="px-5 py-4 bg-[#FAFAFA] border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111111]">
              Inbound Marketplace Orders Stream ({orders.length})
            </div>
            <div className="text-xs text-[#777777]">Sorted by most recent</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#E5E7EB] text-[#555555] font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold w-28">Channel</th>
                  <th className="py-3 px-4 font-semibold">SKU &amp; Title</th>
                  <th className="py-3 px-4 font-semibold w-20 text-center">Qty</th>
                  <th className="py-3 px-4 font-semibold w-28 text-right">Total (INR)</th>
                  <th className="py-3 px-4 font-semibold w-36 text-center">Timestamp</th>
                  <th className="py-3 px-4 font-semibold w-32 text-center">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] font-semibold text-[#111111]">
                      {o.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium px-2 py-0.5 rounded-[2px] bg-[#F7F8FA] border border-[#E5E7EB]">
                        {o.channel === 'FLIPKART' ? 'Flipkart' : 'Amazon'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[13px] text-[#111111] line-clamp-1">
                        {o.title}
                      </div>
                      <div className="font-mono text-[11px] text-[#777777] mt-0.5">
                        SKU: {o.sku}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-center font-semibold text-[#111111]">
                      {o.quantity}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-right font-medium text-[#111111]">
                      ₹{Number(o.totalAmount).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-center text-[#777777]">
                      {new Date(o.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="status-pill status-published">FULFILLED</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
