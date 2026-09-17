import React from 'react';
import {
  LayoutDashboard,
  Network,
  PackageCheck,
  RefreshCw,
  FileText,
  Bell,
  Radio,
  Settings,
  ShieldCheck,
  BrainCircuit,
  Gamepad2,
  HeartPulse,
  Radar,
  GitMerge,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import templeImg from '../assets/temple.jpg';

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    unresolvedAlertsCount,
    sidebarCollapsed,
    toggleSidebar,
    currentUser,
    canAccessTab
  } = useApp();

  const NAV_SECTIONS = [
    {
      title: 'OPERATIONS',
      items: [
        { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
        { id: 'network_map', label: 'Network Map', icon: Network },
        { id: 'commander', label: 'AI Commander', icon: BrainCircuit, badge: 'AI', badgeColor: '#ede9fe', badgeTextColor: '#6d28d9' },
        { id: 'war_room', label: 'Crisis War Room', icon: Gamepad2, isWarRoom: true }
      ]
    },
    {
      title: 'HUMAN IMPACT & INTEL',
      items: [
        { id: 'patient_impact', label: 'Patient Impact', icon: HeartPulse },
        { id: 'early_warning', label: '72h Early Warning', icon: Radar },
        { id: 'causal_graph', label: 'Causal Chain', icon: GitMerge },
        { id: 'inventory', label: 'Inventory Master', icon: PackageCheck }
      ]
    },
    {
      title: 'LOGISTICS & RURAL',
      items: [
        { id: 'rebalancing', label: 'Rebalancing Plan', icon: RefreshCw },
        { id: 'rural', label: 'Rural GSM Connect', icon: Radio }
      ]
    },
    {
      title: 'GOVERNANCE',
      items: [
        {
          id: 'alerts',
          label: 'Alerts Triage',
          icon: Bell,
          badge: unresolvedAlertsCount > 0 ? `${unresolvedAlertsCount}` : '3',
          badgeColor: '#dc2626',
          badgeTextColor: '#ffffff',
          isCircleBadge: true
        },
        { id: 'reports', label: 'Reports Dossier', icon: FileText },
        { id: 'settings', label: 'System Settings', icon: Settings },
        { id: 'audit', label: 'Audit Trail', icon: ShieldCheck }
      ]
    }
  ];

  return (
    <aside style={{
      width: sidebarCollapsed ? '64px' : '256px',
      transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      overflow: 'hidden'
    }}>
      {/* 1. Header: Brand Logo, Title & Collapse Arrow Button */}
      <div style={{
        padding: sidebarCollapsed ? '14px 8px' : '14px 14px 12px 14px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: sidebarCollapsed ? 'center' : 'space-between',
        gap: '8px',
        flexShrink: 0
      }}>
        {!sidebarCollapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 50%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
              fontSize: '18px',
              flexShrink: 0
            }}>
              🦋
            </div>
            <div style={{ overflow: 'hidden', minWidth: 0 }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '800',
                fontFamily: 'var(--font-heading, inherit)',
                color: '#0f172a',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                MedRipple <span style={{ color: '#2563eb' }}>AI</span>
              </div>
              <div style={{
                fontSize: '9.5px',
                fontWeight: '600',
                color: '#64748b',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginTop: '1px'
              }}>
                Small Ripples. Healthier Tomorrows.
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={toggleSidebar}
            title="Expand Sidebar"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)'
            }}
          >
            🦋
          </div>
        )}

        {/* Clean Collapse Arrow Button (< / >) */}
        <button
          onClick={toggleSidebar}
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
            flexShrink: 0,
            transition: 'all 0.15s ease',
            padding: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#eff6ff';
            e.currentTarget.style.borderColor = '#93c5fd';
            e.currentTarget.style.color = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* 2. Middle Scrollable Navigation List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: sidebarCollapsed ? '10px 6px' : '10px 10px 4px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {!sidebarCollapsed && (
          <div style={{
            padding: '5px 8px',
            borderRadius: '6px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '10px',
            fontWeight: '700',
            color: currentUser?.badgeColor || '#2563eb',
            marginBottom: '2px'
          }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser?.role === 'ADMIN' ? '👨‍💼 System Admin' :
               currentUser?.role === 'DHO' ? '👨‍⚕️ District Officer' :
               currentUser?.role === 'HOSPITAL' ? '🏥 Facility In-Charge' : '👁️ Hackathon Observer'}
            </span>
            <span style={{
              fontSize: '8.5px',
              fontWeight: '800',
              padding: '1px 5px',
              borderRadius: '4px',
              backgroundColor: currentUser?.role === 'ADMIN' ? '#f3e8ff' : currentUser?.role === 'OBSERVER' ? '#ffedd5' : '#e0f2fe',
              color: currentUser?.badgeColor || '#2563eb',
              flexShrink: 0
            }}>
              {currentUser?.role === 'ADMIN' ? 'ALL 14 VIEWS' :
               currentUser?.role === 'DHO' ? '13 VIEWS' :
               currentUser?.role === 'HOSPITAL' ? '7 VIEWS' : '8 VIEWS'}
            </span>
          </div>
        )}

        {NAV_SECTIONS
          .map((section) => ({
            ...section,
            items: section.items.filter(item => canAccessTab(item.id))
          }))
          .filter(section => section.items.length > 0)
          .map((section) => (
          <div key={section.title} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {!sidebarCollapsed && (
              <div style={{
                fontSize: '9.5px',
                fontWeight: '800',
                color: '#94a3b8',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '2px 8px',
                marginBottom: '1px'
              }}>
                {section.title}
              </div>
            )}

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isWarRoom = item.isWarRoom;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                    padding: sidebarCollapsed ? '7px 0' : '7px 10px',
                    borderRadius: '8px',
                    backgroundColor: isActive
                      ? '#eff6ff'
                      : isWarRoom
                        ? 'transparent'
                        : 'transparent',
                    color: isActive
                      ? '#1d4ed8'
                      : isWarRoom
                        ? '#b91c1c'
                        : '#475569',
                    fontWeight: isActive ? '700' : isWarRoom ? '600' : '500',
                    fontSize: '12.5px',
                    border: isWarRoom
                      ? '1px dashed #f87171'
                      : 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.12s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = isWarRoom ? '#fef2f2' : '#f8fafc';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
                    <Icon
                      size={16}
                      color={
                        isActive
                          ? '#2563eb'
                          : isWarRoom
                            ? '#dc2626'
                            : '#64748b'
                      }
                      style={{ flexShrink: 0 }}
                    />
                    {!sidebarCollapsed && (
                      <span style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.2
                      }}>
                        {item.label}
                      </span>
                    )}
                  </div>

                  {/* Badges */}
                  {!sidebarCollapsed && item.badge && (
                    item.isCircleBadge ? (
                      <span style={{
                        backgroundColor: item.badgeColor || '#dc2626',
                        color: item.badgeTextColor || '#ffffff',
                        fontSize: '10px',
                        fontWeight: '800',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {item.badge}
                      </span>
                    ) : (
                      <span style={{
                        backgroundColor: item.badgeColor || '#ede9fe',
                        color: item.badgeTextColor || '#6d28d9',
                        fontSize: '9.5px',
                        fontWeight: '800',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        flexShrink: 0,
                        letterSpacing: '0.02em'
                      }}>
                        {item.badge}
                      </span>
                    )
                  )}

                  {/* Collapsed dot indicators */}
                  {sidebarCollapsed && item.badge && (
                    <span style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: item.badgeColor || '#ef4444'
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* 3. Bottom Cultural Artwork & Slogan: Matching Screenshot 2 Exactly */}
      {!sidebarCollapsed ? (
        <div style={{
          padding: '10px 12px 0 12px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          flexShrink: 0
        }}>
          {/* Quote: Georgia serif font in navy italic */}
          <p style={{
            fontFamily: 'Georgia, Cambria, serif',
            fontSize: '12px',
            fontStyle: 'italic',
            color: '#1e3a8a',
            lineHeight: '1.35',
            margin: '0 0 8px 0',
            fontWeight: '700',
            letterSpacing: '-0.01em'
          }}>
            &ldquo;Stronger Supply Chains.<br />Healthier Communities.&rdquo;
          </p>

          {/* Temple Image Card: Rounded top corners, clean frame at bottom */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '118px',
            borderRadius: '10px 10px 0 0',
            overflow: 'hidden',
            boxShadow: '0 -1px 6px rgba(15, 23, 42, 0.06)'
          }}>
            <img
              src={templeImg}
              alt="Tamil Nadu Heritage Temple Gopuram"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 25%',
                display: 'block'
              }}
            />
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '10px 0',
          borderTop: '1px solid #f1f5f9',
          flexShrink: 0
        }}>
          <span
            style={{ fontSize: '18px', cursor: 'pointer' }}
            onClick={toggleSidebar}
            title="Expand Sidebar"
          >
            🏛️
          </span>
        </div>
      )}
    </aside>
  );
}
