import React, { useState, useEffect } from 'react';
import { Smartphone, X, Send, CheckCircle2, Radio, Copy, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function RuralSmsModal() {
  const {
    isRuralModalOpen,
    setIsRuralModalOpen,
    modalTransfer,
    selectedMedicine,
    handleDispatchSms,
    canDispatchSms,
    currentUser
  } = useApp();

  const medicineName = selectedMedicine?.name || 'Amoxicillin + Clavulanic Acid 625mg';

  const defaultTransfer = {
    transfer_id: 'TR-001',
    source_name: 'Salem District Medical Depot',
    target_name: 'Tiruchengode PHC',
    target_id: 'F_TIRU_PHC',
    transfer_volume: 340,
    transit_hours: 1.7,
    cost_inr: 380
  };

  const targetTransfer = modalTransfer || defaultTransfer;

  const [phone, setPhone] = useState('+91 94421 88301');
  const [nurseName, setNurseName] = useState('Sister Jayalakshmi (PHC In-Charge)');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [lastReceipt, setLastReceipt] = useState('');

  useEffect(() => {
    if (isRuralModalOpen) {
      const generatedMsg = `⚠️ MedRipple AI Alert [DISPATCH #${targetTransfer.transfer_id}]: Emergency rebalancing approved. ${targetTransfer.transfer_volume} units of ${medicineName} dispatched from ${targetTransfer.source_name} to ${targetTransfer.target_name}. Cold-box van ETA: ${targetTransfer.transit_hours} hrs. Reply YES ${targetTransfer.transfer_id} on delivery. - Health Dept TN`;
      setMessage(generatedMsg);
      setIsSent(false);
      setLastReceipt('');
    }
  }, [isRuralModalOpen, modalTransfer, medicineName, targetTransfer.transfer_id, targetTransfer.transfer_volume, targetTransfer.source_name, targetTransfer.target_name, targetTransfer.transit_hours]);

  if (!isRuralModalOpen) return null;

  const handleSend = async () => {
    setSending(true);
    try {
      const res = await handleDispatchSms({
        facility_id: targetTransfer.target_id || 'F_TIRU_PHC',
        recipient_phone: phone,
        recipient_name: nurseName,
        message_text: message,
        dispatch_code: '9821',
        transfer_id: targetTransfer.transfer_id
      });
      setLastReceipt(res?.delivery_receipt || 'AIRTEL-TN-MSG-9821');
      setIsSent(true);
    } catch (err) {
      console.error("SMS Dispatch error:", err);
    } finally {
      setSending(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setIsRuralModalOpen(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div className="med-card" style={{
        maxWidth: '540px',
        width: '100%',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        backgroundColor: '#ffffff'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Smartphone size={20} color="#2563eb" />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#0f172a' }}>
                Rural PHC Low-Bandwidth SMS Gateway
              </h2>
              <p style={{ fontSize: '11px', color: '#64748b' }}>
                Offline cellular resilience for remote healthcare clinics with zero broadband connectivity
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Demo Mode Notice Banner */}
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '11px',
          color: '#15803d',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Radio size={14} color="#16a34a" />
          <span><b>Live Demo GSM Gateway:</b> Simulates direct SMS broadcast to field staff over 2G cellular network via TN State Telephony Gateway.</span>
        </div>

        {/* Target Recipient Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
              Field Recipient
            </label>
            <input
              type="text"
              value={nurseName}
              onChange={(e) => setNurseName(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '12px',
                color: '#0f172a'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
              GSM Mobile Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '12px',
                color: '#0f172a'
              }}
            />
          </div>
        </div>

        {/* SMS Message Payload */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>
              GSM SMS Dispatch Payload ({message.length} chars • {Math.ceil(message.length / 160)} SMS parts)
            </label>
            <button
              onClick={handleCopy}
              style={{
                border: 'none',
                background: 'none',
                fontSize: '11px',
                color: '#2563eb',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              {copied ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: '#0f172a',
              resize: 'none',
              backgroundColor: '#f8fafc'
            }}
          />
        </div>

        {/* Delivery State Banner */}
        {isSent && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '8px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <CheckCircle2 size={18} color="#16a34a" />
            <div style={{ fontSize: '12px', color: '#15803d' }}>
              <b>SMS Dispatched Successfully!</b> Gateway receipt: <span style={{ fontFamily: 'monospace', fontWeight: '800' }}>{lastReceipt}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
          <button
            onClick={handleClose}
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
            Close
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !canDispatchSms}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: !canDispatchSms ? '#94a3b8' : '#2563eb',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: '700',
              cursor: (!canDispatchSms || sending) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: !canDispatchSms ? 'none' : '0 2px 8px rgba(37, 99, 235, 0.3)'
            }}
          >
            <Send size={13} fill="#ffffff" />
            <span>
              {!canDispatchSms
                ? '🔒 DHO/Admin Required'
                : sending
                  ? 'Transmitting via 2G...'
                  : isSent
                    ? 'Re-send SMS'
                    : 'Broadcast via GSM'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
