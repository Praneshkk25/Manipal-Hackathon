import React from 'react';
import { AlertTriangle, AlertOctagon, Clock, CheckCircle2, Users, Sprout } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MetricCards() {
  const { simData, settings } = useApp();

  const rippleScore = simData?.ripple_score ?? 84;
  const rippleStatus = simData?.ripple_status ?? 'Critical Crisis';
  const counts = simData?.counts ?? { CRITICAL: 7, APPROACHING: 1, AT_RISK: 4, HEALTHY: 0 };
  const secondarySpillover = simData?.secondary_spillover_rate ?? 128;
  const rescuedUnits = simData?.rescued_from_expiry_units ?? 820;
  const critThreshold = settings?.critical_threshold_days ?? 5.0;
  const donorFloor = settings?.donor_floor_days ?? 18.0;

  // Compute circle circumference and strokeDashoffset for Ripple Score
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const progress = (Math.min(100, Math.max(0, rippleScore)) / 100) * circumference;
  const strokeDashoffset = circumference - progress;

  // Determine score color and status badge styling
  let scoreColor = '#10b981'; // green (0 - 40: Stable)
  let scoreBg = '#f0fdf4';
  let scoreBorder = '#bbf7d0';
  if (rippleScore > 40 && rippleScore <= 70) {
    scoreColor = '#d97706'; // amber (41 - 70: Elevated)
    scoreBg = '#fffbeb';
    scoreBorder = '#fde68a';
  }
  if (rippleScore > 70) {
    scoreColor = '#ef4444'; // red (71 - 100: Critical)
    scoreBg = '#fef2f2';
    scoreBorder = '#fecaca';
  }

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      padding: '16px 24px 8px 24px',
      width: '100%'
    }}>
      {/* 1. The Ripple Score Gauge Card */}
      <div className="med-card" style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flex: '1.2 1 240px',
        minWidth: '235px',
        boxSizing: 'border-box'
      }}>
        <div style={{ position: 'relative', width: '74px', height: '74px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="74" height="74" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#e2e8f0"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke={scoreColor}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              fontSize: '24px',
              fontWeight: '800',
              fontFamily: 'var(--font-heading)',
              color: '#0f172a',
              lineHeight: 1
            }}>
              {rippleScore}
            </span>
            <span style={{
              fontSize: '9px',
              fontWeight: '700',
              color: '#94a3b8',
              marginTop: '1px'
            }}>
              / 100
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.2 }}>
            The Ripple Score
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            width: 'fit-content',
            padding: '2px 7px',
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: '800',
            backgroundColor: scoreBg,
            color: scoreColor,
            border: `1px solid ${scoreBorder}`,
            marginTop: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.02em'
          }}>
            {rippleStatus}
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px' }}>
            Composite risk index
          </div>
        </div>
      </div>

      {/* 2. Critical Shortage */}
      <div className="med-card" style={{
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
        flex: '1 1 145px',
        minWidth: '145px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <AlertTriangle size={18} color="#dc2626" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#dc2626', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
            {counts.CRITICAL ?? 0}
          </div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#991b1b', marginTop: '3px', whiteSpace: 'nowrap' }}>
            Critical Shortage
          </div>
          <div style={{ fontSize: '10px', color: '#b91c1c', whiteSpace: 'nowrap' }}>
            (≤ {critThreshold} days)
          </div>
        </div>
      </div>

      {/* 3. Approaching Shortage */}
      <div className="med-card" style={{
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#fff7ed',
        borderColor: '#fed7aa',
        flex: '1 1 145px',
        minWidth: '145px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: '#ffedd5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <AlertOctagon size={18} color="#ea580c" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#ea580c', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
            {counts.APPROACHING ?? 0}
          </div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#9a3412', marginTop: '3px', whiteSpace: 'nowrap' }}>
            Approaching Shortage
          </div>
          <div style={{ fontSize: '10px', color: '#c2410c', whiteSpace: 'nowrap' }}>
            (6–9 days)
          </div>
        </div>
      </div>

      {/* 4. At Risk Buffer */}
      <div className="med-card" style={{
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#fefce8',
        borderColor: '#fef08a',
        flex: '1 1 145px',
        minWidth: '145px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: '#fef9c3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Clock size={18} color="#ca8a04" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#ca8a04', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
            {counts.AT_RISK ?? 0}
          </div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#854d0e', marginTop: '3px', whiteSpace: 'nowrap' }}>
            At Risk Buffer
          </div>
          <div style={{ fontSize: '10px', color: '#a16207', whiteSpace: 'nowrap' }}>
            (10–{donorFloor} days)
          </div>
        </div>
      </div>

      {/* 5. Healthy Buffer */}
      <div className="med-card" style={{
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#f0fdf4',
        borderColor: '#bbf7d0',
        flex: '1 1 145px',
        minWidth: '145px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: '#dcfce7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <CheckCircle2 size={18} color="#16a34a" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#16a34a', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
            {counts.HEALTHY ?? 0}
          </div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#166534', marginTop: '3px', whiteSpace: 'nowrap' }}>
            Healthy Buffer
          </div>
          <div style={{ fontSize: '10px', color: '#15803d', whiteSpace: 'nowrap' }}>
            (&gt; {donorFloor} days)
          </div>
        </div>
      </div>

      {/* 6. Secondary Spillover Rate */}
      <div className="med-card" style={{
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#faf5ff',
        borderColor: '#e9d5ff',
        flex: '1 1 145px',
        minWidth: '145px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: '#f3e8ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Users size={18} color="#9333ea" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#7e22ce', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
            +{secondarySpillover}
          </div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#6b21a8', marginTop: '3px', whiteSpace: 'nowrap' }}>
            patients / day
          </div>
          <div style={{ fontSize: '10px', color: '#9333ea', whiteSpace: 'nowrap' }}>
            Secondary Spillover
          </div>
        </div>
      </div>

      {/* 7. Rescued from Expiry */}
      <div className="med-card" style={{
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#f0fdf4',
        borderColor: '#bbf7d0',
        flex: '1 1 145px',
        minWidth: '145px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: '#dcfce7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Sprout size={18} color="#16a34a" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#15803d', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
            {rescuedUnits.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#166534', marginTop: '3px', whiteSpace: 'nowrap' }}>
            units
          </div>
          <div style={{ fontSize: '10px', color: '#15803d', whiteSpace: 'nowrap' }}>
            Rescued via FEFO (&lt;{settings.expiry_window_days}d)
          </div>
        </div>
      </div>
    </div>
  );
}
