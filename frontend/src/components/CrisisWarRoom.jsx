import React, { useState } from 'react';
import {
  Gamepad2,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Users,
  Truck,
  Building2,
  Radio,
  Clock,
  ShieldCheck,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const INTERVENTIONS_LIST = [
  { id: 'TRANSFER_340', label: '📦 Transfer 340 Units (Salem CHC → Tiruchengode)', category: 'PRECISION_LOGISTICS', impactScore: -38, savedPts: 540 },
  { id: 'DEPOT_EMERGENCY', label: '🏥 Activate Coimbatore Depot Emergency Buffer', category: 'REGIONAL_BUFFER', impactScore: -22, savedPts: 320 },
  { id: 'SMS_ALERT', label: '📱 Broadcast 2G SMS Protocol to 7 Rural PHCs', category: 'RURAL_GSM', impactScore: -12, savedPts: 180 },
  { id: 'REDIRECT_PATIENTS', label: '🚑 Active Patient Drift Redirection Notice', category: 'PATIENT_TRIAGE', impactScore: -8, savedPts: 120 },
  { id: 'ALTERNATE_ROUTE', label: '🚧 Re-route via State Highway SH-86 (Avoid NH-544)', category: 'CORRIDOR_INTELLIGENCE', impactScore: -6, savedPts: 80 }
];

const CRISIS_DAYS = [
  { day: 0, title: 'Day 0', subtitle: 'Supplier Delay', desc: 'Consignment delayed +15 days at container freight station.' },
  { day: 1, title: 'Day 1', subtitle: 'Shelf Drawdown', desc: 'Daily burn rate accelerates at epicenter clinic.' },
  { day: 3, title: 'Day 3', subtitle: 'Stockout Predicted', desc: 'Stock falls under critical 5.0-day threshold.' },
  { day: 4, title: 'Day 4', subtitle: 'Patient Spillover', desc: '128 patients/day begin migrating to neighboring clinics.' },
  { day: 6, title: 'Day 6', subtitle: 'Neighbor Strain', desc: 'Namakkal PHC burn rate spikes +42%.' },
  { day: 7, title: 'Day 7', subtitle: 'Regional Crisis', desc: 'Secondary healthcare tier collapses without intervention.' }
];

export default function CrisisWarRoom() {
  const {
    selectedMedicine,
    simData,
    patientImpactData,
    warRoomState,
    runWarRoomScenario,
    handleSynthesizeRebalance,
    showToast
  } = useApp();

  const [activeDay, setActiveDay] = useState(4);
  const [selectedInterventions, setSelectedInterventions] = useState(['TRANSFER_340', 'SMS_ALERT']);

  const medicineName = selectedMedicine?.name || 'Amoxicillin + Clavulanic Acid 625mg';

  const toggleIntervention = (id) => {
    setSelectedInterventions(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleRunSimulation = () => {
    runWarRoomScenario(selectedInterventions, activeDay);
  };

  const handleReset = () => {
    setSelectedInterventions(['TRANSFER_340', 'SMS_ALERT']);
    setActiveDay(4);
    runWarRoomScenario(['TRANSFER_340', 'SMS_ALERT'], 4);
    showToast('info', 'War Room scenario reset to standard crisis conditions.');
  };

  const handleApplyToSystem = async () => {
    await handleSynthesizeRebalance();
    showToast('success', 'War Room strategy approved and synchronized across entire digital twin!');
  };

  const result = warRoomState.simulatedResult;

  return (
    <div style={{ padding: '8px 24px 32px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div className="med-card" style={{
        padding: '18px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        backgroundColor: '#0f172a',
        color: '#ffffff',
        borderLeft: '5px solid #ef4444'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(220, 38, 38, 0.5)'
          }}>
            <Gamepad2 size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '19px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#ffffff', margin: 0 }}>
                Healthcare Crisis War-Room
              </h1>
              <span style={{
                fontSize: '10px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '10px',
                backgroundColor: '#7f1d1d',
                color: '#fca5a5',
                border: '1px solid #ef4444'
              }}>
                SIMULATION HORIZON: DAY {activeDay} / 14
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px', margin: 0 }}>
              Live tactical testing environment for multi-agency healthcare disruption response • Context: <b style={{ color: '#60a5fa' }}>{medicineName}</b>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid #475569',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          <button
            onClick={handleRunSimulation}
            disabled={warRoomState.isExecuting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(37, 99, 235, 0.4)'
            }}
          >
            <Play size={13} fill="#ffffff" />
            <span>{warRoomState.isExecuting ? 'Computing...' : 'Run Scenario'}</span>
          </button>
        </div>
      </div>

      {/* Stepped Crisis Day Progression */}
      <div className="med-card" style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '10px' }}>
          Crisis Progression Stage (Select Day to Test)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
          {CRISIS_DAYS.map((cd) => {
            const isSelected = activeDay === cd.day;
            return (
              <div
                key={cd.day}
                onClick={() => setActiveDay(cd.day)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? '#eff6ff' : '#f8fafc',
                  border: `1.5px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: isSelected ? '#1d4ed8' : '#0f172a' }}>
                    {cd.title}
                  </span>
                  {isSelected && (
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
                  )}
                </div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: isSelected ? '#2563eb' : '#475569', marginTop: '2px' }}>
                  {cd.subtitle}
                </div>
                <p style={{ fontSize: '10px', color: '#64748b', marginTop: '2px', lineHeight: '1.2' }}>
                  {cd.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column War Room Interface: Interventions vs. Scenario Consequence */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '20px' }}>
        {/* Left: What Should We Simulate? */}
        <div className="med-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Tactical Interventions (Select Strategies)
            </h2>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '3px', margin: 0 }}>
              Combine multiple logistical and epidemiological countermeasures to evaluate resilience:
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {INTERVENTIONS_LIST.map((item) => {
              const isChecked = selectedInterventions.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleIntervention(item.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: isChecked ? '#f0fdf4' : '#ffffff',
                    border: `1.5px solid ${isChecked ? '#86efac' : '#e2e8f0'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // Handled by container
                      style={{ width: '16px', height: '16px', accentColor: '#16a34a', cursor: 'pointer' }}
                    />
                    <div>
                      <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#0f172a' }}>
                        {item.label}
                      </span>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '1px' }}>
                        Category: {item.category.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#15803d',
                    backgroundColor: '#dcfce7',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.impactScore} pts risk
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
            <button
              onClick={handleRunSimulation}
              disabled={warRoomState.isExecuting || selectedInterventions.length === 0}
              style={{
                padding: '9px 20px',
                borderRadius: '8px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
              }}
            >
              <Play size={14} fill="#ffffff" />
              <span>Simulate Selected Interventions ({selectedInterventions.length})</span>
            </button>
          </div>
        </div>

        {/* Right: Simulation Results & Impact Evaluation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="med-card" style={{ padding: '22px', borderLeft: '4px solid #2563eb' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={17} color="#2563eb" />
              <span>Simulated Consequence Comparison</span>
            </h3>

            {/* Before vs After Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#991b1b', textTransform: 'uppercase' }}>
                  WITHOUT INTERVENTION
                </div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#dc2626', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                  {result?.beforeRisk || 84} / 100
                </div>
                <div style={{ fontSize: '11px', color: '#b91c1c', marginTop: '2px' }}>
                  Ripple Score (Crisis)
                </div>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '6px' }}>
                  👥 <b>{result?.beforePatients?.toLocaleString() || '1,240'}</b> patients at risk<br />
                  🏥 <b>{result?.beforeCritical || 4}</b> facilities depleted
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>
                  WITH WAR-ROOM PLAN
                </div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#15803d', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                  {result?.afterRisk || 36} / 100
                </div>
                <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '2px' }}>
                  Stable Network (-{result?.riskReductionPct || 57}%)
                </div>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '6px' }}>
                  👥 <b>{result?.afterPatients?.toLocaleString() || '210'}</b> residual risk<br />
                  🏥 <b>{result?.afterCritical || 1}</b> facility contained
                </div>
              </div>
            </div>

            {/* Human Impact Highlight */}
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Users size={16} color="#1d4ed8" />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#1e3a8a' }}>
                  ~{result?.patientsSaved?.toLocaleString() || '1,030'} Patient Interruptions Avoided
                </div>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '1px' }}>
                  *Model simulation estimate based on multi-corridor gravity diffusion.
                </div>
              </div>
            </div>

            <button
              onClick={handleApplyToSystem}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                border: 'none',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)'
              }}
            >
              <CheckCircle2 size={15} />
              <span>Approve &amp; Synchronize Strategy to Live Network</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
