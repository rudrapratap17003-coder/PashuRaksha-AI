from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class TimelineEventCreate(BaseModel):
    event_type: str = Field(...)
    title: str = Field(...)
    description: Optional[str] = Field(None)
    actor_name: Optional[str] = None
    actor_role: Optional[str] = None

class TimelineEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    case_id: str
    event_type: str
    title: str
    description: Optional[str] = None
    actor_name: Optional[str] = None
    actor_role: Optional[str] = None
    created_at: Optional[datetime] = None
