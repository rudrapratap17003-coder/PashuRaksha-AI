from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.authority import AuthorityDashboardSummary, MapPoint, TrendPoint
from app.services.authority_service import AuthorityService

router = APIRouter(prefix="/authority", tags=["Authority Surveillance & Hotspots"])

@router.get("/dashboard", response_model=AuthorityDashboardSummary)
def get_authority_dashboard(db: Session = Depends(get_db)):
    return AuthorityService.get_dashboard_summary(db)

@router.get("/map-data", response_model=List[MapPoint])
def get_surveillance_map_points(db: Session = Depends(get_db)):
    return AuthorityService.get_map_points(db)

@router.get("/trends", response_model=List[TrendPoint])
def get_epidemic_trends(db: Session = Depends(get_db)):
    return AuthorityService.get_trends(db)
