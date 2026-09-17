import React, { useState } from 'react';
import { Bell, AlertTriangle, AlertOctagon, Clock, CheckCircle2, Send, Check, Eye, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AlertsView() {
  const {
    alertsData,
    selectedMedicine,
    handleAcknowledgeAlert,
    handleResolveAlert,
    openFacilityDrawer,
    setModalTransfer,
    setIsRuralModalOpen
  } = useApp();

  const [filterTab, setFilterTab] = useState('ACTIVE'); // 'ACTIVE' | 'ACKNOWLEDGED' | 'ALL'

  const medicineName = selectedMedicine?.name || 'Selected Essential Medicine';

  const filteredAlerts = alertsData.filter(alt => {
    if (filterTab === 'ALL') return true;
    return alt.status === filterTab;
  });

  const activeCount = alertsData.filter(a => a.status === 'ACTIVE').length;
  const acknowledgedCount = alertsData.filter(a => a.status === 'ACKNOWLEDGED').length;

  const handleOpenSmsForAlert = (alt) => {
    setModalTransfer({
      transfer_id: `ALT-${alt.id}`,
      source_name: 'Salem District Medical Depot',
      target_name: alt.facility,
      target_id: alt.facility_id || 'F_TIRU_PHC',
      transfer_volume: 250,
      transit_hours: 1.5,
      cost_inr: 320
    });
    setIsRuralModalOpen(true);
  };

  return (
    <div style={{ padding: '8px 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header Card */}
      <div className="med-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="#dc2626" />
            <h2 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#0f172a' }}>
              Active Clinical Triage Stream: <span style={{ color: '#2563eb' }}>{medicineName}</span>
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Real-time critical stockout warnings, rapid hospital triage, and spillover early notifications
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <button
              onClick={() => setFilterTab('ACTIVE')}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: filterTab === 'ACTIVE' ? '#ffffff' : 'transparent',
                color: filterTab === 'ACTIVE' ? '#dc2626' : '#64748b',
                fontWeight: filterTab === 'ACTIVE' ? '800' : '600',
                fontSize: '11px',
                cursor: 'pointer',
                boxShadow: filterTab === 'ACTIVE' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>Active</span>
              <span style={{
                backgroundColor: filterTab === 'ACTIVE' ? '#fee2e2' : '#e2e8f0',
                color: filterTab === 'ACTIVE' ? '#dc2626' : '#475569',
                padding: '1px 6px',
                borderRadius: '10px',
                fontSize: '10px'
              }}>
                {activeCount}
              </span>
            </button>

            <button
              onClick={() => setFilterTab('ACKNOWLEDGED')}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: filterTab === 'ACKNOWLEDGED' ? '#ffffff' : 'transparent',
                color: filterTab === 'ACKNOWLEDGED' ? '#d97706' : '#64748b',
                fontWeight: filterTab === 'ACKNOWLEDGED' ? '800' : '600',
                fontSize: '11px',
                cursor: 'pointer',
                boxShadow: filterTab === 'ACKNOWLEDGED' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>Acknowledged</span>
              <span style={{
                backgroundColor: filterTab === 'ACKNOWLEDGED' ? '#fef3c7' : '#e2e8f0',
                color: filterTab === 'ACKNOWLEDGED' ? '#b45309' : '#475569',
                padding: '1px 6px',
                borderRadius: '10px',
                fontSize: '10px'
              }}>
                {acknowledgedCount}
              </span>
            </button>

            <button
              onClick={() => setFilterTab('ALL')}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: filterTab === 'ALL' ? '#ffffff' : 'transparent',
                color: filterTab === 'ALL' ? '#2563eb' : '#64748b',
                fontWeight: filterTab === 'ALL' ? '800' : '600',
                fontSize: '11px',
                cursor: 'pointer',
                boxShadow: filterTab === 'ALL' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              All Alerts ({alertsData.length})
            </button>
          </div>
        </div>
      </div>

      {/* Alerts Stream List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredAlerts.length === 0 ? (
          <div className="med-card" style={{
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#f0fdf4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={26} color="#16a34a" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                No {filterTab.toLowerCase()} alerts for this medicine
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                All monitored healthcare facilities are operating within normal buffer parameters.
              </p>
            </div>
          </div>
        ) : (
          filteredAlerts.map((alt) => {
            const isCrit = alt.severity === 'CRITICAL';
            const isAppr = alt.severity === 'APPROACHING';
            const isAck = alt.status === 'ACKNOWLEDGED';

            return (
              <div
                key={alt.id}
                className="med-card"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  borderLeft: `5px solid ${isCrit ? '#ef4444' : isAppr ? '#f97316' : '#eab308'}`,
                  backgroundColor: isAck ? '#fafafa' : '#ffffff'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: isCrit ? '#fee2e2' : isAppr ? '#ffedd5' : '#fef9c3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isCrit ? <AlertTriangle size={19} color="#dc2626" /> : isAppr ? <AlertOctagon size={19} color="#ea580c" /> : <Clock size={19} color="#ca8a04" />}
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => openFacilityDrawer(alt.facility_id || alt.facility)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          fontSize: '14px',
                          fontWeight: '800',
                          color: '#0f172a',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          textDecorationColor: '#cbd5e1'
                        }}
                        title="Click to inspect facility inventory drawer"
                      >
                        {alt.facility}
                      </button>

                      <span style={{
                        fontSize: '9px',
                        fontWeight: '800',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        backgroundColor: isCrit ? '#fef2f2' : isAppr ? '#fff7ed' : '#fefce8',
                        color: isCrit ? '#dc2626' : isAppr ? '#ea580c' : '#ca8a04',
                        border: `1px solid ${isCrit ? '#fecaca' : isAppr ? '#fed7aa' : '#fef08a'}`
                      }}>
                        {alt.severity}
                      </span>

                      <span style={{
                        fontSize: '9px',
                        fontWeight: '700',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        backgroundColor: isAck ? '#fef3c7' : '#eff6ff',
                        color: isAck ? '#b45309' : '#1d4ed8',
                        border: `1px solid ${isAck ? '#fde68a' : '#bfdbfe'}`
                      }}>
                        {alt.status || 'ACTIVE'}
                      </span>
                    </div>

                    <p style={{ fontSize: '12px', color: '#475569', marginTop: '3px' }}>
                      {alt.message}
                    </p>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => openFacilityDrawer(alt.facility_id || alt.facility)}
                    title="View Facility Stock & SHAP Drivers"
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      color: '#475569',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Eye size={12} />
                    <span>Drawer</span>
                  </button>

                  {alt.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleAcknowledgeAlert(alt.id)}
                      title="Acknowledge alert without resolving"
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#fffbeb',
                        border: '1px solid #fde68a',
                        color: '#b45309',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Check size={12} />
                      <span>Acknowledge</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenSmsForAlert(alt)}
                    title="Dispatch Emergency SMS to Facility Nurse"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#1d4ed8',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Send size={11} />
                    <span>Dispatch SMS</span>
                  </button>

                  <button
                    onClick={() => handleResolveAlert(alt.id)}
                    title="Mark Alert Resolved"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      color: '#15803d',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <CheckCircle2 size={12} />
                    <span>Resolve</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
