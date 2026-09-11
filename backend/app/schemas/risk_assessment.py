from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from enum import Enum

class RiskLevelEnum(str, Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class RiskFactor(BaseModel):
    factor: str = Field(...)
    weight_contribution: float = Field(...)
    category: str = Field(...)

class RiskAssessmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str = Field(...)
    report_id: str = Field(...)
    animal_id: str = Field(...)
    risk_score: float = Field(..., ge=0, le=100, description="Normalized risk score (0-100)")
    risk_level: RiskLevelEnum = Field(...)
    possible_disease_concern: str = Field(...)
    disease_risk_score: float = Field(...)
    
    # Explainable AI factors
    contributing_factors: List[RiskFactor] = Field(default_factory=list)
    recommendation: str = Field(...)
    
    cluster_detected: bool = Field(False)
    cluster_name: Optional[str] = Field(None)
    
    # Non-diagnostic disclaimer
    disclaimer: str = Field(
        default="PASHURAKSHA AI provides AI-assisted health risk assessment and early-warning support. It does not replace professional veterinary diagnosis or treatment."
    )
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

