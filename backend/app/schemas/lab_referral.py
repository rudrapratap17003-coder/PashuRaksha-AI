from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class LabReferralBase(BaseModel):
    animal_id: str = Field(..., min_length=1, max_length=50)
    sample_type: str = Field(..., min_length=1, max_length=100)
    test_requested: str = Field(..., min_length=1, max_length=255)
    priority: str = Field(default="normal", max_length=20)
    village: Optional[str] = Field(None, max_length=255)
    district: Optional[str] = Field(None, max_length=255)

class LabReferralCreate(LabReferralBase):
    case_id: Optional[str] = Field(None, max_length=50)
    report_id: Optional[str] = Field(None, max_length=50)
    veterinarian_name: Optional[str] = Field(None, max_length=255)

class LabReferralUpdate(BaseModel):
    status: Optional[str] = Field(None, max_length=50)
    result: Optional[str] = Field(None, max_length=50)
    result_notes: Optional[str] = Field(None, max_length=2000)

class LabReferralResponse(LabReferralBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    case_id: Optional[str] = None
    report_id: Optional[str] = None
    veterinarian_id: Optional[str] = None
    veterinarian_name: Optional[str] = None
    lab_technician_id: Optional[str] = None
    status: str = "pending"
    result: str = "pending"
    result_notes: Optional[str] = None
    collection_date: Optional[datetime] = None
    result_date: Optional[datetime] = None
    created_at: Optional[datetime] = None

