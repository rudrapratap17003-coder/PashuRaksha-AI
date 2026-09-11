from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
from enum import Enum

class ClusterStatusEnum(str, Enum):
    ACTIVE = "active"
    INVESTIGATING = "investigating"
    CONTAINED = "contained"
    RESOLVED = "resolved"

class ClusterResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str = Field(...)
    cluster_name: str = Field(...)
    disease_concern: str = Field(...)
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    radius_km: float = Field(..., ge=0)
    case_count: int = Field(..., ge=0)
    affected_animals_count: int = Field(..., ge=0)
    cluster_score: float = Field(..., ge=0, le=100.0)
    risk_level: str = Field(...)
    dominant_symptoms: List[str] = Field(default_factory=lambda: ["Fever", "Cough", "Reduced Appetite"])
    affected_villages: List[str] = Field(default_factory=lambda: ["Rampur"])
    case_ids: List[str] = Field(default_factory=list)
    explanation: Optional[str] = Field(None)
    temporal_window_days: int = Field(default=14, ge=1, le=365)
    vaccination_coverage: float = Field(default=78.5, ge=0, le=100.0)
    contributing_factors: List[dict] = Field(default_factory=list)
    status: ClusterStatusEnum = Field(default=ClusterStatusEnum.ACTIVE)
    detected_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    recommended_action: str = Field(
        default="Immediate on-site veterinary investigation recommended. Initiate ring vaccination check."
    )

