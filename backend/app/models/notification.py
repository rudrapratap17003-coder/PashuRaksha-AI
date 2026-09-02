import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey
from app.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(50), primary_key=True, default=lambda: f"notif-{str(uuid.uuid4())[:8]}")
    user_id = Column(String(50), ForeignKey("users.id"), nullable=True, index=True)
    target_role = Column(String(50), nullable=True, index=True)
    category = Column(String(50), nullable=False)  # health_alert, vaccination, vet_action, lab_update, cluster_warning
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    priority = Column(String(20), default="normal")  # low, normal, high, urgent
    related_id = Column(String(50), nullable=True)  # ID of related entity
    related_type = Column(String(50), nullable=True)  # report, case, lab_referral, cluster
    is_read = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
