from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

class VaccinationBase(BaseModel):
    animal_id: str = Field(..., example="COW-101")
    vaccine_name: str = Field(..., example="FMD (Foot & Mouth Disease)")
    vaccination_date: date = Field(default_factory=date.today)
    next_due_date: Optional[date] = Field(None)
    status: str = Field(default="completed", example="completed")
    notes: Optional[str] = Field(None, example="Annual booster administered by Dr. Sharma")

class VaccinationCreate(VaccinationBase):
    pass

class VaccinationResponse(VaccinationBase):
    id: str = Field(..., example="vac-101")
    created_at: datetime = Field(default_factory=datetime.utcnow)
