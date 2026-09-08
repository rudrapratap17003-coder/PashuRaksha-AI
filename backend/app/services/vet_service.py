import uuid
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.health_report import HealthReport
from app.models.animal import Animal
from app.models.user import User
from app.models.vet_action import VeterinaryAction
from app.schemas.vet import VetCaseResponse, VetActionCreate

class VetService:
    @staticmethod
    def get_priority_cases(db: Session, status: Optional[str] = None) -> List[VetCaseResponse]:
        # Triage high and critical risk reports
        query = db.query(HealthReport).filter(HealthReport.risk_score >= 30.0)
        reports = query.order_by(HealthReport.risk_score.desc(), HealthReport.reported_at.desc()).all()
        
        cases = []
        for r in reports:
            # Check if there is an action
            action = db.query(VeterinaryAction).filter(VeterinaryAction.report_id == r.id).first()
            current_status = action.status if action else "pending"
            if status and current_status != status:
                continue

            animal = db.query(Animal).filter(
                (Animal.animal_id == r.animal_id) | (Animal.id == r.animal_id)
            ).first()

            symptoms = []
            if r.fever: symptoms.append("Fever")
            if r.cough: symptoms.append("Cough")
            if r.nasal_discharge: symptoms.append("Nasal Discharge")
            if r.reduced_appetite: symptoms.append("Reduced Appetite")
            if r.difficulty_breathing: symptoms.append("Difficulty Breathing")
            if r.lesions: symptoms.append("Lesions")
            if r.diarrhea: symptoms.append("Diarrhea")
            if r.lethargy: symptoms.append("Lethargy")

            cases.append(
                VetCaseResponse(
                    id=f"case-{r.id[-6:]}",
                    report_id=r.id,
                    animal_id=r.animal_id,
                    species=r.species or "Cattle",
                    breed=animal.breed if animal else "Local",
                    farmer_name=r.reporter_name or "Farmer",
                    farmer_phone="9876543210",
                    village=r.village or "Baramati",
                    district=r.district or "Pune",
                    symptoms=symptoms,
                    severity=r.severity,
                    duration_days=r.duration_days,
                    risk_score=r.risk_score,
                    risk_level=r.risk_level,
                    possible_disease_concern=r.possible_disease_concern or "Elevated Risk",
                    cluster_flag=r.number_of_animals_affected > 1,
                    cluster_id="clust-101" if r.number_of_animals_affected > 1 else None,
                    status=current_status,
                    veterinary_notes=action.notes if action else None,
                    lab_referral=action.lab_referral if action else False,
                    reported_at=r.reported_at
                )
            )
        return cases

    @staticmethod
    def add_action(db: Session, case_id: str, action_in: VetActionCreate) -> Optional[VetCaseResponse]:
        # Determine associated report_id
        rep = db.query(HealthReport).filter(
            (HealthReport.id == case_id) | (HealthReport.id.like(f"%{case_id.replace('case-', '')}%"))
        ).first()
        report_id = rep.id if rep else (case_id if case_id.startswith("rep-") else None)

        vact = VeterinaryAction(
            id=f"vact-{str(uuid.uuid4())[:8]}",
            case_id=case_id,
            report_id=report_id,
            action=action_in.action,
            notes=action_in.notes,
            lab_referral=action_in.lab_referral,
            status=action_in.status,
        )
        db.add(vact)

        # Transition Case State
        if rep or report_id:
            from app.services.case_service import CaseService, CaseStatus
            target_id = rep.id if rep else report_id
            
            if action_in.lab_referral:
                new_status = CaseStatus.LAB_PENDING.value
                # Create lab referral record if not exists
                from app.models.lab_referral import LabReferral
                existing_ref = db.query(LabReferral).filter(
                    (LabReferral.report_id == target_id) | (LabReferral.case_id == case_id)
                ).first()
                if not existing_ref:
                    lab_ref = LabReferral(
                        id=f"lab-{str(uuid.uuid4())[:8]}",
                        case_id=case_id,
                        report_id=target_id,
                        animal_id=rep.animal_id if rep else "ANI-101",
                        sample_type="Epithelial Scraping / Swab",
                        test_requested="RT-PCR for FMDV / Vesicular Panel",
                        priority="urgent",
                        veterinarian_name="Dr. Priya Sharma",
                        village=rep.village if rep else "Baramati",
                        district=rep.district if rep else "Pune",
                        status="pending"
                    )
                    db.add(lab_ref)
            elif action_in.status == "closed":
                new_status = CaseStatus.CLOSED.value
            elif action_in.status in ("investigated", "treated"):
                new_status = CaseStatus.ACTION_TAKEN.value
            else:
                new_status = CaseStatus.VET_REVIEW.value

            CaseService.transition_status(
                db, target_id, new_status,
                actor_name="Dr. Priya Sharma",
                actor_role="veterinarian",
                action=action_in.action,
                notes=action_in.notes
            )
        else:
            # Fallback Timeline Event for untracked report ID
            from app.models.case_timeline import CaseTimelineEvent
            event = CaseTimelineEvent(
                case_id=case_id,
                event_type="clinical_review",
                title="Veterinarian Clinical Examination",
                description=f"Action: {action_in.action}. Notes: {action_in.notes or 'Clinical review completed.'}",
                actor_name="Dr. Priya Sharma",
                actor_role="veterinarian"
            )
            db.add(event)

        db.commit()

        cases = VetService.get_priority_cases(db)
        for c in cases:
            if c.id == case_id or c.report_id == case_id or (rep and c.report_id == rep.id):
                return c
        return cases[0] if cases else None
