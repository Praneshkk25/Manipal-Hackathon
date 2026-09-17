import React, { useState } from 'react';
import {
  GitMerge,
  ArrowDown,
  Clock,
  TrendingDown,
  AlertTriangle,
  Users,
  Building2,
  Activity,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CausalCrisisGraph() {
  const {
    selectedMedicine,
    causalChainData,
    simData,
    supplierDelay
  } = useApp();

  const [selectedNodeId, setSelectedNodeId] = useState('supplier_delay');
  const medicineName = selectedMedicine?.name || 'Amoxicillin + Clavulanic Acid 625mg';

  const activeNode = causalChainData.find(n => n.id === selectedNodeId) || causalChainData[0];

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
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
        borderLeft: '5px solid #059669'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: '#d1fae5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <GitMerge size={24} color="#059669" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '19px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#0f172a', margin: 0 }}>
                Causal Crisis Cascade Graph
              </h1>
              <span style={{
                fontSize: '10px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                border: '1px solid #bbf7d0'
              }}>
                SHAP &amp; BAYESIAN ATTRIBUTION
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', margin: 0 }}>
              Deconstructing the upstream trigger down to multi-facility regional collapse • Context: <b style={{ color: '#059669' }}>{medicineName}</b>
            </p>
          </div>
        </div>
      </div>

      {/* Two-Column Layout: Visual Flowchart vs. Node Deep-Dive */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: '20px' }}>
        {/* Left Column: Interactive Causal Chain */}
        <div className="med-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '4px' }}>
            Click Any Stage to Inspect Causal Drivers
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            {causalChainData.map((node, index) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <React.Fragment key={node.id}>
                  <div
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                      border: `2px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.15)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#2563eb' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: '800'
                      }}>
                        {index + 1}
                      </span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>
                          {node.label}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {node.metric}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        padding: '2px 7px',
                        borderRadius: '6px',
                        backgroundColor: node.severity === 'CRITICAL' ? '#fee2e2' : '#fef3c7',
                        color: node.severity === 'CRITICAL' ? '#dc2626' : '#d97706'
                      }}>
                        {node.severity}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: node.color }}>
                        {node.impactPct}%
                      </span>
                    </div>
                  </div>

                  {index < causalChainData.length - 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '14px', color: '#94a3b8' }}>
                      <ArrowDown size={14} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right Column: Node Deep-Dive Explanation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="med-card" style={{ padding: '22px', borderLeft: `5px solid ${activeNode.color}` }}>
            <div style={{ fontSize: '10.5px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
              Selected Causal Node Analysis
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: '4px 0 10px 0' }}>
              {activeNode.label}
            </h2>

            <p style={{
              fontSize: '12.5px',
              color: '#334155',
              lineHeight: '1.6',
              backgroundColor: '#f8fafc',
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              {activeNode.desc}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#1d4ed8', textTransform: 'uppercase' }}>Attribution Weight</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#2563eb', fontFamily: 'var(--font-heading)', marginTop: '2px' }}>
                  {activeNode.impactPct}%
                </div>
                <div style={{ fontSize: '10px', color: '#475569' }}>SHAP Relative Factor</div>
              </div>

              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>Bayesian CI (95%)</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#15803d', fontFamily: 'var(--font-heading)', marginTop: '2px' }}>
                  ±0.8d
                </div>
                <div style={{ fontSize: '10px', color: '#475569' }}>Uncertainty Margin</div>
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', fontSize: '12px', color: '#475569' }}>
              <div><b>Controllable Action Point:</b> Earliest point where minimum intervention transfers prevent downstream cascading failure.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
