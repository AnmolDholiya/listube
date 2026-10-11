import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UploadCloud, LogOut, ArrowLeft, Layers, ShieldCheck } from 'lucide-react';

export const Navbar = ({ onOpenBulkUpload, onNavigateHome }) => {
  const { sellerEmail, businessName, logout } = useAuth();

  return (
    <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-30">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Left: Brand & Manifest Title */}
        <div className="flex items-center gap-4">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="p-2 border border-[#E5E7EB] hover:border-[#111111] rounded-[2px] text-[#555555] hover:text-[#111111] transition-colors cursor-pointer mr-1"
              title="Return to Landing Page"
              aria-label="Return to landing page"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[2px] bg-[#111111] text-white flex items-center justify-center font-semibold text-xs tracking-widest border border-[#111111]">
              CP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#111111] text-[16px] tracking-tight">
                  Seller Catalog Ledger
                </span>
                <span className="text-[11px] px-1.5 py-0.5 rounded-[2px] bg-[#F3F4F6] text-[#555555] font-mono border border-[#E5E7EB]">
                  v3.4
                </span>
              </div>
              <div className="text-[11px] text-[#777777] font-normal">
                Flipkart Listing v3 &amp; Multi-Channel Gateway
              </div>
            </div>
          </div>
        </div>

        {/* Right: Seller Info & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-medium text-[#111111]">
              {businessName || 'Seller Account'}
            </span>
            <span className="text-[11px] text-[#777777] font-mono">
              {sellerEmail}
            </span>
          </div>

          <button
            onClick={onOpenBulkUpload}
            className="btn-rect text-xs py-2 px-3.5 font-medium cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Bulk CSV Upload</span>
          </button>

          <button
            onClick={logout}
            className="btn-rect text-xs py-2 px-3 text-[#777777] hover:text-[#111111] cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
