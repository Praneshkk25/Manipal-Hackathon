"""
Tamil Nadu Healthcare Network Topology & Multi-Medicine Datasets
Comprehensive, distinct, and realistic datasets for 8 essential medicines across 12 facilities.
"""
from typing import Dict, List, Any

# 12 Healthcare Facilities in Central & Western Tamil Nadu
FACILITY_COORDINATES: Dict[str, Dict[str, Any]] = {
    "F_CBE_DEPOT": {"name": "Coimbatore Depot", "type": "DEPOT", "type_label": "Central Warehouse / Depot", "lat": 11.0168, "lng": 76.9558, "x": 165, "y": 90},
    "F_ERODE_CHC": {"name": "Erode CHC", "type": "CHC", "type_label": "Community Health Center (CHC)", "lat": 11.3410, "lng": 77.7172, "x": 255, "y": 175},
    "F_TIRU_PHC": {"name": "Tiruchengode PHC", "type": "PHC", "type_label": "Primary Health Center (PHC)", "lat": 11.3789, "lng": 77.8967, "x": 365, "y": 245},
    "F_SALEM_CHC": {"name": "Salem CHC", "type": "CHC", "type_label": "Community Health Center (CHC)", "lat": 11.6643, "lng": 78.1460, "x": 525, "y": 155},
    "F_NAMAK_PHC": {"name": "Namakkal PHC", "type": "PHC", "type_label": "Primary Health Center (PHC)", "lat": 11.2189, "lng": 78.1674, "x": 625, "y": 250},
    "F_KARUR_DH": {"name": "Karur District Hospital", "type": "DISTRICT_HOSPITAL", "type_label": "District Hospital", "lat": 10.9601, "lng": 78.0766, "x": 525, "y": 365},
    "F_DIND_CHC": {"name": "Dindigul CHC", "type": "CHC", "type_label": "Community Health Center (CHC)", "lat": 10.3673, "lng": 77.9803, "x": 335, "y": 440},
    "F_MADU_PHC": {"name": "Madurai PHC", "type": "PHC", "type_label": "Primary Health Center (PHC)", "lat": 9.9252, "lng": 78.1198, "x": 515, "y": 475},
    "F_TRICHY_CHC": {"name": "Trichy CHC", "type": "CHC", "type_label": "Community Health Center (CHC)", "lat": 10.7905, "lng": 78.7047, "x": 695, "y": 435},
    "F_DHARMA_DH": {"name": "Dharmapuri District Hospital", "type": "DISTRICT_HOSPITAL", "type_label": "District Hospital", "lat": 12.1211, "lng": 78.1582, "x": 580, "y": 65},
    "F_PERAM_PHC": {"name": "Perambalur PHC", "type": "PHC", "type_label": "Primary Health Center (PHC)", "lat": 11.2342, "lng": 78.8820, "x": 750, "y": 320},
    "F_THANJ_DH": {"name": "Thanjavur Medical College Hospital", "type": "DISTRICT_HOSPITAL", "type_label": "District Hospital", "lat": 10.7870, "lng": 79.1378, "x": 790, "y": 460}
}

BASE_MEDICINES: List[Dict[str, Any]] = [
    {
        "id": "amoxicillin_clav",
        "name": "Amoxicillin + Clavulanic Acid 625mg",
        "category": "Essential Broad-Spectrum Antibiotic",
        "unit": "Strip of 10 Tablets",
        "storage_temp": "Room Temp (<25°C)",
        "default_lead_time_days": 10,
        "critical_threshold_days": 5,
        "shortage_description": "Severe respiratory tract bacterial infection spike following monsoon dampness."
    },
    {
        "id": "insulin_glargine",
        "name": "Insulin Glargine (Cold-chain life-saving)",
        "category": "Endocrinology / Cold-Chain Biologic",
        "unit": "10ml Vials (100 IU/ml)",
        "storage_temp": "2°C - 8°C Strict Cold Chain",
        "default_lead_time_days": 12,
        "critical_threshold_days": 5,
        "shortage_description": "Cold-chain distribution delay from national depot triggering rural stock depletion."
    },
    {
        "id": "paracetamol_500",
        "name": "Paracetamol 500mg Tablets",
        "category": "Essential Antipyretic / Analgesic",
        "unit": "Box of 100 Tablets",
        "storage_temp": "Room Temp (<30°C)",
        "default_lead_time_days": 5,
        "critical_threshold_days": 4,
        "shortage_description": "Massive seasonal viral flu surge driving 3x higher community OPD consumption."
    },
    {
        "id": "azithromycin_500",
        "name": "Azithromycin 500mg Tablets",
        "category": "Macrolide Antibiotic",
        "unit": "Strip of 6 Tablets",
        "storage_temp": "Room Temp (<25°C)",
        "default_lead_time_days": 14,
        "critical_threshold_days": 5,
        "shortage_description": "Active Pharmaceutical Ingredient (API) supply bottleneck from supplier port."
    },
    {
        "id": "ceftriaxone_1g",
        "name": "Ceftriaxone 1g Injection",
        "category": "Critical Inpatient Cephalosporin",
        "unit": "Vial with Sterile Water",
        "storage_temp": "Controlled Room Temp (<25°C)",
        "default_lead_time_days": 8,
        "critical_threshold_days": 4,
        "shortage_description": "Inpatient surgical and sepsis ICU demand exceeding tertiary hospital allocations."
    },
    {
        "id": "ors_sachets",
        "name": "Oral Rehydration Salts (ORS Sachets)",
        "category": "Pediatric & Dehydration Essential",
        "unit": "20.5g WHO-Formula Sachets",
        "storage_temp": "Dry Room Temp (<30°C)",
        "default_lead_time_days": 6,
        "critical_threshold_days": 5,
        "shortage_description": "Localized water contamination outbreak causing acute pediatric diarrhea wave."
    },
    {
        "id": "rabies_vaccine",
        "name": "Anti-Rabies Vaccine (PVRV Human)",
        "category": "Zero-Tolerance Emergency Biological",
        "unit": "Single Dose Vial (0.5ml)",
        "storage_temp": "2°C - 8°C Strict Cold Chain",
        "default_lead_time_days": 16,
        "critical_threshold_days": 3,
        "shortage_description": "High animal-bite incidence in peri-urban agrarian belts exhausting emergency buffers."
    },
    {
        "id": "oxytocin_10iu",
        "name": "Oxytocin 10 IU Injection",
        "category": "Life-Saving Maternal Health",
        "unit": "1ml Ampoules",
        "storage_temp": "2°C - 8°C Cold Chain",
        "default_lead_time_days": 9,
        "critical_threshold_days": 4,
        "shortage_description": "Obstetric post-partum hemorrhage prevention stock run across rural labor rooms."
    }
]

