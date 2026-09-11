from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, timezone
from enum import Enum

class SeverityEnum(str, Enum):
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"

class HealthReportBase(BaseModel):
    animal_id: str = Field(..., min_length=1, max_length=50)
    
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
    other_symptoms: Optional[str] = Field(None, max_length=1000)

    # ML Clinical Assessment Features
    rectal_temperature: Optional[float] = Field(
        None,
        ge=30.0,
        le=45.0,
        description="Observed rectal temperature in Celsius"
    )
    girth: Optional[float] = Field(
        None,
        ge=1.0,
        le=200.0,
        description="Animal girth measurement"
    )
    famacha_score_left: Optional[float] = Field(
        None,
        ge=1.0,
        le=5.0,
        description="FAMACHA score for left eye"
    )
    famacha_score_right: Optional[float] = Field(
        None,
        ge=1.0,
        le=5.0,
        description="FAMACHA score for right eye"
    )
    elasticity: Optional[str] = Field(None, max_length=50)
    consistency_of_faeces: Optional[str] = Field(None, max_length=50)
    suckling: Optional[str] = Field(None, max_length=20)
    grazing: Optional[str] = Field(None, max_length=20)
    
    # Severity and Epidemiology Context
    severity: SeverityEnum = Field(default=SeverityEnum.MODERATE)
    duration_days: int = Field(default=2, ge=1, le=365, description="Duration in days")
    number_of_animals_affected: int = Field(default=1, ge=1, le=100000, description="Count of animals displaying symptoms in vicinity")
    
    # Geospatial location
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0)
    village: Optional[str] = Field(None, max_length=255)
    district: Optional[str] = Field(None, max_length=255)

class HealthReportCreate(HealthReportBase):
    reported_by: Optional[str] = Field(None)
    reporter_name: Optional[str] = Field(None)

class HealthReportResponse(HealthReportBase):
    model_config = ConfigDict(from_attributes=True)

    id: str = Field(...)
    reported_by: str = Field(...)
    reporter_name: Optional[str] = Field("Ramesh Kumar")
    species: Optional[str] = Field("Cattle (Cow)")
    reported_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Linked initial AI risk assessment
    risk_score: Optional[float] = Field(74.0)
    risk_level: Optional[str] = Field("HIGH")
    possible_disease_concern: Optional[str] = Field("Possible Bovine Respiratory Disease / Elevated Viral Concern")
    recommendation: Optional[str] = Field("Veterinary assessment recommended.")
    status: Optional[str] = Field("RISK_ASSESSED")
    contributing_factors: Optional[list] = None

