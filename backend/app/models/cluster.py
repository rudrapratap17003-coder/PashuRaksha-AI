import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, Text, JSON
from app.database import Base

class OutbreakCluster(Base):
    __tablename__ = "outbreak_clusters"

    id = Column(String(50), primary_key=True, default=lambda: f"clust-{str(uuid.uuid4())[:8]}")
    cluster_name = Column(String(255), nullable=False)
    disease_concern = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    radius_km = Column(Float, default=1.5)
    case_count = Column(Integer, default=1)
    affected_animals_count = Column(Integer, default=1)
    cluster_score = Column(Float, default=0.0)
    risk_level = Column(String(20), default="CRITICAL")
    dominant_symptoms = Column(JSON, default=list)
    affected_villages = Column(JSON, default=list)
    status = Column(String(50), default="active", index=True)
    detected_at = Column(DateTime, default=datetime.utcnow, index=True)
    recommended_action = Column(Text, nullable=True)
