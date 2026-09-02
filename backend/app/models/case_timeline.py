import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text
from app.database import Base

class CaseTimelineEvent(Base):
    __tablename__ = "case_timeline_events"

    id = Column(String(50), primary_key=True, default=lambda: f"evt-{str(uuid.uuid4())[:8]}")
    case_id = Column(String(50), nullable=False, index=True)  # report_id or case reference
    event_type = Column(String(50), nullable=False)  # report_created, ai_triage, risk_identified, vet_assigned, field_visit, sample_collected, lab_result, treatment, resolved
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    actor_name = Column(String(255), nullable=True)
    actor_role = Column(String(50), nullable=True)
    metadata_json = Column(Text, nullable=True)  # JSON string for extra data
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
