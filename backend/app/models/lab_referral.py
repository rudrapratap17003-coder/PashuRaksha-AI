import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Integer, Index
from app.database import Base

class LabReferral(Base):
    __tablename__ = "lab_referrals"

    id = Column(String(50), primary_key=True, default=lambda: f"lab-{str(uuid.uuid4())[:8]}")
    case_id = Column(String(50), nullable=True, index=True)
    report_id = Column(String(50), ForeignKey("health_reports.id"), nullable=True, index=True)
    animal_id = Column(String(50), nullable=False, index=True)
    sample_type = Column(String(100), nullable=False)  # Blood, Swab, Tissue, Milk, Fecal
    test_requested = Column(String(255), nullable=False, index=True)  # RT-PCR, Culture, Serology, etc.
    collection_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    priority = Column(String(20), default="normal", index=True)  # low, normal, high, urgent
    veterinarian_id = Column(String(50), ForeignKey("users.id"), nullable=True, index=True)
    veterinarian_name = Column(String(255), nullable=True)
    lab_technician_id = Column(String(50), ForeignKey("users.id"), nullable=True, index=True)
    village = Column(String(255), nullable=True, index=True)
    district = Column(String(255), nullable=True, index=True)
    status = Column(String(50), default="pending", index=True)  # pending, received, processing, completed
    result = Column(String(50), default="pending", index=True)  # positive, negative, inconclusive, pending
    result_notes = Column(Text, nullable=True)
    result_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

