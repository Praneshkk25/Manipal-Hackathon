import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  checkBackendHealth,
  fetchMedicines,
  fetchRegions,
  fetchSettings,
  updateSettings as apiUpdateSettings,
  fetchMedicineDashboard,
  simulateDisruption,
  synthesizeRebalance,
  approveTransferApi,
  fetchExplainableInsights,
  fetchMedicineInventory,
  fetchMedicineAlerts,
  fetchMedicineReport,
  fetchAuditTrail,
  fetchSmsHistory,
  dispatchRuralSms
} from '../services/api';

export const DEMO_USERS = {
  ADMIN: {
    id: 'usr_admin',
    name: 'Suresh Narayanan, IAS',
    role: 'ADMIN',
    email: 'admin@medripple.demo',
    title: 'State Principal Health Secretary',
    avatar: 'AD',
    badgeColor: '#7c3aed',
    permissions: ['full system control', 'approve transfers', 'modify settings', 'war room', 'audit write']
  },
  DHO: {
    id: 'usr_dho',
    name: 'Dr. R. Shanmugasundaram, M.D.',
    role: 'DHO',
    email: 'dho@medripple.demo',
    title: 'District Health Officer (Salem Circle)',
    avatar: 'DH',
    badgeColor: '#2563eb',
    permissions: ['regional oversight', 'approve transfers', 'dispatch sms', 'war room', 'view reports']
  },
  HOSPITAL: {
    id: 'usr_pharm',
    name: 'Sister Jayalakshmi, B.Pharm',
    role: 'HOSPITAL',
    email: 'facility@medripple.demo',
    title: 'Chief In-Charge (Tiruchengode PHC)',
    avatar: 'RX',
    badgeColor: '#059669',
    permissions: ['local inventory', 'request emergency stock', 'view alerts']
  },
  OBSERVER: {
    id: 'usr_judge',
    name: 'Hackathon Evaluation Panel',
    role: 'OBSERVER',
    email: 'judge@manipal.demo',
    title: 'External Jury Member (UN SDG Track)',
    avatar: 'JU',
    badgeColor: '#ea580c',
    permissions: ['read only command center', 'view simulations', 'inspect audit']
  }
};

