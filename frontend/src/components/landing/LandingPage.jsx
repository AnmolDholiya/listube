import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { HeroSection } from './HeroSection';
import { WorkflowAndEngineSection } from './WorkflowAndEngineSection';
import { CompetitorAnalyticsSection } from './CompetitorAnalyticsSection';
import { MarketplaceEcosystemSection } from './MarketplaceEcosystemSection';
import { PipelineAndMetricsSection } from './PipelineAndMetricsSection';
import { TrustAndCTASection } from './TrustAndCTASection';
import { FooterSection } from './FooterSection';

export const LandingPage = ({ currentView, setCurrentView, onNavigate }) => {
  const handleOpenLedger = () => {
    if (onNavigate) {
      onNavigate('ledger');
    } else if (setCurrentView) {
      setCurrentView('ledger');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#05060B] text-white flex flex-col selection:bg-[#4563FF] selection:text-white">
      {/* 1. Dark Enterprise Navigation Bar */}
      <LandingNavbar
        onNavigate={onNavigate}
        onOpenLedger={handleOpenLedger}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* Main Sections with CedCommerce Dark/Light Alternating Rhythm */}
      <main className="flex-1 w-full overflow-x-hidden">
        
        {/* 2. DARK HERO + ECOSYSTEM NODE VISUAL + HERO METRICS (Sections 6, 7 & 8) */}
        <HeroSection
          onNavigate={onNavigate}
          onOpenLedger={handleOpenLedger}
        />

        {/* 3. LIGHT: UNICON CROSS-LIST SECTION (CedCommerce Screenshot 3) */}
        <WorkflowAndEngineSection
          onNavigate={onNavigate}
          onOpenLedger={handleOpenLedger}
        />

        {/* 4. LIGHT: MARKETPLACE PERFORMANCE / GROWTH SERVICES (CedCommerce Screenshot 4) */}
        <CompetitorAnalyticsSection
          onNavigate={onNavigate}
          onOpenLedger={handleOpenLedger}
        />

        {/* 5. LIGHT: DATA SOURCES / MARKETPLACE ECOSYSTEM (Section 14 - CedCommerce Screenshot 5) */}
        <MarketplaceEcosystemSection
          onNavigate={onNavigate}
        />

        {/* 6. DARK: 9-STEP AUTOMATION PIPELINE + EFFICIENCY METRICS (Sections 15 & 16) */}
        <PipelineAndMetricsSection />

        {/* 7. DARK: TESTIMONIALS + ENTERPRISE TRUST + FINAL CTA (Sections 19, 20 & 21) */}
        <TrustAndCTASection
          onNavigate={onNavigate}
          onOpenLedger={handleOpenLedger}
        />

      </main>

      {/* 8. LIGHT: ENTERPRISE MULTI-COLUMN FOOTER (Section 22) */}
      <FooterSection
        onNavigate={onNavigate}
        onOpenLedger={handleOpenLedger}
      />
    </div>
  );
};
