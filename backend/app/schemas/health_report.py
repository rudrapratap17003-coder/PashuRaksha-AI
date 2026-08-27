from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class SeverityEnum(str, Enum):
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"

class HealthReportBase(BaseModel):
    animal_id: str = Field(..., example="COW-101")
    
    # 11 Core Monitored Symptoms
    fever: bool = Field(False, description="Elevated body temperature")
    cough: bool = Field(False, description="Coughing / wheezing")
    nasal_discharge: bool = Field(False, description="Discharge from nose")
    reduced_appetite: bool = Field(False, description="Loss of appetite / off feed")
    diarrhea: bool = Field(False, description="Diarrhea / loose stool")
    lethargy: bool = Field(False, description="Lethargy / inability to stand")
    reduced_milk: bool = Field(False, description="Sudden drop in daily milk yield")
    difficulty_breathing: bool = Field(False, description="Labored breathing / panting")
    salivation: bool = Field(False, description="Excessive salivation / drooling")
    lesions: bool = Field(False, description="Blisters or sores on mouth/tongue/feet")
    swelling: bool = Field(False, description="Swelling in throat, jaw, or limbs")
    other_symptoms: Optional[str] = Field(None, example="Shivering in the morning")
    
    # Severity and Epidemiology Context
    severity: SeverityEnum = Field(default=SeverityEnum.MODERATE)
    duration_days: int = Field(default=2, ge=1, le=60, description="Duration in days")
    number_of_animals_affected: int = Field(default=1, ge=1, description="Count of animals displaying symptoms in vicinity")
    
    # Geospatial location
    latitude: Optional[float] = Field(26.9124, example=26.9124)
    longitude: Optional[float] = Field(75.7873, example=75.7873)
    village: Optional[str] = Field("Rampur", example="Rampur")
    district: Optional[str] = Field("Jaipur Rural", example="Jaipur Rural")

class HealthReportCreate(HealthReportBase):
    reported_by: Optional[str] = Field(None, example="usr-101")

class HealthReportResponse(HealthReportBase):
    id: str = Field(..., example="rep-101")
    reported_by: str = Field(..., example="usr-101")
    reporter_name: Optional[str] = Field("Ramesh Kumar", example="Ramesh Kumar")
    species: Optional[str] = Field("Cattle (Cow)", example="Cattle (Cow)")
    reported_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Linked initial AI risk assessment
    risk_score: Optional[float] = Field(74.0, example=74.0)
    risk_level: Optional[str] = Field("HIGH", example="HIGH")
    possible_disease_concern: Optional[str] = Field("Possible Bovine Respiratory Disease / Elevated Viral Concern", example="Possible Bovine Respiratory Disease / Elevated Viral Concern")
    recommendation: Optional[str] = Field("Veterinary assessment recommended.", example="Veterinary assessment recommended.")
