import React from 'react';
import {
  Truck,
  TrendingUp,
  AlertTriangle,
  Zap,
  Sparkles,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DisruptionSimulator() {
  const {
    supplierDelay,
    setSupplierDelay,
    demandSurge,
    setDemandSurge,
    infrastructureSeverance,
    setInfrastructureSeverance,
    handleRunSimulation,
    handleSynthesizeRebalance,
    handleResetSimulation,
    simLoading,
    simulationResultBanner,
    isSimulationActive
  } = useApp();

  return (
    <div className="med-card" style={{
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            backgroundColor: '#f5f3ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldAlert size={16} color="#7c3aed" />
          </div>
          <h2 style={{ fontSize: '14px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#0f172a', margin: 0 }}>
            What-If Disruption Simulator
          </h2>
        </div>
        <button
          onClick={handleResetSimulation}
          title="Reset to Verified Baseline"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Control 1: Supplier Replenishment Delay */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#334155' }}>
            <Truck size={14} color="#2563eb" />
            <span>Supplier Replenishment Delay</span>
          </div>
          <span style={{
            fontSize: '12px',
            fontWeight: '800',
            fontFamily: 'var(--font-heading)',
            color: supplierDelay > 10 ? '#dc2626' : '#2563eb',
            backgroundColor: supplierDelay > 10 ? '#fef2f2' : '#eff6ff',
            padding: '2px 8px',
            borderRadius: '6px'
          }}>
            +{supplierDelay} days
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="30"
          value={supplierDelay}
          onChange={(e) => setSupplierDelay(parseInt(e.target.value, 10))}
          style={{ width: '100%', accentColor: '#2563eb' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
          <span>0 (Normal)</span>
          <span>15d</span>
          <span>30d (Severe)</span>
        </div>
      </div>

      {/* Control 2: Outbreak Demand Surge */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#334155' }}>
            <TrendingUp size={14} color="#ea580c" />
            <span>Outbreak Demand Surge</span>
          </div>
          <span style={{
            fontSize: '12px',
            fontWeight: '800',
            fontFamily: 'var(--font-heading)',
            color: demandSurge > 30 ? '#ea580c' : '#0f172a',
            backgroundColor: demandSurge > 30 ? '#fff7ed' : '#f8fafc',
            padding: '2px 8px',
            borderRadius: '6px'
          }}>
            +{demandSurge}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="80"
          value={demandSurge}
          onChange={(e) => setDemandSurge(parseInt(e.target.value, 10))}
          style={{ width: '100%', accentColor: '#ea580c' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
          <span>0%</span>
          <span>40%</span>
          <span>80% (Outbreak)</span>
        </div>
      </div>

      {/* Control 3: Infrastructure Severance Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 10px',
        backgroundColor: infrastructureSeverance ? '#fef2f2' : '#f8fafc',
        border: `1px solid ${infrastructureSeverance ? '#fecaca' : '#e2e8f0'}`,
        borderRadius: '8px',
        transition: 'all 0.2s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={15} color={infrastructureSeverance ? '#dc2626' : '#64748b'} />
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#0f172a' }}>
              Infrastructure Severance
            </div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>
              Simulate NH-544 bridge severance or landslides
            </div>
          </div>
        </div>

        {/* Switch */}
        <label className="switch">
          <input
            type="checkbox"
            checked={infrastructureSeverance}
            onChange={(e) => setInfrastructureSeverance(e.target.checked)}
          />
          <span className="slider-toggle" />
        </label>
      </div>

      {/* Dynamic Simulation Result Panel */}
      {simulationResultBanner && (
        <div style={{
          backgroundColor: '#fff7ed',
          border: '1.5px solid #fed7aa',
          borderRadius: '8px',
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontSize: '11px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800', color: '#9a3412' }}>
            <Activity size={13} color="#ea580c" />
            <span>SIMULATION RESULT ANALYSIS</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', color: '#7c2d12' }}>
            <div>
              Regional Risk: <b>{simulationResultBanner.beforeRisk} → {simulationResultBanner.afterRisk}</b>
            </div>
            <div>
              Critical Sites: <b>{simulationResultBanner.beforeCrit} → {simulationResultBanner.afterCrit}</b>
            </div>
            <div>
              Wandering Inflow: <b>+{simulationResultBanner.afterSpillover} pts/d</b>
            </div>
            <div>
              Earliest Stockout: <b>{simulationResultBanner.daysToStockoutEarliest}d</b>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
        {/* Button 1: Run Disruption Simulation */}
        <button
          onClick={handleRunSimulation}
          disabled={simLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '9px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 3px 10px rgba(37, 99, 235, 0.25)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          <Zap size={16} fill="#ffffff" />
          <span>{simLoading ? 'Simulating Cascade...' : 'Run Disruption Simulation'}</span>
        </button>

        {/* Button 2: Synthesize Minimum Intervention (MIO) */}
        <button
          onClick={handleSynthesizeRebalance}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '9px',
            backgroundColor: '#f5f3ff',
            color: '#6d28d9',
            border: '1.5px solid #a78bfa',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(124, 58, 237, 0.12)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ede9fe'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f3ff'}
        >
          <Sparkles size={16} color="#7c3aed" />
          <span>Synthesize Minimum Intervention (MIO)</span>
        </button>
      </div>
    </div>
  );
}
