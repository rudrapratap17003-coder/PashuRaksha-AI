import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime, Text, ForeignKey
from app.database import Base

class HealthReport(Base):
    __tablename__ = "health_reports"

    id = Column(String(50), primary_key=True, default=lambda: f"rep-{str(uuid.uuid4())[:8]}")
    animal_id = Column(String(50), nullable=False, index=True)
    reported_by = Column(String(50), ForeignKey("users.id"), nullable=False, index=True)
    reporter_name = Column(String(255), nullable=True)
    species = Column(String(100), nullable=True)
    
    # 11 Core Monitored Symptoms
    fever = Column(Boolean, default=False)
    cough = Column(Boolean, default=False)
    nasal_discharge = Column(Boolean, default=False)
    reduced_appetite = Column(Boolean, default=False)
    diarrhea = Column(Boolean, default=False)
    lethargy = Column(Boolean, default=False)
    reduced_milk = Column(Boolean, default=False)
    difficulty_breathing = Column(Boolean, default=False)
    salivation = Column(Boolean, default=False)
    lesions = Column(Boolean, default=False)
    swelling = Column(Boolean, default=False)
    other_symptoms = Column(Text, nullable=True)
    
    severity = Column(String(20), default="moderate")
    duration_days = Column(Integer, default=2)
    number_of_animals_affected = Column(Integer, default=1)
    
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    village = Column(String(255), nullable=True)
    district = Column(String(255), nullable=True)
    
    risk_score = Column(Float, default=0.0)
    risk_level = Column(String(20), default="LOW")
    possible_disease_concern = Column(String(255), nullable=True)
    recommendation = Column(Text, nullable=True)
    
    reported_at = Column(DateTime, default=datetime.utcnow, index=True)
