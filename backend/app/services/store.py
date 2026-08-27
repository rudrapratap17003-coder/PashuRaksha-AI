"""
In-memory demonstration data store for Phase 3.
Provides pre-populated seed data representing multiple villages, livestock profiles,
and an active simulated disease cluster in Rampur village.
"""
from datetime import datetime, timedelta, date
import uuid

class InMemoryStore:
    def __init__(self):
        self.users = {}
        self.animals = {}
        self.vaccinations = {}
        self.health_reports = {}
        self.risk_assessments = {}
        self.clusters = {}
        self.alerts = {}
        self.vet_cases = {}
        self._seed_data()

    def _seed_data(self):
        # 1. Seed Users
        self.users["usr-farmer-1"] = {
            "id": "usr-farmer-1",
            "name": "Ramesh Kumar",
            "phone": "9876543210",
            "email": "farmer.ramesh@pashuraksha.ai",
            "role": "farmer",
            "village": "Rampur",
            "district": "Jaipur Rural",
            "state": "Rajasthan",
            "latitude": 26.9124,
            "longitude": 75.7873,
            "created_at": datetime.utcnow() - timedelta(days=30),
        }
        self.users["usr-farmer-2"] = {
            "id": "usr-farmer-2",
            "name": "Suresh Patel",
            "phone": "9876543211",
            "email": "farmer.suresh@pashuraksha.ai",
            "role": "farmer",
            "village": "Rampur",
            "district": "Jaipur Rural",
            "state": "Rajasthan",
            "latitude": 26.9140,
            "longitude": 75.7890,
            "created_at": datetime.utcnow() - timedelta(days=25),
        }
        self.users["usr-vet-1"] = {
            "id": "usr-vet-1",
            "name": "Dr. Sharma",
            "phone": "9876543220",
            "email": "dr.sharma@pashuraksha.ai",
            "role": "veterinarian",
            "village": "Rampur Block Center",
            "district": "Jaipur Rural",
            "state": "Rajasthan",
            "latitude": 26.9100,
            "longitude": 75.7800,
            "created_at": datetime.utcnow() - timedelta(days=60),
        }
        self.users["usr-auth-1"] = {
            "id": "usr-auth-1",
            "name": "R. Verma",
            "phone": "9876543230",
            "email": "officer.verma@pashuraksha.ai",
            "role": "authority",
            "village": "Jaipur HQ",
            "district": "Jaipur Rural",
            "state": "Rajasthan",
            "latitude": 26.9200,
            "longitude": 75.8000,
            "created_at": datetime.utcnow() - timedelta(days=90),
        }

        # 2. Seed Animals
        self.animals["anim-101"] = {
            "id": "anim-101",
            "animal_id": "COW-101",
            "owner_id": "usr-farmer-1",
            "owner_name": "Ramesh Kumar",
            "species": "Cattle (Cow)",
            "breed": "Gir",
            "age": 4.5,
            "gender": "female",
            "weight": 380.0,
            "vaccination_status": "Up to date",
            "previous_diseases": "None",
            "milk_production": 14.0,
            "village": "Rampur",
            "district": "Jaipur Rural",
            "current_risk_score": 12.0,
            "current_risk_level": "LOW",
            "created_at": datetime.utcnow() - timedelta(days=20),
        }
        self.animals["anim-102"] = {
            "id": "anim-102",
            "animal_id": "BUF-204",
            "owner_id": "usr-farmer-1",
            "owner_name": "Ramesh Kumar",
            "species": "Buffalo",
            "breed": "Murrah",
            "age": 3.0,
            "gender": "female",
            "weight": 460.0,
            "vaccination_status": "Due soon",
            "previous_diseases": "Mild mastitis (treated)",
            "milk_production": 11.5,
            "village": "Rampur",
            "district": "Jaipur Rural",
            "current_risk_score": 74.0,
            "current_risk_level": "HIGH",
            "created_at": datetime.utcnow() - timedelta(days=15),
        }
        self.animals["anim-103"] = {
            "id": "anim-103",
            "animal_id": "GOAT-305",
            "owner_id": "usr-farmer-1",
            "owner_name": "Ramesh Kumar",
            "species": "Goat",
            "breed": "Sirohi",
            "age": 1.5,
            "gender": "male",
            "weight": 42.0,
            "vaccination_status": "Up to date",
            "previous_diseases": "None",
            "milk_production": 0.0,
            "village": "Rampur",
            "district": "Jaipur Rural",
            "current_risk_score": 8.0,
            "current_risk_level": "LOW",
            "created_at": datetime.utcnow() - timedelta(days=10),
        }

        # 3. Seed Vaccinations
        self.vaccinations["vac-101"] = {
            "id": "vac-101",
            "animal_id": "COW-101",
            "vaccine_name": "FMD (Foot & Mouth Disease)",
            "vaccination_date": date.today() - timedelta(days=60),
            "next_due_date": date.today() + timedelta(days=300),
            "status": "completed",
            "notes": "Annual booster administered",
            "created_at": datetime.utcnow() - timedelta(days=60),
        }
        self.vaccinations["vac-102"] = {
            "id": "vac-102",
            "animal_id": "BUF-204",
            "vaccine_name": "HS + BQ Combined",
            "vaccination_date": date.today() - timedelta(days=170),
            "next_due_date": date.today() + timedelta(days=10),
            "status": "due",
            "notes": "Booster due before monsoon",
            "created_at": datetime.utcnow() - timedelta(days=170),
        }

        # 4. Seed Health Reports & Risk Assessments
        self.health_reports["rep-101"] = {
            "id": "rep-101",
            "animal_id": "BUF-204",
            "reported_by": "usr-farmer-1",
            "reporter_name": "Ramesh Kumar",
            "species": "Buffalo",
            "fever": True,
            "cough": True,
            "nasal_discharge": False,
            "reduced_appetite": True,
            "diarrhea": False,
            "lethargy": True,
            "reduced_milk": True,
            "difficulty_breathing": False,
            "salivation": False,
            "lesions": False,
            "swelling": False,
            "other_symptoms": "High body temperature in afternoon",
            "severity": "severe",
            "duration_days": 3,
            "number_of_animals_affected": 2,
            "latitude": 26.9124,
            "longitude": 75.7873,
            "village": "Rampur",
            "district": "Jaipur Rural",
            "reported_at": datetime.utcnow() - timedelta(hours=3),
            "risk_score": 74.0,
            "risk_level": "HIGH",
            "possible_disease_concern": "Possible Bovine Respiratory Disease / Elevated Viral Concern",
            "recommendation": "Veterinary assessment recommended. Isolate animal and monitor water intake.",
        }

        self.risk_assessments["risk-101"] = {
            "id": "risk-101",
            "report_id": "rep-101",
            "animal_id": "BUF-204",
            "risk_score": 74.0,
            "risk_level": "HIGH",
            "possible_disease_concern": "Possible Bovine Respiratory Disease Complex",
            "disease_risk_score": 72.5,
            "contributing_factors": [
                {"factor": "Fever reported", "weight_contribution": 20.0, "category": "Clinical Vitals"},
                {"factor": "Cough & respiratory signs", "weight_contribution": 18.0, "category": "Symptoms"},
                {"factor": "Loss of appetite & lethargy", "weight_contribution": 16.0, "category": "General Health"},
                {"factor": "Multiple animals affected (2 nearby)", "weight_contribution": 12.0, "category": "Community Spread"},
                {"factor": "Overdue booster vaccination", "weight_contribution": 8.0, "category": "Immunization History"},
            ],
            "recommendation": "Veterinary assessment recommended. Separate from healthy herd.",
            "cluster_detected": True,
            "cluster_name": "Rampur Village Cluster #1",
            "disclaimer": "PASHURAKSHA AI provides AI-assisted health risk assessment and early-warning support. It does not replace professional veterinary diagnosis or treatment.",
            "created_at": datetime.utcnow() - timedelta(hours=3),
        }

        # 5. Seed Simulated Outbreak Cluster
        self.clusters["clust-101"] = {
            "id": "clust-101",
            "cluster_name": "Rampur Village Outbreak Cluster #1",
            "disease_concern": "Possible Bovine Respiratory Illness Cluster",
            "latitude": 26.9124,
            "longitude": 75.7873,
            "radius_km": 1.5,
            "case_count": 4,
            "affected_animals_count": 7,
            "cluster_score": 82.0,
            "risk_level": "CRITICAL",
            "dominant_symptoms": ["Fever", "Cough", "Reduced Appetite"],
            "affected_villages": ["Rampur"],
            "status": "active",
            "detected_at": datetime.utcnow() - timedelta(hours=4),
            "recommended_action": "On-site veterinary inspection recommended. Ring vaccination check advised.",
        }

        # 6. Seed Alerts
        self.alerts["alt-101"] = {
            "id": "alt-101",
            "user_id": "usr-farmer-1",
            "target_role": "farmer",
            "alert_type": "cluster_warning",
            "title": "Elevated Livestock Health Risk in Rampur",
            "message": "Multiple similar livestock health reports have been detected nearby. Please check your animals for fever or cough.",
            "risk_level": "HIGH",
            "related_cluster_id": "clust-101",
            "village": "Rampur",
            "is_read": False,
            "created_at": datetime.utcnow() - timedelta(hours=2),
        }
        self.alerts["alt-102"] = {
            "id": "alt-102",
            "user_id": "usr-vet-1",
            "target_role": "veterinarian",
            "alert_type": "vet_triage",
            "title": "New High-Priority Case: Rampur Center",
            "message": "Animal BUF-204 reported severe respiratory symptoms with risk score 74/100.",
            "risk_level": "HIGH",
            "related_cluster_id": "clust-101",
            "village": "Rampur",
            "is_read": False,
            "created_at": datetime.utcnow() - timedelta(hours=3),
        }
        self.alerts["alt-103"] = {
            "id": "alt-103",
            "user_id": "usr-auth-1",
            "target_role": "authority",
            "alert_type": "surveillance_cluster",
            "title": "Possible Disease Cluster: Rampur Village",
            "message": "Spatial clustering detected 4 cases within 1.5 km. Public health investigation recommended.",
            "risk_level": "CRITICAL",
            "related_cluster_id": "clust-101",
            "village": "Rampur",
            "is_read": False,
            "created_at": datetime.utcnow() - timedelta(hours=4),
        }

        # 7. Seed Vet Cases
        self.vet_cases["case-8801"] = {
            "id": "case-8801",
            "report_id": "rep-101",
            "animal_id": "BUF-204",
            "species": "Buffalo",
            "breed": "Murrah",
            "farmer_name": "Ramesh Kumar",
            "farmer_phone": "9876543210",
            "village": "Rampur",
            "district": "Jaipur Rural",
            "symptoms": ["Fever", "Cough", "Reduced Appetite"],
            "severity": "severe",
            "duration_days": 3,
            "risk_score": 74.0,
            "risk_level": "HIGH",
            "possible_disease_concern": "Possible Bovine Respiratory Disease",
            "cluster_flag": True,
            "cluster_id": "clust-101",
            "status": "pending",
            "veterinary_notes": None,
            "lab_referral": False,
            "reported_at": datetime.utcnow() - timedelta(hours=3),
        }

store = InMemoryStore()
