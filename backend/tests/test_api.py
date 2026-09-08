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
def vet_headers():
    token = get_auth_token("vet1@pashuraksha.ai")
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
    assert clusters[0]["risk_level"] == "CRITICAL"
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
