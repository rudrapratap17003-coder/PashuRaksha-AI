from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone

class VetActionCreate(BaseModel):
    action: str = Field(...)
    notes: Optional[str] = Field(None)
    lab_referral: bool = Field(False, description="Whether biological sample was referred to diagnostic lab")
    status: str = Field(default="investigated")

class VetCaseResponse(BaseModel):
    id: str = Field(...)
    report_id: str = Field(...)
    animal_id: str = Field(...)
    species: str = Field(...)
    breed: str = Field(...)
    farmer_name: str = Field(...)
    farmer_phone: str = Field(...)
    village: str = Field(...)
    district: str = Field(...)
    
    symptoms: List[str] = Field(default_factory=lambda: ["Fever", "Cough", "Reduced Appetite"])
    severity: str = Field(...)
    duration_days: int = Field(...)
    
    risk_score: float = Field(...)
    risk_level: str = Field(...)
    possible_disease_concern: str = Field(...)
    
    cluster_flag: bool = Field(True)
    cluster_id: Optional[str] = Field(None)
    
    status: str = Field(default="pending")
    veterinary_notes: Optional[str] = None
    lab_referral: bool = False
    reported_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
