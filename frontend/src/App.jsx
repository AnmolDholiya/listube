import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { LandingPage } from './components/landing/LandingPage';
import { SellerDashboardLayout } from './components/SellerDashboardLayout';

const DASHBOARD_VIEWS = [
  'ledger',
  'dashboard',
  'products',
  'publishing',
  'listings',
  'orders',
  'inventory',
  'marketplaces',
  'settings',
];

const MainApp = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('landing');

  // If user becomes authenticated, switch to dashboard if on auth screens
  useEffect(() => {
    if (isAuthenticated && (currentView === 'login' || currentView === 'register')) {
      setCurrentView('dashboard');
    }
  }, [isAuthenticated]);

  if (currentView === 'login') {
    return (
      <AuthPage 
        initialMode="login" 
        onNavigate={setCurrentView} 
      />
    );
  }

  if (currentView === 'register') {
    return (
      <AuthPage 
        initialMode="register" 
        onNavigate={setCurrentView} 
      />
    );
  }

  if (DASHBOARD_VIEWS.includes(currentView)) {
    if (!isAuthenticated) {
      return (
        <AuthPage 
          initialMode="login" 
          onNavigate={setCurrentView} 
        />
      );
    }
    return (
      <SellerDashboardLayout 
        initialView={currentView}
        onNavigateHome={() => setCurrentView('landing')} 
      />
    );
  }

  return (
    <LandingPage 
      currentView={currentView}
      setCurrentView={setCurrentView}
      onNavigate={setCurrentView}
    />
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
