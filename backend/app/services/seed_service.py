"""
Database seeder service for initial prototype demonstrations.
Populates tables if empty with realistic rural livestock data.
"""
from datetime import datetime, timedelta, date
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.animal import Animal
from app.models.vaccination import Vaccination
from app.models.health_report import HealthReport
from app.models.risk_assessment import RiskAssessment
from app.models.cluster import OutbreakCluster
from app.models.alert import Alert

def seed_database(db: Session):
    # Check if users already exist
    if db.query(User).first() is not None:
        return  # Database already seeded

    # 1. Seed Users
    farmer1 = User(
        id="usr-farmer-1",
        name="Ramesh Kumar",
        phone="9876543210",
        email="farmer.ramesh@pashuraksha.ai",
        password_hash="hashed_pw_farmer1",
        role="farmer",
        village="Rampur",
        district="Jaipur Rural",
        state="Rajasthan",
        latitude=26.9124,
        longitude=75.7873,
    )
    farmer2 = User(
        id="usr-farmer-2",
        name="Suresh Patel",
        phone="9876543211",
        email="farmer.suresh@pashuraksha.ai",
        password_hash="hashed_pw_farmer2",
        role="farmer",
        village="Rampur",
        district="Jaipur Rural",
        state="Rajasthan",
        latitude=26.9140,
        longitude=75.7890,
    )
    vet1 = User(
        id="usr-vet-1",
        name="Dr. Sharma",
        phone="9876543220",
        email="dr.sharma@pashuraksha.ai",
        password_hash="hashed_pw_vet1",
        role="veterinarian",
        village="Rampur Block Center",
        district="Jaipur Rural",
        state="Rajasthan",
        latitude=26.9100,
        longitude=75.7800,
    )
    auth1 = User(
        id="usr-auth-1",
        name="R. Verma",
        phone="9876543230",
        email="officer.verma@pashuraksha.ai",
        password_hash="hashed_pw_auth1",
        role="authority",
        village="Jaipur HQ",
        district="Jaipur Rural",
        state="Rajasthan",
        latitude=26.9200,
        longitude=75.8000,
    )
    db.add_all([farmer1, farmer2, vet1, auth1])
    db.commit()

    # 2. Seed Animals
    anim1 = Animal(
        id="anim-101",
        animal_id="COW-101",
        owner_id=farmer1.id,
        owner_name=farmer1.name,
        species="Cattle (Cow)",
        breed="Gir",
        age=4.5,
        gender="female",
        weight=380.0,
        vaccination_status="Up to date",
        previous_diseases="None",
        milk_production=14.0,
        village="Rampur",
        district="Jaipur Rural",
        current_risk_score=12.0,
        current_risk_level="LOW",
    )
    anim2 = Animal(
        id="anim-102",
        animal_id="BUF-204",
        owner_id=farmer1.id,
        owner_name=farmer1.name,
        species="Buffalo",
        breed="Murrah",
        age=3.0,
        gender="female",
        weight=460.0,
        vaccination_status="Due soon",
        previous_diseases="Mild mastitis (treated)",
        milk_production=11.5,
        village="Rampur",
        district="Jaipur Rural",
        current_risk_score=74.0,
        current_risk_level="HIGH",
    )
    anim3 = Animal(
        id="anim-103",
        animal_id="GOAT-305",
        owner_id=farmer1.id,
        owner_name=farmer1.name,
        species="Goat",
        breed="Sirohi",
        age=1.5,
        gender="male",
        weight=42.0,
        vaccination_status="Up to date",
        previous_diseases="None",
        milk_production=0.0,
        village="Rampur",
        district="Jaipur Rural",
        current_risk_score=8.0,
        current_risk_level="LOW",
    )
    db.add_all([anim1, anim2, anim3])
    db.commit()

    # 3. Seed Vaccinations
    vac1 = Vaccination(
        id="vac-101",
        animal_id=anim1.animal_id,
        vaccine_name="FMD (Foot & Mouth Disease)",
        vaccination_date=date.today() - timedelta(days=60),
        next_due_date=date.today() + timedelta(days=300),
        status="completed",
        notes="Annual booster administered by Dr. Sharma",
    )
    vac2 = Vaccination(
        id="vac-102",
        animal_id=anim2.animal_id,
        vaccine_name="HS + BQ Combined",
        vaccination_date=date.today() - timedelta(days=170),
        next_due_date=date.today() + timedelta(days=10),
        status="due",
        notes="Booster due before monsoon",
    )
    db.add_all([vac1, vac2])
    db.commit()

    # 4. Seed Health Report & Risk Assessment
    rep1 = HealthReport(
        id="rep-101",
        animal_id=anim2.animal_id,
        reported_by=farmer1.id,
        reporter_name=farmer1.name,
        species=anim2.species,
        fever=True,
        cough=True,
        nasal_discharge=False,
        reduced_appetite=True,
        diarrhea=False,
        lethargy=True,
        reduced_milk=True,
        difficulty_breathing=False,
        salivation=False,
        lesions=False,
        swelling=False,
        other_symptoms="High body temperature in afternoon",
        severity="severe",
        duration_days=3,
        number_of_animals_affected=2,
        latitude=26.9124,
        longitude=75.7873,
        village="Rampur",
        district="Jaipur Rural",
        risk_score=74.0,
        risk_level="HIGH",
        possible_disease_concern="Possible Bovine Respiratory Disease / Elevated Viral Concern",
        recommendation="Veterinary assessment recommended. Isolate animal and monitor water intake.",
    )
    db.add(rep1)
    db.commit()

    risk1 = RiskAssessment(
        id="risk-101",
        report_id=rep1.id,
        animal_id=anim2.animal_id,
        risk_score=74.0,
        risk_level="HIGH",
        possible_disease_concern="Possible Bovine Respiratory Disease Complex",
        disease_risk_score=72.5,
        contributing_factors=[
            {"factor": "Fever reported", "weight_contribution": 20.0, "category": "Clinical Vitals"},
            {"factor": "Cough & respiratory signs", "weight_contribution": 18.0, "category": "Symptoms"},
            {"factor": "Loss of appetite & lethargy", "weight_contribution": 16.0, "category": "General Health"},
            {"factor": "Multiple animals affected (2 nearby)", "weight_contribution": 12.0, "category": "Community Spread"},
            {"factor": "Overdue booster vaccination", "weight_contribution": 8.0, "category": "Immunization History"},
        ],
        recommendation="Veterinary assessment recommended. Separate from healthy herd.",
        cluster_detected=True,
        cluster_name="Rampur Village Cluster #1",
    )
    db.add(risk1)
    db.commit()

    # 5. Seed Simulated Outbreak Cluster
    cluster1 = OutbreakCluster(
        id="clust-101",
        cluster_name="Rampur Village Outbreak Cluster #1",
        disease_concern="Possible Bovine Respiratory Illness Cluster",
        latitude=26.9124,
        longitude=75.7873,
        radius_km=1.5,
        case_count=4,
        affected_animals_count=7,
        cluster_score=82.0,
        risk_level="CRITICAL",
        dominant_symptoms=["Fever", "Cough", "Reduced Appetite"],
        affected_villages=["Rampur"],
        status="active",
        recommended_action="On-site veterinary inspection recommended. Ring vaccination check advised.",
    )
    db.add(cluster1)
    db.commit()

    # 6. Seed Alerts
    alt1 = Alert(
        id="alt-101",
        user_id=farmer1.id,
        target_role="farmer",
        alert_type="cluster_warning",
        title="Elevated Livestock Health Risk in Rampur",
        message="Multiple similar livestock health reports have been detected nearby. Please check your animals for fever or cough.",
        risk_level="HIGH",
        related_cluster_id=cluster1.id,
        village="Rampur",
        is_read=False,
    )
    alt2 = Alert(
        id="alt-102",
        user_id=vet1.id,
        target_role="veterinarian",
        alert_type="vet_triage",
        title="New High-Priority Case: Rampur Center",
        message="Animal BUF-204 reported severe respiratory symptoms with risk score 74/100.",
        risk_level="HIGH",
        related_cluster_id=cluster1.id,
        village="Rampur",
        is_read=False,
    )
    alt3 = Alert(
        id="alt-103",
        user_id=auth1.id,
        target_role="authority",
        alert_type="surveillance_cluster",
        title="Possible Disease Cluster: Rampur Village",
        message="Spatial clustering detected 4 cases within 1.5 km. Public health investigation recommended.",
        risk_level="CRITICAL",
        related_cluster_id=cluster1.id,
        village="Rampur",
        is_read=False,
    )
    db.add_all([alt1, alt2, alt3])
    db.commit()
