from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.vet import VetCaseResponse, VetActionCreate
from app.services.vet_service import VetService

router = APIRouter(prefix="/vet", tags=["Veterinarian Clinical Desk"])

@router.get("/cases", response_model=List[VetCaseResponse])
def get_priority_triage_cases(
    status: Optional[str] = Query(None, description="Filter by case status (pending/investigated)"),
    db: Session = Depends(get_db)
):
    return VetService.get_priority_cases(db, status=status)

@router.post("/cases/{case_id}/action", response_model=VetCaseResponse)
def record_veterinary_action(
    case_id: str,
    action_in: VetActionCreate,
    db: Session = Depends(get_db)
):
    case = VetService.add_action(db, case_id, action_in)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case
