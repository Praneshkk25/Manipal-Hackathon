import React, { useState } from 'react';
import { Award, Globe, RefreshCw, ChevronDown, CheckCircle2, AlertCircle, Menu, User, Shield, LogIn } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TopNav() {
  const {
    backendStatus,
    lastCheckedTime,
    checkHealth,
    regions,
    selectedRegionId,
    handleSelectRegion,
    currentUser,
    setLoginModalOpen,
    sidebarCollapsed,
    toggleSidebar
  } = useApp();

  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    await checkHealth();
    setTimeout(() => setRetrying(false), 500);
  };

  const isConnected = backendStatus === 'CONNECTED';
  const currentRegion = regions.find(r => r.id === selectedRegionId) || regions[0];

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '8px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '14px',
      flexWrap: 'wrap',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Left Area: Collapse Toggle & Breadcrumb / Command Center Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            title="Expand Sidebar"
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#1e3a8a',
              fontWeight: '700',
              fontSize: '12px'
            }}
          >
            <Menu size={16} color="#2563eb" />
            <span>MedRipple AI</span>
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '800',
            color: '#1d4ed8',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            padding: '3px 8px',
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            Healthcare Crisis Command Center
          </span>
        </div>
      </div>

      {/* Center Badges: Hackathon & UN SDG */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '16px',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          fontSize: '11px',
          fontWeight: '600',
          color: '#1d4ed8'
        }}>
          <Award size={13} color="#2563eb" />
          <span>Manipal Hackathon 2026 • Round 1</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '16px',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          fontSize: '11px',
          fontWeight: '600',
          color: '#15803d'
        }}>
          <Globe size={13} color="#16a34a" />
          <span>UN SDG 3: Good Health &amp; Well-Being</span>
        </div>
      </div>

      {/* Right Controls: Real Health Status, Region Selector, User Profile Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Live Backend Health Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '14px',
          backgroundColor: isConnected ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${isConnected ? '#bbf7d0' : '#fecaca'}`,
          fontSize: '11px',
          fontWeight: '600',
          color: isConnected ? '#15803d' : '#b91c1c'
        }}>
          <span
            className={isConnected ? "pulse-dot-green" : ""}
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: isConnected ? '#10b981' : '#ef4444',
              display: 'inline-block'
            }}
          />
          <span style={{ fontSize: '11px' }}>
            {isConnected ? 'Port 8000' : 'Offline'}
          </span>
          <button
            onClick={handleRetry}
            disabled={retrying}
            title="Retry Backend Health Check"
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '1px',
              color: isConnected ? '#16a34a' : '#dc2626'
            }}
          >
            <RefreshCw size={11} className={retrying ? 'spin-icon' : ''} />
          </button>
        </div>

        {/* Global Region Selector with Demo Flag */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11.5px',
              fontWeight: '700',
              color: '#334155',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              padding: '4px 9px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <span>{currentRegion.name}</span>
            <ChevronDown size={13} color="#64748b" />
          </div>

          {regionDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '4px',
              width: '230px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              zIndex: 100,
              overflow: 'hidden'
            }}>
              <div style={{ padding: '8px 12px', fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                Operational Health Regions
              </div>
              {regions.map((reg) => (
                <div
                  key={reg.id}
                  onClick={() => {
                    handleSelectRegion(reg.id);
                    setRegionDropdownOpen(false);
                  }}
                  style={{
                    padding: '9px 12px',
                    fontSize: '12px',
                    fontWeight: reg.id === selectedRegionId ? '700' : '500',
                    color: reg.id === selectedRegionId ? '#2563eb' : '#0f172a',
                    backgroundColor: reg.id === selectedRegionId ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{reg.name}</span>
                    <span style={{ fontSize: '9px', fontWeight: '800', backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '1px 5px', borderRadius: '4px' }}>
                      12 Facilities
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>
                    {reg.district_hq}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Authenticated User Role Pill with Login Modal Trigger */}
        <button
          onClick={() => setLoginModalOpen(true)}
          title="Click to Switch User Role or View Permissions"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            backgroundColor: '#f8fafc',
            border: '1.5px solid #cbd5e1',
            padding: '3px 9px 3px 4px',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.backgroundColor = '#eff6ff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#f8fafc'; }}
        >
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: currentUser?.badgeColor || '#2563eb',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '10.5px'
          }}>
            {currentUser?.avatar || 'DH'}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
              {currentUser?.role || 'DHO'}
            </div>
            <div style={{ fontSize: '9px', color: '#64748b', lineHeight: 1 }}>
              {currentUser?.title?.split(' ')[0] || 'Role'} ▾
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}
