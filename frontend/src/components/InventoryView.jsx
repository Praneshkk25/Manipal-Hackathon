import React, { useState } from 'react';
import {
  PackageCheck,
  Search,
  ArrowUpDown,
  Filter,
  ChevronRight,
  Download,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function InventoryView() {
  const { inventoryData, selectedMedicine, openFacilityDrawer } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState('days_until_stockout');
  const [sortAsc, setSortAsc] = useState(true);

  const rawItems = inventoryData?.inventory || [];

  // Filter items
  const filteredItems = rawItems.filter(item => {
    const matchesSearch = item.facility_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.facility_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') {
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortAsc ? (aVal - bVal) : (bVal - aVal);
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const medicineName = selectedMedicine?.name || 'Essential Medicine';

  return (
    <div style={{ padding: '8px 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Banner Card */}
      <div className="med-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PackageCheck size={20} color="#2563eb" />
            <h2 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#0f172a', margin: 0 }}>
              Regional Inventory Master: <span style={{ color: '#2563eb' }}>{medicineName}</span>
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', margin: 0 }}>
            Multi-tier inventory tracking, safety quarantine, and stockout projections across 12 facilities
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ padding: '6px 14px', borderRadius: '8px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#1e40af', textTransform: 'uppercase' }}>Total Network Stock</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#1d4ed8' }}>{inventoryData?.total_stock?.toLocaleString() || '18,500'} units</div>
          </div>
          <div style={{ padding: '6px 14px', borderRadius: '8px', backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#9a3412', textTransform: 'uppercase' }}>Daily Consumption</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#ea580c' }}>{inventoryData?.total_daily_burn?.toLocaleString() || '1,120'} units/day</div>
          </div>
          <div style={{ padding: '6px 14px', borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#166534', textTransform: 'uppercase' }}>Expiring Soon (&lt;45d)</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#15803d' }}>{inventoryData?.total_expiring_soon?.toLocaleString() || '1,200'} units</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="med-card" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={14} color="#64748b" style={{ position: 'absolute', left: '10px', top: '9px' }} />
          <input
            type="text"
            placeholder="Search facility name or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px 6px 30px',
              borderRadius: '7px',
              border: '1px solid #cbd5e1',
              fontSize: '12px',
              outline: 'none',
              color: '#0f172a'
            }}
          />
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Statuses' },
            { id: 'CRITICAL', label: 'Critical' },
            { id: 'APPROACHING', label: 'Approaching' },
            { id: 'AT_RISK', label: 'At Risk' },
            { id: 'HEALTHY', label: 'Healthy' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                backgroundColor: statusFilter === tab.id ? '#ffffff' : 'transparent',
                color: statusFilter === tab.id ? '#2563eb' : '#64748b',
                boxShadow: statusFilter === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Master Table */}
      <div className="med-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.03em' }}>
                <th onClick={() => handleSort('facility_name')} style={{ padding: '12px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Facility</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th style={{ padding: '12px 16px' }}>Type</th>
                <th onClick={() => handleSort('current_stock')} style={{ padding: '12px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Current Stock</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th style={{ padding: '12px 16px' }}>Available / Reserved</th>
                <th onClick={() => handleSort('daily_consumption')} style={{ padding: '12px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Daily Burn</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th onClick={() => handleSort('days_until_stockout')} style={{ padding: '12px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Days to Stockout</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Supplier ETA</th>
                <th onClick={() => handleSort('expiring_soon_units')} style={{ padding: '12px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Expiry Risk (&lt;45d)</span>
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => {
                const isCrit = item.status === 'CRITICAL';
                const isAppr = item.status === 'APPROACHING';

                return (
                  <tr
                    key={item.facility_id}
                    onClick={() => openFacilityDrawer(item.facility_id)}
                    style={{
                      borderBottom: '1px solid #edf2f7',
                      backgroundColor: isCrit ? '#fef2f2' : isAppr ? '#fff7ed' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isCrit && !isAppr) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (!isCrit && !isAppr) e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0f172a' }}>
                      {item.facility_name}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>
                      {item.facility_type}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '800', color: '#0f172a' }}>
                      {item.current_stock?.toLocaleString()} units
                      {item.incoming_stock > 0 && (
                        <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: '700' }}>
                          +{item.incoming_stock} incoming
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#475569', fontSize: '11px' }}>
                      <b>{item.available_stock?.toLocaleString()}</b> avail / {item.reserved_stock?.toLocaleString()} res
                    </td>
                    <td style={{ padding: '12px 16px', color: '#ea580c', fontWeight: '700' }}>
                      {item.daily_consumption} /day
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '800', color: isCrit ? '#dc2626' : isAppr ? '#ea580c' : '#15803d' }}>
                      {item.days_until_stockout} days
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '800',
                        backgroundColor: isCrit ? '#fee2e2' : isAppr ? '#ffedd5' : item.status === 'AT_RISK' ? '#fef9c3' : '#dcfce7',
                        color: isCrit ? '#b91c1c' : isAppr ? '#c2410c' : item.status === 'AT_RISK' ? '#a16207' : '#15803d',
                        textTransform: 'uppercase'
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>
                      {item.supplier_eta}
                    </td>
                    <td style={{ padding: '12px 16px', color: item.expiring_soon_units > 0 ? '#7c3aed' : '#94a3b8', fontWeight: item.expiring_soon_units > 0 ? '700' : '400' }}>
                      {item.expiring_soon_units > 0 ? `${item.expiring_soon_units} units (FEFO)` : 'None'}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openFacilityDrawer(item.facility_id);
                        }}
                        style={{
                          border: 'none',
                          background: 'none',
                          color: '#2563eb',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <ChevronRight size={16} />
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
