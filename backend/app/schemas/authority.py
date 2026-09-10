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

class AuthorityActionCreate(BaseModel):
    action_type: str = Field(..., example="Enact 5km Containment Zone & Ring Vaccination")
    notes: Optional[str] = Field(None, example="Deployment of 250 FMD vaccine doses and livestock transit checkpoint.")
    target_status: Optional[str] = Field(default="ACTION_TAKEN", example="ACTION_TAKEN")

class MvuUnit(BaseModel):
    id: str = Field(..., example="MH-12-MVU-1962")
    name: str = Field(..., example="Pashu Sanjeevani Unit #01 (Baramati)")
    district: str = Field(..., example="Pune")
    currentLocation: str = Field(..., example="Baramati East Wasti (18.1582° N, 74.5810° E)")
    status: str = Field(..., example="ON-CALL (Attending Case)")
    statusType: str = Field(..., example="warning")
    dutyVet: str = Field(..., example="Dr. Vivek Kulkarni, B.V.Sc")
    driver: str = Field(..., example="Santosh Ghadge (+91 98221 45678)")
    speedKmH: int = Field(default=32, example=32)
    fuelPercent: int = Field(default=82, example=82)
    coldBoxTemp: float = Field(default=4.1, example=4.1)
    casesHandledToday: int = Field(default=7, example=7)
    equipment: List[str] = Field(default_factory=list)

class MvuDispatchRequest(BaseModel):
    unit_id: str = Field(..., example="MH-12-MVU-1962")
    destination: str = Field(..., example="Baramati Outbreak Hotspot (Contagion Core)")
    priority: Optional[str] = Field(default="EMERGENCY_SOS", example="EMERGENCY_SOS")
    notes: Optional[str] = Field(None, example="Urgent response with 250 ring vaccination doses")

class MvuDispatchResponse(BaseModel):
    success: bool
    message: str
    unit: MvuUnit
    eta_minutes: int = Field(default=14)

class MarketBiosecurityItem(BaseModel):
    marketName: str = Field(..., example="Baramati APMC Livestock Market")
    day: str = Field(..., example="Every Saturday")
    taluka: str = Field(..., example="Baramati, Pune")
    status: str = Field(..., example="EMBARGO ACTIVE (FMD Ring Containment)")
    statusType: str = Field(..., example="danger")
    weeklyCattleFootfall: str = Field(..., example="~1,200 Head")
    disinfectionStation: str = Field(..., example="Active (4% Sodium Carbonate Spray)")
    activeRestrictions: str = Field(..., example="Total ban on livestock transit from within 10km containment zone.")

class TransitPermitItem(BaseModel):
    permitId: str = Field(..., example="MH-TRANSIT-2026-8812")
    trader: str = Field(..., example="Dnyaneshwar Shinde")
    originVillage: str = Field(..., example="Shirur (Buffer Zone)")
    destinationMarket: str = Field(..., example="Loni Market")
    animalCount: int = Field(default=4, example=4)
    species: str = Field(..., example="Cattle (Khillar)")
    vaxStatus: str = Field(..., example="Fully Vaccinated (FMD + HS)")
    verdict: str = Field(..., example="PERMIT APPROVED")
    isAllowed: bool = Field(default=True)

class MarketBiosecurityOverview(BaseModel):
    markets: List[MarketBiosecurityItem] = Field(default_factory=list)
    permits: List[TransitPermitItem] = Field(default_factory=list)
    total_monitored_bazaars: int = Field(default=3)
    active_cordons: int = Field(default=1)
    permits_verified_today: int = Field(default=142)
    blocked_violations_today: int = Field(default=3)

class PermitVerificationRequest(BaseModel):
    permit_id_or_code: str = Field(..., example="MH-TRANSIT-2026-9401")

class PermitVerificationResponse(BaseModel):
    allowed: bool
    message: str
    permit: Optional[TransitPermitItem] = None
