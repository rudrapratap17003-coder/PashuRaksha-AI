"""
Case State Machine & Operational Lifecycle Service
Manages validated transitions across the 10-stage operational lifecycle:
REPORTED -> RISK_ASSESSED -> FIELD_VERIFICATION -> VET_REVIEW -> SAMPLE_COLLECTED
-> LAB_PENDING -> LAB_RESULT -> AUTHORITY_REVIEW -> ACTION_TAKEN -> CLOSED
"""
from enum import Enum
from typing import Dict, List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.health_report import HealthReport
from app.models.case_timeline import CaseTimelineEvent

class CaseStatus(str, Enum):
    REPORTED = "REPORTED"
    RISK_ASSESSED = "RISK_ASSESSED"
    FIELD_VERIFICATION = "FIELD_VERIFICATION"
    VET_REVIEW = "VET_REVIEW"
    SAMPLE_COLLECTED = "SAMPLE_COLLECTED"
    LAB_PENDING = "LAB_PENDING"
    LAB_RESULT = "LAB_RESULT"
    AUTHORITY_REVIEW = "AUTHORITY_REVIEW"
    ACTION_TAKEN = "ACTION_TAKEN"
    CLOSED = "CLOSED"

VALID_TRANSITIONS: Dict[str, List[str]] = {
    CaseStatus.REPORTED.value: [
        CaseStatus.RISK_ASSESSED.value,
        CaseStatus.FIELD_VERIFICATION.value,
        CaseStatus.VET_REVIEW.value,
        CaseStatus.CLOSED.value
    ],
    CaseStatus.RISK_ASSESSED.value: [
        CaseStatus.FIELD_VERIFICATION.value,
        CaseStatus.VET_REVIEW.value,
        CaseStatus.SAMPLE_COLLECTED.value,
        CaseStatus.LAB_PENDING.value,
        CaseStatus.CLOSED.value
    ],
    CaseStatus.FIELD_VERIFICATION.value: [
        CaseStatus.VET_REVIEW.value,
        CaseStatus.SAMPLE_COLLECTED.value,
        CaseStatus.LAB_PENDING.value,
        CaseStatus.ACTION_TAKEN.value,
        CaseStatus.CLOSED.value
    ],
    CaseStatus.VET_REVIEW.value: [
        CaseStatus.FIELD_VERIFICATION.value,
        CaseStatus.SAMPLE_COLLECTED.value,
        CaseStatus.LAB_PENDING.value,
        CaseStatus.ACTION_TAKEN.value,
        CaseStatus.CLOSED.value
    ],
    CaseStatus.SAMPLE_COLLECTED.value: [
        CaseStatus.LAB_PENDING.value,
        CaseStatus.VET_REVIEW.value,
        CaseStatus.ACTION_TAKEN.value,
        CaseStatus.CLOSED.value
    ],
    CaseStatus.LAB_PENDING.value: [
        CaseStatus.LAB_RESULT.value,
        CaseStatus.CLOSED.value
    ],
    CaseStatus.LAB_RESULT.value: [
        CaseStatus.AUTHORITY_REVIEW.value,
        CaseStatus.VET_REVIEW.value,
        CaseStatus.ACTION_TAKEN.value,
        CaseStatus.CLOSED.value
    ],
    CaseStatus.AUTHORITY_REVIEW.value: [
        CaseStatus.ACTION_TAKEN.value,
        CaseStatus.CLOSED.value
    ],
    CaseStatus.ACTION_TAKEN.value: [
        CaseStatus.CLOSED.value,
        CaseStatus.FIELD_VERIFICATION.value,
        CaseStatus.VET_REVIEW.value
    ],
    CaseStatus.CLOSED.value: [
        CaseStatus.FIELD_VERIFICATION.value,
        CaseStatus.VET_REVIEW.value
    ]
}

class CaseService:
    @staticmethod
    def get_case_by_id(db: Session, case_id: str) -> Optional[HealthReport]:
        return db.query(HealthReport).filter(
            (HealthReport.id == case_id) | (HealthReport.id.like(f"%{case_id.replace('case-', '')}%"))
        ).first()

    @staticmethod
    def transition_status(
        db: Session,
        case_id: str,
        new_status: str,
        actor_name: str,
        actor_role: str,
        action: str,
        notes: Optional[str] = None
    ) -> HealthReport:
        case = CaseService.get_case_by_id(db, case_id)
        if not case:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Case {case_id} not found."
            )

        current_status = getattr(case, "status", CaseStatus.RISK_ASSESSED.value) or CaseStatus.RISK_ASSESSED.value
        allowed_next = VALID_TRANSITIONS.get(current_status, [])

        if new_status not in allowed_next and new_status != current_status:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid state transition from {current_status} to {new_status}. Allowed transitions: {', '.join(allowed_next)}"
            )

        previous_status = current_status
        case.status = new_status

        # Create audited timeline event
        event = CaseTimelineEvent(
            case_id=case.id,
            event_type=new_status.lower(),
            title=action,
            description=f"Status changed from {previous_status} to {new_status}. {notes or ''}".strip(),
            actor_name=actor_name,
            actor_role=actor_role,
            created_at=datetime.utcnow()
        )
        db.add(event)
        db.commit()
        db.refresh(case)
        return case
