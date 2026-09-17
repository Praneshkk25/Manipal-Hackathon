import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ConfirmationModal() {
  const { confirmModal, closeConfirmation } = useApp();

  if (!confirmModal.isOpen) return null;

  const {
    title,
    message,
    details,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    isDanger = false,
    onConfirm
  } = confirmModal;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: '16px'
    }}>
      <div className="med-card" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '22px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: isDanger ? '#fee2e2' : '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {isDanger ? (
                <AlertCircle size={20} color="#dc2626" />
              ) : (
                <CheckCircle2 size={20} color="#2563eb" />
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#0f172a' }}>
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={closeConfirmation}
            style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Message body */}
        <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
          {message}
        </p>

        {/* Optional key-value details */}
        {details && typeof details === 'object' && (
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '10px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontSize: '12px'
          }}>
            {Object.entries(details).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontWeight: '500' }}>{key}</span>
                <span style={{ color: '#0f172a', fontWeight: '700' }}>{val}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
          <button
            onClick={closeConfirmation}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isDanger ? '#dc2626' : '#2563eb',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: isDanger ? '0 2px 8px rgba(220, 38, 38, 0.3)' : '0 2px 8px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.15s ease'
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
