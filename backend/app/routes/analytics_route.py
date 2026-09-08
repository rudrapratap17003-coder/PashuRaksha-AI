from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.services.analytics_service import AnalyticsService
from app.schemas.analytics import AnalyticsOverview, TimeSeriesPoint, SpeciesDistribution, VillageRisk
from typing import List, Dict

router = APIRouter(prefix="/analytics", tags=["Analytics & Intelligence"])

@router.get("/overview", response_model=AnalyticsOverview)
def get_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Role-aware analytics overview.
    Farmers receive metrics relevant to their herd and local district.
    Vets and authorities receive broad district epidemiology indicators.
    """
    return AnalyticsService.get_overview(db, current_user=current_user)

@router.get("/cases-over-time", response_model=List[TimeSeriesPoint])
def get_cases_over_time(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return AnalyticsService.get_cases_over_time(db)

@router.get("/species-distribution", response_model=List[SpeciesDistribution])
def get_species_distribution(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return AnalyticsService.get_species_distribution(db)

@router.get("/village-risk", response_model=List[VillageRisk])
def get_village_risk(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return AnalyticsService.get_village_risk_ranking(db)

@router.get("/vaccination-coverage", response_model=Dict[str, Dict[str, str]])
def get_vaccination_coverage(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return AnalyticsService.get_vaccination_coverage(db)
