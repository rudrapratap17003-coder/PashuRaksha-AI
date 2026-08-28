import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from app.database import Base

class Animal(Base):
    __tablename__ = "animals"

    id = Column(String(50), primary_key=True, default=lambda: f"anim-{str(uuid.uuid4())[:8]}")
    animal_id = Column(String(50), unique=True, nullable=False, index=True)
    owner_id = Column(String(50), ForeignKey("users.id"), nullable=False, index=True)
    owner_name = Column(String(255), nullable=True)
    species = Column(String(100), nullable=False)
    breed = Column(String(100), nullable=False)
    age = Column(Float, nullable=False)
    gender = Column(String(20), nullable=False)
    weight = Column(Float, nullable=True)
    vaccination_status = Column(String(50), default="Up to date")
    previous_diseases = Column(String(500), default="None")
    milk_production = Column(Float, nullable=True)
    village = Column(String(255), nullable=True)
    district = Column(String(255), nullable=True)
    current_risk_score = Column(Float, default=0.0)
    current_risk_level = Column(String(20), default="LOW")
    created_at = Column(DateTime, default=datetime.utcnow)
