import React from 'react';
import { Pill, Smartphone, Calendar, ChevronDown, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ControlBar() {
  const {
    selectedMedicineId,
    handleSelectMedicine,
    medicines = [],
    systemTime,
    isSimulationActive,
    timelineDay,
    setIsRuralModalOpen,
    setModalTransfer
  } = useApp();

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap'
    }}>
      {/* Left Selectors: Medicine */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {/* Select Medicine */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            Select Medicine
          </span>
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#0f172a',
              cursor: 'pointer'
            }}>
              <Pill size={15} color="#2563eb" />
              <select
                value={selectedMedicineId}
                onChange={(e) => handleSelectMedicine(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#0f172a',
                  cursor: 'pointer',
                  appearance: 'none',
                  paddingRight: '16px',
                  maxWidth: '280px'
                }}
              >
                {medicines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} color="#64748b" style={{ pointerEvents: 'none', position: 'absolute', right: '10px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Right Controls: Rural PHC SMS Mode & Dynamic Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        {/* Rural PHC SMS Quick Trigger */}
        <button
          onClick={() => {
            setModalTransfer(null);
            setIsRuralModalOpen(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            backgroundColor: '#eff6ff',
            border: '1.5px solid #3b82f6',
            borderRadius: '8px',
            padding: '7px 14px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#1d4ed8',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 3px rgba(37, 99, 235, 0.12)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
        >
          <Smartphone size={15} color="#2563eb" />
          <span>Rural PHC SMS Mode</span>
        </button>

        {/* Dynamic Date & Simulation Horizon Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#475569',
          fontSize: '12px',
          fontWeight: '600',
          backgroundColor: '#f8fafc',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <Calendar size={14} color="#64748b" />
          <span>{systemTime || 'Wed, 10 Sep 2026 10:24 AM'}</span>

          {isSimulationActive && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              fontSize: '10px',
              fontWeight: '800',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid #fca5a5'
            }}>
              <Activity size={11} />
              <span>SIM DAY +{timelineDay}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
