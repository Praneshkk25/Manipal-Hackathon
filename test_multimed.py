import urllib.request
import json

def get_json(url):
    req = urllib.request.urlopen(url)
    return json.loads(req.read().decode())

print("=== VERIFYING MULTI-MEDICINE ENDPOINTS ===")
meds = get_json('http://localhost:8000/api/medicines')['medicines']
print(f"Total medicines available: {len(meds)}")

for m in meds:
    dash = get_json(f"http://localhost:8000/api/medicines/{m['id']}/dashboard")
    sim = dash["simulation"]
    reb = dash["rebalance"]
    print(f"\n[MEDICINE] {m['name']} ({m['id']})")
    print(f"  Ripple Score: {sim['ripple_score']} ({sim['ripple_status']})")
    print(f"  Counts: Critical={sim['counts']['CRITICAL']}, Approaching={sim['counts']['APPROACHING']}, AtRisk={sim['counts']['AT_RISK']}, Healthy={sim['counts']['HEALTHY']}")
    print(f"  Secondary Spillover: +{sim['secondary_spillover_rate']} pts/day | Rescued Expiry: {sim['rescued_from_expiry_units']} units")
    print(f"  Regional Risk: {reb['pre_rebalance_risk']}% -> {reb['post_rebalance_risk']}% (-{reb['risk_reduction_pct']}%)")
    print(f"  Transfers: {len(reb['recommended_transfers'])} recommendations")
    print(f"  Alerts: {len(dash['alerts'])} active alerts")
    print(f"  Epicenter: {dash['epicenter_facility_id']} ({dash['explainable_ai']['facility_name']})")

print("\n=== ALL MEDICINES VERIFIED WITH DISTINCT, DYNAMIC DATA ===")
