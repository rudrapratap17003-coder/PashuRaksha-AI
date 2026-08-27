from fastapi import APIRouter
from typing import List
from app.schemas.authority import AuthorityDashboardSummary, MapPoint, TrendPoint
from app.services.authority_service import AuthorityService

router = APIRouter(prefix="/authority", tags=["Authority Surveillance & Hotspots"])

@router.get("/dashboard", response_model=AuthorityDashboardSummary)
def get_authority_dashboard():
    return AuthorityService.get_dashboard_summary()

@router.get("/map-data", response_model=List[MapPoint])
def get_surveillance_map_points():
    return AuthorityService.get_map_points()

@router.get("/trends", response_model=List[TrendPoint])
def get_epidemic_trends():
    return AuthorityService.get_trends()
