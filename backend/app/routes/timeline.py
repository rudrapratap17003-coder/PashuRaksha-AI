from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.timeline_service import TimelineService
from app.schemas.case_timeline import CaseTimelineEventResponse, CaseTimelineEventCreate
from typing import List

router = APIRouter(prefix="/cases/{case_id}/timeline", tags=["Case Timeline"])

@router.get("", response_model=List[CaseTimelineEventResponse])
def get_timeline(case_id: str, db: Session = Depends(get_db)):
    return TimelineService.get_timeline(db, case_id)

@router.post("", response_model=CaseTimelineEventResponse)
def add_timeline_event(case_id: str, data: CaseTimelineEventCreate, db: Session = Depends(get_db)):
    return TimelineService.add_event(db, case_id, data.event_type, data.title, data.description, data.actor_name, data.actor_role)
