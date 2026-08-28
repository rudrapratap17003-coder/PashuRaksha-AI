import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, Text, JSON, ForeignKey
from app.database import Base

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(String(50), primary_key=True, default=lambda: f"risk-{str(uuid.uuid4())[:8]}")
    report_id = Column(String(50), ForeignKey("health_reports.id"), nullable=False, index=True)
    animal_id = Column(String(50), nullable=False, index=True)
    risk_score = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)
    possible_disease_concern = Column(String(255), nullable=False)
    disease_risk_score = Column(Float, default=0.0)
    contributing_factors = Column(JSON, default=list)
    recommendation = Column(Text, nullable=False)
    cluster_detected = Column(Boolean, default=False)
    cluster_name = Column(String(255), nullable=True)
    disclaimer = Column(
        Text,
        default="PASHURAKSHA AI provides AI-assisted health risk assessment and early-warning support. It does not replace professional veterinary diagnosis or treatment."
    )
    created_at = Column(DateTime, default=datetime.utcnow)
