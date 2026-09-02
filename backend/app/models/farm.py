import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey
from app.database import Base

class Farm(Base):
    __tablename__ = "farms"

    id = Column(String(50), primary_key=True, default=lambda: f"farm-{str(uuid.uuid4())[:8]}")
    name = Column(String(255), nullable=False)
    owner_id = Column(String(50), ForeignKey("users.id"), nullable=False, index=True)
    owner_name = Column(String(255), nullable=True)
    village = Column(String(255), nullable=True)
    taluka = Column(String(255), nullable=True)
    district = Column(String(255), nullable=True)
    state = Column(String(100), default="Maharashtra")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    total_animals = Column(Integer, default=0)
    cattle_count = Column(Integer, default=0)
    buffalo_count = Column(Integer, default=0)
    goat_count = Column(Integer, default=0)
    sheep_count = Column(Integer, default=0)
    poultry_count = Column(Integer, default=0)
    vaccination_coverage = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
