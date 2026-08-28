import uuid
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.health_report import HealthReport
from app.models.risk_assessment import RiskAssessment
from app.models.animal import Animal
from app.models.user import User
from app.models.alert import Alert
from app.schemas.health_report import HealthReportCreate, HealthReportResponse

class HealthReportService:
    @staticmethod
    def get_all(db: Session, animal_id: Optional[str] = None) -> List[HealthReportResponse]:
        query = db.query(HealthReport)
        if animal_id:
            query = query.filter(HealthReport.animal_id == animal_id)
        reports = query.order_by(HealthReport.reported_at.desc()).all()
        return [
            HealthReportResponse(
                id=r.id,
                animal_id=r.animal_id,
                reported_by=r.reported_by,
                reporter_name=r.reporter_name,
                species=r.species,
                fever=r.fever,
                cough=r.cough,
                nasal_discharge=r.nasal_discharge,
                reduced_appetite=r.reduced_appetite,
                diarrhea=r.diarrhea,
                lethargy=r.lethargy,
                reduced_milk=r.reduced_milk,
                difficulty_breathing=r.difficulty_breathing,
                salivation=r.salivation,
                lesions=r.lesions,
                swelling=r.swelling,
                other_symptoms=r.other_symptoms,
                severity=r.severity,
                duration_days=r.duration_days,
                number_of_animals_affected=r.number_of_animals_affected,
                latitude=r.latitude,
                longitude=r.longitude,
                village=r.village,
                district=r.district,
                reported_at=r.reported_at,
                risk_score=r.risk_score,
                risk_level=r.risk_level,
                possible_disease_concern=r.possible_disease_concern,
                recommendation=r.recommendation
            )
            for r in reports
        ]

    @staticmethod
    def get_by_id(db: Session, report_id: str) -> Optional[HealthReportResponse]:
        r = db.query(HealthReport).filter(HealthReport.id == report_id).first()
        if not r:
            return None
        return HealthReportResponse(
            id=r.id,
            animal_id=r.animal_id,
            reported_by=r.reported_by,
            reporter_name=r.reporter_name,
            species=r.species,
            fever=r.fever,
            cough=r.cough,
            nasal_discharge=r.nasal_discharge,
            reduced_appetite=r.reduced_appetite,
            diarrhea=r.diarrhea,
            lethargy=r.lethargy,
            reduced_milk=r.reduced_milk,
            difficulty_breathing=r.difficulty_breathing,
            salivation=r.salivation,
            lesions=r.lesions,
            swelling=r.swelling,
            other_symptoms=r.other_symptoms,
            severity=r.severity,
            duration_days=r.duration_days,
            number_of_animals_affected=r.number_of_animals_affected,
            latitude=r.latitude,
            longitude=r.longitude,
            village=r.village,
            district=r.district,
            reported_at=r.reported_at,
            risk_score=r.risk_score,
            risk_level=r.risk_level,
            possible_disease_concern=r.possible_disease_concern,
            recommendation=r.recommendation
        )

    @staticmethod
    def create(db: Session, report_in: HealthReportCreate) -> HealthReportResponse:
        reported_by = report_in.reported_by or "usr-farmer-1"
        user = db.query(User).filter(User.id == reported_by).first()
        reporter_name = user.name if user else "Farmer"

        animal = db.query(Animal).filter(
            (Animal.animal_id == report_in.animal_id) | (Animal.id == report_in.animal_id)
        ).first()
        species = animal.species if animal else "Cattle (Cow)"

        # Calculate preliminary prototype score
        score = 0.0
        factors = []
        if report_in.fever:
            score += 20.0
            factors.append({"factor": "Elevated temperature (Fever)", "weight_contribution": 20.0, "category": "Vitals"})
        if report_in.cough or report_in.nasal_discharge:
            score += 15.0
            factors.append({"factor": "Respiratory signs (Cough/Discharge)", "weight_contribution": 15.0, "category": "Symptoms"})
        if report_in.difficulty_breathing:
            score += 25.0
            factors.append({"factor": "Severe respiratory distress", "weight_contribution": 25.0, "category": "Critical Vitals"})
        if report_in.lesions:
            score += 25.0
            factors.append({"factor": "Blisters/Lesions on mouth or feet", "weight_contribution": 25.0, "category": "Critical Signs"})
        if report_in.reduced_appetite or report_in.lethargy:
            score += 12.0
            factors.append({"factor": "Loss of appetite / Lethargy", "weight_contribution": 12.0, "category": "General State"})
        if report_in.number_of_animals_affected > 1:
            score += 12.0
            factors.append({"factor": f"{report_in.number_of_animals_affected} animals displaying signs", "weight_contribution": 12.0, "category": "Community Spread"})

        if report_in.severity == "severe":
            score += 10.0
        elif report_in.severity == "moderate":
            score += 5.0

        normalized_score = min(max(round(score, 1), 0.0), 100.0)
        
        if normalized_score >= 80:
            level = "CRITICAL"
            rec = "Urgent veterinary attention required. Isolate animal immediately."
        elif normalized_score >= 60:
            level = "HIGH"
            rec = "Veterinary assessment recommended. Monitor vitals and isolate from herd."
        elif normalized_score >= 30:
            level = "MODERATE"
            rec = "Moderate health concern. Keep animal hydrated and observe for 24 hours."
        else:
            level = "LOW"
            rec = "Routine monitoring. Normal vitals reported."

        possible_disease = "Possible Respiratory / Viral Complex (Decision-Support Assessment)"

        rep = HealthReport(
            id=f"rep-{str(uuid.uuid4())[:8]}",
            animal_id=report_in.animal_id,
            reported_by=reported_by,
            reporter_name=reporter_name,
            species=species,
            fever=report_in.fever,
            cough=report_in.cough,
            nasal_discharge=report_in.nasal_discharge,
            reduced_appetite=report_in.reduced_appetite,
            diarrhea=report_in.diarrhea,
            lethargy=report_in.lethargy,
            reduced_milk=report_in.reduced_milk,
            difficulty_breathing=report_in.difficulty_breathing,
            salivation=report_in.salivation,
            lesions=report_in.lesions,
            swelling=report_in.swelling,
            other_symptoms=report_in.other_symptoms,
            severity=report_in.severity.value,
            duration_days=report_in.duration_days,
            number_of_animals_affected=report_in.number_of_animals_affected,
            latitude=report_in.latitude or (user.latitude if user else 26.9124),
            longitude=report_in.longitude or (user.longitude if user else 75.7873),
            village=report_in.village or (user.village if user else "Rampur"),
            district=report_in.district or (user.district if user else "Jaipur Rural"),
            risk_score=normalized_score,
            risk_level=level,
            possible_disease_concern=possible_disease,
            recommendation=rec,
        )
        db.add(rep)
        db.commit()
        db.refresh(rep)

        # Store linked risk assessment
        risk = RiskAssessment(
            id=f"risk-{str(uuid.uuid4())[:8]}",
            report_id=rep.id,
            animal_id=rep.animal_id,
            risk_score=normalized_score,
            risk_level=level,
            possible_disease_concern=possible_disease,
            disease_risk_score=normalized_score,
            contributing_factors=factors,
            recommendation=rec,
            cluster_detected=report_in.number_of_animals_affected > 1,
            cluster_name="Rampur Village Cluster #1" if report_in.number_of_animals_affected > 1 else None,
        )
        db.add(risk)

        # Update animal's current risk score
        if animal:
            animal.current_risk_score = normalized_score
            animal.current_risk_level = level

        # If high/critical risk, create an alert
        if normalized_score >= 60:
            alert = Alert(
                id=f"alt-{str(uuid.uuid4())[:8]}",
                user_id=reported_by,
                target_role="veterinarian",
                alert_type="vet_triage",
                title=f"High Risk Case: {animal.animal_id if animal else rep.animal_id} ({rep.village})",
                message=f"{species} reported with risk score {normalized_score}/100. Prompt veterinary review recommended.",
                risk_level=level,
                village=rep.village,
            )
            db.add(alert)

        db.commit()

        return HealthReportResponse(
            id=rep.id,
            animal_id=rep.animal_id,
            reported_by=rep.reported_by,
            reporter_name=rep.reporter_name,
            species=rep.species,
            fever=rep.fever,
            cough=rep.cough,
            nasal_discharge=rep.nasal_discharge,
            reduced_appetite=rep.reduced_appetite,
            diarrhea=rep.diarrhea,
            lethargy=rep.lethargy,
            reduced_milk=rep.reduced_milk,
            difficulty_breathing=rep.difficulty_breathing,
            salivation=rep.salivation,
            lesions=rep.lesions,
            swelling=rep.swelling,
            other_symptoms=rep.other_symptoms,
            severity=rep.severity,
            duration_days=rep.duration_days,
            number_of_animals_affected=rep.number_of_animals_affected,
            latitude=rep.latitude,
            longitude=rep.longitude,
            village=rep.village,
            district=rep.district,
            reported_at=rep.reported_at,
            risk_score=rep.risk_score,
            risk_level=rep.risk_level,
            possible_disease_concern=rep.possible_disease_concern,
            recommendation=rep.recommendation
        )
