from fastapi import APIRouter, HTTPException, Query, Depends, status
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.health_report import HealthReportCreate, HealthReportResponse
from app.services.health_report_service import HealthReportService

router = APIRouter(prefix="/health-reports", tags=["Health Reports & Symptom Ingestion"])

@router.get("", response_model=List[HealthReportResponse])
def list_health_reports(
    animal_id: Optional[str] = Query(None, description="Filter by animal ID"),
    db: Session = Depends(get_db)
):
    return HealthReportService.get_all(db, animal_id=animal_id)

@router.post("", response_model=HealthReportResponse, status_code=status.HTTP_201_CREATED)
def submit_health_report(report_in: HealthReportCreate, db: Session = Depends(get_db)):
    return HealthReportService.create(db, report_in)

@router.get("/{report_id}", response_model=HealthReportResponse)
def get_health_report(report_id: str, db: Session = Depends(get_db)):
    report = HealthReportService.get_by_id(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Health report not found")
    return report
