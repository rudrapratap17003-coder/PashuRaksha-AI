"""
Laboratory service for managing lab referrals, sample tracking, and result entry.
"""
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.lab_referral import LabReferral
from app.models.case_timeline import CaseTimelineEvent

from app.schemas.lab_referral import LabReferralCreate, LabReferralUpdate


class LabService:
    @staticmethod
    def get_lab_dashboard(db: Session) -> dict:
        """Aggregate lab referral counts by status."""
        referrals = db.query(LabReferral).all()
        counts = {
            "pending": 0, "received": 0, "processing": 0,
            "completed": 0, "high_priority": 0, "total": len(referrals),
            "positive_results": 0, "negative_results": 0,
        }
        for r in referrals:
            if r.status in counts:
                counts[r.status] += 1
            if r.priority in ("high", "urgent"):
                counts["high_priority"] += 1
            if r.result == "positive":
                counts["positive_results"] += 1
            elif r.result == "negative":
                counts["negative_results"] += 1
        return counts

    @staticmethod
    def get_referrals(db: Session, status: str = None, priority: str = None):
        query = db.query(LabReferral).order_by(LabReferral.created_at.desc())
        if status:
            query = query.filter(LabReferral.status == status)
        if priority:
            query = query.filter(LabReferral.priority == priority)
        return query.all()

    @staticmethod
    def get_referral(db: Session, referral_id: str):
        return db.query(LabReferral).filter(LabReferral.id == referral_id).first()

    @staticmethod
    def create_referral(db: Session, data: LabReferralCreate, vet_id: str = None):
        referral = LabReferral(
            case_id=data.case_id,
            report_id=data.report_id,
            animal_id=data.animal_id,
            sample_type=data.sample_type,
            test_requested=data.test_requested,
            priority=data.priority,
            veterinarian_id=vet_id,
            veterinarian_name=data.veterinarian_name,
            village=data.village,
            district=data.district,
        )
        db.add(referral)

        # Add timeline event
        if data.case_id or data.report_id:
            event = CaseTimelineEvent(
                case_id=data.case_id or data.report_id,
                event_type="sample_collected",
                title="Laboratory Referral Created",
                description=f"Sample: {data.sample_type}. Test: {data.test_requested}. Priority: {data.priority}.",
                actor_role="veterinarian",
                actor_name=data.veterinarian_name,
            )
            db.add(event)

        db.commit()
        db.refresh(referral)
        return referral

    @staticmethod
    def update_referral(db: Session, referral_id: str, data: LabReferralUpdate):
        referral = db.query(LabReferral).filter(LabReferral.id == referral_id).first()
        if not referral:
            return None

        if data.status is not None:
            referral.status = data.status
        if data.result is not None:
            referral.result = data.result
            referral.result_date = datetime.utcnow()
        if data.result_notes is not None:
            referral.result_notes = data.result_notes

        # Add timeline event for result
        if data.result and data.result != "pending":
            case_ref = referral.case_id or referral.report_id
            if case_ref:
                event = CaseTimelineEvent(
                    case_id=case_ref,
                    event_type="lab_result",
                    title=f"Lab Result: {data.result.upper()}",
                    description=f"Test: {referral.test_requested}. Result: {data.result}. {data.result_notes or ''}",
                    actor_role="laboratory",
                )
                db.add(event)

        db.commit()
        db.refresh(referral)
        return referral
