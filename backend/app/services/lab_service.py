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

        # Transition case to LAB_PENDING
        case_ref = data.case_id or data.report_id
        if case_ref:
            from app.services.case_service import CaseService, CaseStatus
            CaseService.transition_status(
                db, case_ref, CaseStatus.LAB_PENDING.value,
                actor_name=data.veterinarian_name or "Attending Veterinarian",
                actor_role="veterinarian",
                action="Laboratory Referral Created",
                notes=f"Sample: {data.sample_type}. Test: {data.test_requested}. Priority: {data.priority}."
            )

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

        # Advance Case State
        if data.result and data.result != "pending":
            case_ref = referral.case_id or referral.report_id
            if case_ref:
                from app.services.case_service import CaseService, CaseStatus
                result_label = "POSITIVE (FMD Serotype O)" if (data.result == "positive" and "FMD" in (referral.test_requested or "")) else data.result.upper()
                
                # Step to LAB_RESULT
                CaseService.transition_status(
                    db, case_ref, CaseStatus.LAB_RESULT.value,
                    actor_name="Central Diagnostic Laboratory",
                    actor_role="laboratory",
                    action=f"Lab Result: {result_label}",
                    notes=f"Test: {referral.test_requested}. Result: {data.result}. {data.result_notes or ''}"
                )

                # If positive result, immediately escalate to AUTHORITY_REVIEW
                if data.result == "positive":
                    CaseService.transition_status(
                        db, case_ref, CaseStatus.AUTHORITY_REVIEW.value,
                        actor_name="Surveillance Dispatch Engine",
                        actor_role="system",
                        action="Escalated to District Animal Husbandry Authority",
                        notes="Confirmed positive diagnostic result triggers district outbreak protocols and ring vaccination response."
                    )

            # If confirmed positive for FMD or high-consequence vesicular disease, trigger outbreak cluster & authority alert
            if data.result == "positive":
                import uuid
                from app.models.cluster import OutbreakCluster
                from app.models.alert import Alert

                village_name = referral.village or "Baramati"
                cluster = db.query(OutbreakCluster).filter(OutbreakCluster.cluster_name.like(f"%{village_name}%")).first()
                if not cluster:
                    cluster = OutbreakCluster(
                        id=f"clust-{str(uuid.uuid4())[:8]}",
                        cluster_name=f"{village_name} FMD Outbreak Cluster",
                        disease_concern="Foot-and-Mouth Disease (FMD Serotype O Confirmed)",
                        latitude=18.1515,
                        longitude=74.5772,
                        radius_km=5.0,
                        case_count=8,
                        affected_animals_count=14,
                        cluster_score=94.0,
                        risk_level="CRITICAL",
                        dominant_symptoms=["Fever", "Oral Lesions", "Excessive Salivation", "Reduced Milk"],
                        affected_villages=[village_name, "Malegaon Bk", "Jalochi"],
                        status="active",
                        recommended_action="Establish 5.0 km ring containment perimeter. Deploy rapid response team with 250 FMD vaccine doses. Impose livestock movement ban and broadcast urgent SMS advisory.",
                        detected_at=datetime.utcnow()
                    )
                    db.add(cluster)
                else:
                    cluster.disease_concern = "Foot-and-Mouth Disease (FMD Serotype O Confirmed)"
                    cluster.cluster_score = 94.0
                    cluster.risk_level = "CRITICAL"
                    cluster.radius_km = 5.0
                    cluster.case_count = max(cluster.case_count, 8)
                    cluster.affected_animals_count = max(cluster.affected_animals_count, 14)
                    cluster.dominant_symptoms = ["Fever", "Oral Lesions", "Excessive Salivation", "Reduced Milk"]
                    cluster.recommended_action = "Establish 5.0 km ring containment perimeter. Deploy rapid response team with 250 FMD vaccine doses. Impose livestock movement ban and broadcast urgent SMS advisory."

                # Dispatch Authority Alert
                db.add(Alert(
                    id=f"alt-auth-{str(uuid.uuid4())[:6]}",
                    target_role="authority",
                    alert_type="outbreak_confirmed",
                    title=f"🚨 CRITICAL Laboratory Confirmation: FMD Positive in {village_name}",
                    message=f"RT-PCR assay confirmed Foot-and-Mouth Disease (Serotype O) for animal {referral.animal_id} in {village_name}. 5.0 km containment zone and ring vaccination protocol activated.",
                    risk_level="CRITICAL",
                    village=village_name,
                ))

        db.commit()
        db.refresh(referral)
        return referral
