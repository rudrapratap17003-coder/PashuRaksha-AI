import os
import uuid
import pytest

# Configure test environment prior to app initialization
os.environ["DEMO_MODE"] = "true"
os.environ["ENVIRONMENT"] = "development"
os.environ["SECRET_KEY"] = "test-session-secret-key-pashuraksha-testing-only-12345"

from fastapi.testclient import TestClient
from app.main import app
from app.database import init_db
from app.ai.risk_engine import ExplainableRiskEngine
from app.ai.disease_model import DiseasePatternModel
from app.ai.clustering import OutbreakClusterEngine

# Initialize test client
client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    init_db()

def get_auth_token(email: str, password: str = "password123") -> str:
    res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert res.status_code == 200, f"Failed login for {email}: {res.text}"
    return res.json()["access_token"]

@pytest.fixture(scope="session")
def farmer_headers():
    token = get_auth_token("farmer1@pashuraksha.ai")
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(scope="session")
def fieldworker_headers():
    token = get_auth_token("fieldworker1@pashuraksha.ai")
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(scope="session")
def vet_headers():
    token = get_auth_token("vet1@pashuraksha.ai")
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(scope="session")
def lab_headers():
    token = get_auth_token("lab1@pashuraksha.ai")
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(scope="session")
def authority_headers():
    token = get_auth_token("officer1@pashuraksha.ai")
    return {"Authorization": f"Bearer {token}"}

# 1. Core Health & Root Tests
def test_root_and_health_endpoints():
    res_root = client.get("/")
    assert res_root.status_code == 200
    assert res_root.json()["ps_id"] == "SIH26128"

    res_health = client.get("/api/v1/health")
    assert res_health.status_code == 200
    data = res_health.json()
    assert data["status"] == "healthy"
    assert "disclaimer" in data

