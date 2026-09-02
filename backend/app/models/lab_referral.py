import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Integer
from app.database import Base

class LabReferral(Base):
    __tablename__ = "lab_referrals"

    id = Column(String(50), primary_key=True, default=lambda: f"lab-{str(uuid.uuid4())[:8]}")
    case_id = Column(String(50), nullable=True, index=True)
    report_id = Column(String(50), ForeignKey("health_reports.id"), nullable=True)
    animal_id = Column(String(50), nullable=False, index=True)
    sample_type = Column(String(100), nullable=False)  # Blood, Swab, Tissue, Milk, Fecal
    test_requested = Column(String(255), nullable=False)  # RT-PCR, Culture, Serology, etc.
    collection_date = Column(DateTime, default=datetime.utcnow)
    priority = Column(String(20), default="normal")  # low, normal, high, urgent
    veterinarian_id = Column(String(50), ForeignKey("users.id"), nullable=True)
    veterinarian_name = Column(String(255), nullable=True)
    lab_technician_id = Column(String(50), ForeignKey("users.id"), nullable=True)
    village = Column(String(255), nullable=True)
    district = Column(String(255), nullable=True)
    status = Column(String(50), default="pending", index=True)  # pending, received, processing, completed
    result = Column(String(50), default="pending")  # positive, negative, inconclusive, pending
    result_notes = Column(Text, nullable=True)
    result_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
