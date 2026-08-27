import uuid
from typing import List, Optional
from datetime import datetime
from app.schemas.health_report import HealthReportCreate, HealthReportResponse
from app.schemas.risk_assessment import RiskAssessmentResponse, RiskLevelEnum
from app.services.store import store

class HealthReportService:
    @staticmethod
    def get_all(animal_id: Optional[str] = None) -> List[HealthReportResponse]:
        reports = list(store.health_reports.values())
        if animal_id:
            reports = [r for r in reports if r.get("animal_id") == animal_id]
        return [HealthReportResponse(**r) for r in reports]

    @staticmethod
    def get_by_id(report_id: str) -> Optional[HealthReportResponse]:
        report = store.health_reports.get(report_id)
        if report:
            return HealthReportResponse(**report)
        return None

    @staticmethod
    def create(report_in: HealthReportCreate) -> HealthReportResponse:
        rep_id = f"rep-{str(uuid.uuid4())[:8]}"
        risk_id = f"risk-{str(uuid.uuid4())[:8]}"
        
        # Determine animal species and owner
        species = "Cattle (Cow)"
        animal = None
        for a in store.animals.values():
            if a["animal_id"] == report_in.animal_id or a["id"] == report_in.animal_id:
                species = a.get("species", "Cattle (Cow)")
                animal = a
                break

        # Calculate preliminary prototype score (will be refined in Phase 9 AI Risk Engine)
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

        rep_dict = report_in.model_dump()
        rep_dict["id"] = rep_id
        rep_dict["reported_by"] = report_in.reported_by or "usr-farmer-1"
        rep_dict["reporter_name"] = store.users.get(rep_dict["reported_by"], {}).get("name", "Farmer")
        rep_dict["species"] = species
        rep_dict["reported_at"] = datetime.utcnow()
        rep_dict["risk_score"] = normalized_score
        rep_dict["risk_level"] = level
        rep_dict["possible_disease_concern"] = possible_disease
        rep_dict["recommendation"] = rec

        store.health_reports[rep_id] = rep_dict

        # Store linked risk assessment
        store.risk_assessments[risk_id] = {
            "id": risk_id,
            "report_id": rep_id,
            "animal_id": report_in.animal_id,
            "risk_score": normalized_score,
            "risk_level": level,
            "possible_disease_concern": possible_disease,
            "disease_risk_score": normalized_score,
            "contributing_factors": factors,
            "recommendation": rec,
            "cluster_detected": report_in.number_of_animals_affected > 1,
            "disclaimer": "PASHURAKSHA AI provides AI-assisted health risk assessment and early-warning support. It does not replace professional veterinary diagnosis or treatment.",
            "created_at": datetime.utcnow(),
        }

        # Update animal's current risk score
        if animal:
            animal["current_risk_score"] = normalized_score
            animal["current_risk_level"] = level

        # If high risk, create a vet triage case
        if normalized_score >= 60:
            case_id = f"case-{str(uuid.uuid4())[:6]}"
            symptoms = []
            if report_in.fever: symptoms.append("Fever")
            if report_in.cough: symptoms.append("Cough")
            if report_in.nasal_discharge: symptoms.append("Nasal Discharge")
            if report_in.reduced_appetite: symptoms.append("Reduced Appetite")
            if report_in.difficulty_breathing: symptoms.append("Difficulty Breathing")
            if report_in.lesions: symptoms.append("Lesions")

            store.vet_cases[case_id] = {
                "id": case_id,
                "report_id": rep_id,
                "animal_id": report_in.animal_id,
                "species": species,
                "breed": animal.get("breed", "Local") if animal else "Local",
                "farmer_name": rep_dict["reporter_name"],
                "farmer_phone": "9876543210",
                "village": report_in.village or "Rampur",
                "district": report_in.district or "Jaipur Rural",
                "symptoms": symptoms,
                "severity": report_in.severity.value,
                "duration_days": report_in.duration_days,
                "risk_score": normalized_score,
                "risk_level": level,
                "possible_disease_concern": possible_disease,
                "cluster_flag": report_in.number_of_animals_affected > 1,
                "cluster_id": "clust-101" if report_in.number_of_animals_affected > 1 else None,
                "status": "pending",
                "veterinary_notes": None,
                "lab_referral": False,
                "reported_at": datetime.utcnow(),
            }

        return HealthReportResponse(**rep_dict)
