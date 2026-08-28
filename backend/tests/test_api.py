import uuid
import pytest
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

# 2. Authentication & JWT Security Tests
def test_authentication_and_jwt():
    unique_email = f"test.vet.{uuid.uuid4().hex[:6]}@pashuraksha.ai"
    reg_payload = {
        "name": "Dr. Test Vet",
        "phone": "9988776655",
        "email": unique_email,
        "password": "password123",
        "role": "veterinarian",
        "village": "Jaipur Rural",
        "district": "Jaipur Rural"
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

# 3. Livestock Digital Records CRUD Tests
def test_animal_digital_passports_crud():
    anim_id = f"COW-{uuid.uuid4().hex[:4].upper()}"
    new_animal = {
        "animal_id": anim_id,
        "species": "Cattle (Cow)",
        "breed": "Gir",
        "age": 4.0,
        "gender": "female",
        "weight": 390.0,
        "milk_production": 14.5,
        "village": "Rampur",
        "district": "Jaipur Rural"
    }
    post_res = client.post("/api/v1/animals", json=new_animal)
    assert post_res.status_code == 201
    created_id = post_res.json()["animal_id"]
    assert created_id == anim_id

    get_res = client.get(f"/api/v1/animals/{created_id}")
    assert get_res.status_code == 200
    assert get_res.json()["breed"] == "Gir"

    list_res = client.get("/api/v1/animals")
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

# 4. AI Explainable Risk Engine & Symptom Ingestion Tests
def test_ai_risk_engine_and_symptom_reporting():
    # Mild Symptom Test (Expected LOW Risk)
    mild_report = {
        "animal_id": "COW-101",
        "cough": True,
        "severity": "mild",
        "duration_days": 1,
        "number_of_animals_affected": 1
    }
    mild_res = client.post("/api/v1/health-reports", json=mild_report)
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
        "village": "Rampur",
        "district": "Jaipur Rural"
    }
    severe_res = client.post("/api/v1/health-reports", json=severe_report)
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
def test_spatial_clustering():
    detect_res = client.post("/api/v1/clusters/run-detection")
    assert detect_res.status_code == 200
    clusters = detect_res.json()
    assert len(clusters) >= 1
    assert clusters[0]["risk_level"] == "CRITICAL"
    assert clusters[0]["radius_km"] > 0

# 7. Multi-Tier Alerts & Mark as Read Tests
def test_alerts_pipeline():
    alerts_res = client.get("/api/v1/alerts?role=veterinarian")
    assert alerts_res.status_code == 200
    alerts = alerts_res.json()
    assert len(alerts) >= 1

    top_alert_id = alerts[0]["id"]
    read_res = client.put(f"/api/v1/alerts/{top_alert_id}/read")
    assert read_res.status_code == 200
    assert read_res.json()["status"] == "success"

# 8. Veterinarian Triage & Clinical Action Tests
def test_vet_clinical_triage():
    cases_res = client.get("/api/v1/vet/cases")
    assert cases_res.status_code == 200
    cases = cases_res.json()
    assert len(cases) >= 1

    top_case_id = cases[0]["id"]
    action_payload = {
        "action": "Administered Analgesics",
        "notes": "Observed on-site in Rampur. Prescribed supportive care.",
        "lab_referral": True,
        "status": "investigated"
    }
    action_res = client.post(f"/api/v1/vet/cases/{top_case_id}/action", json=action_payload)
    assert action_res.status_code == 200

# 9. Authority Disease Surveillance Tests
def test_authority_surveillance_endpoints():
    dash_res = client.get("/api/v1/authority/dashboard")
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    assert dash_data["total_monitored_animals"] > 0
    assert len(dash_data["villages"]) >= 4

    map_res = client.get("/api/v1/authority/map-data")
    assert map_res.status_code == 200
    assert len(map_res.json()) >= 1

    trends_res = client.get("/api/v1/authority/trends")
    assert trends_res.status_code == 200
    assert len(trends_res.json()) == 6
