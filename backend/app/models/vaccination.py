import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Text
from app.database import Base

class Vaccination(Base):
    __tablename__ = "vaccinations"

    id = Column(String(50), primary_key=True, default=lambda: f"vac-{str(uuid.uuid4())[:8]}")
    animal_id = Column(String(50), nullable=False, index=True)
    vaccine_name = Column(String(255), nullable=False)
    vaccination_date = Column(Date, default=date.today)
    next_due_date = Column(Date, nullable=True)
    status = Column(String(50), default="completed")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
