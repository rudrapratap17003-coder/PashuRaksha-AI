from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class LabReferralBase(BaseModel):
    animal_id: str = Field(..., example="BUF-204")
    sample_type: str = Field(..., example="Blood")
    test_requested: str = Field(..., example="RT-PCR")
    priority: str = Field(default="normal", example="high")
    village: Optional[str] = Field(None, example="Baramati")
    district: Optional[str] = Field(None, example="Pune")

class LabReferralCreate(LabReferralBase):
    case_id: Optional[str] = Field(None, example="CASE-101")
    report_id: Optional[str] = Field(None, example="rep-101")
    veterinarian_name: Optional[str] = None

class LabReferralUpdate(BaseModel):
    status: Optional[str] = Field(None, example="processing")
    result: Optional[str] = Field(None, example="positive")
    result_notes: Optional[str] = Field(None, example="FMD virus detected by RT-PCR")

class LabReferralResponse(LabReferralBase):
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

    class Config:
        from_attributes = True
