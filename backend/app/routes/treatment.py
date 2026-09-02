from fastapi import APIRouter, Query
from app.services.treatment_service import TreatmentService
from typing import Dict, Any, Optional

router = APIRouter(prefix="/treatments", tags=["Veterinary Treatments & Prescriptions"])

@router.get("/protocols")
def get_protocols():
    """Fetch all standard veterinary treatment protocols approved in Maharashtra."""
    return TreatmentService.get_all_protocols()

@router.post("/generate-prescription")
def generate_prescription(
    case_id: int = Query(1),
    animal_id: int = Query(1),
    disease_code: str = Query("FMD"),
    body_weight_kg: float = Query(350.0),
    vet_name: str = Query("Dr. Vivek Kulkarni, B.V.Sc & A.H."),
    reg_number: str = Query("MSVC-98421"),
    clinic_name: str = Query("Taluka Veterinary Polyclinic, Baramati, Dist. Pune")
):
    """Generate tailored veterinary prescription with body-weight specific drug dosage and supportive care."""
    return TreatmentService.generate_prescription(
        case_id=case_id,
        animal_id=animal_id,
        disease_code=disease_code,
        body_weight_kg=body_weight_kg,
        vet_name=vet_name,
        reg_number=reg_number,
        clinic_name=clinic_name
    )
