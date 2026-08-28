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
                    village=r.village or "Rampur",
                    district=r.district or "Jaipur Rural",
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
        # Extract report ID or case reference
        # Look up by health report
        vact = VeterinaryAction(
            id=f"vact-{str(uuid.uuid4())[:8]}",
            case_id=case_id,
            action=action_in.action,
            notes=action_in.notes,
            lab_referral=action_in.lab_referral,
            status=action_in.status,
        )
        db.add(vact)
        db.commit()

        cases = VetService.get_priority_cases(db)
        for c in cases:
            if c.id == case_id or c.report_id == case_id:
                return c
        return cases[0] if cases else None
