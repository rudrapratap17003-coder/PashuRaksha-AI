from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, timezone

class AlertResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str = Field(...)
    user_id: Optional[str] = Field(None)
    target_role: str = Field(...)
    alert_type: str = Field(...)
    title: str = Field(...)
    message: str = Field(...)
    risk_level: str = Field(...)
    related_cluster_id: Optional[str] = Field(None)
    village: Optional[str] = Field(None)
    is_read: bool = Field(False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

