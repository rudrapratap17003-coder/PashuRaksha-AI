from sqlalchemy.orm import Session
from app.models.case_timeline import CaseTimelineEvent

class TimelineService:
    @staticmethod
    def get_timeline(db: Session, case_id: str):
        return db.query(CaseTimelineEvent).filter(CaseTimelineEvent.case_id == case_id).order_by(CaseTimelineEvent.created_at).all()

    @staticmethod
    def add_event(db: Session, case_id: str, event_type: str, title: str, description: str = None, actor_name: str = None, actor_role: str = None):
        event = CaseTimelineEvent(
            case_id=case_id,
            event_type=event_type,
            title=title,
            description=description,
            actor_name=actor_name,
            actor_role=actor_role
        )
        db.add(event)
        db.commit()
        db.refresh(event)
        return event
