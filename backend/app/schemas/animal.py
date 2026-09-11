from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, timezone

class AnimalBase(BaseModel):
    animal_id: str = Field(..., min_length=1, max_length=50, description="Unique livestock ear-tag or registration ID")
    species: str = Field(..., min_length=1, max_length=100)
    breed: str = Field(..., min_length=1, max_length=100)
    age: float = Field(..., ge=0, le=50.0, description="Age in years")
    gender: str = Field(..., min_length=1, max_length=20)
    weight: Optional[float] = Field(None, ge=0, le=2000.0, description="Weight in kg")
    vaccination_status: Optional[str] = Field("Up to date")
    previous_diseases: Optional[str] = Field("None")
    milk_production: Optional[float] = Field(None, ge=0, le=100.0, description="Daily milk yield in liters")
    village: Optional[str] = Field(None)
    district: Optional[str] = Field(None)

class AnimalCreate(AnimalBase):
    owner_id: Optional[str] = Field(None)
    owner_name: Optional[str] = Field(None)

class AnimalUpdate(BaseModel):
    species: Optional[str] = Field(None, min_length=1, max_length=100)
    breed: Optional[str] = Field(None, min_length=1, max_length=100)
    age: Optional[float] = Field(None, ge=0, le=50.0)
    gender: Optional[str] = Field(None, min_length=1, max_length=20)
    weight: Optional[float] = Field(None, ge=0, le=2000.0)
    vaccination_status: Optional[str] = None
    previous_diseases: Optional[str] = None
    milk_production: Optional[float] = Field(None, ge=0, le=100.0)

class AnimalResponse(AnimalBase):
    model_config = ConfigDict(from_attributes=True)

    id: str = Field(...)
    owner_id: str = Field(...)
    owner_name: Optional[str] = Field(None)
    current_risk_score: Optional[float] = Field(12.0)
    current_risk_level: Optional[str] = Field("LOW")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

