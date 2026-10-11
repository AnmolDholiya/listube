import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Send,
  List,
  ShoppingCart,
  BarChart3,
  Store,
  Settings,
  LogOut,
  ChevronLeft,
} from 'lucide-react';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'products', label: 'Products', icon: Package },
  { key: 'publishing', label: 'Publishing', icon: Send },
  { key: 'listings', label: 'Listings', icon: List },
  { key: 'orders', label: 'Orders', icon: ShoppingCart },
  { key: 'inventory', label: 'Inventory', icon: BarChart3 },
  { key: 'marketplaces', label: 'Marketplaces', icon: Store },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar = ({ currentView, onNavigate, collapsed, onToggleCollapse }) => {
  const { businessName, sellerEmail, logout } = useAuth();

  return (
    <aside
      className={`bg-white border-r border-[#E5E7EB] flex flex-col h-screen sticky top-0 transition-all duration-200 ${
        collapsed ? 'w-[60px]' : 'w-[220px]'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-[#E5E7EB] gap-3 shrink-0">
        <div className="w-8 h-8 rounded-[2px] bg-[#111111] text-white flex items-center justify-center font-semibold text-xs tracking-widest shrink-0">
          CP
        </div>
        {!collapsed && (
          <span className="font-semibold text-[14px] text-[#111111] tracking-tight truncate">
            CatalogPlatform
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ key, label, icon: Icon }) => {
          const isActive = currentView === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[2px] text-[13px] font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#111111] text-white'
                  : 'text-[#555555] hover:bg-[#F7F8FA] hover:text-[#111111]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-[#E5E7EB] p-3 space-y-2 shrink-0">
        {!collapsed && (
          <div className="px-2 mb-2">
            <div className="text-xs font-medium text-[#111111] truncate">
              {businessName || 'Seller Account'}
            </div>
            <div className="text-[11px] text-[#777777] font-mono truncate">
              {sellerEmail}
            </div>
          </div>
        )}

        <button
          onClick={logout}
          title="Sign out"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-[2px] text-[13px] text-[#777777] hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>

        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center py-1.5 rounded-[2px] text-[#999999] hover:text-[#111111] hover:bg-[#F7F8FA] transition-colors cursor-pointer"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </aside>
  );
};
