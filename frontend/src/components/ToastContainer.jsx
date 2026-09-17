import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 250,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '380px',
      width: '100%',
      pointerEvents: 'none'
    }}>
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        const bgColor = isSuccess ? '#f0fdf4' : isWarning ? '#fff7ed' : isError ? '#fef2f2' : '#eff6ff';
        const borderColor = isSuccess ? '#86efac' : isWarning ? '#fed7aa' : isError ? '#fca5a5' : '#bfdbfe';
        const textColor = isSuccess ? '#166534' : isWarning ? '#9a3412' : isError ? '#991b1b' : '#1e40af';
        const Icon = isSuccess ? CheckCircle2 : isWarning ? AlertTriangle : isError ? AlertCircle : Info;
        const iconColor = isSuccess ? '#16a34a' : isWarning ? '#ea580c' : isError ? '#dc2626' : '#2563eb';

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              backgroundColor: bgColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '10px',
              padding: '12px 14px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              animation: 'slideUp 0.2s ease-out'
            }}
          >
            <Icon size={18} color={iconColor} style={{ marginTop: '1px', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              {toast.title && (
                <div style={{ fontSize: '12px', fontWeight: '800', color: textColor, marginBottom: '2px' }}>
                  {toast.title}
                </div>
              )}
              <div style={{ fontSize: '12px', color: textColor, lineHeight: '1.4' }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                border: 'none',
                background: 'none',
                color: textColor,
                opacity: 0.6,
                cursor: 'pointer',
                padding: '2px',
                flexShrink: 0
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
