from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AnimalBase(BaseModel):
    animal_id: str = Field(..., example="COW-101", description="Unique livestock ear-tag or registration ID")
    species: str = Field(..., example="Cattle (Cow)")
    breed: str = Field(..., example="Gir")
    age: float = Field(..., ge=0, example=4.5, description="Age in years")
    gender: str = Field(..., example="female")
    weight: Optional[float] = Field(None, ge=0, example=380.0, description="Weight in kg")
    vaccination_status: Optional[str] = Field("Up to date", example="Up to date")
    previous_diseases: Optional[str] = Field("None", example="Foot and mouth disease (2024, treated)")
    milk_production: Optional[float] = Field(None, ge=0, example=12.5, description="Daily milk yield in liters")
    village: Optional[str] = Field(None, example="Rampur")
    district: Optional[str] = Field(None, example="Jaipur Rural")

class AnimalCreate(AnimalBase):
    owner_id: Optional[str] = Field(None, example="usr-101")

class AnimalUpdate(BaseModel):
    species: Optional[str] = None
    breed: Optional[str] = None
    age: Optional[float] = None
    gender: Optional[str] = None
    weight: Optional[float] = None
    vaccination_status: Optional[str] = None
    previous_diseases: Optional[str] = None
    milk_production: Optional[float] = None

class AnimalResponse(AnimalBase):
    id: str = Field(..., example="anim-101")
    owner_id: str = Field(..., example="usr-101")
    owner_name: Optional[str] = Field(None, example="Ramesh Kumar")
    current_risk_score: Optional[float] = Field(12.0, example=12.0)
    current_risk_level: Optional[str] = Field("LOW", example="LOW")
    created_at: datetime = Field(default_factory=datetime.utcnow)
