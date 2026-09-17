import React, { useState } from 'react';
import {
  HeartPulse,
  Users,
  ShieldCheck,
  AlertTriangle,
  TrendingDown,
  Building2,
  ArrowRight,
  Activity,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PatientImpactSimulator() {
  const {
    selectedMedicine,
    simData,
    rebalanceData,
    patientImpactData,
    openFacilityDrawer
  } = useApp();

  const [mobilityKm, setMobilityKm] = useState(35);
  const [vulnerabilityFactor, setVulnerabilityFactor] = useState(1.2);

  const medicineName = selectedMedicine?.name || 'Amoxicillin + Clavulanic Acid 625mg';
  const facilities = simData?.facilities || [];

  // Dynamic calculated patient impact
  const totalPatientsAtRisk = Math.round(patientImpactData.baselinePatientsAtRisk * (vulnerabilityFactor));
  const patientsProtected = Math.round(patientImpactData.patientsProtected * (vulnerabilityFactor));
  const residualRisk = Math.max(90, totalPatientsAtRisk - patientsProtected);

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
        background: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)',
        borderLeft: '5px solid #9333ea'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: '#f3e8ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <HeartPulse size={24} color="#9333ea" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '19px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#0f172a', margin: 0 }}>
                Patient Impact Simulator
              </h1>
              <span style={{
                fontSize: '10px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: '#f3e8ff',
                color: '#7e22ce',
                border: '1px solid #e9d5ff'
              }}>
                HUMAN HEALTH CONVERSION
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', margin: 0 }}>
              Translating inventory deficits directly into patient interruptions &amp; protected human lives • Context: <b style={{ color: '#9333ea' }}>{medicineName}</b>
            </p>
          </div>
        </div>
      </div>

      {/* Human Impact Cascade Pipeline */}
      <div className="med-card" style={{ padding: '20px' }}>
        <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '14px' }}>
          Epidemiological Shortage-To-Patient Cascade Model
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#991b1b' }}>1. SHELF SHORTAGE</div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#dc2626', marginTop: '2px' }}>0 Units Stock</div>
            <div style={{ fontSize: '10px', color: '#b91c1c' }}>At Epicenter PHC</div>
          </div>

          <div style={{ textAlign: 'center', color: '#94a3b8' }}>➔</div>

          <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#fff7ed', border: '1px solid #fed7aa', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#9a3412' }}>2. UNMET RX</div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#ea580c', marginTop: '2px' }}>70 / day</div>
            <div style={{ fontSize: '10px', color: '#c2410c' }}>Prescriptions Denied</div>
          </div>

          <div style={{ textAlign: 'center', color: '#94a3b8' }}>➔</div>

          <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#6b21a8' }}>3. PATIENT DRIFT</div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#7e22ce', marginTop: '2px' }}>+128 / day</div>
            <div style={{ fontSize: '10px', color: '#9333ea' }}>Wandering Migration</div>
          </div>

          <div style={{ textAlign: 'center', color: '#94a3b8' }}>➔</div>

          <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#1e40af' }}>4. NEIGHBOR DRAIN</div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#1d4ed8', marginTop: '2px' }}>3.2x Velocity</div>
            <div style={{ fontSize: '10px', color: '#2563eb' }}>Buffer Depletion</div>
          </div>

          <div style={{ textAlign: 'center', color: '#94a3b8' }}>➔</div>

          <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#166534' }}>5. AI PROTECTION</div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#15803d', marginTop: '2px' }}>~{patientsProtected} Saved</div>
            <div style={{ fontSize: '10px', color: '#16a34a' }}>Cascade Contained</div>
          </div>
        </div>
      </div>

      {/* Dual Comparative Cards: Without vs. With Intervention */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Without Intervention */}
        <div className="med-card" style={{ padding: '22px', borderLeft: '4px solid #ef4444', backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            WITHOUT AI INTERVENTION
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#dc2626', fontFamily: 'var(--font-heading)', marginTop: '6px' }}>
            {totalPatientsAtRisk.toLocaleString()}
          </div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#991b1b', marginTop: '2px' }}>
            Patient Treatment Interruptions at Risk
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', fontSize: '12px', color: '#7f1d1d' }}>
            <div>🏥 <b>5 Facilities</b> pushed into acute secondary stockouts</div>
            <div>💊 <b>3 Critical Medicines</b> experience compounding stockout cascades</div>
            <div>⏱️ <b>Day 4.2</b> mark when the regional cascade failure begins</div>
            <div>⚠️ High risk of antibiotic resistance due to treatment dropouts</div>
          </div>
        </div>

        {/* With AI Intervention */}
        <div className="med-card" style={{ padding: '22px', borderLeft: '4px solid #16a34a', backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            WITH MEDRIPPLE AI PRECISION REBALANCE
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#15803d', fontFamily: 'var(--font-heading)', marginTop: '6px' }}>
            {residualRisk.toLocaleString()}
          </div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#166534', marginTop: '2px' }}>
            Residual Patient Exposure (Cascade Contained)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', fontSize: '12px', color: '#14532d' }}>
            <div>🛡️ <b>~{patientsProtected.toLocaleString()} Patient Visits Protected</b> across the network</div>
            <div>🏥 <b>1 Facility Strained</b> (stabilized within 48h through donor floor transfer)</div>
            <div>🚚 <b>340 Units Rebalanced</b> with zero disruption to donor facility buffer</div>
            <div>✅ 100% vital prescriptions fulfilled for urgent maternal &amp; pediatric care</div>
          </div>
        </div>
      </div>

      {/* Interactive Sliders to Test Sensitivity */}
      <div className="med-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginBottom: '14px' }}>
          Epidemiological Parameter Sensitivity Sandbox
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ fontWeight: '700', color: '#475569' }}>Patient Migration Radius Threshold</span>
              <span style={{ fontWeight: '800', color: '#2563eb' }}>{mobilityKm} km road distance</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={mobilityKm}
              onChange={(e) => setMobilityKm(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              Average road transit distance rural patients are willing to travel to fill essential prescriptions.
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ fontWeight: '700', color: '#475569' }}>Seasonal Outpatient Surge Multiplier</span>
              <span style={{ fontWeight: '800', color: '#9333ea' }}>{vulnerabilityFactor.toFixed(1)}x Normal</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.0"
              step="0.1"
              value={vulnerabilityFactor}
              onChange={(e) => setVulnerabilityFactor(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#9333ea', cursor: 'pointer' }}
            />
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              Multiplies patient load during monsoon, viral outbreaks, or seasonal epidemiological spikes.
            </div>
          </div>
        </div>
      </div>

      {/* Facility-Level Human Impact Table */}
      <div className="med-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
          Facility-Level Patient Protection Roster
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: '700' }}>
                <th style={{ padding: '10px 12px' }}>Facility</th>
                <th style={{ padding: '10px 12px' }}>Daily Patients</th>
                <th style={{ padding: '10px 12px' }}>Days of Supply</th>
                <th style={{ padding: '10px 12px' }}>Patients at Risk</th>
                <th style={{ padding: '10px 12px' }}>Patients Protected</th>
                <th style={{ padding: '10px 12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {facilities.slice(0, 6).map((f) => {
                const atRisk = Math.round(f.daily_consumption * (f.status === 'CRITICAL' ? 4.5 : f.status === 'APPROACHING' ? 2.5 : 0.8));
                const protectedPts = Math.round(atRisk * 0.82);
                return (
                  <tr key={f.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 12px', fontWeight: '700', color: '#0f172a' }}>
                      {f.name}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#475569' }}>
                      {f.daily_consumption} pts/day
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: '700', color: f.days_until_stockout <= 5 ? '#dc2626' : '#15803d' }}>
                      {f.days_until_stockout} days
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: '700', color: '#dc2626' }}>
                      {atRisk} visits
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: '700', color: '#15803d' }}>
                      +{protectedPts} visits ✓
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <button
                        onClick={() => openFacilityDrawer(f.id)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#f8fafc',
                          color: '#2563eb',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
