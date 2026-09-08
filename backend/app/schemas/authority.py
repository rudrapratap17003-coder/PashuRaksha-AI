from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class VillageRiskSummary(BaseModel):
    village: str = Field(..., example="Rampur")
    district: str = Field(..., example="Jaipur Rural")
    monitored_animals: int = Field(..., example=142)
    active_health_reports: int = Field(..., example=5)
    cluster_status: str = Field(..., example="CRITICAL HOTSPOT")
    risk_index: float = Field(..., example=84.0)
    vaccination_coverage: float = Field(..., example=82.5)

class MapPoint(BaseModel):
    id: str = Field(..., example="pt-101")
    title: str = Field(..., example="Rampur Hotspot Centroid")
    latitude: float = Field(..., example=26.9124)
    longitude: float = Field(..., example=75.7873)
    risk_level: str = Field(..., example="CRITICAL")
    case_count: int = Field(default=1, example=4)
    dominant_symptom: str = Field(default="Fever & Cough", example="Fever & Cough")
    risk_score: Optional[float] = None
    point_type: Optional[str] = None
    label: Optional[str] = None

class TrendPoint(BaseModel):
    date: Optional[str] = Field(None, example="2026-08-20")
    day: Optional[str] = Field(None, example="Mon")
    cases: Optional[int] = Field(0, example=5)
    alerts: Optional[int] = Field(0, example=2)
    low_risk_count: int = Field(default=0, example=15)
    high_risk_count: int = Field(default=0, example=3)
    critical_risk_count: int = Field(default=0, example=1)

class AuthorityDashboardSummary(BaseModel):
    total_monitored_animals: int = Field(..., example=625)
    total_health_reports: int = Field(..., example=8)
    active_critical_cases: int = Field(..., example=2)
    active_outbreak_clusters: int = Field(..., example=1)
    high_risk_villages_count: int = Field(..., example=1)
    district_vaccination_rate: float = Field(..., example=84.2)
    villages: List[VillageRiskSummary] = Field(default_factory=list)
    recent_alerts: List[str] = Field(default_factory=list)
