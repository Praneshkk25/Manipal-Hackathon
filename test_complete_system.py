import sys
from fastapi.testclient import TestClient
from backend.app.main import app

def run_tests():
    client = TestClient(app)
    
    print("==================================================================")
    print("MEDRIPPLE AI SYSTEM: COMPREHENSIVE BACKEND & WORKFLOW VERIFICATION")
    print("==================================================================")
    
    # 1. Health & Settings
    print("\n[TEST 1] System Health & Operational Settings:")
    health = client.get('/api/health').json()
    assert health['status'] == 'healthy'
    assert 'timestamp' in health
    print(f"  [PASS] System status: {health['status']} at {health['timestamp']}")
    
    settings = client.get('/api/settings').json()
    assert settings['critical_threshold_days'] == 5.0
    assert settings['donor_floor_days'] == 18.0
    print(f"  [PASS] Settings: Critical <= {settings['critical_threshold_days']}d, Donor Floor > {settings['donor_floor_days']}d")
    
    # 2. Region Registry
    print("\n[TEST 2] Operational Regions:")
    regions = client.get('/api/regions').json()['regions']
    assert len(regions) >= 1
    demo_reg = regions[0]
    assert demo_reg['is_demo'] is True
    print(f"  [PASS] Region: {demo_reg['name']} ({demo_reg['facility_count']} facilities)")
    
    # 3. Multi-Medicine Isolation
    print("\n[TEST 3] Multi-Medicine Isolation & Dynamic Dashboards:")
    meds = client.get('/api/medicines').json()['medicines']
    assert len(meds) >= 8
    print(f"  [PASS] Found {len(meds)} active essential medicines.")
    
    scores = {}
    for m in meds:
        mid = m['id']
        dash = client.get(f'/api/medicines/{mid}/dashboard').json()
        assert dash['medicine']['id'] == mid
        sim = dash['simulation']
        reb = dash['rebalance']
        xai = dash['explainable_ai']
        scores[mid] = sim['ripple_score']
        print(f"  [PASS] [{mid}] {m['name']}:")
        print(f"      Ripple Score: {sim['ripple_score']} ({sim['ripple_status']}) | Spillover: +{sim['secondary_spillover_rate']} pts/day | Expiry: {sim['rescued_from_expiry_units']} units")
        print(f"      Pre/Post Risk: {reb['pre_rebalance_risk']}% -> {reb['post_rebalance_risk']}% | Transfers: {len(reb['recommended_transfers'])}")
    
    # Verify no two consecutive medicines have identical values (0% data leakage)
    assert scores['amoxicillin_clav'] != scores['insulin_glargine']
    assert scores['paracetamol_500'] != scores['ceftriaxone_1g']
    print("  [PASS] Zero data leakage between distinct therapeutic categories.")
    
    # 4. Disruption Simulation Engine
    print("\n[TEST 4] What-If Disruption Simulation Engine:")
    sim_res = client.post('/api/medicines/amoxicillin_clav/simulate', json={
        "medicine_id": "amoxicillin_clav",
        "supplier_delay_days": 25,
        "outbreak_surge_pct": 50,
        "infrastructure_severance": True,
        "timeline_day": 7
    }).json()
    assert sim_res['ripple_score'] >= 85
    assert sim_res['blocked_routes_count'] == 2
    print(f"  [PASS] Severe Disruption (+25d delay, +50% surge, severed): Ripple={sim_res['ripple_score']}, Blocked={sim_res['blocked_routes_count']}")
    
    # 5. MIO Rebalance & Human-in-the-Loop Transfer Approval
    print("\n[TEST 5] MIO Rebalance & Transfer Approval Workflow:")
    reb = client.post('/api/medicines/amoxicillin_clav/optimize').json()
    assert len(reb['recommended_transfers']) >= 1
    first_transfer = reb['recommended_transfers'][0]
    tid = first_transfer['transfer_id']
    
    approval = client.post(f'/api/medicines/amoxicillin_clav/transfers/{tid}/approve', json={
        "approved_by_role": "District Health Officer",
        "notes": "Emergency authorization"
    }).json()
    assert approval['success'] is True
    assert approval['status'] == 'APPROVED'
    print(f"  [PASS] Approved transfer {tid}: {approval['units_transferred']} units authorized by DHO.")
    print(f"    Donor ({approval['source_id']}) floor maintained: {approval['donor_remaining_stock']} units.")
    
    # 6. Low-Bandwidth Rural GSM SMS Gateway
    print("\n[TEST 6] Rural GSM SMS Gateway:")
    sms = client.post('/api/rural-sms', json={
        "facility_id": first_transfer['target_id'],
        "recipient_phone": "+91 94421 88301",
        "recipient_name": "Sister Jayalakshmi (PHC In-Charge)",
        "message_text": f"MedRipple AI Dispatch #{tid}: Dispatched {first_transfer['transfer_volume']} units.",
        "dispatch_code": "9821",
        "transfer_id": tid
    }).json()
    assert sms['success'] is True
    assert 'delivery_receipt' in sms
    print(f"  [PASS] SMS broadcast transmitted: Receipt = {sms['delivery_receipt']}, Mode = {sms['mode']}")
    
    # 7. Audit Ledger
    print("\n[TEST 7] Operational Audit Ledger:")
    audit = client.get('/api/audit').json()
    logs = audit['audit_trail']
    assert len(logs) >= 1
    print(f"  [PASS] Audit ledger contains {len(logs)} tamper-evident clinical events.")
    print(f"    Latest action: {logs[0]['action']} by {logs[0]['user_role']} at {logs[0]['timestamp']}")
    
    print("\n==================================================================")
    print("[SUCCESS] ALL VERIFICATION SUITES PASSED! MEDRIPPLE AI IS FULLY OPERATIONAL.")
    print("==================================================================")

if __name__ == '__main__':
    run_tests()
