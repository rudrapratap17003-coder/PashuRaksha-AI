from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from app.schemas.health_report import HealthReportCreate, HealthReportResponse
from app.services.health_report_service import HealthReportService

router = APIRouter(prefix="/health-reports", tags=["Health Reports & Symptom Ingestion"])

@router.get("", response_model=List[HealthReportResponse])
def list_health_reports(animal_id: Optional[str] = Query(None, description="Filter by animal ID")):
    return HealthReportService.get_all(animal_id=animal_id)

@router.post("", response_model=HealthReportResponse, status_code=status.HTTP_201_CREATED)
def submit_health_report(report_in: HealthReportCreate):
    return HealthReportService.create(report_in)

@router.get("/{report_id}", response_model=HealthReportResponse)
def get_health_report(report_id: str):
    report = HealthReportService.get_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Health report not found")
    return report
