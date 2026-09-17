import os
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Facility(BaseModel):
    id: str
    name: str
    type: str  # 'DEPOT', 'DISTRICT_HOSPITAL', 'CHC', 'PHC'
    type_label: str
    lat: float
    lng: float
    current_stock: int
    daily_consumption: int
    days_until_stockout: float
    status: str  # 'CRITICAL', 'APPROACHING', 'AT_RISK', 'HEALTHY'
    expiring_soon_units: int  # < 45 days
    supplier_lead_time_days: int
    spillover_inflow: int = 0
    buffer_days: int = 14

class RoadEdge(BaseModel):
    source_id: str
    target_id: str
    distance_km: int
    transit_hours: float
    active_transfer: bool = False
    blocked: bool = False

class DisruptionSimulationRequest(BaseModel):
    medicine_id: str = "insulin_glargine"
    supplier_delay_days: int = Field(default=15, ge=0, le=30)
    outbreak_surge_pct: int = Field(default=40, ge=0, le=80)
    infrastructure_severance: bool = False
    timeline_day: int = Field(default=0, ge=0, le=14)

class SimulationResponse(BaseModel):
    medicine_id: str
    medicine_name: str
    ripple_score: int
    ripple_status: str  # 'Stable', 'Elevated Risk', 'Critical Crisis'
    counts: Dict[str, int]
    secondary_spillover_rate: int
    rescued_from_expiry_units: int
    facilities: List[Facility]
    edges: List[RoadEdge]
    timeline_day: int
    timeline_label: str
    active_transfers_count: int
    blocked_routes_count: int
    total_network_km: int

class TransferRecommendation(BaseModel):
    transfer_id: str
    source_id: str
    source_name: str
    target_id: str
    target_name: str
    target_urgency_days: int
    transfer_volume: int
    distance_km: int
    transit_hours: float
    strategies: List[str]
    cost_inr: int
    status: str = "RECOMMENDED"

class RebalanceResponse(BaseModel):
    status: str
    pre_rebalance_risk: int
    post_rebalance_risk: int
    risk_reduction_pct: float
    recommended_transfers: List[TransferRecommendation]
    total_units_moved: int
    total_cost_inr: int
    expiry_units_saved: int

class ShapFactor(BaseModel):
    name: str
    percentage: int
    color: str

class ExplainableInsightResponse(BaseModel):
    facility_id: str
    facility_name: str
    status: str
    ai_confidence_pct: int
    uncertainty_margin_days: float
    headline_alert: str
    shap_factors: List[ShapFactor]
    inventory_summary: Dict[str, Any]
    batch_breakdown: List[Dict[str, Any]]
    uncertainty_details: Dict[str, Any]

class RuralSmsPayload(BaseModel):
    facility_id: str
    recipient_phone: str = "+91 94421 88301"
    recipient_name: str = "Sister Jayalakshmi (PHC Head Nurse)"
    message_text: str
    dispatch_code: str
    transfer_id: str

class SystemSettings(BaseModel):
    critical_threshold_days: float = Field(default=5.0, gt=0, le=20)
    donor_floor_days: float = Field(default=18.0, gt=5, le=45)
    expiry_window_days: int = Field(default=45, gt=5, le=120)
    fastapi_gateway_host: str = "http://localhost:8000"

class TransferApprovalRequest(BaseModel):
    transfer_id: Optional[str] = None
    approved_by_role: str = "District Health Officer"
    notes: Optional[str] = None

class TransferApprovalResponse(BaseModel):
    success: bool
    transfer_id: str
    source_id: str
    target_id: str
    units_transferred: int
    donor_remaining_stock: int
    target_projected_stock: int
    status: str = "APPROVED"
    timestamp: str

class AuditLogEntry(BaseModel):
    id: str
    timestamp: str
    user_role: str
    action: str
    medicine_id: str
    details: Dict[str, Any]

class Region(BaseModel):
    id: str
    name: str
    state: str
    is_demo: bool
    facility_count: int
    district_hq: str

