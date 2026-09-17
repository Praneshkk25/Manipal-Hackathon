import React from 'react';
import { ShieldCheck, Clock, UserCheck, Activity, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AuditTrailView() {
  const { auditTrail, selectedMedicine } = useApp();
  const [search, setSearch] = React.useState('');

  const filtered = auditTrail.filter(entry => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      entry.action.toLowerCase().includes(term) ||
      entry.user_role.toLowerCase().includes(term) ||
      JSON.stringify(entry.details).toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ padding: '8px 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div className="med-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={22} color="#2563eb" />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#0f172a' }}>
              Operational Audit Trail &amp; Governance Ledger
            </h2>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Immutable chronological record of approvals, SMS transmissions, parameter shifts, and clinical interventions
            </p>
          </div>
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} color="#64748b" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input
            type="text"
            placeholder="Search audit actions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 10px 7px 32px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '12px',
              outline: 'none',
              color: '#0f172a'
            }}
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="med-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.03em' }}>
                <th style={{ padding: '12px 16px' }}>Event ID</th>
                <th style={{ padding: '12px 16px' }}>Timestamp (IST)</th>
                <th style={{ padding: '12px 16px' }}>Authorized Role</th>
                <th style={{ padding: '12px 16px' }}>Action</th>
                <th style={{ padding: '12px 16px' }}>Operational Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => {
                const isApproval = entry.action === 'TRANSFER_APPROVED';
                const isSms = entry.action === 'SMS_DISPATCHED';
                const isSettings = entry.action === 'SETTINGS_SAVED' || entry.action === 'SETTINGS_UPDATE';

                return (
                  <tr key={entry.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '800', color: '#2563eb', fontFamily: 'monospace' }}>
                      {entry.id}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#475569', whiteSpace: 'nowrap' }}>
                      {entry.timestamp}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0f172a' }}>
                      {entry.user_role}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '10px',
                        fontWeight: '800',
                        backgroundColor: isApproval ? '#dcfce7' : isSms ? '#eff6ff' : isSettings ? '#fef3c7' : '#f1f5f9',
                        color: isApproval ? '#15803d' : isSms ? '#1d4ed8' : isSettings ? '#92400e' : '#475569'
                      }}>
                        {entry.action}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>
                      <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '11px', whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(entry.details, null, 2)}
                      </pre>
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
