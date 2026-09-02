from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TimelineEventCreate(BaseModel):
    event_type: str = Field(..., example="field_visit")
    title: str = Field(..., example="Field Visit Completed")
    description: Optional[str] = Field(None, example="Dr. Sharma visited the farm")
    actor_name: Optional[str] = None
    actor_role: Optional[str] = None

class TimelineEventResponse(BaseModel):
    id: str
    case_id: str
    event_type: str
    title: str
    description: Optional[str] = None
    actor_name: Optional[str] = None
    actor_role: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