# Baseline datasets for EVERY medicine across the 12 facilities
# Each medicine has completely distinct stock distributions, demand, expiry, batches, and risk
MEDICINE_DATASETS: Dict[str, Dict[str, Any]] = {
    # 1. AMOXICILLIN + CLAVULANIC ACID 625MG
    "amoxicillin_clav": {
        "epicenter_facility_id": "F_TIRU_PHC",
        "baseline_ripple_score": 84,
        "ripple_status": "Critical Crisis",
        "secondary_spillover_rate": 128,
        "rescued_from_expiry_units": 820,
        "baseline_regional_risk": 89,
        "post_rebalance_risk": 19,
        "risk_reduction_pct": 78.7,
        "facilities": [
            {"id": "F_CBE_DEPOT", "stock": 5800, "daily_demand": 210, "lead_time": 10, "expiring_soon": 350, "spillover": 0},
            {"id": "F_ERODE_CHC", "stock": 260, "daily_demand": 80, "lead_time": 8, "expiring_soon": 0, "spillover": 35},
            {"id": "F_TIRU_PHC", "stock": 140, "daily_demand": 70, "lead_time": 12, "expiring_soon": 0, "spillover": 45},
            {"id": "F_SALEM_CHC", "stock": 2450, "daily_demand": 110, "lead_time": 9, "expiring_soon": 470, "spillover": 0},
            {"id": "F_NAMAK_PHC", "stock": 210, "daily_demand": 65, "lead_time": 11, "expiring_soon": 0, "spillover": 30},
            {"id": "F_KARUR_DH", "stock": 3100, "daily_demand": 130, "lead_time": 9, "expiring_soon": 280, "spillover": 0},
            {"id": "F_DIND_CHC", "stock": 420, "daily_demand": 75, "lead_time": 8, "expiring_soon": 0, "spillover": 18},
            {"id": "F_MADU_PHC", "stock": 1340, "daily_demand": 60, "lead_time": 10, "expiring_soon": 90, "spillover": 0},
            {"id": "F_TRICHY_CHC", "stock": 310, "daily_demand": 85, "lead_time": 8, "expiring_soon": 0, "spillover": 25},
            {"id": "F_DHARMA_DH", "stock": 380, "daily_demand": 95, "lead_time": 12, "expiring_soon": 0, "spillover": 15},
            {"id": "F_PERAM_PHC", "stock": 190, "daily_demand": 45, "lead_time": 9, "expiring_soon": 0, "spillover": 12},
            {"id": "F_THANJ_DH", "stock": 4200, "daily_demand": 140, "lead_time": 10, "expiring_soon": 220, "spillover": 0}
        ],
        "rebalance_transfers": [
            {
                "transfer_id": "TR-001",
                "source_id": "F_SALEM_CHC",
                "source_name": "Salem CHC",
                "target_id": "F_TIRU_PHC",
                "target_name": "Tiruchengode PHC",
                "target_urgency_days": 2,
                "transfer_volume": 340,
                "distance_km": 65,
                "transit_hours": 1.7,
                "strategies": ["FEFO Expiry Saved", "Donor Buffer Protected"],
                "cost_inr": 380
            },
            {
                "transfer_id": "TR-002",
                "source_id": "F_KARUR_DH",
                "source_name": "Karur Hospital",
                "target_id": "F_NAMAK_PHC",
                "target_name": "Namakkal PHC",
                "target_urgency_days": 3,
                "transfer_volume": 240,
                "distance_km": 44,
                "transit_hours": 1.3,
                "strategies": ["Donor Buffer Protected"],
                "cost_inr": 290
            },
            {
                "transfer_id": "TR-003",
                "source_id": "F_CBE_DEPOT",
                "source_name": "Coimbatore Depot",
                "target_id": "F_ERODE_CHC",
                "target_name": "Erode CHC",
                "target_urgency_days": 3,
                "transfer_volume": 320,
                "distance_km": 86,
                "transit_hours": 2.2,
                "strategies": ["FEFO Expiry Saved"],
                "cost_inr": 450
            }
        ],
        "explainable_insights": {
            "facility_id": "F_TIRU_PHC",
            "facility_name": "PHC Tiruchengode",
            "status": "CRITICAL",
            "ai_confidence_pct": 91,
            "uncertainty_margin_days": 0.6,
            "headline_alert": "Critical risk primarily driven by severe local bacterial respiratory surge and depleted antibiotic strips.",
            "shap_factors": [
                {"name": "Current Inventory Deficit", "percentage": 42, "color": "#ef4444"},
                {"name": "Epidemiological Demand Surge", "percentage": 28, "color": "#06b6d4"},
                {"name": "Secondary Patient Spillover", "percentage": 18, "color": "#f97316"},
                {"name": "Supplier Transit Delay", "percentage": 12, "color": "#f59e0b"}
            ],
            "batches": [
                {"batch_no": "AMX-TN-2026-901", "quantity": 90, "expiry_date": "2026-10-08", "status": "Priority Burn"},
                {"batch_no": "AMX-TN-2026-443", "quantity": 50, "expiry_date": "2026-12-15", "status": "Active"}
            ]
        },
        "alerts": [
            {"id": "ALT-01", "severity": "CRITICAL", "facility": "Tiruchengode PHC", "message": "Projected stockout in 2.0 days. Inflow spike +45 pts/day."},
            {"id": "ALT-02", "severity": "CRITICAL", "facility": "Erode CHC", "message": "Antibiotic buffer depleted to 3.2 days. Spillover alert."},
            {"id": "ALT-03", "severity": "APPROACHING", "facility": "Namakkal PHC", "message": "Reserve buffer at 3.2 days. Immediate rebalancing recommended."}
        ]
    },

    # 2. INSULIN GLARGINE (COLD-CHAIN LIFE-SAVING)
    "insulin_glargine": {
        "epicenter_facility_id": "F_TIRU_PHC",
        "baseline_ripple_score": 32,
        "ripple_status": "Stable",
        "secondary_spillover_rate": 49,
        "rescued_from_expiry_units": 1650,
        "baseline_regional_risk": 78,
        "post_rebalance_risk": 14,
        "risk_reduction_pct": 82.1,
        "facilities": [
            {"id": "F_CBE_DEPOT", "stock": 4200, "daily_demand": 110, "lead_time": 12, "expiring_soon": 650, "spillover": 0},
            {"id": "F_ERODE_CHC", "stock": 840, "daily_demand": 60, "lead_time": 8, "expiring_soon": 120, "spillover": 0},
            {"id": "F_TIRU_PHC", "stock": 280, "daily_demand": 70, "lead_time": 14, "expiring_soon": 0, "spillover": 0},
            {"id": "F_SALEM_CHC", "stock": 1320, "daily_demand": 60, "lead_time": 9, "expiring_soon": 210, "spillover": 0},
            {"id": "F_NAMAK_PHC", "stock": 360, "daily_demand": 45, "lead_time": 11, "expiring_soon": 40, "spillover": 0},
            {"id": "F_KARUR_DH", "stock": 2520, "daily_demand": 90, "lead_time": 10, "expiring_soon": 480, "spillover": 0},
            {"id": "F_DIND_CHC", "stock": 1080, "daily_demand": 60, "lead_time": 9, "expiring_soon": 150, "spillover": 0},
            {"id": "F_MADU_PHC", "stock": 1050, "daily_demand": 50, "lead_time": 10, "expiring_soon": 90, "spillover": 0},
            {"id": "F_TRICHY_CHC", "stock": 880, "daily_demand": 80, "lead_time": 8, "expiring_soon": 80, "spillover": 0},
            {"id": "F_DHARMA_DH", "stock": 1750, "daily_demand": 70, "lead_time": 12, "expiring_soon": 190, "spillover": 0},
            {"id": "F_PERAM_PHC", "stock": 315, "daily_demand": 35, "lead_time": 9, "expiring_soon": 30, "spillover": 0},
            {"id": "F_THANJ_DH", "stock": 3600, "daily_demand": 120, "lead_time": 10, "expiring_soon": 320, "spillover": 0}
        ],
        "rebalance_transfers": [
            {
                "transfer_id": "TR-001",
                "source_id": "F_CBE_DEPOT",
                "source_name": "Coimbatore Depot",
                "target_id": "F_TIRU_PHC",
                "target_name": "Tiruchengode PHC",
                "target_urgency_days": 4,
                "transfer_volume": 180,
                "distance_km": 42,
                "transit_hours": 1.1,
                "strategies": ["FEFO Expiry Saved", "Donor Buffer Protected"],
                "cost_inr": 240
            },
            {
                "transfer_id": "TR-002",
                "source_id": "F_KARUR_DH",
                "source_name": "Karur Hospital",
                "target_id": "F_NAMAK_PHC",
                "target_name": "Namakkal PHC",
                "target_urgency_days": 8,
                "transfer_volume": 120,
                "distance_km": 72,
                "transit_hours": 2.0,
                "strategies": ["Donor Buffer Protected"],
                "cost_inr": 320
            },
            {
                "transfer_id": "TR-003",
                "source_id": "F_DIND_CHC",
                "source_name": "Dindigul CHC",
                "target_id": "F_TRICHY_CHC",
                "target_name": "Trichy CHC",
                "target_urgency_days": 11,
                "transfer_volume": 90,
                "distance_km": 60,
                "transit_hours": 1.8,
                "strategies": ["FEFO Expiry Saved"],
                "cost_inr": 280
            }
        ],
        "explainable_insights": {
            "facility_id": "F_TIRU_PHC",
            "facility_name": "PHC Tiruchengode",
            "status": "CRITICAL",
            "ai_confidence_pct": 88,
            "uncertainty_margin_days": 0.8,
            "headline_alert": "PHC Tiruchengode is at CRITICAL risk primarily driven by inventory depletion and secondary patient spillover.",
            "shap_factors": [
                {"name": "Current Inventory Deficit", "percentage": 38, "color": "#ef4444"},
                {"name": "Secondary Patient Spillover", "percentage": 26, "color": "#f97316"},
                {"name": "Supplier Transit Delay", "percentage": 22, "color": "#f59e0b"},
                {"name": "Epidemiological Demand Surge", "percentage": 14, "color": "#06b6d4"}
            ],
            "batches": [
                {"batch_no": "IG-TN-2026-081", "quantity": 180, "expiry_date": "2026-10-15", "status": "Active Safe"},
                {"batch_no": "IG-TN-2026-044", "quantity": 100, "expiry_date": "2026-09-28", "status": "Priority Burn"}
            ]
        },
        "alerts": [
            {"id": "ALT-01", "severity": "CRITICAL", "facility": "Tiruchengode PHC", "message": "Insulin Glargine stockout predicted in 4.0 days."},
            {"id": "ALT-02", "severity": "APPROACHING", "facility": "Namakkal PHC", "message": "Cold-chain buffer at 8.0 days. Diverted patients approaching."},
            {"id": "ALT-03", "severity": "AT_RISK", "facility": "Trichy CHC", "message": "Stock buffer at 11.0 days. Lead time delay expected."}
        ]
    },

    # 3. PARACETAMOL 500MG TABLETS
    "paracetamol_500": {
        "epicenter_facility_id": "F_MADU_PHC",
        "baseline_ripple_score": 58,
        "ripple_status": "Moderate Risk",
        "secondary_spillover_rate": 86,
        "rescued_from_expiry_units": 4200,
        "baseline_regional_risk": 64,
        "post_rebalance_risk": 12,
        "risk_reduction_pct": 81.3,
        "facilities": [
            {"id": "F_CBE_DEPOT", "stock": 18000, "daily_demand": 450, "lead_time": 5, "expiring_soon": 2400, "spillover": 0},
            {"id": "F_ERODE_CHC", "stock": 2400, "daily_demand": 140, "lead_time": 4, "expiring_soon": 400, "spillover": 0},
            {"id": "F_TIRU_PHC", "stock": 1200, "daily_demand": 90, "lead_time": 6, "expiring_soon": 150, "spillover": 0},
            {"id": "F_SALEM_CHC", "stock": 3500, "daily_demand": 160, "lead_time": 5, "expiring_soon": 500, "spillover": 0},
            {"id": "F_NAMAK_PHC", "stock": 1100, "daily_demand": 85, "lead_time": 5, "expiring_soon": 100, "spillover": 0},
            {"id": "F_KARUR_DH", "stock": 4800, "daily_demand": 210, "lead_time": 5, "expiring_soon": 800, "spillover": 0},
            {"id": "F_DIND_CHC", "stock": 680, "daily_demand": 150, "lead_time": 4, "expiring_soon": 0, "spillover": 25},
            {"id": "F_MADU_PHC", "stock": 380, "daily_demand": 110, "lead_time": 6, "expiring_soon": 0, "spillover": 45},
            {"id": "F_TRICHY_CHC", "stock": 2800, "daily_demand": 170, "lead_time": 4, "expiring_soon": 300, "spillover": 0},
            {"id": "F_DHARMA_DH", "stock": 3200, "daily_demand": 130, "lead_time": 6, "expiring_soon": 250, "spillover": 0},
            {"id": "F_PERAM_PHC", "stock": 950, "daily_demand": 70, "lead_time": 5, "expiring_soon": 80, "spillover": 0},
            {"id": "F_THANJ_DH", "stock": 6500, "daily_demand": 240, "lead_time": 5, "expiring_soon": 600, "spillover": 0}
        ],
        "rebalance_transfers": [
            {
                "transfer_id": "TR-001",
                "source_id": "F_KARUR_DH",
                "source_name": "Karur Hospital",
                "target_id": "F_MADU_PHC",
                "target_name": "Madurai PHC",
                "target_urgency_days": 3,
                "transfer_volume": 800,
                "distance_km": 110,
                "transit_hours": 2.8,
                "strategies": ["FEFO Expiry Saved", "Donor Buffer Protected"],
                "cost_inr": 420
            },
            {
                "transfer_id": "TR-002",
                "source_id": "F_CBE_DEPOT",
                "source_name": "Coimbatore Depot",
                "target_id": "F_DIND_CHC",
                "target_name": "Dindigul CHC",
                "target_urgency_days": 4,
                "transfer_volume": 950,
                "distance_km": 140,
                "transit_hours": 3.4,
                "strategies": ["FEFO Expiry Saved"],
                "cost_inr": 510
            }
        ],
        "explainable_insights": {
            "facility_id": "F_MADU_PHC",
            "facility_name": "Madurai PHC",
            "status": "CRITICAL",
            "ai_confidence_pct": 93,
            "uncertainty_margin_days": 0.5,
            "headline_alert": "Madurai PHC facing acute stockout from viral fever caseload outpacing local allocation.",
            "shap_factors": [
                {"name": "Epidemiological Demand Surge", "percentage": 44, "color": "#06b6d4"},
                {"name": "Current Inventory Deficit", "percentage": 32, "color": "#ef4444"},
                {"name": "Secondary Patient Spillover", "percentage": 14, "color": "#f97316"},
                {"name": "Supplier Transit Delay", "percentage": 10, "color": "#f59e0b"}
            ],
            "batches": [
                {"batch_no": "PCM-TN-2026-102", "quantity": 380, "expiry_date": "2027-02-28", "status": "Active High Burn"}
            ]
        },
        "alerts": [
            {"id": "ALT-01", "severity": "CRITICAL", "facility": "Madurai PHC", "message": "Paracetamol stock depleted to 3.5 days under viral epidemic."},
            {"id": "ALT-02", "severity": "CRITICAL", "facility": "Dindigul CHC", "message": "Fever clinic buffer under 4.5 days."}
        ]
    },

    # 4. AZITHROMYCIN 500MG TABLETS
    "azithromycin_500": {
        "epicenter_facility_id": "F_DIND_CHC",
        "baseline_ripple_score": 76,
        "ripple_status": "High Risk",
        "secondary_spillover_rate": 62,
        "rescued_from_expiry_units": 940,
        "baseline_regional_risk": 82,
        "post_rebalance_risk": 18,
        "risk_reduction_pct": 78.0,
        "facilities": [
            {"id": "F_CBE_DEPOT", "stock": 3200, "daily_demand": 120, "lead_time": 14, "expiring_soon": 410, "spillover": 0},
            {"id": "F_ERODE_CHC", "stock": 650, "daily_demand": 50, "lead_time": 12, "expiring_soon": 90, "spillover": 0},
            {"id": "F_TIRU_PHC", "stock": 420, "daily_demand": 40, "lead_time": 14, "expiring_soon": 60, "spillover": 0},
            {"id": "F_SALEM_CHC", "stock": 1850, "daily_demand": 75, "lead_time": 11, "expiring_soon": 290, "spillover": 0},
            {"id": "F_NAMAK_PHC", "stock": 410, "daily_demand": 35, "lead_time": 13, "expiring_soon": 40, "spillover": 0},
            {"id": "F_KARUR_DH", "stock": 1600, "daily_demand": 70, "lead_time": 12, "expiring_soon": 180, "spillover": 0},
            {"id": "F_DIND_CHC", "stock": 110, "daily_demand": 45, "lead_time": 14, "expiring_soon": 0, "spillover": 28},
            {"id": "F_MADU_PHC", "stock": 130, "daily_demand": 50, "lead_time": 15, "expiring_soon": 0, "spillover": 34},
            {"id": "F_TRICHY_CHC", "stock": 890, "daily_demand": 65, "lead_time": 12, "expiring_soon": 110, "spillover": 0},
            {"id": "F_DHARMA_DH", "stock": 1150, "daily_demand": 55, "lead_time": 14, "expiring_soon": 130, "spillover": 0},
            {"id": "F_PERAM_PHC", "stock": 290, "daily_demand": 30, "lead_time": 12, "expiring_soon": 20, "spillover": 0},
            {"id": "F_THANJ_DH", "stock": 2400, "daily_demand": 90, "lead_time": 13, "expiring_soon": 210, "spillover": 0}
        ],
        "rebalance_transfers": [
            {
                "transfer_id": "TR-001",
                "source_id": "F_SALEM_CHC",
                "source_name": "Salem CHC",
                "target_id": "F_DIND_CHC",
                "target_name": "Dindigul CHC",
                "target_urgency_days": 2,
                "transfer_volume": 220,
                "distance_km": 120,
                "transit_hours": 3.0,
                "strategies": ["FEFO Expiry Saved", "Donor Buffer Protected"],
                "cost_inr": 360
            },
            {
                "transfer_id": "TR-002",
                "source_id": "F_CBE_DEPOT",
                "source_name": "Coimbatore Depot",
                "target_id": "F_MADU_PHC",
                "target_name": "Madurai PHC",
                "target_urgency_days": 3,
                "transfer_volume": 260,
                "distance_km": 165,
                "transit_hours": 3.9,
                "strategies": ["FEFO Expiry Saved"],
                "cost_inr": 480
            }
        ],
        "explainable_insights": {
            "facility_id": "F_DIND_CHC",
            "facility_name": "Dindigul CHC",
            "status": "CRITICAL",
            "ai_confidence_pct": 89,
            "uncertainty_margin_days": 0.9,
            "headline_alert": "Dindigul CHC at CRITICAL risk due to API import hold-up and zero safety buffer.",
            "shap_factors": [
                {"name": "Supplier Transit Delay", "percentage": 40, "color": "#f59e0b"},
                {"name": "Current Inventory Deficit", "percentage": 34, "color": "#ef4444"},
                {"name": "Secondary Patient Spillover", "percentage": 16, "color": "#f97316"},
                {"name": "Local Clinical Demand", "percentage": 10, "color": "#06b6d4"}
            ],
            "batches": [
                {"batch_no": "AZM-TN-2026-551", "quantity": 110, "expiry_date": "2026-11-15", "status": "Critical Low"}
            ]
        },
        "alerts": [
            {"id": "ALT-01", "severity": "CRITICAL", "facility": "Dindigul CHC", "message": "Azithromycin stockout in 2.4 days. 14-day supplier delay."},
            {"id": "ALT-02", "severity": "CRITICAL", "facility": "Madurai PHC", "message": "Antibiotic buffer down to 2.6 days."}
        ]
    },

    # 5. CEFTRIAXONE 1G INJECTION
    "ceftriaxone_1g": {
        "epicenter_facility_id": "F_SALEM_CHC",
        "baseline_ripple_score": 91,
        "ripple_status": "Critical Crisis",
        "secondary_spillover_rate": 38,
        "rescued_from_expiry_units": 610,
        "baseline_regional_risk": 92,
        "post_rebalance_risk": 15,
        "risk_reduction_pct": 83.7,
        "facilities": [
            {"id": "F_CBE_DEPOT", "stock": 2800, "daily_demand": 90, "lead_time": 8, "expiring_soon": 210, "spillover": 0},
            {"id": "F_ERODE_CHC", "stock": 420, "daily_demand": 35, "lead_time": 7, "expiring_soon": 50, "spillover": 0},
            {"id": "F_TIRU_PHC", "stock": 290, "daily_demand": 25, "lead_time": 8, "expiring_soon": 30, "spillover": 0},
            {"id": "F_SALEM_CHC", "stock": 60, "daily_demand": 40, "lead_time": 9, "expiring_soon": 0, "spillover": 22},
            {"id": "F_NAMAK_PHC", "stock": 240, "daily_demand": 20, "lead_time": 8, "expiring_soon": 20, "spillover": 0},
            {"id": "F_KARUR_DH", "stock": 1400, "daily_demand": 55, "lead_time": 7, "expiring_soon": 140, "spillover": 0},
            {"id": "F_DIND_CHC", "stock": 390, "daily_demand": 30, "lead_time": 8, "expiring_soon": 40, "spillover": 0},
            {"id": "F_MADU_PHC", "stock": 580, "daily_demand": 40, "lead_time": 8, "expiring_soon": 60, "spillover": 0},
            {"id": "F_TRICHY_CHC", "stock": 90, "daily_demand": 45, "lead_time": 7, "expiring_soon": 0, "spillover": 16},
            {"id": "F_DHARMA_DH", "stock": 850, "daily_demand": 40, "lead_time": 9, "expiring_soon": 90, "spillover": 0},
            {"id": "F_PERAM_PHC", "stock": 190, "daily_demand": 18, "lead_time": 8, "expiring_soon": 15, "spillover": 0},
            {"id": "F_THANJ_DH", "stock": 2950, "daily_demand": 80, "lead_time": 7, "expiring_soon": 310, "spillover": 0}
        ],
        "rebalance_transfers": [
            {
                "transfer_id": "TR-001",
                "source_id": "F_THANJ_DH",
                "source_name": "Thanjavur Medical College",
                "target_id": "F_TRICHY_CHC",
                "target_name": "Trichy CHC",
                "target_urgency_days": 2,
                "transfer_volume": 180,
                "distance_km": 56,
                "transit_hours": 1.4,
                "strategies": ["FEFO Expiry Saved", "Donor Buffer Protected"],
                "cost_inr": 260
            },
            {
                "transfer_id": "TR-002",
                "source_id": "F_KARUR_DH",
                "source_name": "Karur Hospital",
                "target_id": "F_SALEM_CHC",
                "target_name": "Salem CHC",
                "target_urgency_days": 2,
                "transfer_volume": 210,
                "distance_km": 88,
                "transit_hours": 2.2,
                "strategies": ["Donor Buffer Protected"],
                "cost_inr": 340
            }
        ],
        "explainable_insights": {
            "facility_id": "F_SALEM_CHC",
            "facility_name": "Salem CHC",
            "status": "CRITICAL",
            "ai_confidence_pct": 94,
            "uncertainty_margin_days": 0.4,
            "headline_alert": "Salem CHC ICU unit facing imminent stockout of IV Ceftriaxone within 36 hours.",
            "shap_factors": [
                {"name": "Current Inventory Deficit", "percentage": 48, "color": "#ef4444"},
                {"name": "ICU Sepsis Demand Spike", "percentage": 26, "color": "#06b6d4"},
                {"name": "Supplier Transit Delay", "percentage": 16, "color": "#f59e0b"},
                {"name": "Secondary Patient Spillover", "percentage": 10, "color": "#f97316"}
            ],
            "batches": [
                {"batch_no": "CFX-TN-2026-789", "quantity": 60, "expiry_date": "2026-10-02", "status": "Emergency Depletion"}
            ]
        },
        "alerts": [
            {"id": "ALT-01", "severity": "CRITICAL", "facility": "Salem CHC", "message": "Critical Inpatient IV Antibiotic stockout in 1.5 days!"},
            {"id": "ALT-02", "severity": "CRITICAL", "facility": "Trichy CHC", "message": "Emergency buffer at 2.0 days."}
        ]
    },

    # 6. ORS SACHETS
    "ors_sachets": {
        "epicenter_facility_id": "F_PERAM_PHC",
        "baseline_ripple_score": 68,
        "ripple_status": "Moderate Risk",
        "secondary_spillover_rate": 140,
        "rescued_from_expiry_units": 5600,
        "baseline_regional_risk": 74,
        "post_rebalance_risk": 11,
        "risk_reduction_pct": 85.1,
        "facilities": [
            {"id": "F_CBE_DEPOT", "stock": 24000, "daily_demand": 500, "lead_time": 6, "expiring_soon": 3200, "spillover": 0},
            {"id": "F_ERODE_CHC", "stock": 3100, "daily_demand": 160, "lead_time": 5, "expiring_soon": 450, "spillover": 0},
            {"id": "F_TIRU_PHC", "stock": 350, "daily_demand": 110, "lead_time": 7, "expiring_soon": 0, "spillover": 45},
            {"id": "F_SALEM_CHC", "stock": 4200, "daily_demand": 180, "lead_time": 6, "expiring_soon": 600, "spillover": 0},
            {"id": "F_NAMAK_PHC", "stock": 380, "daily_demand": 120, "lead_time": 6, "expiring_soon": 0, "spillover": 38},
            {"id": "F_KARUR_DH", "stock": 6100, "daily_demand": 220, "lead_time": 5, "expiring_soon": 900, "spillover": 0},
            {"id": "F_DIND_CHC", "stock": 2200, "daily_demand": 140, "lead_time": 6, "expiring_soon": 250, "spillover": 0},
            {"id": "F_MADU_PHC", "stock": 1900, "daily_demand": 130, "lead_time": 6, "expiring_soon": 200, "spillover": 0},
            {"id": "F_TRICHY_CHC", "stock": 2600, "daily_demand": 170, "lead_time": 5, "expiring_soon": 300, "spillover": 0},
            {"id": "F_DHARMA_DH", "stock": 3800, "daily_demand": 150, "lead_time": 7, "expiring_soon": 400, "spillover": 0},
            {"id": "F_PERAM_PHC", "stock": 260, "daily_demand": 95, "lead_time": 6, "expiring_soon": 0, "spillover": 57},
            {"id": "F_THANJ_DH", "stock": 7200, "daily_demand": 250, "lead_time": 6, "expiring_soon": 800, "spillover": 0}
        ],
        "rebalance_transfers": [
            {
                "transfer_id": "TR-001",
                "source_id": "F_CBE_DEPOT",
                "source_name": "Coimbatore Depot",
                "target_id": "F_TIRU_PHC",
                "target_name": "Tiruchengode PHC",
                "target_urgency_days": 3,
                "transfer_volume": 1200,
                "distance_km": 118,
                "transit_hours": 3.1,
                "strategies": ["FEFO Expiry Saved", "Donor Buffer Protected"],
                "cost_inr": 350
            },
            {
                "transfer_id": "TR-002",
                "source_id": "F_KARUR_DH",
                "source_name": "Karur Hospital",
                "target_id": "F_PERAM_PHC",
                "target_name": "Perambalur PHC",
                "target_urgency_days": 3,
                "transfer_volume": 900,
                "distance_km": 112,
                "transit_hours": 2.9,
                "strategies": ["FEFO Expiry Saved"],
                "cost_inr": 320
            }
        ],
        "explainable_insights": {
            "facility_id": "F_PERAM_PHC",
            "facility_name": "Perambalur PHC",
            "status": "CRITICAL",
            "ai_confidence_pct": 92,
            "uncertainty_margin_days": 0.5,
            "headline_alert": "Monsoon gastroenteritis outbreak causing 3.4x spike in pediatric dehydration treatments.",
            "shap_factors": [
                {"name": "Epidemiological Demand Surge", "percentage": 52, "color": "#06b6d4"},
                {"name": "Current Inventory Deficit", "percentage": 28, "color": "#ef4444"},
                {"name": "Secondary Patient Spillover", "percentage": 12, "color": "#f97316"},
                {"name": "Supplier Transit Delay", "percentage": 8, "color": "#f59e0b"}
            ],
            "batches": [
                {"batch_no": "ORS-TN-2026-119", "quantity": 260, "expiry_date": "2027-06-30", "status": "Rapid Burn"}
            ]
        },
        "alerts": [
            {"id": "ALT-01", "severity": "CRITICAL", "facility": "Perambalur PHC", "message": "Pediatric ORS stockout projected in 2.7 days."},
            {"id": "ALT-02", "severity": "CRITICAL", "facility": "Tiruchengode PHC", "message": "ORS inventory at 3.1 days under waterborne disease alert."}
        ]
    },

    # 7. ANTI-RABIES VACCINE (PVRV HUMAN)
    "rabies_vaccine": {
        "epicenter_facility_id": "F_MADU_PHC",
        "baseline_ripple_score": 88,
        "ripple_status": "Critical Crisis",
        "secondary_spillover_rate": 24,
        "rescued_from_expiry_units": 320,
        "baseline_regional_risk": 88,
        "post_rebalance_risk": 16,
        "risk_reduction_pct": 81.8,
        "facilities": [
            {"id": "F_CBE_DEPOT", "stock": 950, "daily_demand": 25, "lead_time": 16, "expiring_soon": 140, "spillover": 0},
            {"id": "F_ERODE_CHC", "stock": 140, "daily_demand": 10, "lead_time": 14, "expiring_soon": 25, "spillover": 0},
            {"id": "F_TIRU_PHC", "stock": 90, "daily_demand": 8, "lead_time": 15, "expiring_soon": 15, "spillover": 0},
            {"id": "F_SALEM_CHC", "stock": 310, "daily_demand": 15, "lead_time": 13, "expiring_soon": 60, "spillover": 0},
            {"id": "F_NAMAK_PHC", "stock": 80, "daily_demand": 7, "lead_time": 15, "expiring_soon": 10, "spillover": 0},
            {"id": "F_KARUR_DH", "stock": 420, "daily_demand": 18, "lead_time": 14, "expiring_soon": 70, "spillover": 0},
            {"id": "F_DIND_CHC", "stock": 22, "daily_demand": 11, "lead_time": 16, "expiring_soon": 0, "spillover": 10},
            {"id": "F_MADU_PHC", "stock": 18, "daily_demand": 12, "lead_time": 16, "expiring_soon": 0, "spillover": 14},
            {"id": "F_TRICHY_CHC", "stock": 260, "daily_demand": 16, "lead_time": 13, "expiring_soon": 40, "spillover": 0},
            {"id": "F_DHARMA_DH", "stock": 290, "daily_demand": 14, "lead_time": 16, "expiring_soon": 50, "spillover": 0},
            {"id": "F_PERAM_PHC", "stock": 70, "daily_demand": 6, "lead_time": 15, "expiring_soon": 10, "spillover": 0},
            {"id": "F_THANJ_DH", "stock": 580, "daily_demand": 22, "lead_time": 14, "expiring_soon": 90, "spillover": 0}
        ],
        "rebalance_transfers": [
            {
                "transfer_id": "TR-001",
                "source_id": "F_KARUR_DH",
                "source_name": "Karur Hospital",
                "target_id": "F_MADU_PHC",
                "target_name": "Madurai PHC",
                "target_urgency_days": 1,
                "transfer_volume": 65,
                "distance_km": 110,
                "transit_hours": 2.8,
                "strategies": ["Cold-Chain Priority", "FEFO Expiry Saved"],
                "cost_inr": 310
            },
            {
                "transfer_id": "TR-002",
                "source_id": "F_CBE_DEPOT",
                "source_name": "Coimbatore Depot",
                "target_id": "F_DIND_CHC",
                "target_name": "Dindigul CHC",
                "target_urgency_days": 2,
                "transfer_volume": 70,
                "distance_km": 140,
                "transit_hours": 3.4,
                "strategies": ["Donor Buffer Protected"],
                "cost_inr": 380
            }
        ],
        "explainable_insights": {
            "facility_id": "F_MADU_PHC",
            "facility_name": "Madurai PHC",
            "status": "CRITICAL",
            "ai_confidence_pct": 96,
            "uncertainty_margin_days": 0.3,
            "headline_alert": "ZERO-TOLERANCE EMERGENCY: Madurai PHC anti-rabies buffer exhausted in 1.5 days.",
            "shap_factors": [
                {"name": "Zero-Buffer Stock Depletion", "percentage": 50, "color": "#ef4444"},
                {"name": "Supplier Transit Delay", "percentage": 24, "color": "#f59e0b"},
                {"name": "Secondary Bite Victim Spillover", "percentage": 16, "color": "#f97316"},
                {"name": "Cold-Chain Logistics Constraint", "percentage": 10, "color": "#06b6d4"}
            ],
            "batches": [
                {"batch_no": "RAB-TN-2026-009", "quantity": 18, "expiry_date": "2026-09-30", "status": "Emergency Doses"}
            ]
        },
        "alerts": [
            {"id": "ALT-01", "severity": "CRITICAL", "facility": "Madurai PHC", "message": "CRITICAL EMERGENCY: Rabies vaccine stockout in 1.5 days! Immediate transfer mandatory."},
            {"id": "ALT-02", "severity": "CRITICAL", "facility": "Dindigul CHC", "message": "Rabies stockout in 2.0 days."}
        ]
    },

    # 8. OXYTOCIN 10 IU INJECTION
    "oxytocin_10iu": {
        "epicenter_facility_id": "F_ERODE_CHC",
        "baseline_ripple_score": 76,
        "ripple_status": "High Risk",
        "secondary_spillover_rate": 18,
        "rescued_from_expiry_units": 480,
        "baseline_regional_risk": 84,
        "post_rebalance_risk": 13,
        "risk_reduction_pct": 84.5,
        "facilities": [
            {"id": "F_CBE_DEPOT", "stock": 1400, "daily_demand": 40, "lead_time": 9, "expiring_soon": 220, "spillover": 0},
            {"id": "F_ERODE_CHC", "stock": 35, "daily_demand": 16, "lead_time": 8, "expiring_soon": 0, "spillover": 9},
            {"id": "F_TIRU_PHC", "stock": 42, "daily_demand": 12, "lead_time": 9, "expiring_soon": 0, "spillover": 9},
            {"id": "F_SALEM_CHC", "stock": 580, "daily_demand": 24, "lead_time": 8, "expiring_soon": 90, "spillover": 0},
            {"id": "F_NAMAK_PHC", "stock": 120, "daily_demand": 10, "lead_time": 9, "expiring_soon": 15, "spillover": 0},
            {"id": "F_KARUR_DH", "stock": 840, "daily_demand": 32, "lead_time": 8, "expiring_soon": 130, "spillover": 0},
            {"id": "F_DIND_CHC", "stock": 290, "daily_demand": 18, "lead_time": 8, "expiring_soon": 40, "spillover": 0},
            {"id": "F_MADU_PHC", "stock": 360, "daily_demand": 20, "lead_time": 9, "expiring_soon": 50, "spillover": 0},
            {"id": "F_TRICHY_CHC", "stock": 410, "daily_demand": 26, "lead_time": 8, "expiring_soon": 60, "spillover": 0},
            {"id": "F_DHARMA_DH", "stock": 480, "daily_demand": 22, "lead_time": 9, "expiring_soon": 70, "spillover": 0},
            {"id": "F_PERAM_PHC", "stock": 95, "daily_demand": 9, "lead_time": 8, "expiring_soon": 10, "spillover": 0},
            {"id": "F_THANJ_DH", "stock": 1100, "daily_demand": 45, "lead_time": 8, "expiring_soon": 170, "spillover": 0}
        ],
        "rebalance_transfers": [
            {
                "transfer_id": "TR-001",
                "source_id": "F_KARUR_DH",
                "source_name": "Karur Hospital",
                "target_id": "F_ERODE_CHC",
                "target_name": "Erode CHC",
                "target_urgency_days": 2,
                "transfer_volume": 120,
                "distance_km": 68,
                "transit_hours": 1.8,
                "strategies": ["Cold-Chain Protected", "FEFO Expiry Saved"],
                "cost_inr": 280
            },
            {
                "transfer_id": "TR-002",
                "source_id": "F_SALEM_CHC",
                "source_name": "Salem CHC",
                "target_id": "F_TIRU_PHC",
                "target_name": "Tiruchengode PHC",
                "target_urgency_days": 3,
                "transfer_volume": 90,
                "distance_km": 65,
                "transit_hours": 1.7,
                "strategies": ["Donor Buffer Protected"],
                "cost_inr": 240
            }
        ],
        "explainable_insights": {
            "facility_id": "F_ERODE_CHC",
            "facility_name": "Erode CHC",
            "status": "CRITICAL",
            "ai_confidence_pct": 95,
            "uncertainty_margin_days": 0.4,
            "headline_alert": "Maternal health alert: Erode CHC labor ward oxytocin stock critically low at 2.2 days.",
            "shap_factors": [
                {"name": "Labor Room Inventory Deficit", "percentage": 46, "color": "#ef4444"},
                {"name": "Cold-Chain Supplier Transit", "percentage": 26, "color": "#f59e0b"},
                {"name": "Secondary Maternal Referral Spillover", "percentage": 18, "color": "#f97316"},
                {"name": "Obstetric Delivery Surge", "percentage": 10, "color": "#06b6d4"}
            ],
            "batches": [
                {"batch_no": "OXY-TN-2026-302", "quantity": 35, "expiry_date": "2026-10-18", "status": "Critical Reserve"}
            ]
        },
        "alerts": [
            {"id": "ALT-01", "severity": "CRITICAL", "facility": "Erode CHC", "message": "Life-saving Oxytocin stockout in 2.2 days! Maternal emergency."},
            {"id": "ALT-02", "severity": "CRITICAL", "facility": "Tiruchengode PHC", "message": "Delivery ward oxytocin buffer at 3.5 days."}
        ]
    }
}

