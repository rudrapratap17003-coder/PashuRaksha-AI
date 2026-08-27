from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.vet import VetCaseResponse, VetActionCreate
from app.services.vet_service import VetService

router = APIRouter(prefix="/vet", tags=["Veterinarian Clinical Desk"])

@router.get("/cases", response_model=List[VetCaseResponse])
def get_priority_triage_cases(status: Optional[str] = Query(None, description="Filter by case status (pending/investigated)")):
    return VetService.get_priority_cases(status=status)

@router.post("/cases/{case_id}/action", response_model=VetCaseResponse)
def record_veterinary_action(case_id: str, action_in: VetActionCreate):
    case = VetService.add_action(case_id, action_in)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case
