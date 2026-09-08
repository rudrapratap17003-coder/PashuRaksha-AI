"""
Administration routes for system management.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_admin
from app.models.user import User
from app.models.animal import Animal
from app.models.health_report import HealthReport
from app.models.vaccination import Vaccination
from app.models.cluster import OutbreakCluster
from app.models.lab_referral import LabReferral
from app.models.alert import Alert

router = APIRouter(prefix="/admin", tags=["Administration"])


@router.get("/users")
def get_users(
    role: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """List all users, optionally filtered by role. Admin only."""
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    users = query.all()
    return [
        {
            "id": u.id, "name": u.name, "role": u.role,
            "village": u.village, "district": u.district,
            "phone": u.phone, "email": u.email, "status": "active",
        }
        for u in users
    ]


@router.put("/users/{user_id}")
def update_user(
    user_id: str,
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Modify user role or profile. Admin only."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in data.items():
        if hasattr(user, key) and key not in ("id", "password_hash"):
            setattr(user, key, value)
    db.commit()
    return {"status": "updated", "user_id": user_id}


@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """System-wide statistics derived directly from live database. Admin only."""
    user_count = db.query(User).count()
    farmer_count = db.query(User).filter(User.role == "farmer").count()
    vet_count = db.query(User).filter(User.role == "veterinarian").count()
    animal_count = db.query(Animal).count()
    report_count = db.query(HealthReport).count()
    active_clusters = db.query(OutbreakCluster).filter(OutbreakCluster.status == "active").count()
    vaccination_count = db.query(Vaccination).count()
    alert_count = db.query(Alert).count()
    lab_referral_count = db.query(LabReferral).count()

    # Determine unique villages & districts from actual data
    villages_count = db.query(User.village).distinct().count()
    districts_count = db.query(User.district).distinct().count()

    return {
        "user_count": user_count,
        "farmer_count": farmer_count,
        "vet_count": vet_count,
        "animal_count": animal_count,
        "report_count": report_count,
        "active_clusters": active_clusters,
        "vaccination_count": vaccination_count,
        "alert_count": alert_count,
        "lab_referral_count": lab_referral_count,
        "villages_covered": max(villages_count, 1),
        "districts_covered": max(districts_count, 1),
        "data_mode": "SYNTHETIC DEMO DATA" if not current_user.email.endswith(".gov.in") else "PRODUCTION"
    }


@router.get("/risk-rules")
def get_risk_rules(current_user: User = Depends(require_admin)):
    """Current risk engine configuration and weights. Admin only."""
    return {
        "engine_version": "1.0.0",
        "disclaimer": "Explainable risk scoring - not a clinical diagnostic tool",
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
def get_villages(current_user: User = Depends(require_admin)):
    """List managed villages with metadata. Admin only."""
    from app.services.seed_service import VILLAGES
    return [
        {
            "name": v["name"],
            "taluka": v["taluka"],
            "district": v["district"],
            "lat": v["lat"],
            "lng": v["lng"],
            "status": "active"
        }
        for v in VILLAGES
    ]
