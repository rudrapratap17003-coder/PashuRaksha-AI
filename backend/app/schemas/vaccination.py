from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import date, datetime, timezone

class VaccinationBase(BaseModel):
    animal_id: str = Field(..., min_length=1, max_length=50)
    vaccine_name: str = Field(..., min_length=1, max_length=255)
    vaccination_date: date = Field(default_factory=date.today)
    next_due_date: Optional[date] = Field(None)
    status: str = Field(default="completed")
    notes: Optional[str] = Field(None, max_length=1000)

class VaccinationCreate(VaccinationBase):
    pass

class VaccinationResponse(VaccinationBase):
    model_config = ConfigDict(from_attributes=True)

    id: str = Field(...)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

