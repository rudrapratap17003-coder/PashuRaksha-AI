"""
Field Worker routes for managing farm visits, assigned cases, and on-behalf reporting.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.health_report import HealthReport
from app.services.timeline_service import TimelineService
from app.schemas.case_timeline import CaseTimelineEventCreate
from app.schemas.health_report import HealthReportCreate

router = APIRouter(prefix="/field-worker", tags=["Field Worker"])


@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    """Field worker dashboard with assigned villages, case counts, and campaign stats."""
    total_reports = db.query(HealthReport).count()
    pending_reports = db.query(HealthReport).filter(HealthReport.risk_level.in_(["HIGH", "CRITICAL"])).count()

    return {
        "worker_name": "Ankita Jadhav",
        "assigned_villages": [
            {"name": "Baramati", "district": "Pune", "farms": 5, "animals": 142, "pending_cases": 3},
            {"name": "Indapur", "district": "Pune", "farms": 4, "animals": 115, "pending_cases": 1},
            {"name": "Shirur", "district": "Pune", "farms": 3, "animals": 98, "pending_cases": 2},
        ],
        "stats": {
            "total_cases_assigned": max(total_reports, 24),
            "pending_visits": max(pending_reports, 6),
            "completed_visits": 18,
            "samples_collected": 8,
            "reports_filed": 15,
        },
        "vaccination_campaigns": [
            {"name": "FMD Annual Booster 2026", "status": "In Progress", "coverage": 78.5, "target_animals": 355, "vaccinated": 278},
            {"name": "HS+BQ Pre-Monsoon", "status": "Scheduled", "coverage": 0.0, "target_animals": 280, "vaccinated": 0},
            {"name": "Brucellosis Ring Vaccination", "status": "Completed", "coverage": 95.2, "target_animals": 105, "vaccinated": 100},
        ],
        "recent_activity": [
            {"type": "visit", "description": "Farm visit at Kumar Farm, Baramati", "date": "2026-08-29", "status": "completed"},
            {"type": "sample", "description": "Blood sample collected from COW-112", "date": "2026-08-28", "status": "sent_to_lab"},
            {"type": "report", "description": "Health report filed for Patel Farm", "date": "2026-08-27", "status": "submitted"},
        ],
    }


@router.get("/cases")
def get_cases(status: str = Query(None), db: Session = Depends(get_db)):
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
    # Demo data
    return [
        {"id": "rep-201", "animal_id": "COW-112", "village": "Baramati", "district": "Pune", "risk_score": 72.0, "risk_level": "HIGH", "symptoms": ["Fever", "Cough", "Reduced Appetite"], "severity": "severe", "reported_at": "2026-08-29T10:30:00", "status": "pending"},
        {"id": "rep-202", "animal_id": "BUF-215", "village": "Baramati", "district": "Pune", "risk_score": 65.0, "risk_level": "HIGH", "symptoms": ["Fever", "Lethargy"], "severity": "moderate", "reported_at": "2026-08-28T14:15:00", "status": "pending"},
        {"id": "rep-203", "animal_id": "GOAT-308", "village": "Shirur", "district": "Pune", "risk_score": 45.0, "risk_level": "MODERATE", "symptoms": ["Diarrhea", "Reduced Appetite"], "severity": "moderate", "reported_at": "2026-08-28T09:00:00", "status": "monitoring"},
        {"id": "rep-204", "animal_id": "COW-118", "village": "Indapur", "district": "Pune", "risk_score": 38.0, "risk_level": "MODERATE", "symptoms": ["Nasal Discharge"], "severity": "mild", "reported_at": "2026-08-27T16:45:00", "status": "monitoring"},
    ]


@router.post("/visit")
def record_visit(case_id: str = Query(...), event_data: CaseTimelineEventCreate = None, db: Session = Depends(get_db)):
    """Record a farm visit with timeline event."""
    if event_data:
        return TimelineService.add_event(
            db, case_id, event_data.event_type, event_data.title,
            event_data.description, event_data.actor_name, event_data.actor_role
        )
    return TimelineService.add_event(
        db, case_id, "field_visit", "Field Visit Conducted",
        "Field worker visited the farm for assessment.",
        "Ankita Jadhav", "field_worker"
    )


@router.post("/report")
def create_report_on_behalf(data: HealthReportCreate, db: Session = Depends(get_db)):
    """Create a health report on behalf of a farmer."""
    from app.services.health_report_service import HealthReportService
    report = HealthReportService.create_report(db, data)
    return report


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
