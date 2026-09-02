from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CaseTimelineEventCreate(BaseModel):
    event_type: str
    title: str
    description: Optional[str] = None
    actor_name: Optional[str] = None
    actor_role: Optional[str] = None

class CaseTimelineEventResponse(BaseModel):
    id: str
    case_id: str
    event_type: str
    title: str
    description: Optional[str]
    actor_name: Optional[str]
    actor_role: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True
