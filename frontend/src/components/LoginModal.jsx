import React, { useState } from 'react';
import {
  X,
  Shield,
  CheckCircle2,
  Edit3,
  Check,
  RotateCcw
} from 'lucide-react';
import { useApp, DEMO_USERS } from '../context/AppContext';

export default function LoginModal() {
  const {
    loginModalOpen,
    setLoginModalOpen,
    currentUser,
    switchRole,
    updateCurrentUser
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('OBSERVER');
  const [editPermissions, setEditPermissions] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!loginModalOpen) return null;

  const startEdit = () => {
    setEditName(currentUser?.name || '');
    setEditTitle(currentUser?.title || '');
    setEditEmail(currentUser?.email || '');
    setEditRole(currentUser?.role || 'OBSERVER');
    setEditPermissions((currentUser?.permissions || []).join(', '));
    setIsEditing(true);
    setSaveSuccess(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const perms = editPermissions
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    updateCurrentUser({
      name: editName,
      title: editTitle,
      email: editEmail,
      role: editRole,
      avatar: editName ? editName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'US',
      permissions: perms.length > 0 ? perms : ['read only command center', 'view simulations']
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 700);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setLoginModalOpen(false);
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '16px'
      }}
    >
      <div style={{
        maxWidth: '560px',
        width: '100%',
        padding: '24px 26px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
        border: '1px solid #e2e8f0',
        position: 'relative'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#eff6ff',
              border: '1px solid #dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Shield size={22} color="#2563eb" strokeWidth={2.2} />
            </div>
            <div>
              <h2 style={{
                fontSize: '17px',
                fontWeight: '800',
                color: '#0f172a',
                margin: 0,
                letterSpacing: '-0.01em',
                lineHeight: 1.2
              }}>
                Role-Based Healthcare Authentication (RBAC)
              </h2>
              <p style={{
                fontSize: '12px',
                color: '#64748b',
                margin: '3px 0 0 0',
                fontWeight: '500'
              }}>
                Operational security &amp; permission profiles for the MedRipple AI Digital Twin
              </p>
            </div>
          </div>
          <button
            onClick={() => setLoginModalOpen(false)}
            title="Close"
            style={{
              border: 'none',
              background: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#334155'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
          >
            <X size={19} />
          </button>
        </div>

        {/* Current Active User Card */}
        <div style={{
          padding: '14px 18px',
          borderRadius: '12px',
          backgroundColor: '#ffffff',
          border: '1.5px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: currentUser?.badgeColor || '#ea580c',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '14px',
              letterSpacing: '0.02em',
              flexShrink: 0
            }}>
              {currentUser?.avatar || 'JU'}
            </div>
            <div>
              <div style={{ fontSize: '14.5px', fontWeight: '800', color: '#0f172a', lineHeight: 1.2 }}>
                {currentUser?.name}
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px', fontWeight: '500' }}>
                {currentUser?.title} • <span style={{ fontFamily: 'monospace', color: '#64748b' }}>{currentUser?.email}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: '#dcfce7',
              color: '#15803d',
              fontSize: '11px',
              fontWeight: '800',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap'
            }}>
              ACTIVE SESSION
            </span>
          </div>
        </div>

        {/* Edit Profile Form (When toggled open) */}
        {isEditing ? (
          <form onSubmit={handleSaveEdit} style={{
            padding: '16px',
            borderRadius: '10px',
            backgroundColor: '#f8fafc',
            border: '1.5px solid #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#1e293b' }}>
                ✏️ Edit Active Profile &amp; Custom Credentials
              </span>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{ fontSize: '11px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Role Category
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                    fontWeight: '600',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="ADMIN">System Admin</option>
                  <option value="DHO">District Officer (DHO)</option>
                  <option value="HOSPITAL">Facility In-Charge</option>
                  <option value="OBSERVER">Hackathon Observer</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Title / Designation
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                Permissions (comma separated)
              </label>
              <input
                type="text"
                value={editPermissions}
                onChange={(e) => setEditPermissions(e.target.value)}
                placeholder="e.g. read only command center, view simulations, inspect audit"
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '11.5px',
                  fontWeight: '500',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '6px 16px',
                  borderRadius: '6px',
                  backgroundColor: '#15803d',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                {saveSuccess ? <Check size={14} /> : null}
                <span>{saveSuccess ? 'Saved!' : 'Save & Apply Profile'}</span>
              </button>
            </div>
          </form>
        ) : null}

        {/* Demo Fast-Login Accounts Section */}
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: '800',
            color: '#334155',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}>
            SWITCH ROLE PERSPECTIVE (1-CLICK DEMO ACCOUNTS)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {Object.keys(DEMO_USERS).map((key) => {
              const u = DEMO_USERS[key];
              const isCurrent = currentUser?.role === u.role;
              return (
                <div
                  key={u.role}
                  onClick={() => switchRole(u.role)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    border: isCurrent ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                    boxShadow: isCurrent ? '0 0 0 1px #2563eb' : 'none',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrent) e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent) e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: u.badgeColor }}>
                      {u.role === 'ADMIN' ? '👨‍💼 System Admin' :
                       u.role === 'DHO' ? '👨‍⚕️ District Officer (DHO)' :
                       u.role === 'HOSPITAL' ? '🏥 Facility In-Charge' : '👁️ Hackathon Observer'}
                    </span>
                    {isCurrent && (
                      <CheckCircle2 size={16} color="#2563eb" style={{ flexShrink: 0 }} />
                    )}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b', marginTop: '2px' }}>
                    {u.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {u.email}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Permissions Summary */}
        <div style={{
          padding: '11px 16px',
          borderRadius: '8px',
          backgroundColor: '#f1f5f9',
          fontSize: '12px',
          color: '#475569',
          lineHeight: '1.4'
        }}>
          <b style={{ color: '#1e293b' }}>Active Permissions:</b> {(currentUser?.permissions || []).join(', ')}
        </div>

        {/* Actions Bottom Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2px' }}>
          <button
            type="button"
            onClick={startEdit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '7px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              fontSize: '11.5px',
              fontWeight: '700',
              color: '#334155',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.borderColor = '#93c5fd'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
          >
            <Edit3 size={13} color="#2563eb" />
            <span>Edit Profile Credentials</span>
          </button>

          <button
            onClick={() => setLoginModalOpen(false)}
            style={{
              padding: '9px 26px',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2563eb'; }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
