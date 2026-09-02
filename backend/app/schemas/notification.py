from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class NotificationResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    target_role: Optional[str] = None
    category: str
    title: str
    message: str
    priority: str = "normal"
    related_id: Optional[str] = None
    related_type: Optional[str] = None
    is_read: bool = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
