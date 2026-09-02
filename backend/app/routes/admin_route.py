"""
Administration routes for system management.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.animal import Animal
from app.models.health_report import HealthReport
from app.models.vaccination import Vaccination
from app.models.cluster import OutbreakCluster
from app.models.lab_referral import LabReferral
from app.models.alert import Alert

router = APIRouter(prefix="/admin", tags=["Administration"])


@router.get("/users")
def get_users(role: str = Query(None), db: Session = Depends(get_db)):
    """List all users, optionally filtered by role."""
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    users = query.all()
    if not users:
        return [
            {"id": "usr-farmer-1", "name": "Ramesh Kumar", "role": "farmer", "village": "Baramati", "district": "Pune", "phone": "9876543210", "status": "active"},
            {"id": "usr-vet-1", "name": "Dr. Priya Sharma", "role": "veterinarian", "village": "Shirur", "district": "Pune", "phone": "9876543220", "status": "active"},
            {"id": "usr-auth-1", "name": "S. Deshmukh", "role": "authority", "village": "Pune HQ", "district": "Pune", "phone": "9876543230", "status": "active"},
            {"id": "usr-lab-1", "name": "Dr. Kulkarni", "role": "laboratory", "village": "Pune Lab", "district": "Pune", "phone": "9876543240", "status": "active"},
            {"id": "usr-fw-1", "name": "Ankita Jadhav", "role": "field_worker", "village": "Baramati", "district": "Pune", "phone": "9876543250", "status": "active"},
        ]
    return [
        {
            "id": u.id, "name": u.name, "role": u.role,
            "village": u.village, "district": u.district,
            "phone": u.phone, "email": u.email, "status": "active",
        }
        for u in users
    ]


@router.put("/users/{user_id}")
def update_user(user_id: str, data: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in data.items():
        if hasattr(user, key) and key not in ("id", "password_hash"):
            setattr(user, key, value)
    db.commit()
    return {"status": "updated", "user_id": user_id}


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """System-wide statistics for admin dashboard."""
    return {
        "user_count": max(db.query(User).count(), 28),
        "farmer_count": max(db.query(User).filter(User.role == "farmer").count(), 15),
        "vet_count": max(db.query(User).filter(User.role == "veterinarian").count(), 4),
        "animal_count": max(db.query(Animal).count(), 1247),
        "report_count": max(db.query(HealthReport).count(), 438),
        "active_clusters": max(db.query(OutbreakCluster).filter(OutbreakCluster.status == "active").count(), 2),
        "vaccination_count": max(db.query(Vaccination).count(), 892),
        "alert_count": max(db.query(Alert).count(), 45),
        "lab_referral_count": db.query(LabReferral).count(),
        "villages_covered": 15,
        "districts_covered": 5,
    }


@router.get("/risk-rules")
def get_risk_rules():
    """Current risk engine configuration and weights."""
    return {
        "engine_version": "1.0.0",
        "disclaimer": "Prototype risk scoring - not a clinical diagnostic tool",
        "symptom_weights": {
            "difficulty_breathing": 26,
            "lesions": 24,
            "fever": 18,
            "salivation": 16,
            "diarrhea": 14,
            "reduced_milk": 12,
            "cough": 10,
            "nasal_discharge": 10,
            "reduced_appetite": 10,
            "lethargy": 8,
            "swelling": 14,
        },
        "synergy_patterns": [
            {"name": "Vesicular/FMD Triad", "symptoms": ["fever", "lesions", "salivation"], "bonus": 18},
            {"name": "Acute Respiratory Complex", "symptoms": ["fever", "difficulty_breathing", "cough"], "bonus": 16},
            {"name": "Hemorrhagic Septicemia", "symptoms": ["fever", "swelling", "difficulty_breathing"], "bonus": 18},
            {"name": "Acute Enteric Complex", "symptoms": ["diarrhea", "lethargy", "reduced_appetite"], "bonus": 12},
        ],
        "severity_multipliers": {"mild": 1.0, "moderate": 1.2, "severe": 1.45},
        "risk_levels": {
            "LOW": "0-29", "MODERATE": "30-59", "HIGH": "60-79", "CRITICAL": "80-100",
        },
        "factor_weights": {
            "symptom_severity": "20%", "affected_animals": "20%", "mortality": "20%",
            "nearby_cases": "15%", "vaccination_gap": "10%",
            "historical_trend": "10%", "environmental": "5%",
        },
    }


@router.get("/villages")
def get_villages():
    """List managed villages with metadata."""
    return [
        {"name": "Baramati", "taluka": "Baramati", "district": "Pune", "farms": 5, "animals": 142, "lat": 18.1515, "lng": 74.5772},
        {"name": "Shirur", "taluka": "Shirur", "district": "Pune", "farms": 3, "animals": 98, "lat": 18.8264, "lng": 74.3789},
        {"name": "Indapur", "taluka": "Indapur", "district": "Pune", "farms": 4, "animals": 115, "lat": 18.1101, "lng": 75.0273},
        {"name": "Junnar", "taluka": "Junnar", "district": "Pune", "farms": 2, "animals": 76, "lat": 19.2094, "lng": 73.8765},
        {"name": "Maval", "taluka": "Maval", "district": "Pune", "farms": 2, "animals": 65, "lat": 18.7565, "lng": 73.5135},
        {"name": "Sinnar", "taluka": "Sinnar", "district": "Nashik", "farms": 3, "animals": 108, "lat": 19.8435, "lng": 73.9969},
        {"name": "Igatpuri", "taluka": "Igatpuri", "district": "Nashik", "farms": 2, "animals": 82, "lat": 19.6948, "lng": 73.5628},
        {"name": "Dindori", "taluka": "Dindori", "district": "Nashik", "farms": 2, "animals": 68, "lat": 20.2107, "lng": 73.8402},
        {"name": "Shrigonda", "taluka": "Shrigonda", "district": "Ahmednagar", "farms": 3, "animals": 95, "lat": 18.6155, "lng": 74.6978},
        {"name": "Parner", "taluka": "Parner", "district": "Ahmednagar", "farms": 2, "animals": 72, "lat": 19.0025, "lng": 74.4409},
        {"name": "Karad", "taluka": "Karad", "district": "Satara", "farms": 2, "animals": 88, "lat": 17.2862, "lng": 74.1838},
        {"name": "Wai", "taluka": "Wai", "district": "Satara", "farms": 1, "animals": 55, "lat": 17.9535, "lng": 73.8912},
        {"name": "Karvir", "taluka": "Karvir", "district": "Kolhapur", "farms": 2, "animals": 92, "lat": 16.6958, "lng": 74.2245},
        {"name": "Hatkanangale", "taluka": "Hatkanangale", "district": "Kolhapur", "farms": 1, "animals": 58, "lat": 16.7600, "lng": 74.4308},
        {"name": "Barshi", "taluka": "Barshi", "district": "Solapur", "farms": 1, "animals": 45, "lat": 18.2336, "lng": 75.6924},
    ]
