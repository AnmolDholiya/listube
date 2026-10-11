import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Settings,
  User,
  ShieldCheck,
  Bell,
  Sliders,
  CheckCircle2,
  Trash2,
  Save,
  KeyRound,
  Lock,
} from 'lucide-react';

export const SettingsPage = () => {
  const { sellerEmail, businessName, logout } = useAuth();

  // Settings State
  const [autoSyncInventory, setAutoSyncInventory] = useState(true);
  const [strictImageCheck, setStrictImageCheck] = useState(true);
  const [defaultCurrency, setDefaultCurrency] = useState('INR');
  const [retryAttempts, setRetryAttempts] = useState('3');
  const [markupPercent, setMarkupPercent] = useState('0');
  const [savedNotice, setSavedNotice] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleClearCatalog = async () => {
    if (!window.confirm('Are you sure you want to delete all products in your catalog? This cannot be undone.')) {
      return;
    }
    setClearing(true);
    try {
      await api.deleteAllProducts();
      alert('All products successfully deleted from catalog.');
    } catch (e) {
      alert(e.message || 'Failed to clear catalog');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="pb-4 border-b border-[#E5E7EB]">
          <h1 className="text-2xl font-medium text-[#111111] tracking-tight">Seller Settings</h1>
          <p className="text-xs text-[#555555] mt-0.5">
            Manage your seller profile, marketplace preferences, and multi-channel synchronization rules.
          </p>
        </div>

        {savedNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[2px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Preferences successfully updated in local session.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Seller Profile & Security */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="editorial-card bg-white border border-[#E5E7EB] p-5 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E5E7EB]">
                <div className="w-10 h-10 rounded-[2px] bg-[#111111] text-white flex items-center justify-center font-bold text-sm">
                  {businessName ? businessName.charAt(0).toUpperCase() : 'S'}
                </div>
                <div>
                  <div className="font-semibold text-sm text-[#111111]">
                    {businessName || 'Seller Account'}
                  </div>
                  <div className="text-[11px] text-[#777777] font-mono">
                    Authenticated Tenant
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-[#777777] block text-[11px]">Primary Email</span>
                  <span className="font-mono text-[#111111]">{sellerEmail}</span>
                </div>
                <div>
                  <span className="text-[#777777] block text-[11px]">Tenant Isolation Mode</span>
                  <span className="font-mono text-emerald-700">Strict Multi-Tenant Schema</span>
                </div>
                <div>
                  <span className="text-[#777777] block text-[11px]">Session Storage</span>
                  <span className="font-mono text-[#111111]">In-Memory Bearer (Volatile)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB]">
                <button
                  onClick={logout}
                  className="btn-rect text-xs py-2 px-3 w-full text-red-600 border-red-200 hover:border-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                >
                  End Active Session
                </button>
              </div>
            </div>

            {/* Architecture Details */}
            <div className="editorial-card bg-[#FAFAFA] border border-[#E5E7EB] p-5 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Compliance &amp; Security
                </span>
              </div>
              <p className="text-xs text-[#555555] leading-relaxed">
                All requests to Flipkart Sandbox utilize client credentials granted via direct Self-Access. Secrets remain strictly on the backend server.
              </p>
            </div>
          </div>

          {/* Right Column: Preferences Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSavePreferences} className="space-y-6">
              {/* Marketplace Synchronization Rules */}
              <div className="editorial-card bg-white border border-[#E5E7EB] p-5 space-y-4">
                <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111111] pb-2 border-b border-[#E5E7EB]">
                  Marketplace Synchronization Rules
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium text-[#111111]">Automated Multi-Channel Inventory Broadcast</div>
                      <div className="text-[#777777] text-[11px] mt-0.5">
                        Broadcast inventory decrement across both Flipkart and Amazon whenever an inbound order webhook is received.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoSyncInventory}
                      onChange={(e) => setAutoSyncInventory(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded-[2px] border-gray-300 text-[#111111] focus:ring-black cursor-pointer"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-4 pt-3 border-t border-[#E5E7EB]">
                    <div>
                      <div className="font-medium text-[#111111]">Strict Image Compliance Verification</div>
                      <div className="text-[#777777] text-[11px] mt-0.5">
                        Enforce minimum 1000x1000px resolution, RGB color profile, and pure white background before publishing.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={strictImageCheck}
                      onChange={(e) => setStrictImageCheck(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded-[2px] border-gray-300 text-[#111111] focus:ring-black cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E5E7EB]">
                  <div>
                    <label className="block text-[11px] font-medium text-[#333333] mb-1">
                      Max Batch Retry Attempts
                    </label>
                    <select
                      value={retryAttempts}
                      onChange={(e) => setRetryAttempts(e.target.value)}
                      className="premium-input text-xs w-full cursor-pointer font-mono"
                    >
                      <option value="1">1 Attempt</option>
                      <option value="3">3 Attempts (Recommended)</option>
                      <option value="5">5 Attempts</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#333333] mb-1">
                      Channel Price Markup (%)
                    </label>
                    <input
                      type="number"
                      value={markupPercent}
                      onChange={(e) => setMarkupPercent(e.target.value)}
                      className="premium-input text-xs w-full font-mono"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="btn-rect-primary text-xs py-2 px-5 cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save System Preferences</span>
                </button>
              </div>
            </form>

            {/* Danger Zone */}
            <div className="editorial-card bg-white border border-rose-200 p-5 space-y-3">
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-rose-700">
                Danger Zone • Catalog Reset
              </div>
              <p className="text-xs text-[#555555]">
                Delete all product SKUs, images, and marketplace listing statuses for your tenant account.
              </p>
              <button
                type="button"
                onClick={handleClearCatalog}
                disabled={clearing}
                className="btn-rect text-xs py-2 px-4 text-rose-600 border-rose-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-600 cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{clearing ? 'Clearing Catalog...' : 'Purge All Catalog Products'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
