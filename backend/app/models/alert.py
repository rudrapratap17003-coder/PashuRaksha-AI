import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, Index
from app.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(50), primary_key=True, default=lambda: f"alt-{str(uuid.uuid4())[:8]}")
    user_id = Column(String(50), ForeignKey("users.id"), nullable=True, index=True)
    target_role = Column(String(50), nullable=False, index=True)
    alert_type = Column(String(50), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    risk_level = Column(String(20), default="HIGH", index=True)
    related_cluster_id = Column(String(50), ForeignKey("outbreak_clusters.id"), nullable=True, index=True)
    village = Column(String(255), nullable=True, index=True)
    is_read = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