export const ROLE_PERMISSIONS = {
  ADMIN: {
    label: 'System Admin (Full Access)',
    allowedTabs: [
      'dashboard', 'network_map', 'commander', 'war_room',
      'patient_impact', 'early_warning', 'causal_graph', 'inventory',
      'rebalancing', 'rural',
      'alerts', 'reports', 'settings', 'audit'
    ],
    canApproveTransfers: true,
    canDispatchSms: true,
    canEditSettings: true,
    canRunWarRoom: true
  },
  DHO: {
    label: 'District Officer (Regional Oversight)',
    allowedTabs: [
      'dashboard', 'network_map', 'commander', 'war_room',
      'patient_impact', 'early_warning', 'causal_graph', 'inventory',
      'rebalancing', 'rural',
      'alerts', 'reports', 'audit'
    ],
    canApproveTransfers: true,
    canDispatchSms: true,
    canEditSettings: false,
    canRunWarRoom: true
  },
  HOSPITAL: {
    label: 'Facility In-Charge (Local Stock)',
    allowedTabs: [
      'dashboard', 'network_map',
      'patient_impact', 'inventory',
      'rebalancing',
      'alerts', 'reports'
    ],
    canApproveTransfers: false,
    canDispatchSms: false,
    canEditSettings: false,
    canRunWarRoom: false
  },
  OBSERVER: {
    label: 'Hackathon Observer (Read-Only)',
    allowedTabs: [
      'dashboard', 'network_map',
      'patient_impact', 'early_warning', 'causal_graph', 'inventory',
      'rebalancing',
      'reports', 'audit'
    ],
    canApproveTransfers: false,
    canDispatchSms: false,
    canEditSettings: false,
    canRunWarRoom: false
  }
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Navigation & Screen routing
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Authentication & Role-Based Access
  const [currentUser, setCurrentUser] = useState(DEMO_USERS.OBSERVER);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const canAccessTab = useCallback((tabId) => {
    if (!currentUser?.role) return true;
    const config = ROLE_PERMISSIONS[currentUser.role] || ROLE_PERMISSIONS.OBSERVER;
    return config.allowedTabs.includes(tabId);
  }, [currentUser?.role]);

  const canApproveTransfers = currentUser?.role === 'ADMIN' || currentUser?.role === 'DHO';
  const canDispatchSms = currentUser?.role === 'ADMIN' || currentUser?.role === 'DHO';
  const canEditSettings = currentUser?.role === 'ADMIN';
  const canRunWarRoom = currentUser?.role === 'ADMIN' || currentUser?.role === 'DHO';

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const switchRole = useCallback((roleKey) => {
    if (DEMO_USERS[roleKey]) {
      const user = DEMO_USERS[roleKey];
      setCurrentUser(user);
      setViewRole(roleKey);
      const permConfig = ROLE_PERMISSIONS[roleKey];
      if (permConfig && !permConfig.allowedTabs.includes(activeTab)) {
        setActiveTab('dashboard');
      }
    }
  }, [activeTab]);

  const loginAsRole = useCallback((roleKey) => {
    if (DEMO_USERS[roleKey]) {
      const user = DEMO_USERS[roleKey];
      setCurrentUser(user);
      setViewRole(roleKey);
      const permConfig = ROLE_PERMISSIONS[roleKey];
      if (permConfig && !permConfig.allowedTabs.includes(activeTab)) {
        setActiveTab('dashboard');
      }
      setLoginModalOpen(false);
    }
  }, [activeTab]);

  const updateCurrentUser = useCallback((customFields) => {
    setCurrentUser(prev => ({
      ...prev,
      ...customFields
    }));
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(DEMO_USERS.OBSERVER);
    setViewRole('OBSERVER');
    setActiveTab('dashboard');
  }, []);

  // Backend Health & Connectivity
  const [backendStatus, setBackendStatus] = useState('CHECKING'); // 'CONNECTED' | 'DEGRADED' | 'OFFLINE'
  const [lastCheckedTime, setLastCheckedTime] = useState(null);
  const [systemTime, setSystemTime] = useState('');

  // Clock ticker: live system time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toLocaleString('en-IN', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 15000);
    return () => clearInterval(timer);
  }, []);

  // Operational System Settings
  const [settings, setSettings] = useState({
    critical_threshold_days: 5.0,
    donor_floor_days: 18.0,
    expiry_window_days: 45,
    fastapi_gateway_host: 'http://localhost:8000'
  });

  // Global Filter Selectors
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicineId, setSelectedMedicineId] = useState('amoxicillin_clav');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [regions, setRegions] = useState([
    {
      id: "tamil_nadu",
      name: "Tamil Nadu — Demo Region",
      state: "Tamil Nadu",
      is_demo: true,
      facility_count: 12,
      district_hq: "Salem / Coimbatore Cluster"
    }
  ]);
  const [selectedRegionId, setSelectedRegionId] = useState('tamil_nadu');
  const [viewRole, setViewRole] = useState('DHO'); // 'DHO' | 'HOSPITAL' | 'DEPOT' | 'STATE'

  // Loading States
  const [loadingMedicine, setLoadingMedicine] = useState(false);
  const [simLoading, setSimLoading] = useState(false);

  // Simulation Parameters
  const [supplierDelay, setSupplierDelay] = useState(15);
  const [demandSurge, setDemandSurge] = useState(40);
  const [infrastructureSeverance, setInfrastructureSeverance] = useState(false);
  const [timelineDay, setTimelineDay] = useState(0);
  const [simulationResultBanner, setSimulationResultBanner] = useState(null);
  const [isSimulationActive, setIsSimulationActive] = useState(false);

  // Dynamic Network & Facility Data
  const [simData, setSimData] = useState({
    ripple_score: 84,
    ripple_status: 'Critical Crisis',
    counts: { CRITICAL: 7, APPROACHING: 1, AT_RISK: 4, HEALTHY: 0 },
    secondary_spillover_rate: 128,
    rescued_from_expiry_units: 820,
    facilities: [],
    edges: [],
    active_transfers_count: 3,
    blocked_routes_count: 0,
    total_network_km: 284
  });

  // Untainted Baseline Simulation Data (for clean Reset without corruption)
  const [baselineSimData, setBaselineSimData] = useState(null);

  // Rebalancing Recommendations & Approved Transfers Map
  const [rebalanceData, setRebalanceData] = useState({
    status: 'OPTIMIZED',
    pre_rebalance_risk: 89,
    post_rebalance_risk: 19,
    risk_reduction_pct: 78.7,
    recommended_transfers: [],
    total_units_moved: 900,
    total_cost_inr: 1120,
    expiry_units_saved: 820
  });

  // Approved Transfers: { [transferId]: { ...transferDetails, approvedAt } }
  const [approvedTransfers, setApprovedTransfers] = useState({});

  // Facility Details & Explainable AI
  const [selectedFacilityId, setSelectedFacilityId] = useState('F_TIRU_PHC');
  const [epicenterId, setEpicenterId] = useState('F_TIRU_PHC');
  const [insightData, setInsightData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [facilityDrawerOpen, setFacilityDrawerOpen] = useState(false);

  // Alerts with full lifecycle: status = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED'
  const [alertsData, setAlertsData] = useState([]);

  // Reports
  const [reportData, setReportData] = useState(null);

  // Operational Audit Trail
  const [auditTrail, setAuditTrail] = useState([]);

  // Rural SMS Gateway History
  const [smsHistory, setSmsHistory] = useState([]);
  const [isRuralModalOpen, setIsRuralModalOpen] = useState(false);
  const [modalTransfer, setModalTransfer] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, message, title = '') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Confirmation Modal
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    details: null,
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    isDanger: false,
    onConfirm: () => {}
  });

  const requestConfirmation = useCallback((options) => {
    setConfirmModal({
      isOpen: true,
      title: options.title || 'Confirm Action',
      message: options.message || 'Are you sure you wish to proceed?',
      details: options.details || null,
      confirmLabel: options.confirmLabel || 'Confirm',
      cancelLabel: options.cancelLabel || 'Cancel',
      isDanger: options.isDanger || false,
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        if (options.onConfirm) options.onConfirm();
      }
    });
  }, []);

  const closeConfirmation = useCallback(() => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Audit Logging
  const logAudit = useCallback((action, details = {}) => {
    const newEntry = {
      id: `AUD-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      }) + ' IST',
      user_role: viewRole === 'DHO' ? 'District Health Officer' :
                 viewRole === 'HOSPITAL' ? 'Hospital Pharmacist' :
                 viewRole === 'DEPOT' ? 'Central Warehouse Director' : 'State Health Commissioner',
      action,
      medicine_id: selectedMedicineId,
      details
    };
    setAuditTrail(prev => [newEntry, ...prev]);
  }, [viewRole, selectedMedicineId]);

  // Health Check Routine
  const checkHealth = useCallback(async () => {
    const health = await checkBackendHealth();
    setLastCheckedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    if (health) {
      setBackendStatus('CONNECTED');
      if (health.settings) {
        setSettings(prev => ({ ...prev, ...health.settings }));
      }
    } else {
      setBackendStatus('OFFLINE');
    }
  }, []);

  // Initial Boot
  const requestSeqRef = useRef(0);

  useEffect(() => {
    async function boot() {
      await checkHealth();

      const [medsList, regionList, srvSettings, srvAudit, srvSms] = await Promise.all([
        fetchMedicines(),
        fetchRegions(),
        fetchSettings(),
        fetchAuditTrail(),
        fetchSmsHistory()
      ]);

      if (medsList && medsList.length > 0) setMedicines(medsList);
      if (regionList && regionList.length > 0) setRegions(regionList);
      if (srvSettings) setSettings(srvSettings);
      if (srvAudit && srvAudit.length > 0) setAuditTrail(srvAudit);
      if (srvSms && srvSms.length > 0) setSmsHistory(srvSms);

      const defaultId = (medsList && medsList.length > 0) ? medsList[0].id : 'amoxicillin_clav';
      setSelectedMedicineId(defaultId);
      loadCompleteMedicine(defaultId, medsList);
    }
    boot();
  }, [checkHealth]);

  // Recalculate facility status and counts given custom threshold
  const applyThresholdsToFacilities = useCallback((facList, critDays = settings.critical_threshold_days) => {
    if (!facList) return { facilities: [], counts: { CRITICAL: 0, APPROACHING: 0, AT_RISK: 0, HEALTHY: 0 } };
    const counts = { CRITICAL: 0, APPROACHING: 0, AT_RISK: 0, HEALTHY: 0 };
    const updated = facList.map(f => {
      let status = 'HEALTHY';
      if (f.days_until_stockout <= critDays) {
        status = 'CRITICAL';
      } else if (f.days_until_stockout <= 9.0) {
        status = 'APPROACHING';
      } else if (f.days_until_stockout <= settings.donor_floor_days) {
        status = 'AT_RISK';
      } else {
        status = 'HEALTHY';
      }
      counts[status] = (counts[status] || 0) + 1;
      return { ...f, status };
    });
    return { facilities: updated, counts };
  }, [settings.critical_threshold_days, settings.donor_floor_days]);

  // Load Complete Medicine Dataset Atomically
  const loadCompleteMedicine = async (medicineId, medsList = medicines) => {
    const currentSeq = ++requestSeqRef.current;
    setLoadingMedicine(true);

    const medMeta = (medsList || []).find(m => m.id === medicineId) || medicines.find(m => m.id === medicineId);
    if (medMeta) setSelectedMedicine(medMeta);

    const [dash, inv, rep, srvAlerts] = await Promise.all([
      fetchMedicineDashboard(medicineId),
      fetchMedicineInventory(medicineId),
      fetchMedicineReport(medicineId),
      fetchMedicineAlerts(medicineId)
    ]);

    if (currentSeq !== requestSeqRef.current) return;

    if (dash) {
      const { facilities: recalcedFacs, counts: recalcedCounts } = applyThresholdsToFacilities(dash.simulation.facilities);
      const updatedSim = {
        ...dash.simulation,
        facilities: recalcedFacs,
        counts: recalcedCounts
      };
      setSimData(updatedSim);
      setBaselineSimData(JSON.parse(JSON.stringify(updatedSim))); // deep copy baseline
      setRebalanceData(dash.rebalance);
      setInsightData(dash.explainable_ai);
      setEpicenterId(dash.epicenter_facility_id || 'F_TIRU_PHC');
      setSelectedFacilityId(dash.epicenter_facility_id || 'F_TIRU_PHC');
      if (dash.medicine) setSelectedMedicine(dash.medicine);
    }

    if (inv) setInventoryData(inv);
    if (rep) setReportData(rep);

    // Initialize raw alerts with status: 'ACTIVE'
    const rawAlerts = (srvAlerts?.alerts) || (dash?.alerts) || [];
    const formattedAlerts = rawAlerts.map(a => ({
      ...a,
      status: 'ACTIVE',
      createdAt: systemTime || 'Live Stream'
    }));
    setAlertsData(formattedAlerts);

    // Reset simulation controls
    setSupplierDelay(15);
    setDemandSurge(40);
    setInfrastructureSeverance(false);
    setTimelineDay(0);
    setSimulationResultBanner(null);
    setIsSimulationActive(false);

    setLoadingMedicine(false);
  };

  // Medicine Switch Handler
  const handleSelectMedicine = (newMedicineId) => {
    if (newMedicineId === selectedMedicineId) return;
    setSelectedMedicineId(newMedicineId);
    setApprovedTransfers({});
    loadCompleteMedicine(newMedicineId);
    logAudit('MEDICINE_SWITCH', { medicine_id: newMedicineId });
    showToast('info', `Switched monitoring context to ${newMedicineId}.`);
  };

  // Region Switch Handler
  const handleSelectRegion = (newRegionId) => {
    setSelectedRegionId(newRegionId);
    logAudit('REGION_SELECT', { region_id: newRegionId });
    showToast('info', `Active region: Tamil Nadu — Demo Region (12 facilities).`);
  };

  // Role Switch Handler
  const handleSelectRole = (newRole) => {
    setViewRole(newRole);
    if (DEMO_USERS[newRole]) {
      setCurrentUser(DEMO_USERS[newRole]);
    }
    logAudit('ROLE_CHANGE', { new_role: newRole });
    const roleLabels = {
      ADMIN: 'System Admin (State Health Secretary)',
      DHO: 'District Health Officer (Macro command view)',
      HOSPITAL: 'Facility In-Charge (Sister Jayalakshmi)',
      OBSERVER: 'Hackathon Observer (Jury Evaluation Panel)'
    };
    showToast('info', `Switched role perspective: ${roleLabels[newRole] || newRole}`);
  };

  // Run Disruption Simulation
  const handleRunSimulation = async () => {
    setSimLoading(true);
    const beforeRisk = simData.ripple_score;
    const beforeCrit = simData.counts?.CRITICAL || 0;
    const beforeSpillover = simData.secondary_spillover_rate;

    const sim = await simulateDisruption(selectedMedicineId, {
      medicine_id: selectedMedicineId,
      supplier_delay_days: supplierDelay,
      outbreak_surge_pct: demandSurge,
      infrastructure_severance: infrastructureSeverance,
      timeline_day: timelineDay
    });

    setSimLoading(false);

    if (sim) {
      const { facilities: recalcedFacs, counts: recalcedCounts } = applyThresholdsToFacilities(sim.facilities);
      const finalSim = {
        ...sim,
        facilities: recalcedFacs,
        counts: recalcedCounts
      };
      setSimData(finalSim);
      setIsSimulationActive(true);

      const afterRisk = finalSim.ripple_score;
      const afterCrit = recalcedCounts.CRITICAL;
      const afterSpillover = finalSim.secondary_spillover_rate;

      setSimulationResultBanner({
        beforeRisk,
        afterRisk,
        beforeCrit,
        afterCrit,
        beforeSpillover,
        afterSpillover,
        daysToStockoutEarliest: Math.min(...recalcedFacs.map(f => f.days_until_stockout || 99))
      });

      logAudit('SIMULATION_RUN', {
        delay_days: supplierDelay,
        surge_pct: demandSurge,
        severed: infrastructureSeverance,
        result_ripple: afterRisk,
        critical_count: afterCrit
      });

      showToast(
        afterRisk > beforeRisk ? 'warning' : 'success',
        `Simulation calculated: Ripple score moved from ${beforeRisk} to ${afterRisk}.`,
        'Disruption Simulation Computed'
      );
    }
  };

  // Timeline Step Scrubbing
  const handleSelectTimelineDay = async (day) => {
    setTimelineDay(day);
    const sim = await simulateDisruption(selectedMedicineId, {
      medicine_id: selectedMedicineId,
      supplier_delay_days: supplierDelay,
      outbreak_surge_pct: demandSurge,
      infrastructure_severance: infrastructureSeverance,
      timeline_day: day
    });
    if (sim) {
      const { facilities: recalcedFacs, counts: recalcedCounts } = applyThresholdsToFacilities(sim.facilities);
      setSimData({
        ...sim,
        facilities: recalcedFacs,
        counts: recalcedCounts
      });
    }
  };

  // Reset Simulation to Baseline
  const handleResetSimulation = () => {
    requestConfirmation({
      title: 'Reset Disruption Simulation?',
      message: 'This will restore all operational parameters, facility stock rates, and ripple metrics to their verified baseline state.',
      confirmLabel: 'Reset to Baseline',
      onConfirm: () => {
        setSupplierDelay(15);
        setDemandSurge(40);
        setInfrastructureSeverance(false);
        setTimelineDay(0);
        setSimulationResultBanner(null);
        setIsSimulationActive(false);

        if (baselineSimData) {
          const { facilities: recalcedFacs, counts: recalcedCounts } = applyThresholdsToFacilities(baselineSimData.facilities);
          setSimData({
            ...baselineSimData,
            facilities: recalcedFacs,
            counts: recalcedCounts
          });
        }
        logAudit('SIMULATION_RESET', { medicine_id: selectedMedicineId });
        showToast('info', 'Simulation restored to verified baseline parameters.');
      }
    });
  };

  // Synthesize Minimum Intervention Rebalance (MIO)
  const handleSynthesizeRebalance = async () => {
    setSimLoading(true);
    const reb = await synthesizeRebalance(selectedMedicineId);
    setSimLoading(false);

    if (reb) {
      setRebalanceData(reb);
      showToast('success', `Optimized rebalancing generated: ${reb.recommended_transfers.length} precision transfers proposed.`);
      logAudit('REBALANCE_SYNTHESIZED', {
        transfers_count: reb.recommended_transfers.length,
        risk_reduction: reb.risk_reduction_pct
      });
    }
  };

  // Approve Transfer Workflow (Human in the Loop)
  const handleApproveTransfer = (transfer) => {
    requestConfirmation({
      title: `Approve Transfer ${transfer.transfer_id}?`,
      message: `Authorize emergency transfer of ${transfer.transfer_volume} units from ${transfer.source_name} to ${transfer.target_name}?`,
      details: {
        'Transfer Volume': `${transfer.transfer_volume} units`,
        'Donor Facility': transfer.source_name,
        'Recipient Facility': transfer.target_name,
        'Logistics Route': `${transfer.distance_km} km via NH corridor (ETA: ${transfer.transit_hours} hrs)`,
        'Estimated Transit Cost': `₹${transfer.cost_inr}`,
        'Strategy': transfer.strategies?.join(' • ') || 'FEFO Optimization'
      },
      confirmLabel: 'Approve & Prepare Dispatch',
      onConfirm: async () => {
        // 1. Call backend approval
        await approveTransferApi(selectedMedicineId, transfer.transfer_id, viewRole);

        // 2. Mark transfer as APPROVED in rebalance data
        setApprovedTransfers(prev => ({
          ...prev,
          [transfer.transfer_id]: { ...transfer, approvedAt: new Date().toLocaleTimeString() }
        }));

        setRebalanceData(prev => ({
          ...prev,
          recommended_transfers: prev.recommended_transfers.map(t =>
            t.transfer_id === transfer.transfer_id ? { ...t, status: 'APPROVED' } : t
          )
        }));

        // 3. Update Facility Inventory (Donor deduction, Recipient incoming credit)
        setSimData(prev => {
          const updatedFacs = prev.facilities.map(f => {
            if (f.id === transfer.source_id) {
              const newStock = Math.max(0, f.current_stock - transfer.transfer_volume);
              const days = roundValue(newStock / Math.max(1, f.daily_consumption), 1);
              return { ...f, current_stock: newStock, days_until_stockout: days };
            }
            if (f.id === transfer.target_id) {
              const newStock = f.current_stock + transfer.transfer_volume;
              const days = roundValue(newStock / Math.max(1, f.daily_consumption), 1);
              return { ...f, current_stock: newStock, days_until_stockout: days };
            }
            return f;
          });
          const { facilities: recalcedFacs, counts: recalcedCounts } = applyThresholdsToFacilities(updatedFacs);

          return {
            ...prev,
            facilities: recalcedFacs,
            counts: recalcedCounts,
            ripple_score: Math.max(18, prev.ripple_score - 16),
            ripple_status: (prev.ripple_score - 16 <= 40) ? 'Stable' : 'Elevated Risk'
          };
        });

        // 4. Update Inventory Table state
        setInventoryData(prev => {
          if (!prev?.inventory) return prev;
          const updated = prev.inventory.map(row => {
            if (row.facility_id === transfer.source_id) {
              const newStock = Math.max(0, row.current_stock - transfer.transfer_volume);
              return { ...row, current_stock: newStock, available_stock: Math.floor(newStock * 0.85) };
            }
            if (row.facility_id === transfer.target_id) {
              const newStock = row.current_stock + transfer.transfer_volume;
              return { ...row, current_stock: newStock, incoming_stock: (row.incoming_stock || 0) + transfer.transfer_volume };
            }
            return row;
          });
          return { ...prev, inventory: updated };
        });

        // 5. Audit Log
        logAudit('TRANSFER_APPROVED', {
          transfer_id: transfer.transfer_id,
          source: transfer.source_name,
          target: transfer.target_name,
          units: transfer.transfer_volume,
          cost_inr: transfer.cost_inr
        });

        // 6. Confetti Celebration
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#2563eb', '#10b981', '#7c3aed', '#38bdf8']
        });

        showToast('success', `Transfer ${transfer.transfer_id} approved. Inventory rebalanced.`);

        // 7. Auto-open SMS Modal for field notification
        setModalTransfer(transfer);
        setIsRuralModalOpen(true);
      }
    });
  };

  // Alert Actions: Acknowledge, Resolve
  const handleAcknowledgeAlert = (alertId) => {
    setAlertsData(prev => prev.map(a =>
      a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a
    ));
    logAudit('ALERT_ACKNOWLEDGED', { alert_id: alertId });
    showToast('info', `Alert #${alertId} marked as acknowledged.`);
  };

  const handleResolveAlert = (alertId) => {
    setAlertsData(prev => prev.filter(a => a.id !== alertId));
    logAudit('ALERT_RESOLVED', { alert_id: alertId });
    showToast('success', `Alert #${alertId} resolved and archived.`);
  };

  // Facility Selection & Drawer
  const handleSelectFacility = async (facId) => {
    setSelectedFacilityId(facId);
    const ins = await fetchExplainableInsights(selectedMedicineId, facId);
    if (ins) setInsightData(ins);
  };

  const openFacilityDrawer = async (facId) => {
    await handleSelectFacility(facId);
    setFacilityDrawerOpen(true);
  };

  const closeFacilityDrawer = () => {
    setFacilityDrawerOpen(false);
  };

  // Operational Settings Update
  const handleUpdateSettings = async (newSettings) => {
    if (newSettings.donor_floor_days <= newSettings.critical_threshold_days) {
      showToast('error', 'Donor Buffer Floor must be strictly greater than Critical Stockout Threshold.');
      return false;
    }

    requestConfirmation({
      title: 'Update Global Clinical Thresholds?',
      message: 'Changing these thresholds will immediately recalculate risk classifications, map color codings, alert triages, and rebalancing recommendations across all 12 facilities.',
      details: {
        'Critical Stockout Threshold': `≤ ${newSettings.critical_threshold_days} days (was ≤ ${settings.critical_threshold_days}d)`,
        'Donor Buffer Protection Floor': `> ${newSettings.donor_floor_days} days (was > ${settings.donor_floor_days}d)`,
        'FEFO Expiry Window': `< ${newSettings.expiry_window_days} days`
      },
      confirmLabel: 'Save & Recalculate System',
      onConfirm: async () => {
        const saved = await apiUpdateSettings(newSettings);
        setSettings(saved);

        // Recalculate active facility statuses immediately
        if (simData?.facilities) {
          const { facilities: recalcedFacs, counts: recalcedCounts } = applyThresholdsToFacilities(simData.facilities, saved.critical_threshold_days);
          setSimData(prev => ({
            ...prev,
            facilities: recalcedFacs,
            counts: recalcedCounts
          }));
        }

        logAudit('SETTINGS_SAVED', {
          critical_threshold: saved.critical_threshold_days,
          donor_floor: saved.donor_floor_days
        });

        showToast('success', 'Operational thresholds saved. All 12 facilities reclassified.');
      }
    });
    return true;
  };

  // Dispatch Rural SMS
  const handleDispatchSms = async (smsPayload) => {
    const res = await dispatchRuralSms(smsPayload);
    const newEntry = {
      id: res.sms_id || `SMS-TN-${Date.now().toString(36).toUpperCase()}`,
      facility_id: smsPayload.facility_id,
      facility_name: smsPayload.recipient_name,
      recipient: smsPayload.recipient_name,
      phone: smsPayload.recipient_phone,
      transfer_id: smsPayload.transfer_id,
      message_text: smsPayload.message_text,
      timestamp: systemTime || new Date().toLocaleTimeString(),
      status: 'DELIVERED_TO_GSM_GATEWAY',
      delivery_receipt: res.delivery_receipt || `AIRTEL-TN-MSG-9821`
    };
    setSmsHistory(prev => [newEntry, ...prev]);

    // Mark transfer as DISPATCHED
    if (smsPayload.transfer_id) {
      setRebalanceData(prev => ({
        ...prev,
        recommended_transfers: prev.recommended_transfers.map(t =>
          t.transfer_id === smsPayload.transfer_id ? { ...t, status: 'DISPATCHED' } : t
        )
      }));
    }

    logAudit('SMS_DISPATCHED', {
      sms_id: newEntry.id,
      phone: smsPayload.recipient_phone,
      transfer_id: smsPayload.transfer_id
    });

    showToast('success', `SMS broadcast delivered to 2G GSM cellular gateway for ${smsPayload.recipient_name}.`);
    return res;
  };

  // 1. Patient Impact Analytics (Memoized)
  const patientImpactData = useMemo(() => {
    const currentRipple = simData?.ripple_score || 84;
    const criticalFacs = simData?.counts?.CRITICAL || 4;
    const spillover = simData?.secondary_spillover_rate || 128;
    const baselinePatientsAtRisk = Math.round(criticalFacs * 240 + spillover * 2.2); // ~1,240
    const postRisk = rebalanceData?.post_rebalance_risk || 19;
    const mitigatedPatientsAtRisk = Math.round(baselinePatientsAtRisk * (postRisk / Math.max(1, currentRipple)));
    const patientsProtected = Math.max(0, baselinePatientsAtRisk - mitigatedPatientsAtRisk);

    return {
      baselinePatientsAtRisk,
      mitigatedPatientsAtRisk,
      patientsProtected,
      facilitiesAtRisk: criticalFacs,
      facilitiesProtected: Math.max(0, criticalFacs - 1),
      cascadeBeginsInDays: Math.min(...(simData?.facilities?.map(f => f.days_until_stockout) || [4.2])),
      interventionAvertedRatio: Math.round((patientsProtected / Math.max(1, baselinePatientsAtRisk)) * 100)
    };
  }, [simData, rebalanceData]);

  // 2. 72-Hour Impending Critical Radar (Memoized)
  const earlyWarningData = useMemo(() => {
    const facs = simData?.facilities || [];
    const h24 = [];
    const h48 = [];
    const h72 = [];

    facs.forEach(f => {
      const days = f.days_until_stockout;
      const hours = Math.round(days * 24);
      if (hours <= 24) {
        h24.push({ ...f, countdownHours: hours, urgency: 'EMERGENCY_COLLAPSE' });
      } else if (hours <= 48) {
        h48.push({ ...f, countdownHours: hours, urgency: 'CRITICAL_SPUR' });
      } else if (hours <= 72) {
        h72.push({ ...f, countdownHours: hours, urgency: 'BUFFER_DEPLETION' });
      }
    });

    return { h24, h48, h72, totalThreats: h24.length + h48.length + h72.length };
  }, [simData]);

  // 3. Causal Crisis Graph Chain (Memoized)
  const causalChainData = useMemo(() => {
    return [
      { id: 'supplier_delay', label: 'Supplier Transit Delay', metric: `+${supplierDelay} Days`, severity: 'HIGH', impactPct: 42, color: '#f59e0b', desc: 'Active container consignment held up at port depot corridor.' },
      { id: 'inventory_deficit', label: 'Local Inventory Deficit', metric: `${simData?.counts?.CRITICAL || 4} Depleted`, severity: 'CRITICAL', impactPct: 35, color: '#ef4444', desc: 'Days of supply plunged below clinical safety threshold.' },
      { id: 'stockout_risk', label: 'Stockout Risk Window', metric: '4.2 Days Horizon', severity: 'CRITICAL', impactPct: 28, color: '#dc2626', desc: 'Epicenter healthcare clinic shelf reaches zero physical stock.' },
      { id: 'unmet_demand', label: 'Unmet Prescriptions', metric: '100% at Epicenter', severity: 'HIGH', impactPct: 22, color: '#ea580c', desc: 'Patients unable to receive vital prescription medications.' },
      { id: 'patient_drift', label: 'Wandering Patient Migration', metric: `+${simData?.secondary_spillover_rate || 128} pts/day`, severity: 'HIGH', impactPct: 18, color: '#9333ea', desc: 'Vulnerable patient flow moves towards closest secondary clinics.' },
      { id: 'neighbor_load', label: 'Neighbor Buffer Drain', metric: '3.2x Velocity', severity: 'MODERATE', impactPct: 15, color: '#7c3aed', desc: 'Surrounding CHC safety stocks depleted 3x faster than scheduled.' },
      { id: 'secondary_stockout', label: 'Secondary Facility Failure', metric: '2 More Centers', severity: 'CRITICAL', impactPct: 12, color: '#b91c1c', desc: 'Secondary healthcare tier collapses without external intervention.' },
      { id: 'regional_ripple', label: 'Regional Cascade Ripple', metric: `Score: ${simData?.ripple_score || 84}/100`, severity: 'CRITICAL', impactPct: 100, color: '#dc2626', desc: 'Entire district healthcare delivery chain enters systemic failure.' }
    ];
  }, [supplierDelay, simData]);

  // 4. Crisis War Room Simulation State
  const [warRoomState, setWarRoomState] = useState({
    day: 4,
    selectedInterventions: ['TRANSFER_340', 'SMS_ALERT'],
    isExecuting: false,
    simulatedResult: null
  });

  const runWarRoomScenario = useCallback((interventions, day) => {
    setWarRoomState(prev => ({ ...prev, isExecuting: true }));
    setTimeout(() => {
      const baseRisk = simData?.ripple_score || 84;
      let reduction = 0;
      let patientsSaved = 0;
      if (interventions.includes('TRANSFER_340')) { reduction += 38; patientsSaved += 540; }
      if (interventions.includes('DEPOT_EMERGENCY')) { reduction += 22; patientsSaved += 320; }
      if (interventions.includes('SMS_ALERT')) { reduction += 12; patientsSaved += 180; }
      if (interventions.includes('REDIRECT_PATIENTS')) { reduction += 8; patientsSaved += 120; }
      if (interventions.includes('ALTERNATE_ROUTE')) { reduction += 6; patientsSaved += 80; }

      const postRisk = Math.max(16, baseRisk - reduction);
      const beforePatients = patientImpactData.baselinePatientsAtRisk;
      const afterPatients = Math.max(90, beforePatients - patientsSaved);

      setWarRoomState(prev => ({
        ...prev,
        day,
        selectedInterventions: interventions,
        isExecuting: false,
        simulatedResult: {
          beforeRisk: baseRisk,
          afterRisk: postRisk,
          beforeCritical: simData?.counts?.CRITICAL || 4,
          afterCritical: Math.max(1, (simData?.counts?.CRITICAL || 4) - (reduction > 30 ? 2 : 1)),
          beforePatients,
          afterPatients,
          patientsSaved: Math.min(beforePatients - 90, patientsSaved),
          riskReductionPct: Math.round(((baseRisk - postRisk) / baseRisk) * 100)
        }
      }));
    }, 500);
  }, [simData, patientImpactData]);

  // Unresolved alerts count for Sidebar Badge
  const unresolvedAlertsCount = alertsData.filter(a => a.status === 'ACTIVE').length;

  return (
    <AppContext.Provider value={{
      // Navigation & Layout
      activeTab,
      setActiveTab,
      sidebarCollapsed,
      setSidebarCollapsed,
      toggleSidebar,

      // Authentication & Role
      currentUser,
      setCurrentUser,
      loginModalOpen,
      setLoginModalOpen,
      loginAsRole,
      switchRole,
      updateCurrentUser,
      logout,
      canAccessTab,
      canApproveTransfers,
      canDispatchSms,
      canEditSettings,
      canRunWarRoom,
      ROLE_PERMISSIONS,

      // Decision Support & Standout Features
      patientImpactData,
      earlyWarningData,
      causalChainData,
      warRoomState,
      setWarRoomState,
      runWarRoomScenario,

      // System Health & Time
      backendStatus,
      lastCheckedTime,
      systemTime,
      checkHealth,

      // Selectors
      medicines,
      selectedMedicineId,
      selectedMedicine,
      handleSelectMedicine,
      regions,
      selectedRegionId,
      handleSelectRegion,
      viewRole,
      handleSelectRole,

      // Loading
      loadingMedicine,
      simLoading,

      // Simulation
      simData,
      isSimulationActive,
      supplierDelay,
      setSupplierDelay,
      demandSurge,
      setDemandSurge,
      infrastructureSeverance,
      setInfrastructureSeverance,
      timelineDay,
      handleRunSimulation,
      handleSelectTimelineDay,
      handleResetSimulation,
      simulationResultBanner,

      // Rebalancing & Transfers
      rebalanceData,
      handleSynthesizeRebalance,
      approvedTransfers,
      handleApproveTransfer,

      // Facilities & Inventory
      selectedFacilityId,
      epicenterId,
      insightData,
      inventoryData,
      handleSelectFacility,
      facilityDrawerOpen,
      openFacilityDrawer,
      closeFacilityDrawer,

      // Alerts
      alertsData,
      unresolvedAlertsCount,
      handleAcknowledgeAlert,
      handleResolveAlert,

      // Reports
      reportData,

      // Settings
      settings,
      handleUpdateSettings,

      // Rural SMS
      smsHistory,
      handleDispatchSms,
      isRuralModalOpen,
      setIsRuralModalOpen,
      modalTransfer,
      setModalTransfer,

      // Audit Log
      auditTrail,
      logAudit,

      // Feedback & Dialogs
      toasts,
      showToast,
      removeToast,
      confirmModal,
      requestConfirmation,
      closeConfirmation
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

function roundValue(val, decimals = 1) {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}
