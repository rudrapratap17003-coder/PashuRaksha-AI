from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

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
