from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class RiskLevelEnum(str, Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class RiskFactor(BaseModel):
    factor: str = Field(..., example="Fever & respiratory distress reported")
    weight_contribution: float = Field(..., example=25.0)
    category: str = Field(..., example="Clinical Symptoms")

class RiskAssessmentResponse(BaseModel):
    id: str = Field(..., example="risk-101")
    report_id: str = Field(..., example="rep-101")
    animal_id: str = Field(..., example="COW-101")
    risk_score: float = Field(..., ge=0, le=100, example=74.0, description="Normalized risk score (0-100)")
    risk_level: RiskLevelEnum = Field(..., example=RiskLevelEnum.HIGH)
    possible_disease_concern: str = Field(..., example="Possible Respiratory / Viral Complex (Elevated Risk)")
    disease_risk_score: float = Field(..., example=72.5)
    
    # Explainable AI factors
    contributing_factors: List[RiskFactor] = Field(default_factory=list)
    recommendation: str = Field(..., example="Veterinary assessment recommended. Isolate animal and monitor water intake.")
    
    cluster_detected: bool = Field(False, example=True)
    cluster_name: Optional[str] = Field(None, example="Rampur Respiratory Cluster #1")
    
    # Non-diagnostic disclaimer
    disclaimer: str = Field(
        default="PASHURAKSHA AI provides AI-assisted health risk assessment and early-warning support. It does not replace professional veterinary diagnosis or treatment."
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
