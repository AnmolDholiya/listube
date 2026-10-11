import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Store,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  KeyRound,
  Lock,
  Zap,
} from 'lucide-react';

export const MarketplacesPage = () => {
  const [fkStatus, setFkStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const data = await api.getFlipkartStatus();
      setFkStatus(data);
    } catch (e) {
      console.error('Failed to load marketplace status:', e);
      setFkStatus({
        connected: false,
        mode: 'SANDBOX',
        environment: 'SANDBOX',
        message: 'Could not communicate with backend Flipkart status controller.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const start = performance.now();
    try {
      const result = await api.testFlipkartConnection();
      const elapsed = Math.round(performance.now() - start);
      setTestResult({
        ...result,
        latencyMs: elapsed,
        timestamp: new Date().toLocaleTimeString(),
      });
      loadStatus();
    } catch (e) {
      setTestResult({
        connected: false,
        message: e.message || 'Connection test failed',
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-4">
          <div>
            <h1 className="text-2xl font-medium text-[#111111] tracking-tight">Marketplace Integrations</h1>
            <p className="text-xs text-[#555555] mt-0.5">
              Direct Self-Access API connectivity, credentials overview, and adapter telemetry.
            </p>
          </div>
          <button
            onClick={loadStatus}
            className="btn-rect text-xs py-2 px-3.5 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* Informational Architecture Callout */}
        <div className="editorial-card p-4 bg-[#FAFAFA] border border-[#E5E7EB] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-[#555555] space-y-1">
            <div className="font-medium text-[#111111]">
              Direct Self-Access Architectural Model Active
            </div>
            <div>
              Because this platform utilizes Flipkart Self-Access credentials, your backend server establishes direct machine-to-machine OAuth2 token sessions with Flipkart Sandbox. No third-party OAuth seller browser authorization redirects are required.
            </div>
          </div>
        </div>

        {/* Marketplace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Flipkart Marketplace Card */}
          <div className="editorial-card bg-white border border-[#E5E7EB] flex flex-col justify-between overflow-hidden">
            <div>
              <div className="p-5 bg-[#FAFAFA] border-b border-[#E5E7EB] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[2px] bg-[#111111] text-white flex items-center justify-center font-bold text-sm">
                    FK
                  </div>
                  <div>
                    <h2 className="text-base font-medium text-[#111111]">Flipkart Marketplace</h2>
                    <div className="text-[11px] text-[#777777] font-mono">
                      Self-Access Sandbox • Listing v3
                    </div>
                  </div>
                </div>
                {fkStatus?.connected ? (
                  <span className="status-pill status-published flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5" />
                    <span>CONNECTED</span>
                  </span>
                ) : (
                  <span className="status-pill status-draft flex items-center gap-1.5">
                    <WifiOff className="w-3.5 h-3.5" />
                    <span>MOCK READY</span>
                  </span>
                )}
              </div>

              <div className="p-5 space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#E5E7EB]">
                    <span className="text-[#777777]">Operating Mode</span>
                    <span className="font-mono font-medium text-[#111111]">
                      {fkStatus?.mode || 'SANDBOX'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E5E7EB]">
                    <span className="text-[#777777]">Environment Target</span>
                    <span className="font-mono text-[#111111]">
                      sandbox-api.flipkart.net
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E5E7EB]">
                    <span className="text-[#777777]">Seller ID</span>
                    <span className="font-mono text-[#111111]">
                      {fkStatus?.sellerId || 'Configured via application.properties'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E5E7EB]">
                    <span className="text-[#777777]">OAuth2 Bearer Token</span>
                    <span className="font-mono text-emerald-700">
                      In-Memory Thread-Safe Service
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#777777]">Inbound Webhook Secret</span>
                    <span className="font-mono text-[#111111]">
                      Verified (X-Webhook-Secret)
                    </span>
                  </div>
                </div>

                {fkStatus?.message && (
                  <div className="p-3 bg-[#F7F8FA] border border-[#E5E7EB] text-xs font-mono text-[#555555] rounded-[2px]">
                    {fkStatus.message}
                  </div>
                )}
              </div>
            </div>

            {/* Test Connection Button & Feedback */}
            <div className="p-5 bg-[#FAFAFA] border-t border-[#E5E7EB] space-y-3">
              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="btn-rect-primary text-xs py-2.5 px-4 w-full cursor-pointer disabled:opacity-50"
              >
                {testing ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying Sandbox OAuth Credentials...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Test Sandbox Connection &amp; Token</span>
                  </span>
                )}
              </button>

              {testResult && (
                <div
                  className={`p-3 text-xs rounded-[2px] border ${
                    testResult.connected
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span>
                      {testResult.connected ? 'Sandbox Authentication Verified' : 'Connection Failed'}
                    </span>
                    {testResult.latencyMs && (
                      <span className="font-mono text-[11px]">{testResult.latencyMs}ms</span>
                    )}
                  </div>
                  <div>{testResult.message}</div>
                  <div className="text-[10px] text-[#777777] font-mono mt-1">
                    Checked at: {testResult.timestamp}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Amazon Marketplace Card */}
          <div className="editorial-card bg-white border border-[#E5E7EB] flex flex-col justify-between overflow-hidden">
            <div>
              <div className="p-5 bg-[#FAFAFA] border-b border-[#E5E7EB] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[2px] bg-[#FAFAFA] border border-[#D1D5DB] text-[#111111] flex items-center justify-center font-bold text-sm">
                    AZ
                  </div>
                  <div>
                    <h2 className="text-base font-medium text-[#111111]">Amazon Marketplace</h2>
                    <div className="text-[11px] text-[#777777] font-mono">
                      Selling Partner API Mock • Port 8081
                    </div>
                  </div>
                </div>
                <span className="status-pill status-published flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5" />
                  <span>MOCK ACTIVE</span>
                </span>
              </div>

              <div className="p-5 space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#E5E7EB]">
                    <span className="text-[#777777]">Adapter Pipeline</span>
                    <span className="font-mono font-medium text-[#111111]">
                      ChannelStockAdapter
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E5E7EB]">
                    <span className="text-[#777777]">Local Service Port</span>
                    <span className="font-mono text-[#111111]">
                      http://localhost:8081
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E5E7EB]">
                    <span className="text-[#777777]">Inventory Event Sync</span>
                    <span className="font-mono text-emerald-700">
                      Asynchronous Listener Active
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E5E7EB]">
                    <span className="text-[#777777]">Cross-Channel Concurrency</span>
                    <span className="font-mono text-[#111111]">
                      Optimistic JPA Locking (@Version)
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#777777]">Mock Ingestion Endpoint</span>
                    <span className="font-mono text-[#111111]">
                      /api/products/{'{id}'}/publish-mock/AMAZON
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#F7F8FA] border border-[#E5E7EB] text-xs font-mono text-[#555555] rounded-[2px]">
                  Amazon SP-API mock adapter enables full side-by-side demonstration of inventory deduplication and multi-channel synchronization.
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#FAFAFA] border-t border-[#E5E7EB]">
              <div className="text-xs text-[#555555] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Adapter synchronized with spring event listener</span>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Architecture Card */}
        <div className="editorial-card p-6 bg-white border border-[#E5E7EB] space-y-4">
          <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111111]">
            Multi-Channel Adapter Architecture Pipeline
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-[2px] space-y-1.5">
              <div className="font-medium text-[#111111] flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>1. Canonical Data Mapper</span>
              </div>
              <p className="text-[#555555]">
                Translates canonical product models to Flipkart Listing v3 JSON schema and Amazon Flat File format.
              </p>
            </div>

            <div className="p-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-[2px] space-y-1.5">
              <div className="font-medium text-[#111111] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span>2. Asynchronous Batch Pipeline</span>
              </div>
              <p className="text-[#555555]">
                Dispatches publish jobs using Spring @Async executor with UUID tracking and persistent status polling.
              </p>
            </div>

            <div className="p-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-[2px] space-y-1.5">
              <div className="font-medium text-[#111111] flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>3. Event-Driven Inventory Sync</span>
              </div>
              <p className="text-[#555555]">
                Inbound order webhooks decrement stock under optimistic JPA locking and broadcast changes across all channels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
