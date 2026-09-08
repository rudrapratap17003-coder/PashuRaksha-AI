"""
Field Worker routes for managing farm visits, assigned cases, and on-behalf reporting.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_field_worker
from app.models.user import User
from app.models.health_report import HealthReport
from app.models.animal import Animal
from app.models.farm import Farm
from app.services.timeline_service import TimelineService
from app.schemas.case_timeline import CaseTimelineEventCreate
from app.schemas.health_report import HealthReportCreate

router = APIRouter(prefix="/field-worker", tags=["Field Worker"])


@router.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_field_worker)
):
    """Field worker dashboard with assigned villages, real case counts, and campaign stats."""
    total_reports = db.query(HealthReport).count()
    pending_reports = db.query(HealthReport).filter(HealthReport.risk_level.in_(["HIGH", "CRITICAL"])).count()
    completed_visits = max(0, total_reports - pending_reports)

    # Calculate live farm & animal counts in field worker's district
    user_district = current_user.district or "Pune"
    total_animals = db.query(Animal).filter(Animal.district == user_district).count()
    total_farms = db.query(Farm).filter(Farm.district == user_district).count()

    return {
        "worker_name": current_user.name or "Ankita Jadhav",
        "assigned_villages": [
            {"name": "Baramati", "district": user_district, "farms": max(total_farms // 3, 1), "animals": max(total_animals // 3, 1), "pending_cases": pending_reports},
            {"name": "Indapur", "district": user_district, "farms": max(total_farms // 3, 1), "animals": max(total_animals // 3, 1), "pending_cases": max(pending_reports // 2, 0)},
            {"name": "Shirur", "district": user_district, "farms": max(total_farms // 3, 1), "animals": max(total_animals // 3, 1), "pending_cases": 0},
        ],
        "stats": {
            "total_cases_assigned": total_reports,
            "pending_visits": pending_reports,
            "completed_visits": completed_visits,
            "samples_collected": min(total_reports, 8),
            "reports_filed": total_reports,
        },
        "vaccination_campaigns": [
            {"name": "FMD Annual Booster 2026", "status": "In Progress", "coverage": 78.5, "target_animals": max(total_animals, 50), "vaccinated": int(max(total_animals, 50) * 0.785)},
            {"name": "HS+BQ Pre-Monsoon", "status": "Scheduled", "coverage": 0.0, "target_animals": max(total_animals, 50), "vaccinated": 0},
            {"name": "Brucellosis Ring Vaccination", "status": "Completed", "coverage": 95.2, "target_animals": 105, "vaccinated": 100},
        ],
        "recent_activity": [
            {"type": "visit", "description": f"Farm visit at {current_user.village or 'Baramati'}", "date": "2026-08-29", "status": "completed"},
            {"type": "sample", "description": "Diagnostic sample collected from livestock", "date": "2026-08-28", "status": "sent_to_lab"},
            {"type": "report", "description": "Health report filed on behalf of farmer", "date": "2026-08-27", "status": "submitted"},
        ],
    }


@router.get("/cases")
def get_cases(
    status: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_field_worker)
):
    """Assigned cases from assigned villages."""
    reports = db.query(HealthReport).filter(
        HealthReport.risk_level.in_(["HIGH", "CRITICAL", "MODERATE"])
    ).order_by(HealthReport.reported_at.desc()).limit(20).all()

    if reports:
        return [
            {
                "id": r.id, "animal_id": r.animal_id, "village": r.village,
                "district": r.district, "risk_score": r.risk_score,
                "risk_level": r.risk_level, "symptoms": _get_symptom_list(r),
                "severity": r.severity, "reported_at": r.reported_at.isoformat() if r.reported_at else None,
                "status": "pending" if r.risk_level in ("HIGH", "CRITICAL") else "monitoring",
            }
            for r in reports
        ]
    return []


@router.post("/visit")
def record_visit(
    case_id: str = Query(...),
    event_data: CaseTimelineEventCreate = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_field_worker)
):
    """Record a farm visit with timeline event."""
    if event_data:
        return TimelineService.add_event(
            db, case_id, event_data.event_type, event_data.title,
            event_data.description, event_data.actor_name, event_data.actor_role
        )
    return TimelineService.add_event(
        db, case_id, "field_visit", "Field Visit Conducted",
        "Field worker visited the farm for assessment.",
        current_user.name or "Field Worker", "field_worker"
    )


@router.post("/cases/{case_id}/accept")
def accept_case(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_field_worker)
):
    """Field worker accepts assigned case for on-site inspection."""
    return TimelineService.add_event(
        db, case_id, "case_accepted", "Case Accepted for Field Inspection",
        f"Field Worker {current_user.name or 'Ankita Jadhav'} accepted case for immediate on-site verification in {current_user.village or 'Baramati'}.",
        current_user.name or "Field Worker", "field_worker"
    )


@router.post("/cases/{case_id}/visit")
def record_case_visit(
    case_id: str,
    observation: str = Query("Clinical examination confirms elevated temperature (104.5°F), extensive oral mucosal erosions, and profuse frothy salivation. Animal isolated."),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_field_worker)
):
    """Record farm visit observations."""
    return TimelineService.add_event(
        db, case_id, "field_visit", "Farm Inspection Conducted",
        observation,
        current_user.name or "Field Worker", "field_worker"
    )


@router.post("/cases/{case_id}/sample")
def record_sample_collection(
    case_id: str,
    sample_type: str = Query("Oral Epithelial Scraping / Swab"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_field_worker)
):
    """Record biological sample collection under cold-chain protocol."""
    return TimelineService.add_event(
        db, case_id, "sample_collected", f"Bio-Sample Collected: {sample_type}",
        f"Collected sterile {sample_type} from lesions under strict biosecurity cold chain for immediate laboratory transmission.",
        current_user.name or "Field Worker", "field_worker"
    )


@router.post("/cases/{case_id}/forward-vet")
def forward_case_to_vet(
    case_id: str,
    notes: str = Query("Priority clinical referral forwarded to Dr. Priya Sharma (Baramati Veterinary Polyclinic) due to suspected vesicular syndrome."),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_field_worker)
):
    """Forward verified field case to attending veterinarian."""
    return TimelineService.add_event(
        db, case_id, "forward_vet", "Case Forwarded to Attending Veterinarian",
        notes,
        current_user.name or "Field Worker", "field_worker"
    )


@router.post("/report")
def create_report_on_behalf(
    data: HealthReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_field_worker)
):
    """Create a health report on behalf of a farmer."""
    from app.services.health_report_service import HealthReportService
    if not data.reporter_name:
        data.reporter_name = f"{current_user.name} (on behalf of farmer)"
    return HealthReportService.create(db, data)


def _get_symptom_list(report: HealthReport) -> list:
    """Extract active symptoms from a health report."""
    symptoms = []
    symptom_map = {
        "fever": "Fever", "cough": "Cough", "nasal_discharge": "Nasal Discharge",
        "reduced_appetite": "Reduced Appetite", "diarrhea": "Diarrhea",
        "lethargy": "Lethargy", "reduced_milk": "Reduced Milk Production",
        "difficulty_breathing": "Difficulty Breathing", "salivation": "Excessive Salivation",
        "lesions": "Blisters/Lesions", "swelling": "Swelling/Lameness",
    }
    for attr, label in symptom_map.items():
        if getattr(report, attr, False):
            symptoms.append(label)
    return symptoms
