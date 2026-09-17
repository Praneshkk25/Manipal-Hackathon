import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertTriangle, CheckCircle2, RotateCcw, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SettingsView() {
  const { settings, handleUpdateSettings, medicines, backendStatus, canEditSettings, currentUser } = useApp();

  const [criticalThreshold, setCriticalThreshold] = useState(settings.critical_threshold_days || 5.0);
  const [donorFloor, setDonorFloor] = useState(settings.donor_floor_days || 18.0);
  const [expiryWindow, setExpiryWindow] = useState(settings.expiry_window_days || 45);
  const [gatewayHost, setGatewayHost] = useState(settings.fastapi_gateway_host || 'http://localhost:8000');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setCriticalThreshold(settings.critical_threshold_days);
    setDonorFloor(settings.donor_floor_days);
    setExpiryWindow(settings.expiry_window_days);
    setGatewayHost(settings.fastapi_gateway_host);
  }, [settings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const crit = parseFloat(criticalThreshold);
    const donor = parseFloat(donorFloor);
    const expiry = parseInt(expiryWindow, 10);

    if (isNaN(crit) || crit <= 0 || crit > 20) {
      setErrorMsg('Critical Stockout Threshold must be a positive number between 0.5 and 20 days.');
      return;
    }

    if (isNaN(donor) || donor <= crit) {
      setErrorMsg(`Donor Buffer Protection Floor (${donor}d) must be strictly greater than the Critical Threshold (${crit}d).`);
      return;
    }

    if (isNaN(expiry) || expiry <= 0 || expiry > 180) {
      setErrorMsg('FEFO Expiry Window must be between 10 and 180 days.');
      return;
    }

    handleUpdateSettings({
      critical_threshold_days: crit,
      donor_floor_days: donor,
      expiry_window_days: expiry,
      fastapi_gateway_host: gatewayHost
    });
  };

  const handleResetDefaults = () => {
    setCriticalThreshold(5.0);
    setDonorFloor(18.0);
    setExpiryWindow(45);
    setGatewayHost('http://localhost:8000');
    setErrorMsg('');
  };

  return (
    <div style={{ padding: '8px 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '780px' }}>
      {/* Header Card */}
      <div className="med-card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Settings size={20} color="#2563eb" />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#0f172a' }}>
              System Configuration &amp; Operational Thresholds
            </h2>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Configure clinical triage triggers, safety buffer floors, and gateway connectivity for the Tamil Nadu Digital Twin
            </p>
          </div>
        </div>
      </div>

      {/* Validation error if any */}
      {errorMsg && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '12px',
          color: '#991b1b'
        }}>
          <AlertTriangle size={16} color="#dc2626" />
          <span><b>Validation Alert:</b> {errorMsg}</span>
        </div>
      )}

      {/* Administrative Protection Banner */}
      {!canEditSettings && (
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1.5px solid #bfdbfe',
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '12.5px',
          color: '#1e40af'
        }}>
          <Shield size={18} color="#2563eb" style={{ flexShrink: 0 }} />
          <span>
            <b>Administrative Privilege Required:</b> System configuration is restricted to <b>System Admin (Suresh Narayanan, IAS)</b>. Active session (<b>{currentUser?.name}</b>) has read-only access.
          </span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="med-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Field 1: Critical Stockout Threshold */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
              Critical Stockout Threshold (Days)
            </label>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#dc2626', backgroundColor: '#fef2f2', padding: '2px 8px', borderRadius: '4px' }}>
              Triage Level 1 Trigger
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
            Facilities with projected stock below or equal to this threshold trigger active <b>CRITICAL</b> shortage status and patient migration modeling.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="20"
              value={criticalThreshold}
              onChange={(e) => setCriticalThreshold(e.target.value)}
              style={{
                width: '140px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                fontWeight: '700',
                color: '#0f172a'
              }}
            />
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>days (Default: 5.0 days)</span>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

        {/* Field 2: Donor Buffer Protection Floor */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
              Donor Buffer Protection Floor (Days)
            </label>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#166534', backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: '4px' }}>
              Safety Floor Protection
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
            The Minimum-Intervention Optimizer (MIO) will <b>never deplete</b> a donor facility below this safety horizon to guarantee local patient safety.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="number"
              step="0.5"
              min="6"
              max="45"
              value={donorFloor}
              onChange={(e) => setDonorFloor(e.target.value)}
              style={{
                width: '140px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                fontWeight: '700',
                color: '#0f172a'
              }}
            />
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>days (Default: 18.0 days)</span>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

        {/* Field 3: FEFO Expiry Window */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
              FEFO Expiry Window (Days)
            </label>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#6d28d9', backgroundColor: '#f5f3ff', padding: '2px 8px', borderRadius: '4px' }}>
              Wastage Prevention Horizon
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
            Medicines expiring within this window are designated for prioritized burn and rescue reallocation to high-consumption centers before expiry.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="number"
              step="1"
              min="10"
              max="180"
              value={expiryWindow}
              onChange={(e) => setExpiryWindow(e.target.value)}
              style={{
                width: '140px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                fontWeight: '700',
                color: '#0f172a'
              }}
            />
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>days (Default: 45 days)</span>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

        {/* Field 4: Readonly System Attributes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '12px' }}>
          <div>
            <span style={{ display: 'block', color: '#64748b', marginBottom: '4px' }}>Monitored Essential Medicines</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{medicines.length} Dynamic Formulations</span>
          </div>
          <div>
            <span style={{ display: 'block', color: '#64748b', marginBottom: '4px' }}>FastAPI Gateway State</span>
            <span style={{
              fontSize: '13px',
              fontWeight: '700',
              color: backendStatus === 'CONNECTED' ? '#15803d' : '#b91c1c'
            }}>
              {backendStatus === 'CONNECTED' ? '● Connected (Port 8000)' : '○ Standby / Fallback'}
            </span>
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={handleResetDefaults}
            disabled={!canEditSettings}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: '12px',
              fontWeight: '600',
              cursor: !canEditSettings ? 'not-allowed' : 'pointer',
              opacity: !canEditSettings ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>

          <button
            type="submit"
            disabled={!canEditSettings}
            style={{
              padding: '9px 22px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: !canEditSettings ? '#94a3b8' : '#2563eb',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '700',
              cursor: !canEditSettings ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: !canEditSettings ? 'none' : '0 2px 8px rgba(37, 99, 235, 0.3)'
            }}
          >
            <Save size={15} />
            <span>{!canEditSettings ? 'Locked (Admin Only)' : 'Save & Recalculate System'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
