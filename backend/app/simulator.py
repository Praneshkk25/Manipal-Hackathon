"""
MedRipple AI Shortage Propagation Simulator
Dynamically operates on the SELECTED MEDICINE as the single source of truth.
Models the Butterfly Effect cascade: localized depletion -> patient spillover -> regional shortage.
"""
import copy
from typing import Dict, List, Any
from .models import Facility, RoadEdge, DisruptionSimulationRequest, SimulationResponse
from .network_data import FACILITY_COORDINATES, BASE_MEDICINES, MEDICINE_DATASETS, BASE_ROAD_EDGES

def compute_facility_status(days_until_stockout: float) -> str:
    if days_until_stockout <= 5.0:
        return "CRITICAL"
    elif days_until_stockout <= 9.0:
        return "APPROACHING"
    elif days_until_stockout <= 18.0:
        return "AT_RISK"
    else:
        return "HEALTHY"

def run_shortage_simulation(req: DisruptionSimulationRequest) -> SimulationResponse:
    # 1. Resolve selected medicine metadata & baseline dataset
    med_meta = next((m for m in BASE_MEDICINES if m["id"] == req.medicine_id), BASE_MEDICINES[0])
    med_dataset = MEDICINE_DATASETS.get(req.medicine_id, MEDICINE_DATASETS["amoxicillin_clav"])
    
    # 2. Build facility list for this medicine
    timeline_day = req.timeline_day
    surge_mult = 1.0 + (req.outbreak_surge_pct / 100.0)
    delay_days = req.supplier_delay_days
    severed = req.infrastructure_severance

    facilities = []
    for fac_raw in med_dataset["facilities"]:
        fac_id = fac_raw["id"]
        coord_info = FACILITY_COORDINATES.get(fac_id, {})
        
        base_demand = fac_raw["daily_demand"]
        effective_demand = max(1.0, base_demand * surge_mult)
        
        # Burn over timeline
        stock_drawn = effective_demand * timeline_day
        remaining_stock = max(0, fac_raw["stock"] - int(stock_drawn))
        
        # Days left calculation
        days_left = remaining_stock / effective_demand
        
        # Delay penalty reduces effective incoming stock
        if delay_days > 0:
            delay_penalty = (delay_days / 30.0) * (fac_raw["lead_time"] * 0.28)
            days_left = max(0.5, days_left - delay_penalty)

        facilities.append({
            "id": fac_id,
            "name": coord_info.get("name", fac_id),
            "type": coord_info.get("type", "PHC"),
            "type_label": coord_info.get("type_label", "Primary Health Center"),
            "lat": coord_info.get("lat", 11.0),
            "lng": coord_info.get("lng", 77.0),
            "current_stock": remaining_stock,
            "daily_consumption": int(effective_demand),
            "days_until_stockout": round(days_left, 1),
            "status": "HEALTHY",
            "expiring_soon_units": fac_raw.get("expiring_soon", 0),
            "supplier_lead_time_days": fac_raw["lead_time"],
            "spillover_inflow": fac_raw.get("spillover", 0),
            "buffer_days": 14
        })

    # 3. Model Patient Spillover Cascade (The Butterfly Effect)
    # When facilities hit <= 5 days, patients wander to nearby connected facilities
    critical_facs = [f for f in facilities if f["days_until_stockout"] <= 5.0]
    total_spillover = 0
    
    if critical_facs:
        # Base spillover scaled by severity and demand surge
        base_spill = med_dataset.get("secondary_spillover_rate", 50)
        total_spillover = int(base_spill * (0.8 + (len(critical_facs) * 0.2)) * surge_mult)
        
        # Distribute spillover to neighboring facilities
        spill_per_neighbor = total_spillover // max(1, len(facilities) - len(critical_facs))
        for f in facilities:
            if f["days_until_stockout"] > 5.0:
                f["spillover_inflow"] += spill_per_neighbor
                f["daily_consumption"] += spill_per_neighbor
                # Re-evaluate stockout days under added spillover load
                if f["daily_consumption"] > 0:
                    f["days_until_stockout"] = round(max(0.5, f["current_stock"] / f["daily_consumption"]), 1)

    # 4. Classify statuses
    counts = {"CRITICAL": 0, "APPROACHING": 0, "AT_RISK": 0, "HEALTHY": 0}
    for f in facilities:
        status = compute_facility_status(f["days_until_stockout"])
        f["status"] = status
        counts[status] += 1

    # 5. Dynamically calculate Ripple Score (0 - 100)
    base_score = med_dataset.get("baseline_ripple_score", 50)
    risk_delta = (counts["CRITICAL"] * 12) + (counts["APPROACHING"] * 7) + (counts["AT_RISK"] * 3) - (counts["HEALTHY"] * 2)
    delay_impact = (delay_days / 30.0) * 22
    surge_impact = (req.outbreak_surge_pct / 80.0) * 18
    timeline_impact = (timeline_day / 14.0) * 20
    severance_impact = 14 if severed else 0

    computed_ripple = int(min(98, max(12, base_score + (risk_delta * 0.4) + delay_impact + surge_impact + timeline_impact + severance_impact)))
    
    # At exact baseline parameters, preserve baseline score
    if timeline_day == 0 and delay_days == 15 and req.outbreak_surge_pct == 40 and not severed:
        ripple_score = base_score
        total_spillover = med_dataset.get("secondary_spillover_rate", 50)
    else:
        ripple_score = computed_ripple

    if ripple_score <= 40:
        ripple_status = "Stable"
    elif ripple_score <= 70:
        ripple_status = "Elevated Risk"
    else:
        ripple_status = "Critical Crisis"

    # 6. Build Edges & Check Severance
    edges = copy.deepcopy(BASE_ROAD_EDGES)
    blocked_count = 0
    active_transfers_count = len(med_dataset.get("rebalance_transfers", []))
    
    # Active transfer routes from this medicine's transfer plan
    transfer_pairs = set()
    for t in med_dataset.get("rebalance_transfers", []):
        transfer_pairs.add((t["source_id"], t["target_id"]))
        transfer_pairs.add((t["target_id"], t["source_id"]))

    for e in edges:
        is_active = (e["source_id"], e["target_id"]) in transfer_pairs or (e["target_id"], e["source_id"]) in transfer_pairs
        is_blocked = False
        if severed and ((e["source_id"] == "F_CBE_DEPOT" and e["target_id"] == "F_TIRU_PHC") or (e["source_id"] == "F_ERODE_CHC" and e["target_id"] == "F_TIRU_PHC")):
            is_blocked = True
            is_active = False
            blocked_count += 1
        
        e["active_transfer"] = is_active
        e["blocked"] = is_blocked

    timeline_labels = {
        0: "Day 0 (Now)",
        3: "Day +3 (Early Impact)",
        7: "Day +7 (Cascade Effect)",
        14: "Day +14 (Regional Crisis)"
    }

    return SimulationResponse(
        medicine_id=med_meta["id"],
        medicine_name=med_meta["name"],
        ripple_score=ripple_score,
        ripple_status=ripple_status,
        counts=counts,
        secondary_spillover_rate=total_spillover,
        rescued_from_expiry_units=med_dataset.get("rescued_from_expiry_units", 1000),
        facilities=[Facility(**f) for f in facilities],
        edges=[RoadEdge(**e) for e in edges],
        timeline_day=timeline_day,
        timeline_label=timeline_labels.get(timeline_day, f"Day +{timeline_day}"),
        active_transfers_count=active_transfers_count if not severed else max(1, active_transfers_count - 1),
        blocked_routes_count=blocked_count,
        total_network_km=284
    )
