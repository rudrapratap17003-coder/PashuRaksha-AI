from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class FarmBase(BaseModel):
    name: str = Field(...)
    village: Optional[str] = Field(None)
    taluka: Optional[str] = Field(None)
    district: Optional[str] = Field(None)

class FarmCreate(FarmBase):
    owner_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class FarmUpdate(BaseModel):
    name: Optional[str] = None
    owner_name: Optional[str] = None
    village: Optional[str] = None
    total_animals: Optional[int] = None
    cattle_count: Optional[int] = None
    buffalo_count: Optional[int] = None
    goat_count: Optional[int] = None
    sheep_count: Optional[int] = None
    poultry_count: Optional[int] = None

class FarmResponse(FarmBase):
    model_config = ConfigDict(from_attributes=True)

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
