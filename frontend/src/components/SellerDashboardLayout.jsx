import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from './Sidebar';
import { DashboardPage } from '../pages/DashboardPage';
import { ProductsPage } from '../pages/ProductsPage';
import { PublishingPage } from '../pages/PublishingPage';
import { ListingsPage } from '../pages/ListingsPage';
import { OrdersPage } from '../pages/OrdersPage';
import { InventoryPage } from '../pages/InventoryPage';
import { MarketplacesPage } from '../pages/MarketplacesPage';
import { SettingsPage } from '../pages/SettingsPage';
import { BulkUploadModal } from './BulkUploadModal';
import {
  UploadCloud,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  Layers,
} from 'lucide-react';

export const SellerDashboardLayout = ({
  initialView = 'dashboard',
  onNavigateHome,
}) => {
  const { sellerEmail, businessName, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState(initialView === 'ledger' ? 'dashboard' : initialView);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const handleNavigate = (tab) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'products':
      case 'ledger':
        return <ProductsPage />;
      case 'publishing':
        return <PublishingPage />;
      case 'listings':
        return <ListingsPage />;
      case 'orders':
        return <OrdersPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'marketplaces':
        return <MarketplacesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row text-[#111111]">
      {/* Desktop Sticky Sidebar */}
      <div className="hidden md:block shrink-0">
        <Sidebar
          currentView={currentTab}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-20 h-16 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#555555] hover:text-[#111111] border border-[#E5E7EB] rounded-[2px] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Back to Home Button */}
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="btn-rect text-xs py-1.5 px-3 cursor-pointer hidden sm:flex items-center gap-1.5"
                title="Return to Public Landing Page"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Landing</span>
              </button>
            )}

            {/* Breadcrumb Indicator */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#888888] hidden sm:inline">Seller Portal /</span>
              <span className="font-semibold text-[#111111] uppercase tracking-wider">
                {currentTab}
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-medium text-[#111111] truncate max-w-[180px]">
                {businessName || 'Seller Account'}
              </span>
              <span className="text-[11px] text-[#777777] font-mono truncate max-w-[180px]">
                {sellerEmail}
              </span>
            </div>

            <button
              onClick={() => setShowBulkUpload(true)}
              className="btn-rect-primary text-xs py-1.5 px-3.5 cursor-pointer flex items-center gap-2"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bulk Ingestion</span>
            </button>

            <button
              onClick={logout}
              className="btn-rect text-xs py-1.5 px-2.5 text-[#777777] hover:text-[#111111] cursor-pointer"
              title="Sign out of seller portal"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Mobile Slide-down Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#E5E7EB] p-4 space-y-1 shadow-md">
            {[
              { key: 'dashboard', label: 'Dashboard' },
              { key: 'products', label: 'Products' },
              { key: 'publishing', label: 'Publishing' },
              { key: 'listings', label: 'Listings' },
              { key: 'orders', label: 'Orders' },
              { key: 'inventory', label: 'Inventory' },
              { key: 'marketplaces', label: 'Marketplaces' },
              { key: 'settings', label: 'Settings' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleNavigate(key)}
                className={`w-full text-left px-3 py-2 text-xs font-medium rounded-[2px] transition-colors cursor-pointer ${
                  currentTab === key
                    ? 'bg-[#111111] text-white'
                    : 'text-[#555555] hover:bg-[#F7F8FA]'
                }`}
              >
                {label}
              </button>
            ))}
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="w-full text-left px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-[2px] pt-3 border-t border-[#E5E7EB] cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Landing Page</span>
              </button>
            )}
          </div>
        )}

        {/* Dynamic Page Component Content */}
        <main className="flex-1 flex flex-col min-w-0">
          {renderContent()}
        </main>
      </div>

      {/* Global Bulk Upload Modal */}
      {showBulkUpload && (
        <BulkUploadModal
          onClose={() => setShowBulkUpload(false)}
          onSuccess={() => {
            setShowBulkUpload(false);
            if (currentTab === 'products') {
              // Trigger reload in products page if open
              setCurrentTab('products');
            }
          }}
        />
      )}
    </div>
  );
};
