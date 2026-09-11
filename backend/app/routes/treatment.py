from fastapi import APIRouter, Query, Depends
from app.services.treatment_service import TreatmentService
from app.dependencies import require_clinical
from app.models.user import User
from typing import Dict, Any, Optional

router = APIRouter(prefix="/treatments", tags=["Veterinary Clinical Decision Support"])

@router.get("/protocols")
def get_protocols(current_user: User = Depends(require_clinical)):
    """
    Fetch standard veterinary treatment protocols.
    Authorized: Veterinarians and Admins only.
    """
    return TreatmentService.get_all_protocols()

@router.post("/generate-prescription")
def generate_prescription(
    case_id: str = Query("1"),
    animal_id: str = Query("1"),
    disease_code: str = Query("FMD"),
    body_weight_kg: float = Query(350.0),
    vet_name: str = Query("Dr. Vivek Kulkarni, B.V.Sc & A.H."),
    reg_number: str = Query("MSVC-98421"),
    clinic_name: str = Query("Taluka Veterinary Polyclinic, Baramati, Dist. Pune"),
    current_user: User = Depends(require_clinical)
):
    """
    Generate tailored veterinary clinical reference with body-weight specific drug dosage and supportive care.
    Authorized: Veterinarians and Admins only.
    """
    return TreatmentService.generate_prescription(
        case_id=case_id,
        animal_id=animal_id,
        disease_code=disease_code,
        body_weight_kg=body_weight_kg,
        vet_name=vet_name,
        reg_number=reg_number,
        clinic_name=clinic_name
    )
