from pydantic import BaseModel, Field
from typing import List, Optional

class AnalyticsOverview(BaseModel):
    total_reports: int = 0
    total_animals: int = 0
    total_farms: int = 0
    active_clusters: int = 0
    avg_risk_score: float = 0.0
    mortality_count: int = 0
    vaccination_coverage: float = 0.0
    cases_resolved: int = 0

class TimeSeriesPoint(BaseModel):
    date: str
    count: int = 0
    label: Optional[str] = None

class SpeciesDistribution(BaseModel):
    species: str
    count: int = 0
    percentage: float = 0.0

class VillageRisk(BaseModel):
    village: str
    district: str
    cases: int = 0
    affected_animals: int = 0
    mortality: int = 0
    vaccination_coverage: float = 0.0
    risk_score: float = 0.0
    risk_level: str = "LOW"
