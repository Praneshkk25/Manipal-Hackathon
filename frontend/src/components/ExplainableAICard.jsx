import React, { useState } from 'react';
import { Lightbulb, X, ChevronDown, Clock, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ExplainableAICard({ onClose }) {
  const {
    insightData,
    selectedFacilityId,
    handleSelectFacility,
    simData,
    selectedMedicine,
    openFacilityDrawer
  } = useApp();

  const [activeTab, setActiveTab] = useState('rationale'); // 'rationale' | 'batches' | 'uncertainty'

  // Derive facility options from currently active facilities
  const facilities = simData?.facilities || [];
  const facilityOptions = facilities.length > 0 ? facilities : [
    { id: 'F_TIRU_PHC', name: 'Tiruchengode PHC', status: 'CRITICAL' },
    { id: 'F_NAMAK_PHC', name: 'Namakkal PHC', status: 'APPROACHING' },
    { id: 'F_TRICHY_CHC', name: 'Trichy CHC', status: 'AT_RISK' },
    { id: 'F_CBE_DEPOT', name: 'Coimbatore Depot', status: 'HEALTHY' }
  ];

  const currentData = insightData || {
    facility_name: 'Tiruchengode PHC',
    status: 'CRITICAL',
    ai_confidence_pct: 88,
    uncertainty_margin_days: 0.8,
    headline_alert: 'Critical risk primarily driven by inventory depletion and clinical demand.',
    shap_factors: [
      { name: 'Current Inventory Deficit', percentage: 42, color: '#ef4444' },
      { name: 'Epidemiological Demand Surge', percentage: 28, color: '#06b6d4' },
      { name: 'Supplier Transit Delay', percentage: 18, color: '#f59e0b' },
      { name: 'Secondary Patient Spillover', percentage: 12, color: '#f97316' }
    ],
    inventory_summary: {
      current_stock: 280,
      daily_burn_rate: 70,
      burn_rate_increase: '+24%',
      days_until_stockout: 4.0,
      min_safety_threshold: 14
    },
    batch_breakdown: [
      { batch_no: 'AMX-TN-2026-901', quantity: 90, expiry_date: '2026-10-08', status: 'Priority Burn' }
    ],
    uncertainty_details: {
      model_type: 'Ensemble Gradient Boosted Trees (XGBoost) + Bayesian Demand Forecasting',
      prediction_interval_95: '3.2 to 4.8 days',
      historical_mape: '4.2%'
    }
  };

  const medicineName = selectedMedicine?.name || 'Essential Medicine';

  return (
    <div className="med-card" style={{
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lightbulb size={16} color="#0284c7" />
          <h2 style={{ fontSize: '14px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#0f172a', margin: 0 }}>
            Explainable AI – Facility Insights
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Facility Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '5px 10px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#0f172a'
          }}>
            <select
              value={selectedFacilityId}
              onChange={(e) => handleSelectFacility(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '12px',
                fontWeight: '700',
                color: '#0f172a',
                cursor: 'pointer',
                appearance: 'none',
                paddingRight: '16px'
              }}
            >
              {facilityOptions.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.name} ({fac.status})
                </option>
              ))}
            </select>
            <ChevronDown size={13} color="#64748b" style={{ pointerEvents: 'none', position: 'absolute', right: '10px' }} />
          </div>
        </div>

        <button
          onClick={() => openFacilityDrawer(selectedFacilityId)}
          title="Open Full Facility Dossier"
          style={{
            padding: '6px 10px',
            borderRadius: '7px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            color: '#2563eb',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>Dossier</span>
          <ExternalLink size={12} />
        </button>
      </div>

      {/* Status & Headline Banner */}
      <div style={{
        padding: '10px 12px',
        borderRadius: '8px',
        backgroundColor: currentData.status === 'CRITICAL' ? '#fef2f2' : currentData.status === 'APPROACHING' ? '#fff7ed' : '#f0fdf4',
        border: `1px solid ${currentData.status === 'CRITICAL' ? '#fecaca' : currentData.status === 'APPROACHING' ? '#fed7aa' : '#bbf7d0'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: '10px',
            fontWeight: '800',
            color: currentData.status === 'CRITICAL' ? '#b91c1c' : currentData.status === 'APPROACHING' ? '#c2410c' : '#15803d',
            textTransform: 'uppercase'
          }}>
            {currentData.status} RISK STATE
          </span>
          <span style={{ fontSize: '10px', color: '#64748b' }}>
            Confidence: <b>{currentData.ai_confidence_pct}%</b>
          </span>
        </div>
        <p style={{
          fontSize: '11px',
          color: currentData.status === 'CRITICAL' ? '#991b1b' : currentData.status === 'APPROACHING' ? '#9a3412' : '#166534',
          margin: 0,
          lineHeight: '1.4'
        }}>
          {currentData.headline_alert}
        </p>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '7px' }}>
        {[
          { id: 'rationale', label: 'SHAP Factors' },
          { id: 'batches', label: 'Batch Tracing' },
          { id: 'uncertainty', label: 'Uncertainty' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              border: 'none',
              padding: '4px 6px',
              borderRadius: '5px',
              fontSize: '10px',
              fontWeight: '700',
              cursor: 'pointer',
              backgroundColor: activeTab === tab.id ? '#ffffff' : 'transparent',
              color: activeTab === tab.id ? '#0f172a' : '#64748b',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: SHAP Factor Attributions */}
      {activeTab === 'rationale' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
            Contributing Drivers to Shortage Risk Horizon:
          </div>
          {currentData.shap_factors?.map((factor, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#334155', marginBottom: '2px' }}>
                <span>{factor.name}</span>
                <b>{factor.percentage}%</b>
              </div>
              <div style={{ height: '6px', borderRadius: '3px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                <div style={{ width: `${factor.percentage}%`, height: '100%', backgroundColor: factor.color || '#2563eb' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Batch Breakdown */}
      {activeTab === 'batches' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
            Active Physical Batches in Clinic Pharmacy:
          </div>
          {currentData.batch_breakdown?.map((batch, idx) => (
            <div key={idx} style={{
              padding: '8px 10px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11px'
            }}>
              <div>
                <div style={{ fontWeight: '700', color: '#0f172a' }}>{batch.batch_no}</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Expires: {batch.expiry_date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '800', color: '#2563eb' }}>{batch.quantity} units</div>
                <span style={{ fontSize: '9px', fontWeight: '800', color: '#7c3aed', backgroundColor: '#f5f3ff', padding: '1px 5px', borderRadius: '4px' }}>
                  {batch.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Uncertainty Bounds */}
      {activeTab === 'uncertainty' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
          <div style={{ padding: '8px 10px', borderRadius: '6px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ color: '#64748b', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}>Forecasting Model</div>
            <div style={{ fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>
              {currentData.uncertainty_details?.model_type || 'Bayesian Demand Process'}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ padding: '8px 10px', borderRadius: '6px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}>95% Credible Interval</div>
              <div style={{ fontWeight: '800', color: '#2563eb', marginTop: '2px' }}>
                {currentData.uncertainty_details?.prediction_interval_95 || '±0.8 days'}
              </div>
            </div>
            <div style={{ padding: '8px 10px', borderRadius: '6px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}>Historical MAPE</div>
              <div style={{ fontWeight: '800', color: '#16a34a', marginTop: '2px' }}>
                {currentData.uncertainty_details?.historical_mape || '3.8% error'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