# Road edges connecting facilities
BASE_ROAD_EDGES: List[Dict[str, Any]] = [
    {"source_id": "F_CBE_DEPOT", "target_id": "F_ERODE_CHC", "distance_km": 86, "transit_hours": 2.2},
    {"source_id": "F_CBE_DEPOT", "target_id": "F_TIRU_PHC", "distance_km": 118, "transit_hours": 3.1},
    {"source_id": "F_ERODE_CHC", "target_id": "F_TIRU_PHC", "distance_km": 42, "transit_hours": 1.1},
    {"source_id": "F_TIRU_PHC", "target_id": "F_SALEM_CHC", "distance_km": 65, "transit_hours": 1.7},
    {"source_id": "F_SALEM_CHC", "target_id": "F_NAMAK_PHC", "distance_km": 72, "transit_hours": 2.0},
    {"source_id": "F_TIRU_PHC", "target_id": "F_NAMAK_PHC", "distance_km": 45, "transit_hours": 1.2},
    {"source_id": "F_TIRU_PHC", "target_id": "F_KARUR_DH", "distance_km": 58, "transit_hours": 1.5},
    {"source_id": "F_NAMAK_PHC", "target_id": "F_KARUR_DH", "distance_km": 44, "transit_hours": 1.3},
    {"source_id": "F_KARUR_DH", "target_id": "F_DIND_CHC", "distance_km": 74, "transit_hours": 1.9},
    {"source_id": "F_DIND_CHC", "target_id": "F_MADU_PHC", "distance_km": 62, "transit_hours": 1.6},
    {"source_id": "F_KARUR_DH", "target_id": "F_TRICHY_CHC", "distance_km": 78, "transit_hours": 2.1},
    {"source_id": "F_DIND_CHC", "target_id": "F_TRICHY_CHC", "distance_km": 98, "transit_hours": 2.5},
    {"source_id": "F_MADU_PHC", "target_id": "F_TRICHY_CHC", "distance_km": 128, "transit_hours": 3.2},
    {"source_id": "F_SALEM_CHC", "target_id": "F_DHARMA_DH", "distance_km": 64, "transit_hours": 1.6},
    {"source_id": "F_NAMAK_PHC", "target_id": "F_PERAM_PHC", "distance_km": 82, "transit_hours": 2.2},
    {"source_id": "F_TRICHY_CHC", "target_id": "F_THANJ_DH", "distance_km": 56, "transit_hours": 1.4}
]
