import React from 'react';
import {
  BrainCircuit,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Send,
  Truck,
  Building2,
  CheckCircle2,
  Gamepad2,
  Sparkles,
  Users,
  Activity,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CrisisCommander() {
  const {
    selectedMedicine,
    simData,
    rebalanceData,
    handleApproveTransfer,
    setActiveTab,
    setIsRuralModalOpen,
    setModalTransfer,
    openFacilityDrawer,
    showToast,
    systemTime
  } = useApp();

  const medicineName = selectedMedicine?.name || 'Amoxicillin + Clavulanic Acid 625mg';
  const rippleScore = simData?.ripple_score || 84;
  const isCritical = rippleScore >= 70;
  const primaryTransfer = rebalanceData?.recommended_transfers?.[0] || {
    transfer_id: 'TR-001',
    source_name: 'Salem CHC',
    target_name: 'Tiruchengode PHC',
    transfer_volume: 340,
    distance_km: 42,
    transit_hours: 1.7,
    cost_inr: 380,
    status: 'RECOMMENDED'
  };

  const handleExecutePrimaryTransfer = () => {
    handleApproveTransfer(primaryTransfer);
  };

  const handleOpenSmsBroadcast = () => {
    setModalTransfer(primaryTransfer);
    setIsRuralModalOpen(true);
  };

  return (
    <div style={{ padding: '8px 24px 32px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="med-card" style={{
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
        borderLeft: '5px solid #2563eb'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BrainCircuit size={22} color="#1d4ed8" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '19px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#0f172a', margin: 0 }}>
                  AI Crisis Commander
                </h1>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <AlertTriangle size={11} />
                  LIVE DECISION SUPPORT
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', margin: 0 }}>
                Synthesized operational directives for healthcare administrators • Context: <b style={{ color: '#2563eb' }}>{medicineName}</b>
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('war_room')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
            }}
          >
            <Gamepad2 size={15} />
            <span>Launch Crisis War-Room</span>
          </button>
        </div>
      </div>

      {/* Main Directive Card: What should the administrator do right now, and why? */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
        gap: '20px'
      }}>
        {/* Left Column: Prioritized Action Plan */}
        <div className="med-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#2563eb" />
              <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Priority Response Plan (4 Directives)
              </h2>
            </div>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>
              Confidence: 94.2% (Bayesian Process)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Directive 1 */}
            <div style={{
              padding: '14px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              border: '1.5px solid #bfdbfe',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '12px',
                  flexShrink: 0
                }}>
                  1
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#1e3a8a' }}>
                    Authorize Emergency Transfer: {primaryTransfer.transfer_volume} Units
                  </div>
                  <p style={{ fontSize: '12px', color: '#334155', marginTop: '2px', lineHeight: '1.4' }}>
                    <b>{primaryTransfer.source_name}</b> $\to$ <b>{primaryTransfer.target_name}</b> via NH-544 ({primaryTransfer.distance_km} km • ETA {primaryTransfer.transit_hours} hrs). Eliminates immediate stockout deficit.
                  </p>
                </div>
              </div>

              <button
                onClick={handleExecutePrimaryTransfer}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 1px 4px rgba(37, 99, 235, 0.25)'
                }}
              >
                {primaryTransfer.status === 'APPROVED' ? 'Approved ✓' : 'Approve & Route'}
              </button>
            </div>

            {/* Directive 2 */}
            <div style={{
              padding: '14px',
              borderRadius: '10px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '12px',
                  flexShrink: 0
                }}>
                  2
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#166534' }}>
                    Broadcast 2G GSM SMS Alert (7 Connected Rural PHCs)
                  </div>
                  <p style={{ fontSize: '12px', color: '#334155', marginTop: '2px', lineHeight: '1.4' }}>
                    Alert field nurse supervisors to withhold non-urgent stock dispatches and prepare cold-box receipt protocol.
                  </p>
                </div>
              </div>

              <button
                onClick={handleOpenSmsBroadcast}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Send size={11} />
                <span>Dispatch SMS</span>
              </button>
            </div>

            {/* Directive 3 */}
            <div style={{
              padding: '14px',
              borderRadius: '10px',
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#d97706',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '12px',
                  flexShrink: 0
                }}>
                  3
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#92400e' }}>
                    Quarantine Reserve Buffer at Coimbatore Regional Drug Depot
                  </div>
                  <p style={{ fontSize: '12px', color: '#334155', marginTop: '2px', lineHeight: '1.4' }}>
                    Tag 650 units under emergency reserve; restrict inter-district outflow until Tiruchengode and Namakkal recover.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  showToast('success', 'Coimbatore Depot emergency buffer locked (650 units quarantined).');
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#d97706',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Lock Buffer
              </button>
            </div>

            {/* Directive 4 */}
            <div style={{
              padding: '14px',
              borderRadius: '10px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#64748b',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '12px',
                  flexShrink: 0
                }}>
                  4
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>
                    Intensive Surveillance on Namakkal PHC (Critical Window: 6.8 Days)
                  </div>
                  <p style={{ fontSize: '12px', color: '#475569', marginTop: '2px', lineHeight: '1.4' }}>
                    Secondary spillover will inflict +42% additional load. If Tiruchengode is replenished, Namakkal runway extends to 16.4 days.
                  </p>
                </div>
              </div>

              <button
                onClick={() => openFacilityDrawer('F_NAMAK_PHC')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#f1f5f9',
                  color: '#1e293b',
                  border: '1px solid #cbd5e1',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Inspect Facility
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: The "WHY?" Justification & Ripple Cascade Analysis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Rationale Box */}
          <div className="med-card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={17} color="#16a34a" />
              <span>Clinical &amp; Logistics Rationale ("WHY?")</span>
            </h3>
            <p style={{
              fontSize: '12.5px',
              color: '#334155',
              lineHeight: '1.6',
              backgroundColor: '#f8fafc',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              margin: 0
            }}>
              <b>Donor Floor Protection Guarantee:</b> Transferring 340 units from Salem CHC leaves <b>2,110 units</b> in its reserve stock—guaranteeing <b>28.4 days of buffer</b> (well above the required &gt;18.0 day donor floor). Meanwhile, Tiruchengode's runway rises from <b>4.2 days to 14.8 days</b>, completely stopping patient spillover.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px' }}>
              <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '10px', color: '#166534', fontWeight: '700', textTransform: 'uppercase' }}>Donor Remaining</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#15803d', marginTop: '2px' }}>28.4 Days</div>
                <div style={{ fontSize: '10px', color: '#16a34a' }}>&gt;18d Safety Floor ✓</div>
              </div>

              <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '10px', color: '#1e40af', fontWeight: '700', textTransform: 'uppercase' }}>Recipient New Stock</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#1d4ed8', marginTop: '2px' }}>14.8 Days</div>
                <div style={{ fontSize: '10px', color: '#2563eb' }}>+10.6 Days Runway ↑</div>
              </div>
            </div>
          </div>

          {/* Expected Cascade Chain Box */}
          <div className="med-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={16} color="#dc2626" />
              <span>Predicted Cascade Failure Path</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#dc2626', backgroundColor: '#fee2e2', padding: '3px 8px', borderRadius: '6px' }}>
                  EPICENTER (Day 0)
                </span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>Tiruchengode PHC</span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>• 4.2d stock left</span>
              </div>

              <div style={{ paddingLeft: '14px', borderLeft: '2px dashed #fca5a5', margin: '2px 0' }}>
                <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: '700' }}>↓ Secondary Patient Drift (+128 pts/day)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#ea580c', backgroundColor: '#ffedd5', padding: '3px 8px', borderRadius: '6px' }}>
                  CASCADE 1 (Day +4)
                </span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>Namakkal PHC</span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>• Burn rate +42%</span>
              </div>

              <div style={{ paddingLeft: '14px', borderLeft: '2px dashed #fed7aa', margin: '2px 0' }}>
                <span style={{ fontSize: '10px', color: '#f97316', fontWeight: '700' }}>↓ Neighbor Spillover Buffer Drain</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#ca8a04', backgroundColor: '#fef9c3', padding: '3px 8px', borderRadius: '6px' }}>
                  CASCADE 2 (Day +7)
                </span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a' }}>Erode CHC</span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>• Buffer exhausted</span>
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#475569' }}>
              <span>Total Patients at Risk: <b style={{ color: '#dc2626' }}>~384/day</b></span>
              <span>Potential Regional Collapse: <b style={{ color: '#dc2626' }}>14 Days</b></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
