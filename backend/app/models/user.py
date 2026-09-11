import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, Enum, Index
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, default=lambda: f"usr-{str(uuid.uuid4())[:8]}")
    name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)
    role = Column(String(50), nullable=False, default="farmer", index=True)
    village = Column(String(255), nullable=True, index=True)
    district = Column(String(255), nullable=True, index=True)
    state = Column(String(255), default="Maharashtra")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

