import React from 'react';
import {
  X,
  Building2,
  Clock,
  Package,
  TrendingUp,
  Truck,
  ShieldCheck,
  AlertTriangle,
  Send,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function FacilityDetailDrawer() {
  const {
    facilityDrawerOpen,
    closeFacilityDrawer,
    selectedFacilityId,
    simData,
    inventoryData,
    insightData,
    selectedMedicine,
    setActiveTab,
    setModalTransfer,
    setIsRuralModalOpen
  } = useApp();

  if (!facilityDrawerOpen || !selectedFacilityId) return null;

  // Locate facility in simData or inventoryData
  const facSim = simData?.facilities?.find(f => f.id === selectedFacilityId);
  const facInv = inventoryData?.inventory?.find(f => f.facility_id === selectedFacilityId);

  const facName = facSim?.name || facInv?.facility_name || selectedFacilityId;
  const facType = facSim?.type_label || facInv?.facility_type || 'Healthcare Facility';
  const currentStock = facSim?.current_stock ?? facInv?.current_stock ?? 0;
  const availableStock = facInv?.available_stock ?? Math.floor(currentStock * 0.85);
  const reservedStock = facInv?.reserved_stock ?? Math.floor(currentStock * 0.15);
  const dailyBurn = facSim?.daily_consumption ?? facInv?.daily_consumption ?? 1;
  const daysUntilStockout = facSim?.days_until_stockout ?? facInv?.days_until_stockout ?? 0;
  const status = facSim?.status ?? facInv?.status ?? 'HEALTHY';
  const supplierEta = facInv?.supplier_eta || `${facSim?.supplier_lead_time_days || 10} days`;
  const expiringSoon = facSim?.expiring_soon_units ?? facInv?.expiring_soon_units ?? 0;
  const incomingStock = facInv?.incoming_stock || 0;
  const spillover = facSim?.spillover_inflow || 0;

  const isCrit = status === 'CRITICAL';
  const isAppr = status === 'APPROACHING';
  const statusColor = isCrit ? '#dc2626' : isAppr ? '#ea580c' : status === 'AT_RISK' ? '#ca8a04' : '#16a34a';
  const statusBg = isCrit ? '#fee2e2' : isAppr ? '#ffedd5' : status === 'AT_RISK' ? '#fef9c3' : '#dcfce7';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(3px)',
      zIndex: 180,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div className="med-card" style={{
        width: '460px',
        maxWidth: '90vw',
        height: '100%',
        borderRadius: 0,
        borderLeft: '1px solid #e2e8f0',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        overflowY: 'auto',
        backgroundColor: '#ffffff',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.15)'
      }}>
        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} color="#2563eb" />
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {facType}
              </span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#0f172a', marginTop: '4px' }}>
              {facName}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '800',
                backgroundColor: statusBg,
                color: statusColor,
                textTransform: 'uppercase'
              }}>
                {status}
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                • Monitored Medicine: <b>{selectedMedicine?.name || 'Essential Medicine'}</b>
              </span>
            </div>
          </div>
          <button
            onClick={closeFacilityDrawer}
            style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Primary Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Days to Stockout</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: statusColor, fontFamily: 'var(--font-heading)', marginTop: '2px' }}>
              {daysUntilStockout} days
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>Critical floor: ≤ 5.0d</div>
          </div>

          <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Current Stock</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', fontFamily: 'var(--font-heading)', marginTop: '2px' }}>
              {currentStock.toLocaleString()}
            </div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Units on facility shelf</div>
          </div>

          <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Daily Burn Rate</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#ea580c', fontFamily: 'var(--font-heading)', marginTop: '2px' }}>
              {dailyBurn} units/day
            </div>
            {spillover > 0 && (
              <div style={{ fontSize: '10px', color: '#9333ea', fontWeight: '700' }}>+{spillover} patient spillover</div>
            )}
          </div>

          <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Supplier Lead Time</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#2563eb', fontFamily: 'var(--font-heading)', marginTop: '2px' }}>
              {supplierEta}
            </div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Replenishment cycle</div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a', marginBottom: '2px' }}>
            Inventory Position Breakdown
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
            <span>Available (Unreserved) Stock:</span>
            <b>{availableStock.toLocaleString()} units (85%)</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
            <span>Quarantined ICU / Emergency Buffer:</span>
            <b>{reservedStock.toLocaleString()} units (15%)</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
            <span>Incoming Approved Inflow:</span>
            <b style={{ color: incomingStock > 0 ? '#16a34a' : '#64748b' }}>+{incomingStock.toLocaleString()} units</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
            <span>Near-Expiry Units (&lt;45d):</span>
            <b style={{ color: expiringSoon > 0 ? '#7c3aed' : '#64748b' }}>{expiringSoon.toLocaleString()} units</b>
          </div>
        </div>

        {/* Explainable AI Factor Drivers if available */}
        {insightData?.shap_factors && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a' }}>
              Decision Support Risk Factors
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {insightData.shap_factors.map((factor, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#475569', marginBottom: '3px' }}>
                    <span>{factor.name}</span>
                    <b>{factor.percentage}%</b>
                  </div>
                  <div style={{ height: '5px', borderRadius: '3px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                    <div style={{ width: `${factor.percentage}%`, height: '100%', backgroundColor: factor.color || '#2563eb' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <button
            onClick={() => {
              closeFacilityDrawer();
              setActiveTab('rebalancing');
            }}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>View Rebalancing Options</span>
            <ChevronRight size={14} />
          </button>

          <button
            onClick={() => {
              closeFacilityDrawer();
              setModalTransfer({
                transfer_id: 'TR-MANUAL',
                source_name: 'Coimbatore Depot',
                target_id: selectedFacilityId,
                target_name: facName,
                transfer_volume: 250,
                transit_hours: 1.5,
                cost_inr: 300
              });
              setIsRuralModalOpen(true);
            }}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Send size={13} color="#2563eb" />
            <span>Send Direct GSM Dispatch Alert</span>
          </button>
        </div>
      </div>
    </div>
  );
}
