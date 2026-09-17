import urllib.request
import json

def test_endpoint(name, url, data=None):
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode() if data else None,
        headers={'Content-Type': 'application/json'} if data else {}
    )
    res = urllib.request.urlopen(req)
    res_data = json.loads(res.read().decode())
    print(f"[PASS] {name}: HTTP {res.getcode()}")
    return res_data

print("--- BACKEND ENDPOINTS VALIDATION ---")
test_endpoint("Health Check", "http://localhost:8000/api/health")
test_endpoint("Medicines List", "http://localhost:8000/api/medicines")
test_endpoint("Facilities List", "http://localhost:8000/api/facilities")

sim_res = test_endpoint("Disruption Simulation", "http://localhost:8000/api/simulate", {
    "medicine_id": "insulin_glargine",
    "supplier_delay_days": 15,
    "outbreak_surge_pct": 40,
    "infrastructure_severance": False,
    "timeline_day": 0
})
print(f"   Ripple Score: {sim_res['ripple_score']} ({sim_res['ripple_status']}), Spillover: {sim_res['secondary_spillover_rate']}/day, Expiry Rescued: {sim_res['rescued_from_expiry_units']} units")

reb_res = test_endpoint("Rebalance Optimization", "http://localhost:8000/api/rebalance?medicine_id=insulin_glargine", {})
print(f"   Risk Reduction: {reb_res['pre_rebalance_risk']}% -> {reb_res['post_rebalance_risk']}% (-{reb_res['risk_reduction_pct']}%), Transfers: {len(reb_res['recommended_transfers'])}")

exp_res = test_endpoint("Explainable AI", "http://localhost:8000/api/explain/F_TIRU_PHC")
print(f"   Confidence: {exp_res['ai_confidence_pct']}%, Margin: ±{exp_res['uncertainty_margin_days']} days, SHAP Factors: {len(exp_res['shap_factors'])}")

sms_res = test_endpoint("Rural SMS Dispatch", "http://localhost:8000/api/rural-sms", {
    "facility_id": "F_TIRU_PHC",
    "recipient_phone": "+91 94421 88301",
    "recipient_name": "Sister Jayalakshmi",
    "message_text": "Emergency 180 units Insulin dispatched",
    "dispatch_code": "9821",
    "transfer_id": "TR-001"
})
print(f"   SMS Gateway Status: {sms_res['status']}, Receipt: {sms_res['delivery_receipt']}")
print("--- ALL BACKEND TEST PASSES ---")
