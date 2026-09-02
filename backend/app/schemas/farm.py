from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class FarmBase(BaseModel):
    name: str = Field(..., example="Kumar Farm")
    village: Optional[str] = Field(None, example="Baramati")
    taluka: Optional[str] = Field(None, example="Baramati")
    district: Optional[str] = Field(None, example="Pune")

class FarmCreate(FarmBase):
    owner_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class FarmResponse(FarmBase):
    id: str
    owner_id: str
    owner_name: Optional[str] = None
    state: str = "Maharashtra"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    total_animals: int = 0
    cattle_count: int = 0
    buffalo_count: int = 0
    goat_count: int = 0
    sheep_count: int = 0
    poultry_count: int = 0
    vaccination_coverage: float = 0.0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
