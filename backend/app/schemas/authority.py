from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class VillageRiskSummary(BaseModel):
    village: str = Field(...)
    district: str = Field(...)
    monitored_animals: int = Field(...)
    active_health_reports: int = Field(...)
    cluster_status: str = Field(...)
    risk_index: float = Field(...)
    vaccination_coverage: float = Field(...)

class MapPoint(BaseModel):
    id: str = Field(...)
    title: str = Field(...)
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    risk_level: str = Field(...)
    case_count: int = Field(default=1, ge=0)
    dominant_symptom: str = Field(default="Fever & Cough")
    risk_score: Optional[float] = Field(None, ge=0, le=100.0)
    point_type: Optional[str] = None
    label: Optional[str] = None


class TrendPoint(BaseModel):
    date: Optional[str] = Field(None)
    day: Optional[str] = Field(None)
    cases: Optional[int] = Field(0)
    alerts: Optional[int] = Field(0)
    low_risk_count: int = Field(default=0)
    high_risk_count: int = Field(default=0)
    critical_risk_count: int = Field(default=0)

class AuthorityDashboardSummary(BaseModel):
    total_monitored_animals: int = Field(...)
    total_health_reports: int = Field(...)
    active_critical_cases: int = Field(...)
    active_outbreak_clusters: int = Field(...)
    high_risk_villages_count: int = Field(...)
    district_vaccination_rate: float = Field(...)
    villages: List[VillageRiskSummary] = Field(default_factory=list)
    recent_alerts: List[str] = Field(default_factory=list)

class AuthorityActionCreate(BaseModel):
    action_type: str = Field(...)
    notes: Optional[str] = Field(None)
    target_status: Optional[str] = Field(default="ACTION_TAKEN")

class MvuUnit(BaseModel):
    id: str = Field(...)
    name: str = Field(...)
    district: str = Field(...)
    currentLocation: str = Field(...)
    status: str = Field(...)
    statusType: str = Field(...)
    dutyVet: str = Field(...)
    driver: str = Field(...)
    speedKmH: int = Field(default=32)
    fuelPercent: int = Field(default=82)
    coldBoxTemp: float = Field(default=4.1)
    casesHandledToday: int = Field(default=7)
    equipment: List[str] = Field(default_factory=list)

class MvuDispatchRequest(BaseModel):
    unit_id: str = Field(...)
    destination: str = Field(...)
    priority: Optional[str] = Field(default="EMERGENCY_SOS")
    notes: Optional[str] = Field(None)

class MvuDispatchResponse(BaseModel):
    success: bool
    message: str
    unit: MvuUnit
    eta_minutes: int = Field(default=14)

class MarketBiosecurityItem(BaseModel):
    marketName: str = Field(...)
    day: str = Field(...)
    taluka: str = Field(...)
    status: str = Field(...)
    statusType: str = Field(...)
    weeklyCattleFootfall: str = Field(...)
    disinfectionStation: str = Field(...)
    activeRestrictions: str = Field(...)

class TransitPermitItem(BaseModel):
    permitId: str = Field(...)
    trader: str = Field(...)
    originVillage: str = Field(...)
    destinationMarket: str = Field(...)
    animalCount: int = Field(default=4)
    species: str = Field(...)
    vaxStatus: str = Field(...)
    verdict: str = Field(...)
    isAllowed: bool = Field(default=True)

class MarketBiosecurityOverview(BaseModel):
    markets: List[MarketBiosecurityItem] = Field(default_factory=list)
    permits: List[TransitPermitItem] = Field(default_factory=list)
    total_monitored_bazaars: int = Field(default=3)
    active_cordons: int = Field(default=1)
    permits_verified_today: int = Field(default=142)
    blocked_violations_today: int = Field(default=3)

class PermitVerificationRequest(BaseModel):
    permit_id_or_code: str = Field(...)

class PermitVerificationResponse(BaseModel):
    allowed: bool
    message: str
    permit: Optional[TransitPermitItem] = None
