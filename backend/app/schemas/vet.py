from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class VetActionCreate(BaseModel):
    action: str = Field(..., example="Field Visit & Antipyretic Treatment")
    notes: Optional[str] = Field(None, example="Examined animal. High fever confirmed. Prescribed isolation and medication.")
    lab_referral: bool = Field(False, description="Whether biological sample was referred to diagnostic lab")
    status: str = Field(default="investigated", example="investigated")

class VetCaseResponse(BaseModel):
    id: str = Field(..., example="CASE-8801")
    report_id: str = Field(..., example="rep-101")
    animal_id: str = Field(..., example="BUF-204")
    species: str = Field(..., example="Buffalo")
    breed: str = Field(..., example="Murrah")
    farmer_name: str = Field(..., example="Ramesh Kumar")
    farmer_phone: str = Field(..., example="9876543210")
    village: str = Field(..., example="Rampur")
    district: str = Field(..., example="Jaipur Rural")
    
    symptoms: List[str] = Field(default_factory=lambda: ["Fever", "Cough", "Reduced Appetite"])
    severity: str = Field(..., example="severe")
    duration_days: int = Field(..., example=3)
    
    risk_score: float = Field(..., example=74.0)
    risk_level: str = Field(..., example="HIGH")
    possible_disease_concern: str = Field(..., example="Possible Bovine Respiratory Disease")
    
    cluster_flag: bool = Field(True)
    cluster_id: Optional[str] = Field(None, example="clust-101")
    
    status: str = Field(default="pending", example="pending")
    veterinary_notes: Optional[str] = None
    lab_referral: bool = False
    reported_at: datetime = Field(default_factory=datetime.utcnow)
