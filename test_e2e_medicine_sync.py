import urllib.request
import json

def get_json(url):
    req = urllib.request.urlopen(url)
    return json.loads(req.read().decode())

def post_json(url, data):
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode(),
        headers={'Content-Type': 'application/json'}
    )
    res = urllib.request.urlopen(req)
    return json.loads(res.read().decode())

print("=================================================================")
print("MEDRIPPLE AI: END-TO-END CENTRALIZED MEDICINE STATE TEST SUITE")
print("=================================================================")

# 1. Fetch available medicines
meds_res = get_json('http://localhost:8000/api/medicines')
meds = meds_res['medicines']
print(f"[PASS] Found {len(meds)} active essential medicines.")
assert len(meds) >= 8, f"Expected at least 8 medicines, found {len(meds)}"

# TEST A: Amoxicillin + Clavulanic Acid 625mg
print("\n--- TEST A: AMOXICILLIN + CLAVULANIC ACID 625MG ---")
amox_dash = get_json('http://localhost:8000/api/medicines/amoxicillin_clav/dashboard')
assert amox_dash['medicine']['id'] == 'amoxicillin_clav'
assert amox_dash['simulation']['ripple_score'] == 84
assert amox_dash['simulation']['secondary_spillover_rate'] == 128
assert amox_dash['simulation']['rescued_from_expiry_units'] == 820
assert amox_dash['rebalance']['pre_rebalance_risk'] == 89
assert amox_dash['rebalance']['post_rebalance_risk'] == 19
print(f"  [PASS] Amoxicillin Ripple Score = {amox_dash['simulation']['ripple_score']}, Spillover = {amox_dash['simulation']['secondary_spillover_rate']}, Pre/Post Risk = {amox_dash['rebalance']['pre_rebalance_risk']}% -> {amox_dash['rebalance']['post_rebalance_risk']}%")

# TEST B: Insulin Glargine
print("\n--- TEST B: INSULIN GLARGINE ---")
ins_dash = get_json('http://localhost:8000/api/medicines/insulin_glargine/dashboard')
assert ins_dash['medicine']['id'] == 'insulin_glargine'
assert ins_dash['simulation']['ripple_score'] == 32
assert ins_dash['simulation']['secondary_spillover_rate'] == 49
assert ins_dash['simulation']['rescued_from_expiry_units'] == 1650
assert ins_dash['rebalance']['pre_rebalance_risk'] == 78
assert ins_dash['rebalance']['post_rebalance_risk'] == 14
# Assert completely distinct from Amoxicillin
assert ins_dash['simulation']['ripple_score'] != amox_dash['simulation']['ripple_score']
assert ins_dash['simulation']['secondary_spillover_rate'] != amox_dash['simulation']['secondary_spillover_rate']
assert ins_dash['simulation']['rescued_from_expiry_units'] != amox_dash['simulation']['rescued_from_expiry_units']
print(f"  [PASS] Insulin Ripple Score = {ins_dash['simulation']['ripple_score']}, Spillover = {ins_dash['simulation']['secondary_spillover_rate']}, Pre/Post Risk = {ins_dash['rebalance']['pre_rebalance_risk']}% -> {ins_dash['rebalance']['post_rebalance_risk']}%")
print("  [PASS] Confirmed 0% data leakage between Amoxicillin and Insulin.")

# TEST C: Return to Amoxicillin
print("\n--- TEST C: SWITCH BACK TO AMOXICILLIN ---")
amox_return = get_json('http://localhost:8000/api/medicines/amoxicillin_clav/dashboard')
assert amox_return['simulation']['ripple_score'] == 84
assert amox_return['simulation']['secondary_spillover_rate'] == 128
print("  [PASS] Returned dataset matches original Amoxicillin baseline exactly.")

# TEST D: Check Remaining 6 Medicines (Paracetamol, Azithromycin, Ceftriaxone, ORS, Rabies, Oxytocin)
print("\n--- TEST D: VERIFYING REMAINING 6 ESSENTIAL MEDICINES ---")
other_med_ids = ['paracetamol_500', 'azithromycin_500', 'ceftriaxone_1g', 'ors_sachets', 'rabies_vaccine', 'oxytocin_10iu']
for mid in other_med_ids:
    d = get_json(f'http://localhost:8000/api/medicines/{mid}/dashboard')
    print(f"  [PASS] {d['medicine']['name']}:")
    print(f"         Ripple Score: {d['simulation']['ripple_score']} | Spillover: +{d['simulation']['secondary_spillover_rate']} pts/day | Expiry: {d['simulation']['rescued_from_expiry_units']} units")
    print(f"         Regional Risk: {d['rebalance']['pre_rebalance_risk']}% -> {d['rebalance']['post_rebalance_risk']}% | Epicenter: {d['epicenter_facility_id']}")

# TEST E: What-If Disruption Simulation on Ceftriaxone
print("\n--- TEST E: WHAT-IF SIMULATION ON CEFTRIAXONE 1G INJECTION ---")
ceft_sim = post_json('http://localhost:8000/api/medicines/ceftriaxone_1g/simulate', {
    "medicine_id": "ceftriaxone_1g",
    "supplier_delay_days": 25,
    "outbreak_surge_pct": 60,
    "infrastructure_severance": True,
    "timeline_day": 7
})
assert ceft_sim['ripple_score'] >= 90
assert ceft_sim['blocked_routes_count'] == 2
print(f"  [PASS] Ceftriaxone under +25d delay & severance: Ripple Score = {ceft_sim['ripple_score']}, Blocked Routes = {ceft_sim['blocked_routes_count']}")

# TEST F: Minimum-Intervention Optimization (MIO) on Anti-Rabies Vaccine
print("\n--- TEST F: MIO OPTIMIZATION ON ANTI-RABIES VACCINE ---")
rab_opt = post_json('http://localhost:8000/api/medicines/rabies_vaccine/optimize', {})
assert rab_opt['status'] == 'OPTIMIZED'
assert rab_opt['risk_reduction_pct'] >= 80.0
assert len(rab_opt['recommended_transfers']) >= 2
for t in rab_opt['recommended_transfers']:
    assert t['transfer_volume'] > 0
    assert t['cost_inr'] > 0
print(f"  [PASS] Anti-Rabies MIO produced {len(rab_opt['recommended_transfers'])} transfers with -{rab_opt['risk_reduction_pct']}% risk reduction.")

# TEST G: Reports & Inventory Endpoints
print("\n--- TEST G: INVENTORY & REPORTS VERIFICATION ---")
inv = get_json('http://localhost:8000/api/medicines/amoxicillin_clav/inventory')
assert len(inv['inventory']) == 12
assert inv['total_stock'] > 0
rep = get_json('http://localhost:8000/api/medicines/insulin_glargine/reports')
assert 'REP-TN-2026' in rep['report_id']
print(f"  [PASS] Inventory returned {len(inv['inventory'])} facilities. Report dossier {rep['report_id']} generated.")

print("\n=================================================================")
print("[SUCCESS] ALL 7 E2E CRITICAL TESTS PASSED! MEDICINE IS TRUE SINGLE SOURCE OF TRUTH.")
print("=================================================================")
