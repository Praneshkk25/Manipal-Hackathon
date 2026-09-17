import React, { useState } from 'react';
import {
  Radio,
  Signal,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  RefreshCw,
  Phone,
  Building2,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function RuralConnectView() {
  const {
    smsHistory,
    systemTime,
    simData,
    selectedMedicine,
    setModalTransfer,
    setIsRuralModalOpen,
    showToast
  } = useApp();

  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'CONNECTED' | 'OFFLINE'

  // Facilities connectivity breakdown: PHCs in remote hilly/rural areas operate via GSM SMS
  const PHC_FACILITIES = (simData?.facilities || []).filter(f => f.type === 'PHC');

  const connectedCount = PHC_FACILITIES.filter(f => f.id !== 'F_TIRU_PHC' && f.id !== 'F_MADU_PHC').length;
  const offlineCount = PHC_FACILITIES.length - connectedCount;

  const handleManualDispatch = (fac) => {
    setModalTransfer({
      transfer_id: 'TR-GSM-ALERT',
      source_name: 'Coimbatore Regional Depot',
      target_id: fac.id,
      target_name: fac.name,
      transfer_volume: 180,
      transit_hours: 1.2,
      cost_inr: 250
    });
    setIsRuralModalOpen(true);
  };

  return (
    <div style={{ padding: '8px 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Banner Card */}
      <div className="med-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Radio size={22} color="#16a34a" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#0f172a' }}>
                Rural PHC Low-Bandwidth SMS Gateway
              </h2>
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '800',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                border: '1px solid #86efac'
              }}>
                2G GSM PROTOCOL ONLINE
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Autonomous failover dispatch protocol for remote clinics with zero 4G/broadband connectivity
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setModalTransfer(null);
            setIsRuralModalOpen(true);
          }}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
          }}
        >
          <Send size={14} fill="#ffffff" />
          <span>Compose GSM Dispatch</span>
        </button>
      </div>

      {/* KPI Status Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        <div className="med-card" style={{ padding: '14px', backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#166534', textTransform: 'uppercase' }}>Gateway Status</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#15803d', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
            Active (2G / WhatsApp)
          </div>
          <div style={{ fontSize: '11px', color: '#16a34a' }}>Airtel/BSNL Cellular Link</div>
        </div>

        <div className="med-card" style={{ padding: '14px', backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#1e40af', textTransform: 'uppercase' }}>Connected PHCs</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#1d4ed8', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
            {connectedCount} of {PHC_FACILITIES.length} PHCs
          </div>
          <div style={{ fontSize: '11px', color: '#2563eb' }}>High GSM Signal (&gt; 3 bars)</div>
        </div>

        <div className="med-card" style={{ padding: '14px', backgroundColor: '#fff7ed', borderColor: '#fed7aa' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#9a3412', textTransform: 'uppercase' }}>Low-Bandwidth / Offline</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#ea580c', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
            {offlineCount} PHCs
          </div>
          <div style={{ fontSize: '11px', color: '#ea580c' }}>Fallback to 2G SMS Relay</div>
        </div>

        <div className="med-card" style={{ padding: '14px', backgroundColor: '#faf5ff', borderColor: '#e9d5ff' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#6b21a8', textTransform: 'uppercase' }}>Dispatched SMS Messages</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#7e22ce', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
            {smsHistory.length} Delivered
          </div>
          <div style={{ fontSize: '11px', color: '#9333ea' }}>100% Delivery Receipt Rate</div>
        </div>
      </div>

      {/* Grid of PHC Clinics & SMS History */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '16px' }}>
        {/* Left Column: PHC Facilities Connectivity Table */}
        <div className="med-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
              Primary Health Centers Connectivity Roster
            </h3>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Updated {systemTime || 'Just now'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PHC_FACILITIES.map((phc) => {
              const isLowSignal = phc.id === 'F_TIRU_PHC' || phc.id === 'F_MADU_PHC';
              return (
                <div
                  key={phc.id}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: isLowSignal ? '#fffbeb' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: isLowSignal ? '#fef3c7' : '#dcfce7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Signal size={16} color={isLowSignal ? '#d97706' : '#16a34a'} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{phc.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {isLowSignal ? '2G Cellular Only • Zero Broadband' : 'Standard 3G/GSM Cellular Link'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      backgroundColor: isLowSignal ? '#fef3c7' : '#dcfce7',
                      color: isLowSignal ? '#92400e' : '#15803d'
                    }}>
                      {isLowSignal ? 'SMS FALLBACK' : 'CELLULAR LIVE'}
                    </span>
                    <button
                      onClick={() => handleManualDispatch(phc)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        color: '#2563eb',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Send Alert
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sent SMS Transmission Log */}
        <div className="med-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
              GSM SMS Broadcast Transmission Log
            </h3>
            <span style={{ fontSize: '11px', color: '#64748b' }}>{smsHistory.length} messages</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
            {smsHistory.map((item, idx) => (
              <div
                key={item.id || idx}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#2563eb' }}>{item.id}</span>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>{item.timestamp}</span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>
                  To: {item.recipient} ({item.phone})
                </div>
                <p style={{ fontSize: '11px', color: '#475569', backgroundColor: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontFamily: 'monospace' }}>
                  {item.message_text}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#15803d', fontWeight: '700' }}>
                  <span>✔ DELIVERED_TO_GSM_GATEWAY</span>
                  <span style={{ fontFamily: 'monospace', color: '#64748b' }}>Receipt: {item.delivery_receipt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
