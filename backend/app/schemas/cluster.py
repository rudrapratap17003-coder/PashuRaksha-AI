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
    status: ClusterStatusEnum = Field(default=ClusterStatusEnum.ACTIVE)
    detected_at: datetime = Field(default_factory=datetime.utcnow)
    recommended_action: str = Field(
        default="Immediate on-site veterinary investigation recommended. Initiate ring vaccination check."
    )
