import React, { useState } from 'react';
import {
  Radar,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Building2,
  Truck,
  Send,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function EarlyWarningRadar() {
  const {
    selectedMedicine,
    simData,
    earlyWarningData,
    openFacilityDrawer,
    setModalTransfer,
    setIsRuralModalOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'H24' | 'H48' | 'H72'
  const medicineName = selectedMedicine?.name || 'Amoxicillin + Clavulanic Acid 625mg';

  const { h24, h48, h72 } = earlyWarningData;

  const getFilteredList = () => {
    if (activeTab === 'H24') return h24;
    if (activeTab === 'H48') return h48;
    if (activeTab === 'H72') return h72;
    return [...h24, ...h48, ...h72];
  };

  const list = getFilteredList();

  const handleQuickTransferForFacility = (facility) => {
    setModalTransfer({
      transfer_id: `RADAR-${facility.id}`,
      source_name: 'Coimbatore Regional Drug Depot',
      target_name: facility.name,
      target_id: facility.id,
      transfer_volume: 300,
      transit_hours: 1.8,
      cost_inr: 390
    });
    setIsRuralModalOpen(true);
  };

  return (
    <div style={{ padding: '8px 24px 32px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="med-card" style={{
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)',
        borderLeft: '5px solid #ea580c'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: '#ffedd5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Radar size={24} color="#ea580c" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '19px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#0f172a', margin: 0 }}>
                72-Hour Early Warning Radar
              </h1>
              <span style={{
                fontSize: '10px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: '#fff7ed',
                color: '#c2410c',
                border: '1px solid #fed7aa'
              }}>
                PREDICTIVE COUNTDOWN WINDOWS
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', margin: 0 }}>
              Anticipating facility collapse horizons before shelves reach empty state • Context: <b style={{ color: '#ea580c' }}>{medicineName}</b>
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          padding: '3px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <button
            onClick={() => setActiveTab('ALL')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'ALL' ? '#ffffff' : 'transparent',
              color: activeTab === 'ALL' ? '#ea580c' : '#64748b',
              fontWeight: activeTab === 'ALL' ? '800' : '600',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            All Radar ({earlyWarningData.totalThreats})
          </button>

          <button
            onClick={() => setActiveTab('H24')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'H24' ? '#ffffff' : 'transparent',
              color: activeTab === 'H24' ? '#dc2626' : '#64748b',
              fontWeight: activeTab === 'H24' ? '800' : '600',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            ≤24h Horizon ({h24.length})
          </button>

          <button
            onClick={() => setActiveTab('H48')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'H48' ? '#ffffff' : 'transparent',
              color: activeTab === 'H48' ? '#ea580c' : '#64748b',
              fontWeight: activeTab === 'H48' ? '800' : '600',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            24–48h Horizon ({h48.length})
          </button>

          <button
            onClick={() => setActiveTab('H72')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'H72' ? '#ffffff' : 'transparent',
              color: activeTab === 'H72' ? '#ca8a04' : '#64748b',
              fontWeight: activeTab === 'H72' ? '800' : '600',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            48–72h Horizon ({h72.length})
          </button>
        </div>
      </div>

      {/* 3 Horizon KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div className="med-card" style={{ padding: '16px', backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626', display: 'inline-block' }} className="pulse-dot" />
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#991b1b', textTransform: 'uppercase' }}>Next 24 Hours: Emergency</div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#dc2626', fontFamily: 'var(--font-heading)', marginTop: '6px' }}>
            {h24.length} Facilities
          </div>
          <div style={{ fontSize: '11.5px', color: '#b91c1c', marginTop: '2px' }}>
            Active physical stock exhaustion imminent
          </div>
        </div>

        <div className="med-card" style={{ padding: '16px', backgroundColor: '#fff7ed', borderColor: '#fed7aa' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ea580c', display: 'inline-block' }} />
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#9a3412', textTransform: 'uppercase' }}>24–48 Hours: Cascade Spur</div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#ea580c', fontFamily: 'var(--font-heading)', marginTop: '6px' }}>
            {h48.length} Facilities
          </div>
          <div style={{ fontSize: '11.5px', color: '#c2410c', marginTop: '2px' }}>
            Secondary patient drift begins drain
          </div>
        </div>

        <div className="med-card" style={{ padding: '16px', backgroundColor: '#fefce8', borderColor: '#fef08a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ca8a04', display: 'inline-block' }} />
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#854d0e', textTransform: 'uppercase' }}>48–72 Hours: Buffer Strain</div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#ca8a04', fontFamily: 'var(--font-heading)', marginTop: '6px' }}>
            {h72.length} Facilities
          </div>
          <div style={{ fontSize: '11.5px', color: '#a16207', marginTop: '2px' }}>
            Pre-crisis window for preventive transfer
          </div>
        </div>
      </div>

      {/* Radar Target Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {list.length === 0 ? (
          <div className="med-card" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <CheckCircle2 size={32} color="#16a34a" style={{ margin: '0 auto 8px auto' }} />
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>Zero Imminent Threats in this Horizon</div>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>All facilities have adequate operational safety buffers.</p>
          </div>
        ) : (
          list.map((target) => {
            const is24 = target.countdownHours <= 24;
            const is48 = target.countdownHours > 24 && target.countdownHours <= 48;
            const color = is24 ? '#dc2626' : is48 ? '#ea580c' : '#ca8a04';
            const bg = is24 ? '#fee2e2' : is48 ? '#ffedd5' : '#fef9c3';
            const border = is24 ? '#fecaca' : is48 ? '#fed7aa' : '#fef08a';

            return (
              <div
                key={target.id}
                className="med-card"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  borderLeft: `5px solid ${color}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '8px',
                    backgroundColor: bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Clock size={20} color={color} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
                        {target.name}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        padding: '2px 7px',
                        borderRadius: '6px',
                        backgroundColor: bg,
                        color,
                        border: `1px solid ${border}`
                      }}>
                        {target.countdownHours}h RUNWAY REMAINING
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        Type: <b>{target.type || 'PHC'}</b>
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '3px', display: 'flex', gap: '16px' }}>
                      <span>Current Stock: <b>{target.current_stock} units</b></span>
                      <span>Daily Burn: <b>{target.daily_consumption} pts/day</b></span>
                      <span>Days Left: <b>{target.days_until_stockout} days</b></span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => openFacilityDrawer(target.id)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#334155',
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

                  <button
                    onClick={() => handleQuickTransferForFacility(target)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '6px',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 1px 4px rgba(37, 99, 235, 0.25)'
                    }}
                  >
                    <Truck size={12} />
                    <span>Deploy Transfer</span>
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
