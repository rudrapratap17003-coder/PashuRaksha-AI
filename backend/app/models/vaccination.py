import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Text, Index
from app.database import Base

class Vaccination(Base):
    __tablename__ = "vaccinations"

    id = Column(String(50), primary_key=True, default=lambda: f"vac-{str(uuid.uuid4())[:8]}")
    animal_id = Column(String(50), nullable=False, index=True)
    vaccine_name = Column(String(255), nullable=False, index=True)
    vaccination_date = Column(Date, default=date.today, index=True)
    next_due_date = Column(Date, nullable=True)
    status = Column(String(50), default="completed", index=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

