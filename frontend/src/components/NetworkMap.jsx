import React, { useState, useRef } from 'react';
import {
  Building2,
  MapPin,
  Truck,
  AlertOctagon,
  RefreshCw,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const DEFAULT_COORDS = {
  'F_CBE_DEPOT': { x: 165, y: 90, name: 'Coimbatore Depot', type: 'DEPOT' },
  'F_ERODE_CHC': { x: 255, y: 175, name: 'Erode CHC', type: 'CHC' },
  'F_TIRU_PHC': { x: 365, y: 245, name: 'Tiruchengode PHC', type: 'PHC' },
  'F_SALEM_CHC': { x: 525, y: 155, name: 'Salem CHC', type: 'CHC' },
  'F_NAMAK_PHC': { x: 625, y: 250, name: 'Namakkal PHC', type: 'PHC' },
  'F_KARUR_DH': { x: 525, y: 365, name: 'Karur District Hospital', type: 'DISTRICT_HOSPITAL' },
  'F_DIND_CHC': { x: 335, y: 440, name: 'Dindigul CHC', type: 'CHC' },
  'F_MADU_PHC': { x: 515, y: 475, name: 'Madurai PHC', type: 'PHC' },
  'F_TRICHY_CHC': { x: 695, y: 435, name: 'Trichy CHC', type: 'CHC' },
  'F_DHARMA_DH': { x: 580, y: 65, name: 'Dharmapuri District Hospital', type: 'DISTRICT_HOSPITAL' },
  'F_PERAM_PHC': { x: 750, y: 320, name: 'Perambalur PHC', type: 'PHC' },
  'F_THANJ_DH': { x: 790, y: 460, name: 'Thanjavur Medical College Hospital', type: 'DISTRICT_HOSPITAL' }
};

const EDGES = [
  { from: 'F_CBE_DEPOT', to: 'F_ERODE_CHC', distance: '86 km' },
  { from: 'F_CBE_DEPOT', to: 'F_TIRU_PHC', distance: '118 km' },
  { from: 'F_ERODE_CHC', to: 'F_TIRU_PHC', distance: '42 km' },
  { from: 'F_TIRU_PHC', to: 'F_SALEM_CHC', distance: '65 km' },
  { from: 'F_SALEM_CHC', to: 'F_NAMAK_PHC', distance: '72 km' },
  { from: 'F_TIRU_PHC', to: 'F_NAMAK_PHC', distance: '45 km' },
  { from: 'F_TIRU_PHC', to: 'F_KARUR_DH', distance: '42 km' },
  { from: 'F_NAMAK_PHC', to: 'F_KARUR_DH', distance: '44 km' },
  { from: 'F_TIRU_PHC', to: 'F_DIND_CHC', distance: '68 km' },
  { from: 'F_KARUR_DH', to: 'F_DIND_CHC', distance: '38 km' },
  { from: 'F_DIND_CHC', to: 'F_MADU_PHC', distance: '25 km' },
  { from: 'F_KARUR_DH', to: 'F_TRICHY_CHC', distance: '55 km' },
  { from: 'F_DIND_CHC', to: 'F_TRICHY_CHC', distance: '36 km' },
  { from: 'F_MADU_PHC', to: 'F_TRICHY_CHC', distance: '58 km' },
  { from: 'F_SALEM_CHC', to: 'F_DHARMA_DH', distance: '64 km' },
  { from: 'F_NAMAK_PHC', to: 'F_PERAM_PHC', distance: '82 km' },
  { from: 'F_TRICHY_CHC', to: 'F_THANJ_DH', distance: '56 km' }
];

export default function NetworkMap() {
  const {
    simData,
    epicenterId,
    rebalanceData,
    infrastructureSeverance,
    selectedMedicine,
    selectedFacilityId,
    openFacilityDrawer
  } = useApp();

  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'CRITICAL_ONLY' | 'ACTIVE_TRANSFERS'
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Map facilities dynamic status
  const nodeStates = { ...DEFAULT_COORDS };
  (simData?.facilities || []).forEach((f) => {
    if (nodeStates[f.id]) {
      nodeStates[f.id] = {
        ...nodeStates[f.id],
        status: f.status,
        days: `${f.days_until_stockout}d`,
        stock: f.current_stock,
        name: f.name
      };
    }
  });

  // Calculate dynamic active routes from recommended & approved transfers
  const activeTransfers = rebalanceData?.recommended_transfers || [];
  const activeRoutePairs = new Set();
  activeTransfers.forEach(t => {
    activeRoutePairs.add(`${t.source_id}->${t.target_id}`);
    activeRoutePairs.add(`${t.target_id}->${t.source_id}`);
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'CRITICAL': return '#ef4444';
      case 'APPROACHING': return '#f97316';
      case 'AT_RISK': return '#eab308';
      case 'HEALTHY': default: return '#10b981';
    }
  };

  // Primary active transfer for delivery truck animation
  const primaryTransfer = activeTransfers.length > 0 ? activeTransfers[0] : null;
  const primarySrc = primaryTransfer ? (DEFAULT_COORDS[primaryTransfer.source_id] || DEFAULT_COORDS['F_SALEM_CHC']) : null;
  const primaryTgt = primaryTransfer ? (DEFAULT_COORDS[primaryTransfer.target_id] || DEFAULT_COORDS['F_TIRU_PHC']) : null;
  const truckX = primarySrc && primaryTgt ? Math.round((primarySrc.x + primaryTgt.x) / 2) : 445;
  const truckY = primarySrc && primaryTgt ? Math.round((primarySrc.y + primaryTgt.y) / 2) : 200;

  const epicenterCoords = DEFAULT_COORDS[epicenterId] || DEFAULT_COORDS['F_TIRU_PHC'];

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="med-card" style={{
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      height: '100%'
    }}>
      {/* Map Header with Filters & Search */}
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        zIndex: 10,
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#0f172a', margin: 0 }}>
              Healthcare Network Digital Twin
            </h2>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              • Monitoring <b style={{ color: '#2563eb' }}>{selectedMedicine?.name || 'Essential Medicine'}</b>
            </span>
          </div>
          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '1px', margin: 0 }}>
            Real-time shortage propagation, road topologies &amp; active redistribution transfers
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Search box */}
          <div style={{ position: 'relative' }}>
            <Search size={13} color="#64748b" style={{ position: 'absolute', left: '8px', top: '8px' }} />
            <input
              type="text"
              placeholder="Search facility..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '5px 8px 5px 26px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '11px',
                width: '140px',
                outline: 'none'
              }}
            />
          </div>

          {/* Status Filter Buttons */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '7px' }}>
            <button
              onClick={() => setFilterMode('ALL')}
              style={{
                border: 'none',
                padding: '3px 8px',
                borderRadius: '5px',
                fontSize: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                backgroundColor: filterMode === 'ALL' ? '#ffffff' : 'transparent',
                color: filterMode === 'ALL' ? '#0f172a' : '#64748b',
                boxShadow: filterMode === 'ALL' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              All (12)
            </button>
            <button
              onClick={() => setFilterMode('CRITICAL_ONLY')}
              style={{
                border: 'none',
                padding: '3px 8px',
                borderRadius: '5px',
                fontSize: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                backgroundColor: filterMode === 'CRITICAL_ONLY' ? '#fee2e2' : 'transparent',
                color: filterMode === 'CRITICAL_ONLY' ? '#dc2626' : '#64748b',
                boxShadow: filterMode === 'CRITICAL_ONLY' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Critical Only
            </button>
            <button
              onClick={() => setFilterMode('ACTIVE_TRANSFERS')}
              style={{
                border: 'none',
                padding: '3px 8px',
                borderRadius: '5px',
                fontSize: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                backgroundColor: filterMode === 'ACTIVE_TRANSFERS' ? '#eff6ff' : 'transparent',
                color: filterMode === 'ACTIVE_TRANSFERS' ? '#2563eb' : '#64748b',
                boxShadow: filterMode === 'ACTIVE_TRANSFERS' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Transfers ({activeTransfers.length})
            </button>
          </div>

          {/* Zoom Buttons */}
          <div style={{ display: 'flex', gap: '2px', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
            <button onClick={handleZoomIn} title="Zoom In" style={{ border: 'none', background: '#ffffff', padding: '5px 7px', cursor: 'pointer' }}>
              <ZoomIn size={13} color="#475569" />
            </button>
            <button onClick={handleZoomOut} title="Zoom Out" style={{ border: 'none', background: '#ffffff', padding: '5px 7px', cursor: 'pointer', borderLeft: '1px solid #e2e8f0' }}>
              <ZoomOut size={13} color="#475569" />
            </button>
            <button onClick={handleResetZoom} title="Reset View" style={{ border: 'none', background: '#ffffff', padding: '5px 7px', cursor: 'pointer', borderLeft: '1px solid #e2e8f0' }}>
              <Maximize2 size={13} color="#475569" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Canvas */}
      <div style={{
        position: 'relative',
        flex: 1,
        minHeight: '440px',
        backgroundColor: '#f1f5f9',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          transform: `scale(${zoomLevel})`,
          transformOrigin: '50% 50%',
          transition: 'transform 0.2s ease-out'
        }}>
          <svg
            viewBox="0 0 870 560"
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              background: 'radial-gradient(circle at 50% 50%, #f8fafc 0%, #edf2f7 100%)'
            }}
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.75" />
              </pattern>
            </defs>

            <rect width="870" height="560" fill="url(#grid)" />

            {/* Tamil Nadu State Outline Silhouette */}
            <path
              d="M 120 70 Q 240 40 450 60 Q 650 90 770 160 Q 840 280 790 420 Q 740 520 540 540 Q 380 530 290 490 Q 180 430 140 280 Q 110 180 120 70 Z"
              fill="#e2e8f0"
              opacity="0.3"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />

            {/* Distance Scale */}
            <g transform="translate(30, 390)">
              <rect x="0" y="0" width="130" height="24" rx="4" fill="#ffffff" opacity="0.85" stroke="#cbd5e1" />
              <line x1="15" y1="12" x2="115" y2="12" stroke="#475569" strokeWidth="1.5" />
              <line x1="15" y1="7" x2="15" y2="17" stroke="#475569" strokeWidth="1.5" />
              <line x1="65" y1="9" x2="65" y2="15" stroke="#475569" strokeWidth="1" />
              <line x1="115" y1="7" x2="115" y2="17" stroke="#475569" strokeWidth="1.5" />
              <text x="15" y="6" fontSize="8" fill="#64748b" textAnchor="middle">0</text>
              <text x="65" y="6" fontSize="8" fill="#64748b" textAnchor="middle">25</text>
              <text x="115" y="6" fontSize="8" fill="#64748b" textAnchor="middle">50 km</text>
            </g>

            {/* Road Edges */}
            {EDGES.map((edge, idx) => {
              const src = DEFAULT_COORDS[edge.from];
              const tgt = DEFAULT_COORDS[edge.to];
              if (!src || !tgt) return null;

              const midX = (src.x + tgt.x) / 2;
              const midY = (src.y + tgt.y) / 2;

              const isRouteActive = activeRoutePairs.has(`${edge.from}->${edge.to}`) || activeRoutePairs.has(`${edge.to}->${edge.from}`);
              const isBlocked = infrastructureSeverance && ((edge.from === 'F_CBE_DEPOT' && edge.to === 'F_TIRU_PHC') || (edge.from === 'F_ERODE_CHC' && edge.to === 'F_TIRU_PHC'));

              if (filterMode === 'ACTIVE_TRANSFERS' && !isRouteActive) return null;

              if (isBlocked) {
                return (
                  <g key={`edge-${idx}`}>
                    <line
                      x1={src.x}
                      y1={src.y}
                      x2={tgt.x}
                      y2={tgt.y}
                      stroke="#ef4444"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      opacity="0.7"
                    />
                    <g transform={`translate(${midX}, ${midY})`}>
                      <circle cx="0" cy="0" r="9" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5" />
                      <line x1="-4" y1="-4" x2="4" y2="4" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
                      <line x1="4" y1="-4" x2="-4" y2="4" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
                    </g>
                  </g>
                );
              }

              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isRouteActive ? '#2563eb' : '#cbd5e1'}
                    strokeWidth={isRouteActive ? 2.8 : 1.6}
                    strokeDasharray={isRouteActive ? '6 6' : 'none'}
                    className={isRouteActive ? 'active-logistics-path' : ''}
                  />
                  <rect
                    x={midX - 18}
                    y={midY - 8}
                    width="36"
                    height="16"
                    rx="8"
                    fill="#ffffff"
                    stroke={isRouteActive ? '#bfdbfe' : '#e2e8f0'}
                    strokeWidth="1"
                  />
                  <text
                    x={midX}
                    y={midY + 3}
                    fontSize="9"
                    fontWeight="600"
                    fill={isRouteActive ? '#1d4ed8' : '#64748b'}
                    textAnchor="middle"
                  >
                    {edge.distance}
                  </text>
                </g>
              );
            })}

            {/* Concentric Ripple Effect around the actual epicenter facility */}
            <g transform={`translate(${epicenterCoords.x}, ${epicenterCoords.y})`}>
              <circle cx="0" cy="0" r="16" fill="#fecaca" opacity="0.65" />
              <circle cx="0" cy="0" r="28" fill="none" stroke="#ef4444" opacity="0.6" strokeWidth="2" className="ripple-circle-1" />
              <circle cx="0" cy="0" r="46" fill="none" stroke="#ef4444" opacity="0.4" strokeWidth="1.5" className="ripple-circle-2" />
            </g>

            {/* Moving Delivery Truck along Active Route */}
            {!infrastructureSeverance && activeTransfers.length > 0 && (
              <g transform={`translate(${truckX}, ${truckY})`}>
                <circle cx="0" cy="0" r="13" fill="#2563eb" filter="drop-shadow(0 2px 4px rgba(37,99,235,0.4))" />
                <text x="0" y="4" fontSize="12" textAnchor="middle" fill="#ffffff">🚚</text>
              </g>
            )}

            {/* Facility Nodes with Untruncated Labels */}
            {Object.entries(nodeStates).map(([id, node]) => {
              const isSelected = selectedFacilityId === id;
              const isEpicenter = epicenterId === id;
              const status = node.status || 'HEALTHY';
              const daysLeft = node.days || '15d';
              const statusColor = getStatusColor(status);

              // Filter check
              if (filterMode === 'CRITICAL_ONLY' && status !== 'CRITICAL') return null;
              if (searchTerm && !node.name.toLowerCase().includes(searchTerm.toLowerCase())) return null;

              // Calculate width required for untruncated name
              const labelWidth = Math.max(120, node.name.length * 6.5 + 44);

              return (
                <g
                  key={id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => openFacilityDrawer(id)}
                  onMouseEnter={() => setHoveredNode(id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer selection ring */}
                  {(isSelected || isEpicenter || status === 'CRITICAL') && (
                    <circle
                      cx="0"
                      cy="0"
                      r={node.type === 'DEPOT' ? 24 : 20}
                      fill="none"
                      stroke={statusColor}
                      strokeWidth={isSelected ? 3 : 2}
                      strokeDasharray={isSelected ? '3 3' : 'none'}
                      opacity="0.8"
                    />
                  )}

                  {/* Node Shape */}
                  {node.type === 'DEPOT' ? (
                    <rect
                      x="-16"
                      y="-16"
                      width="32"
                      height="32"
                      rx="8"
                      fill="#2563eb"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      filter="drop-shadow(0 3px 6px rgba(37, 99, 235, 0.4))"
                    />
                  ) : node.type === 'DISTRICT_HOSPITAL' ? (
                    <circle
                      cx="0"
                      cy="0"
                      r="16"
                      fill="#1d4ed8"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      filter="drop-shadow(0 3px 6px rgba(29, 78, 216, 0.4))"
                    />
                  ) : (
                    <circle
                      cx="0"
                      cy="0"
                      r="14"
                      fill={statusColor}
                      stroke="#ffffff"
                      strokeWidth="2"
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
                    />
                  )}

                  {/* Icon */}
                  {node.type === 'DEPOT' ? (
                    <text x="0" y="5" fontSize="14" textAnchor="middle" fill="#ffffff">🏢</text>
                  ) : node.type === 'DISTRICT_HOSPITAL' ? (
                    <text x="0" y="5" fontSize="14" textAnchor="middle" fill="#ffffff">🏥</text>
                  ) : (
                    <text x="0" y="4.5" fontSize="13" fontWeight="800" textAnchor="middle" fill="#ffffff">+</text>
                  )}

                  {/* Full Untruncated Facility Name Badge */}
                  <g transform={`translate(0, ${node.y > 400 ? -24 : 26})`}>
                    <rect
                      x={-labelWidth / 2}
                      y="-11"
                      width={labelWidth}
                      height="22"
                      rx="6"
                      fill="#ffffff"
                      stroke={isSelected ? '#2563eb' : '#cbd5e1'}
                      strokeWidth={isSelected ? 1.5 : 1}
                      filter="drop-shadow(0 2px 5px rgba(0,0,0,0.08))"
                    />
                    <text
                      x="0"
                      y="3"
                      fontSize="10"
                      fontWeight="700"
                      fill="#0f172a"
                      textAnchor="middle"
                    >
                      {node.name} <tspan fill={statusColor} fontWeight="800">({daysLeft})</tspan>
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend Overlay */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '10px 14px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          fontSize: '11px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          zIndex: 5
        }}>
          <div style={{ fontWeight: '800', color: '#0f172a', marginBottom: '2px' }}>
            Facility Risk Status
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <span>Critical Shortage (≤ 5d)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f97316' }} />
            <span>Approaching Shortage (6-9d)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#eab308' }} />
            <span>At Risk Buffer (10-18d)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span>Healthy Buffer (&gt; 18d)</span>
          </div>
          <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '2px 0' }} />
          <div style={{ fontSize: '10px', color: '#64748b' }}>
            Click any facility for full inventory &amp; risk factors
          </div>
        </div>
      </div>
    </div>
  );
}
