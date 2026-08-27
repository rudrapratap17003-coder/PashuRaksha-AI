from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AlertResponse(BaseModel):
    id: str = Field(..., example="alt-101")
    user_id: Optional[str] = Field(None, example="usr-101")
    target_role: str = Field(..., example="farmer")
    alert_type: str = Field(..., example="cluster_warning")
    title: str = Field(..., example="Elevated Health Risk Detected Nearby")
    message: str = Field(..., example="4 nearby livestock health reports received in Rampur. Please observe your animals.")
    risk_level: str = Field(..., example="HIGH")
    related_cluster_id: Optional[str] = Field(None, example="clust-101")
    village: Optional[str] = Field("Rampur", example="Rampur")
    is_read: bool = Field(False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
