import React from 'react';
import { AppProvider, useApp } from './context/AppContext';

import TopNav from './components/TopNav';
import ControlBar from './components/ControlBar';
import Sidebar from './components/Sidebar';
import MetricCards from './components/MetricCards';
import NetworkMap from './components/NetworkMap';
import DisruptionSimulator from './components/DisruptionSimulator';
import ExplainableAICard from './components/ExplainableAICard';
import TimelineSimulator from './components/TimelineSimulator';
import RebalancingTable from './components/RebalancingTable';
import InventoryView from './components/InventoryView';
import ReportsView from './components/ReportsView';
import AlertsView from './components/AlertsView';
import RuralConnectView from './components/RuralConnectView';
import SettingsView from './components/SettingsView';
import AuditTrailView from './components/AuditTrailView';

// New Crisis Command Center Standout Features
import CrisisCommander from './components/CrisisCommander';
import CrisisWarRoom from './components/CrisisWarRoom';
import PatientImpactSimulator from './components/PatientImpactSimulator';
import EarlyWarningRadar from './components/EarlyWarningRadar';
import CausalCrisisGraph from './components/CausalCrisisGraph';
import LoginModal from './components/LoginModal';

import RuralSmsModal from './components/RuralSmsModal';
import FacilityDetailDrawer from './components/FacilityDetailDrawer';
import ConfirmationModal from './components/ConfirmationModal';
import ToastContainer from './components/ToastContainer';

function MedRippleMain() {
  const { activeTab, loadingMedicine } = useApp();

  return (
    <div className="app-container">
      {/* Left Collapsible Navigation Sidebar with Brand Header & Temple Art */}
      <Sidebar />

      {/* Main Command Center Content Area */}
      <div className="main-content">
        {/* Top Header */}
        <TopNav />

        {/* Dynamic Controls Bar with Live Clock, Medicine & Role Selectors */}
        <ControlBar />

        {/* Loading Bar during Context Switch */}
        {loadingMedicine && (
          <div style={{ height: '3px', width: '100%', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: '40%',
              backgroundColor: '#2563eb',
              animation: 'flow-dash 1s infinite linear'
            }} />
          </div>
        )}

        {/* Dynamic KPI Metric Cards Header */}
        <MetricCards />

        {/* Multi-Tab Command Center Views */}
        {activeTab === 'dashboard' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 340px',
            gap: '16px',
            padding: '8px 24px 16px 24px'
          }}>
            {/* Left Column: Map + Timeline + Rebalancing Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
              <div style={{ height: '520px' }}>
                <NetworkMap />
              </div>
              <TimelineSimulator />
              <RebalancingTable />
            </div>

            {/* Right Column: What-If Disruption Simulator + Explainable AI */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <DisruptionSimulator />
              <ExplainableAICard />
            </div>
          </div>
        )}

        {/* Page: Network Map Dedicated View */}
        {activeTab === 'network_map' && (
          <div style={{ padding: '8px 24px 24px 24px', height: 'calc(100vh - 160px)' }}>
            <NetworkMap />
          </div>
        )}

        {/* NEW Page: AI Crisis Commander */}
        {activeTab === 'commander' && (
          <CrisisCommander />
        )}

        {/* NEW Page: Crisis War Room */}
        {activeTab === 'war_room' && (
          <CrisisWarRoom />
        )}

        {/* NEW Page: Patient Impact Simulator */}
        {activeTab === 'patient_impact' && (
          <PatientImpactSimulator />
        )}

        {/* NEW Page: 72-Hour Early Warning Radar */}
        {activeTab === 'early_warning' && (
          <EarlyWarningRadar />
        )}

        {/* NEW Page: Causal Crisis Chain Graph */}
        {activeTab === 'causal_graph' && (
          <CausalCrisisGraph />
        )}

        {/* Page: Inventory Master */}
        {activeTab === 'inventory' && (
          <InventoryView />
        )}

        {/* Page: Simulations Sandbox */}
        {activeTab === 'simulations' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 380px',
            gap: '16px',
            padding: '8px 24px 24px 24px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ height: '480px' }}>
                <NetworkMap />
              </div>
              <TimelineSimulator />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <DisruptionSimulator />
              <ExplainableAICard />
            </div>
          </div>
        )}

        {/* Page: Rebalancing Plan */}
        {activeTab === 'rebalancing' && (
          <div style={{ padding: '8px 24px 24px 24px' }}>
            <RebalancingTable />
          </div>
        )}

        {/* Page: Reports Dossier */}
        {activeTab === 'reports' && (
          <ReportsView />
        )}

        {/* Page: Alerts Triage Stream */}
        {activeTab === 'alerts' && (
          <AlertsView />
        )}

        {/* Page: Rural Low-Bandwidth Connect */}
        {activeTab === 'rural' && (
          <RuralConnectView />
        )}

        {/* Page: Operational Settings & Thresholds */}
        {activeTab === 'settings' && (
          <SettingsView />
        )}

        {/* Page: Governance Audit Trail */}
        {activeTab === 'audit' && (
          <AuditTrailView />
        )}
      </div>

      {/* Global Interactive Overlays & Modals */}
      <LoginModal />
      <RuralSmsModal />
      <FacilityDetailDrawer />
      <ConfirmationModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MedRippleMain />
    </AppProvider>
  );
}