# 2. Authentication & JWT Security Tests + RBAC Tests
def test_authentication_and_jwt(farmer_headers):
    unique_email = f"test.vet.{uuid.uuid4().hex[:6]}@pashuraksha.ai"
    reg_payload = {
        "name": "Dr. Test Vet",
        "phone": "9988776655",
        "email": unique_email,
        "password": "password123",
        "role": "veterinarian",
        "village": "Baramati",
        "district": "Pune"
    }
    reg_res = client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_res.status_code == 201

    login_res = client.post("/api/v1/auth/login", json={
        "email": unique_email,
        "password": "password123"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    assert token is not None

    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == unique_email

    # Unauthenticated request must return 401
    unauth_res = client.get("/api/v1/animals")
    assert unauth_res.status_code == 401

    # Farmer trying to access Authority dashboard must return 403 Forbidden
    forbidden_res = client.get("/api/v1/authority/dashboard", headers=farmer_headers)
    assert forbidden_res.status_code == 403

def test_invalid_login_rejection():
    """Phase 1: Ensure unknown emails and incorrect passwords always return HTTP 401."""
    # Unknown email
    res1 = client.post("/api/v1/auth/login", json={"email": "nonexistent@pashuraksha.ai", "password": "password123"})
    assert res1.status_code == 401
    assert "Invalid credentials" in res1.json()["detail"]

    # Wrong password
    res2 = client.post("/api/v1/auth/login", json={"email": "farmer1@pashuraksha.ai", "password": "wrong_password"})
    assert res2.status_code == 401
    assert "Invalid credentials" in res2.json()["detail"]

def test_rbac_portal_protection(farmer_headers, vet_headers, authority_headers):
    """Phase 1: Enforce RBAC matrix across sensitive routes."""
    # Farmer cannot access Vet, Lab, Authority, or Admin endpoints
    assert client.get("/api/v1/vet/cases", headers=farmer_headers).status_code == 403
    assert client.get("/api/v1/lab/dashboard", headers=farmer_headers).status_code == 403
    assert client.get("/api/v1/authority/dashboard", headers=farmer_headers).status_code == 403
    assert client.get("/api/v1/admin/stats", headers=farmer_headers).status_code == 403
    assert client.get("/api/v1/field-worker/dashboard", headers=farmer_headers).status_code == 403

    # Vet can access clinical desk but not admin
    assert client.get("/api/v1/vet/cases", headers=vet_headers).status_code == 200
    assert client.get("/api/v1/admin/users", headers=vet_headers).status_code == 403

    # Authority can access surveillance dashboard but not admin users
    assert client.get("/api/v1/authority/dashboard", headers=authority_headers).status_code == 200
    assert client.get("/api/v1/admin/users", headers=authority_headers).status_code == 403

# 3. Livestock Digital Records CRUD Tests
def test_animal_digital_passports_crud(farmer_headers):
    anim_id = f"COW-{uuid.uuid4().hex[:4].upper()}"
    new_animal = {
        "animal_id": anim_id,
        "species": "Cattle (Cow)",
        "breed": "Gir",
        "age": 4.0,
        "gender": "female",
        "weight": 390.0,
        "milk_production": 14.5,
        "village": "Baramati",
        "district": "Pune"
    }
    post_res = client.post("/api/v1/animals", json=new_animal, headers=farmer_headers)
    assert post_res.status_code == 201
    created_id = post_res.json()["animal_id"]
    assert created_id == anim_id

    get_res = client.get(f"/api/v1/animals/{created_id}", headers=farmer_headers)
    assert get_res.status_code == 200
    assert get_res.json()["breed"] == "Gir"

    list_res = client.get("/api/v1/animals", headers=farmer_headers)
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

# 4. AI Explainable Risk Engine & Symptom Ingestion Tests
def test_ai_risk_engine_and_symptom_reporting(farmer_headers):
    # Mild Symptom Test (Expected LOW Risk)
    mild_report = {
        "animal_id": "COW-101",
        "cough": True,
        "severity": "mild",
        "duration_days": 1,
        "number_of_animals_affected": 1
    }
    mild_res = client.post("/api/v1/health-reports", json=mild_report, headers=farmer_headers)
    assert mild_res.status_code == 201
    assert mild_res.json()["risk_level"] == "LOW"

    # Severe Outbreak Symptom Test (Expected CRITICAL Risk & FMD Match)
    severe_report = {
        "animal_id": "BUF-204",
        "fever": True,
        "lesions": True,
        "salivation": True,
        "reduced_milk": True,
        "severity": "severe",
        "duration_days": 3,
        "number_of_animals_affected": 4,
        "village": "Baramati",
        "district": "Pune"
    }
    severe_res = client.post("/api/v1/health-reports", json=severe_report, headers=farmer_headers)
    assert severe_res.status_code == 201
    data = severe_res.json()
    assert data["risk_level"] == "CRITICAL"
    assert data["risk_score"] >= 80.0
    assert "Foot-and-Mouth" in data["possible_disease_concern"] or "Vesicular" in data["possible_disease_concern"]

# 5. Disease Differential Model Unit Tests
def test_disease_pattern_model():
    eval_fmd = DiseasePatternModel.evaluate_differentials(
        fever=True, lesions=True, salivation=True, reduced_milk=True, species="Cattle (Cow)", number_of_animals_affected=3
    )
    assert eval_fmd["primary_confidence"] >= 80.0
    assert "Foot-and-Mouth" in eval_fmd["primary_disease_match"]

    eval_hs = DiseasePatternModel.evaluate_differentials(
        fever=True, swelling=True, difficulty_breathing=True, species="Buffalo"
    )
    assert eval_hs["primary_confidence"] >= 80.0
    assert "Hemorrhagic Septicemia" in eval_hs["primary_disease_match"]

# 6. Spatial-Temporal Haversine Clustering Tests
def test_spatial_clustering(vet_headers):
    detect_res = client.post("/api/v1/clusters/run-detection", headers=vet_headers)
    assert detect_res.status_code == 200
    clusters = detect_res.json()
    assert len(clusters) >= 1
    assert clusters[0]["risk_level"] in ("HIGH", "CRITICAL")
    assert clusters[0]["radius_km"] > 0

# 7. Multi-Tier Alerts & Mark as Read Tests
def test_alerts_pipeline(vet_headers):
    alerts_res = client.get("/api/v1/alerts?role=veterinarian", headers=vet_headers)
    assert alerts_res.status_code == 200
    alerts = alerts_res.json()
    assert len(alerts) >= 1

    top_alert_id = alerts[0]["id"]
    read_res = client.put(f"/api/v1/alerts/{top_alert_id}/read", headers=vet_headers)
    assert read_res.status_code == 200
    assert read_res.json()["status"] == "success"

# 8. Veterinarian Triage & Clinical Action Tests
def test_vet_clinical_triage(vet_headers):
    cases_res = client.get("/api/v1/vet/cases", headers=vet_headers)
    assert cases_res.status_code == 200
    cases = cases_res.json()
    assert len(cases) >= 1

    top_case_id = cases[0]["id"]
    action_payload = {
        "action": "Administered Analgesics",
        "notes": "Observed on-site in Baramati. Prescribed supportive care.",
        "lab_referral": True,
        "status": "investigated"
    }
    action_res = client.post(f"/api/v1/vet/cases/{top_case_id}/action", json=action_payload, headers=vet_headers)
    assert action_res.status_code == 200

# 9. Authority Disease Surveillance Tests
def test_authority_surveillance_endpoints(authority_headers):
    dash_res = client.get("/api/v1/authority/dashboard", headers=authority_headers)
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    assert dash_data["total_monitored_animals"] > 0
    assert len(dash_data["villages"]) >= 4

    map_res = client.get("/api/v1/authority/map-data", headers=authority_headers)
    assert map_res.status_code == 200
    assert len(map_res.json()) >= 1

    trends_res = client.get("/api/v1/authority/trends", headers=authority_headers)
    assert trends_res.status_code == 200
    assert len(trends_res.json()) == 6


# 10. SIH 2026 Demonstration Scenario: Suspected FMD Outbreak in Baramati (7-Step Lifecycle)
def test_sih_demo_scenario_lifecycle():
    # 1. Test Reset to clean baseline
    reset_res = client.post("/api/v1/demo/reset")
    assert reset_res.status_code == 200
    reset_data = reset_res.json()
    assert reset_data["status"] == "success"
    assert reset_data["demo_animal"]["animal_id"] == "COW-101"
    assert reset_data["demo_animal"]["village"] == "Baramati"

    # Verify initial demo state
    state_res = client.get("/api/v1/demo/state")
    assert state_res.status_code == 200
    assert state_res.json()["current_step"] == 1

    # 2. Step 1: Farmer Lodges Baramati FMD Symptoms for COW-101
    step1_res = client.post("/api/v1/demo/step/1")
    assert step1_res.status_code == 200
    s1_data = step1_res.json()
    assert s1_data["risk_score"] >= 80.0
    assert s1_data["risk_level"] == "CRITICAL"
    assert "Foot-and-Mouth" in s1_data["possible_disease_concern"] or "Vesicular" in s1_data["possible_disease_concern"]

    # 3. Step 3: Field Worker Verifies & Collects Bio-Sample
    step3_res = client.post("/api/v1/demo/step/3")
    assert step3_res.status_code == 200

    # 4. Step 4: Veterinarian Triage & Lab Referral
    step4_res = client.post("/api/v1/demo/step/4")
    assert step4_res.status_code == 200
    assert step4_res.json()["referral_id"] is not None

    # 5. Step 5: Laboratory Validates POSITIVE Result
    step5_res = client.post("/api/v1/demo/step/5")
    assert step5_res.status_code == 200
    assert "POSITIVE" in step5_res.json()["result"]

    # 6. Step 6: Authority Outbreak Cluster & 5km Ring Containment Zone
    step6_res = client.post("/api/v1/demo/step/6")
    assert step6_res.status_code == 200
    s6_data = step6_res.json()
    assert s6_data["radius_km"] == 5.0
    assert s6_data["risk_level"] == "CRITICAL"

    # 7. Verify final closed-loop state
    final_state = client.get("/api/v1/demo/state").json()
    assert final_state["current_step"] == 7
    assert final_state["report"]["risk_level"] == "CRITICAL"
    assert final_state["referral"]["result"] == "positive"
    assert final_state["cluster"]["radius_km"] == 5.0

    # 8. Test clean repeatability: Reset again
    repeat_reset = client.post("/api/v1/demo/reset")
    assert repeat_reset.status_code == 200
    assert client.get("/api/v1/demo/state").json()["current_step"] == 1


# 11. Phase 3: Core Case Workflow, Explainable Risk Engine & Timeline Verification
def test_phase3_core_case_workflow_and_timeline(farmer_headers, vet_headers):
    # Step 1: Farmer files health report
    report_payload = {
        "animal_id": "COW-101",
        "fever": True,
        "lesions": True,
        "salivation": True,
        "reduced_milk": True,
        "reduced_appetite": True,
        "severity": "severe",
        "duration_days": 2,
        "number_of_animals_affected": 3,
        "village": "Baramati",
        "district": "Pune"
    }
    report_res = client.post("/api/v1/health-reports", json=report_payload, headers=farmer_headers)
    assert report_res.status_code == 201
    rep_data = report_res.json()
    case_id = rep_data["id"]
    assert case_id.startswith("rep-")
    assert rep_data["risk_score"] >= 80.0
    assert rep_data["risk_level"] == "CRITICAL"
    assert len(rep_data["contributing_factors"]) >= 4

    # Step 2: Verify explainable risk assessment was stored and linked
    risk_res = client.get(f"/api/v1/risk-assessments/{case_id}", headers=farmer_headers)
    assert risk_res.status_code == 200
    risk_data = risk_res.json()
    assert risk_data["report_id"] == case_id
    assert risk_data["risk_score"] == rep_data["risk_score"]
    assert "disclaimer" in risk_data

    # Step 3: Verify initial case timeline events were created automatically
    tl_res = client.get(f"/api/v1/cases/{case_id}/timeline", headers=vet_headers)
    assert tl_res.status_code == 200
    tl_events = tl_res.json()
    assert len(tl_events) >= 2
    event_types = [e["event_type"] for e in tl_events]
    assert "report_created" in event_types
    assert "ai_triage" in event_types

    # Step 4: Downstream Vet reviews case and logs action
    action_payload = {
        "action": "Clinical Examination & Biosecurity Advisory",
        "notes": "Oral lesions inspected. Quarantine ring advised.",
        "lab_referral": True,
        "status": "investigated"
    }
    action_res = client.post(f"/api/v1/vet/cases/{case_id}/action", json=action_payload, headers=vet_headers)
    assert action_res.status_code == 200

    # Step 5: Verify timeline updated with vet action
    tl_res_updated = client.get(f"/api/v1/cases/{case_id}/timeline", headers=vet_headers)
    assert tl_res_updated.status_code == 200
    updated_events = tl_res_updated.json()
    assert len(updated_events) > len(tl_events)


# 12. Phase 4: Validated Case State Machine & End-to-End Operational Lifecycle
def test_phase4_case_state_machine_and_end_to_end_operations(
    farmer_headers, fieldworker_headers, vet_headers, lab_headers, authority_headers
):
    """
    Phase 4: Full End-to-End Operational Lifecycle on ONE Case Record:
    REPORTED / RISK_ASSESSED -> FIELD_VERIFICATION -> SAMPLE_COLLECTED ->
    LAB_PENDING -> LAB_RESULT -> AUTHORITY_REVIEW -> ACTION_TAKEN -> CLOSED
    """
    # 1. Farmer reports case (REPORTED -> RISK_ASSESSED)
    report_payload = {
        "animal_id": "COW-101",
        "fever": True,
        "lesions": True,
        "salivation": True,
        "reduced_milk": True,
        "severity": "severe",
        "duration_days": 2,
        "number_of_animals_affected": 3,
        "village": "Baramati",
        "district": "Pune"
    }
    create_res = client.post("/api/v1/health-reports", json=report_payload, headers=farmer_headers)
    assert create_res.status_code == 201
    case_data = create_res.json()
    case_id = case_data["id"]
    assert case_data["status"] == "RISK_ASSESSED"

    # 2. Field Worker accepts case and records farm inspection visit (-> FIELD_VERIFICATION)
    visit_res = client.post(
        f"/api/v1/field-worker/cases/{case_id}/visit",
        params={"observation": "Confirmed vesicular erosions on dental pad and interdigital cleft. Animal isolated in pen."},
        headers=fieldworker_headers
    )
    assert visit_res.status_code == 200

    # Verify status is now FIELD_VERIFICATION
    rep_res = client.get(f"/api/v1/health-reports/{case_id}", headers=farmer_headers)
    assert rep_res.status_code == 200
    assert rep_res.json()["status"] == "FIELD_VERIFICATION"

    # 3. Field Worker collects bio-sample under cold chain (-> SAMPLE_COLLECTED)
    sample_res = client.post(
        f"/api/v1/field-worker/cases/{case_id}/sample",
        params={"sample_type": "Oral Vesicular Fluid & Scraping"},
        headers=fieldworker_headers
    )
    assert sample_res.status_code == 200
    assert client.get(f"/api/v1/health-reports/{case_id}", headers=farmer_headers).json()["status"] == "SAMPLE_COLLECTED"

    # 4. Veterinarian conducts clinical triage & escalates to diagnostic lab (-> LAB_PENDING)
    vet_action_payload = {
        "action": "Urgent Vesicular Differential Referral",
        "notes": "Suspected Aphthovirus infection. Escalating sample to Central Diagnostic Lab for RT-PCR typing.",
        "lab_referral": True,
        "status": "investigated"
    }
    vet_res = client.post(f"/api/v1/vet/cases/{case_id}/action", json=vet_action_payload, headers=vet_headers)
    assert vet_res.status_code == 200
    assert client.get(f"/api/v1/health-reports/{case_id}", headers=farmer_headers).json()["status"] == "LAB_PENDING"

    # Verify referral was created in Lab queue
    lab_referrals_res = client.get("/api/v1/lab/referrals", headers=lab_headers)
    assert lab_referrals_res.status_code == 200
    referrals = lab_referrals_res.json()
    matching_ref = next((r for r in referrals if r["report_id"] == case_id or r["case_id"] == case_id), None)
    assert matching_ref is not None
    ref_id = matching_ref["id"]

    # 5. Laboratory validates RT-PCR POSITIVE result (-> LAB_RESULT -> auto-escalate to AUTHORITY_REVIEW)
    lab_update_payload = {
        "status": "completed",
        "result": "positive",
        "result_notes": "RT-PCR assay confirmed Foot-and-Mouth Disease (Serotype O). High viral copy count detected."
    }
    lab_res = client.put(f"/api/v1/lab/referrals/{ref_id}", json=lab_update_payload, headers=lab_headers)
    assert lab_res.status_code == 200
    assert client.get(f"/api/v1/health-reports/{case_id}", headers=farmer_headers).json()["status"] == "AUTHORITY_REVIEW"

    # 6. District Authority reviews case and enacts containment & ring vaccination (-> ACTION_TAKEN)
    auth_action_payload = {
        "action_type": "5.0 km Containment Perimeter & 250 Ring Vaccines Dispatched",
        "notes": "Checkpoint installed on Baramati-Indapur road. Vaccination teams mobilized.",
        "target_status": "ACTION_TAKEN"
    }
    auth_act_res = client.post(f"/api/v1/authority/cases/{case_id}/action", json=auth_action_payload, headers=authority_headers)
    assert auth_act_res.status_code == 200
    assert client.get(f"/api/v1/health-reports/{case_id}", headers=farmer_headers).json()["status"] == "ACTION_TAKEN"

    # 7. Authority closes resolved case after containment protocol completion (-> CLOSED)
    close_res = client.post(
        f"/api/v1/authority/cases/{case_id}/close",
        params={"notes": "Ring vaccination 94% coverage achieved. No new active lesions after 14-day quarantine."},
        headers=authority_headers
    )
    assert close_res.status_code == 200
    assert client.get(f"/api/v1/health-reports/{case_id}", headers=farmer_headers).json()["status"] == "CLOSED"

    # 8. Complete Audit Verification on unified case timeline
    timeline_res = client.get(f"/api/v1/cases/{case_id}/timeline", headers=vet_headers)
    assert timeline_res.status_code == 200
    timeline = timeline_res.json()
    assert len(timeline) >= 6

    # Verify actors across all 5 operational roles participated in this single case record
    actors = [t["actor_name"] for t in timeline]
    roles = [t["actor_role"] for t in timeline]
    assert "field_worker" in roles
    assert "veterinarian" in roles
    assert "laboratory" in roles
    assert "authority" in roles


def test_invalid_case_state_transitions():
    """Phase 4: Ensure invalid state transitions are blocked by the state machine with HTTP 400."""
    from app.database import SessionLocal
    from app.services.case_service import CaseService, CaseStatus
    from fastapi import HTTPException

    db = SessionLocal()
    try:
        # Create fresh report in RISK_ASSESSED
        report_payload = {
            "animal_id": "COW-101",
            "fever": True,
            "severity": "mild",
            "duration_days": 1,
            "number_of_animals_affected": 1
        }
        res = client.post("/api/v1/health-reports", json=report_payload, headers={"Authorization": f"Bearer {get_auth_token('farmer1@pashuraksha.ai')}"})
        case_id = res.json()["id"]

        # Attempt invalid jump: RISK_ASSESSED -> LAB_RESULT directly (must fail)
        with pytest.raises(HTTPException) as exc_info:
            CaseService.transition_status(
                db, case_id, CaseStatus.LAB_RESULT.value,
                actor_name="Test Actor", actor_role="test", action="Invalid Jump"
            )
        assert exc_info.value.status_code == 400
        assert "Invalid state transition" in exc_info.value.detail
    finally:
        db.close()


# 13. Phase 5: Outbreak Intelligence, 14-Day Rolling Window & Explainable GIS
def test_phase5_outbreak_detection_14_day_filtering_and_gis(vet_headers, authority_headers):
    """
    Phase 5: Test strict temporal filtering (14 days), spatial proximity,
    symptom similarity, and human-interpretable explainability reasons.
    """
    from datetime import datetime, timedelta
    from app.database import SessionLocal
    from app.models.health_report import HealthReport
    from app.ai.clustering import OutbreakClusterEngine

    # 1. Test 14-Day Temporal Filtering: Historical reports (>14 days) must be excluded
    now = datetime.utcnow()
    old_reports = [
        {
            "id": "old-rep-1",
            "animal_id": "COW-991",
            "latitude": 18.1515,
            "longitude": 74.5772,
            "village": "Baramati",
            "fever": True,
            "lesions": True,
            "salivation": True,
            "number_of_animals_affected": 2,
            "risk_score": 85.0,
            "reported_at": (now - timedelta(days=25)).isoformat()  # 25 days old -> MUST be excluded
        },
        {
            "id": "old-rep-2",
            "animal_id": "COW-992",
            "latitude": 18.1520,
            "longitude": 74.5780,
            "village": "Baramati",
            "fever": True,
            "lesions": True,
            "salivation": True,
            "number_of_animals_affected": 3,
            "risk_score": 90.0,
            "reported_at": (now - timedelta(days=20)).isoformat()  # 20 days old -> MUST be excluded
        }
    ]
    # Running cluster engine on ONLY old reports with window_days=14 must return empty list
    old_clusters = OutbreakClusterEngine.detect_clusters(old_reports, time_window_days=14, min_cases=2)
    assert len(old_clusters) == 0, "Historical cases outside 14-day window incorrectly created clusters"

    # 2. Test Recent Reports (<14 days): Must form cluster with explainable detection reason
    recent_reports = [
        {
            "id": "rec-rep-1",
            "animal_id": "COW-101",
            "latitude": 18.1515,
            "longitude": 74.5772,
            "village": "Baramati",
            "fever": True,
            "lesions": True,
            "salivation": True,
            "number_of_animals_affected": 2,
            "risk_score": 88.0,
            "reported_at": (now - timedelta(days=2)).isoformat()  # 2 days old
        },
        {
            "id": "rec-rep-2",
            "animal_id": "BUF-204",
            "latitude": 18.1610,
            "longitude": 74.5880,
            "village": "Malegaon Bk",
            "fever": True,
            "lesions": True,
            "salivation": True,
            "number_of_animals_affected": 3,
            "risk_score": 92.0,
            "reported_at": (now - timedelta(days=1)).isoformat()  # 1 day old
        }
    ]
    recent_clusters = OutbreakClusterEngine.detect_clusters(recent_reports, time_window_days=14, min_cases=2)
    assert len(recent_clusters) == 1
    c = recent_clusters[0]
    assert c["case_count"] == 2
    assert c["affected_animals_count"] == 5
    assert c["radius_km"] > 0
    assert "explanation" in c
    assert "Cluster detected because" in c["explanation"]
    assert "14 days" in c["explanation"]
    assert len(c["contributing_factors"]) >= 3
    assert len(c["case_ids"]) == 2

    # 3. Test API cluster detection endpoint
    detect_res = client.post("/api/v1/clusters/run-detection?window_days=14", headers=authority_headers)
    assert detect_res.status_code == 200
    clusters_api = detect_res.json()
    assert len(clusters_api) >= 1
    top_cluster = clusters_api[0]
    assert top_cluster["id"].startswith("clust-")
    assert top_cluster["explanation"] is not None
    assert top_cluster["temporal_window_days"] == 14
    assert top_cluster["vaccination_coverage"] > 0
    assert len(top_cluster["dominant_symptoms"]) >= 1

    # 4. Test Cluster Action Dispatch
    cluster_id = top_cluster["id"]
    action_payload = "Deploy 250 Ring Vaccination Doses & Impose Livestock Transit Checkpoint"
    act_res = client.post(
        f"/api/v1/clusters/{cluster_id}/action",
        params={"action": action_payload},
        headers=authority_headers
    )
    assert act_res.status_code == 200
    act_data = act_res.json()
    assert act_data["status"] == "success"
    assert act_data["new_status"] == "contained"
    assert act_data["cluster_id"] == cluster_id

