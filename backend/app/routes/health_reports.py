from fastapi import APIRouter, HTTPException, Query, Depends, status
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.health_report import HealthReportCreate, HealthReportResponse
from app.services.health_report_service import HealthReportService

router = APIRouter(prefix="/health-reports", tags=["Health Reports & Symptom Ingestion"])

@router.get("", response_model=List[HealthReportResponse])
def list_health_reports(
    animal_id: Optional[str] = Query(None, description="Filter by animal ID"),
    limit: int = Query(100, ge=1, le=500, description="Max records to return"),
    offset: int = Query(0, ge=0, description="Records to skip"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List clinical symptom reports.
    Authenticated: Farmers only see reports from their own farm.
    Vets, field workers, authorities, and admins see all district reports.
    """
    reports = HealthReportService.get_all(db, animal_id=animal_id, limit=limit, offset=offset)
    if (current_user.role or "").lower() == "farmer":
        reports = [r for r in reports if r.reported_by == current_user.id]
    return reports

@router.post("", response_model=HealthReportResponse, status_code=status.HTTP_201_CREATED)
def submit_health_report(
    report_in: HealthReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Submit clinical symptom observation for AI risk analysis.
    Automatically assigns reporter identity from authenticated user session.
    """
    if not report_in.reported_by or (current_user.role or "").lower() == "farmer":
        report_in.reported_by = current_user.id
        report_in.reporter_name = current_user.name
    return HealthReportService.create(db, report_in)

@router.get("/{report_id}", response_model=HealthReportResponse)
def get_health_report(
    report_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve specific symptom report by ID.
    Farmers can only view reports filed for their livestock.
    """
    report = HealthReportService.get_by_id(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Health report not found")
    if (current_user.role or "").lower() == "farmer" and report.reported_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: you are only authorized to view your own filed reports."
        )
    return report
