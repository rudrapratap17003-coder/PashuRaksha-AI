import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey
from app.database import Base

class VeterinaryAction(Base):
    __tablename__ = "veterinary_actions"

    id = Column(String(50), primary_key=True, default=lambda: f"vact-{str(uuid.uuid4())[:8]}")
    case_id = Column(String(50), nullable=False, index=True)
    report_id = Column(String(50), ForeignKey("health_reports.id"), nullable=True)
    veterinarian_id = Column(String(50), ForeignKey("users.id"), nullable=True)
    action = Column(String(255), nullable=False)
    notes = Column(Text, nullable=True)
    lab_referral = Column(Boolean, default=False)
    status = Column(String(50), default="investigated", index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
