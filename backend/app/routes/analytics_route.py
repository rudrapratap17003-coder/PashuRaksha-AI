from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.analytics_service import AnalyticsService
from app.schemas.analytics import AnalyticsOverview, TimeSeriesPoint, SpeciesDistribution, VillageRisk
from typing import List, Dict

router = APIRouter(prefix="/analytics", tags=["Analytics & Intelligence"])

@router.get("/overview", response_model=AnalyticsOverview)
def get_overview(db: Session = Depends(get_db)):
    return AnalyticsService.get_overview(db)

@router.get("/cases-over-time", response_model=List[TimeSeriesPoint])
def get_cases_over_time(db: Session = Depends(get_db)):
    return AnalyticsService.get_cases_over_time(db)

@router.get("/species-distribution", response_model=List[SpeciesDistribution])
def get_species_distribution(db: Session = Depends(get_db)):
    return AnalyticsService.get_species_distribution(db)

@router.get("/village-risk", response_model=List[VillageRisk])
def get_village_risk(db: Session = Depends(get_db)):
    return AnalyticsService.get_village_risk_ranking(db)

@router.get("/vaccination-coverage", response_model=Dict[str, Dict[str, str]])
def get_vaccination_coverage(db: Session = Depends(get_db)):
    return AnalyticsService.get_vaccination_coverage(db)
