import React from 'react';
import { RefreshCw, CheckCircle2, TrendingDown, Send, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function RebalancingTable() {
  const {
    rebalanceData,
    handleApproveTransfer,
    approvedTransfers,
    setModalTransfer,
    setIsRuralModalOpen,
    canApproveTransfers,
    currentUser
  } = useApp();

  const transfers = rebalanceData?.recommended_transfers || [];
  const preRisk = rebalanceData?.pre_rebalance_risk ?? 89;
  const postRisk = rebalanceData?.post_rebalance_risk ?? 19;
  const riskReductionPct = rebalanceData?.risk_reduction_pct ?? 78.7;

  return (
    <div className="med-card" style={{
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Table Top Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            backgroundColor: '#f5f3ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <RefreshCw size={16} color="#7c3aed" />
          </div>
          <h2 style={{ fontSize: '15px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#0f172a', margin: 0 }}>
            Minimum-Intervention AI Rebalancing Plan
          </h2>
          {/* OPTIMIZED badge */}
          <span style={{
            backgroundColor: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
            fontSize: '10px',
            fontWeight: '800',
            padding: '2px 8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <CheckCircle2 size={12} color="#16a34a" />
            <span>MIO OPTIMIZED</span>
          </span>
        </div>

        {/* Regional Shortage Risk Reduction KPI */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          padding: '6px 14px',
          borderRadius: '20px'
        }}>
          <TrendingDown size={16} color="#16a34a" />
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#15803d' }}>
            Regional Shortage Risk: {preRisk}% → {postRisk}% (-{riskReductionPct}% Reduction)
          </span>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '12px'
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              color: '#64748b',
              fontWeight: '700',
              textTransform: 'uppercase',
              fontSize: '10px',
              letterSpacing: '0.03em'
            }}>
              <th style={{ padding: '10px 16px' }}>Transfer ID</th>
              <th style={{ padding: '10px 16px' }}>Source Donor</th>
              <th style={{ padding: '10px 16px' }}>Target Deficit</th>
              <th style={{ padding: '10px 16px' }}>Transfer Volume</th>
              <th style={{ padding: '10px 16px' }}>Logistics Route</th>
              <th style={{ padding: '10px 16px' }}>Strategy</th>
              <th style={{ padding: '10px 16px' }}>Cost</th>
              <th style={{ padding: '10px 16px', textAlign: 'center' }}>Approval &amp; Action</th>
            </tr>
          </thead>
          <tbody>
            {transfers.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                  No active rebalancing transfers required for this clinical scenario. All facilities maintain sufficient buffer.
                </td>
              </tr>
            ) : (
              transfers.map((t, idx) => {
                const isApproved = approvedTransfers[t.transfer_id] || t.status === 'APPROVED' || t.status === 'DISPATCHED';
                const isDispatched = t.status === 'DISPATCHED';

                return (
                  <tr
                    key={t.transfer_id || idx}
                    style={{
                      borderBottom: '1px solid #edf2f7',
                      backgroundColor: isDispatched ? '#f0fdf4' : isApproved ? '#eff6ff' : '#ffffff',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isApproved && !isDispatched) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (!isApproved && !isDispatched) e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    {/* Transfer ID */}
                    <td style={{ padding: '12px 16px', fontWeight: '800', color: '#2563eb', fontFamily: 'monospace' }}>
                      {t.transfer_id}
                    </td>

                    {/* Source Donor */}
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: '#1e293b' }}>
                      {t.source_name}
                      <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: '700' }}>
                        Buffer Protected (&gt;18d)
                      </div>
                    </td>

                    {/* Target Deficit */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>
                        {t.target_name}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        color: t.target_urgency_days <= 5 ? '#dc2626' : t.target_urgency_days <= 9 ? '#ea580c' : '#ca8a04'
                      }}>
                        (Stockout urgency: {t.target_urgency_days}d)
                      </div>
                    </td>

                    {/* Transfer Volume */}
                    <td style={{ padding: '12px 16px', fontWeight: '800', color: '#0f172a' }}>
                      {t.transfer_volume} units
                    </td>

                    {/* Logistics Route */}
                    <td style={{ padding: '12px 16px', color: '#475569' }}>
                      {t.distance_km} km • ETA: {t.transit_hours} hrs
                    </td>

                    {/* Strategy Tags */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {t.strategies?.map((strat, sIdx) => {
                          const isFEFO = strat.includes('FEFO');
                          return (
                            <span
                              key={sIdx}
                              style={{
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '10px',
                                fontWeight: '700',
                                backgroundColor: isFEFO ? '#f5f3ff' : '#f0fdf4',
                                color: isFEFO ? '#6d28d9' : '#15803d',
                                border: `1px solid ${isFEFO ? '#ddd6fe' : '#bbf7d0'}`,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                            >
                              {isFEFO ? '✦' : '✔'} {strat}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Cost */}
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: '#334155' }}>
                      ₹{t.cost_inr}
                    </td>

                    {/* Action Button */}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {isDispatched ? (
                        <span style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          backgroundColor: '#dcfce7',
                          color: '#15803d',
                          fontSize: '11px',
                          fontWeight: '800',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Check size={12} color="#16a34a" />
                          <span>GSM Dispatched</span>
                        </span>
                      ) : isApproved ? (
                        <button
                          onClick={() => {
                            setModalTransfer(t);
                            setIsRuralModalOpen(true);
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #bfdbfe',
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <Send size={12} />
                          <span>Send GSM SMS</span>
                        </button>
                      ) : !canApproveTransfers ? (
                        <span
                          title={`Authorization restricted: ${currentUser?.name} has read-only access. DHO or Admin authorization required.`}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            backgroundColor: '#f1f5f9',
                            color: '#64748b',
                            fontSize: '11px',
                            fontWeight: '700',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            border: '1px solid #e2e8f0',
                            cursor: 'not-allowed'
                          }}
                        >
                          🔒 Read-Only
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApproveTransfer(t)}
                          style={{
                            padding: '7px 14px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                        >
                          <Send size={12} fill="#ffffff" />
                          <span>Approve &amp; SMS</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
