from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class ClusterStatusEnum(str, Enum):
    ACTIVE = "active"
    INVESTIGATING = "investigating"
    CONTAINED = "contained"
    RESOLVED = "resolved"

class ClusterResponse(BaseModel):
    id: str = Field(..., example="clust-101")
    cluster_name: str = Field(..., example="Rampur Village Outbreak Cluster #1")
    disease_concern: str = Field(..., example="Possible Respiratory Disease Cluster")
    latitude: float = Field(..., example=26.9124)
    longitude: float = Field(..., example=75.7873)
    radius_km: float = Field(..., example=1.5)
    case_count: int = Field(..., example=4)
    affected_animals_count: int = Field(..., example=7)
    cluster_score: float = Field(..., example=82.0)
    risk_level: str = Field(..., example="CRITICAL")
    dominant_symptoms: List[str] = Field(default_factory=lambda: ["Fever", "Cough", "Reduced Appetite"])
    affected_villages: List[str] = Field(default_factory=lambda: ["Rampur"])
    case_ids: List[str] = Field(default_factory=list)
    explanation: Optional[str] = Field(None, example="Cluster detected because 5 similar cases were reported within 8 km during the last 14 days.")
    temporal_window_days: int = Field(default=14, example=14)
    vaccination_coverage: float = Field(default=78.5, example=78.5)
    contributing_factors: List[dict] = Field(default_factory=list)
    status: ClusterStatusEnum = Field(default=ClusterStatusEnum.ACTIVE)
    detected_at: datetime = Field(default_factory=datetime.utcnow)
    recommended_action: str = Field(
        default="Immediate on-site veterinary investigation recommended. Initiate ring vaccination check."
    )
