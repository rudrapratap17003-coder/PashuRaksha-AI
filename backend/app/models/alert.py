import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey
from app.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(50), primary_key=True, default=lambda: f"alt-{str(uuid.uuid4())[:8]}")
    user_id = Column(String(50), ForeignKey("users.id"), nullable=True, index=True)
    target_role = Column(String(50), nullable=False, index=True)
    alert_type = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    risk_level = Column(String(20), default="HIGH")
    related_cluster_id = Column(String(50), ForeignKey("outbreak_clusters.id"), nullable=True)
    village = Column(String(255), nullable=True)
    is_read = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
