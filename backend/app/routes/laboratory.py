from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import require_lab, require_clinical_or_lab
from app.models.user import User
from app.services.lab_service import LabService
from app.schemas.lab_referral import LabReferralCreate, LabReferralUpdate, LabReferralResponse
from typing import List

router = APIRouter(prefix="/lab", tags=["Laboratory & Diagnostics"])

@router.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_lab)
):
    """
    Diagnostic referral triage and sample testing dashboard.
    Authorized: Laboratory personnel and Admins only.
    """
    return LabService.get_lab_dashboard(db)

@router.get("/referrals", response_model=List[LabReferralResponse])
def get_referrals(
    status: str = Query(None),
    priority: str = Query(None),
    limit: int = Query(100, ge=1, le=500, description="Max referrals to return"),
    offset: int = Query(0, ge=0, description="Records to skip"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_clinical_or_lab)
):
    return LabService.get_referrals(db, status, priority, limit=limit, offset=offset)

@router.post("/referrals", response_model=LabReferralResponse)
def create_referral(
    data: LabReferralCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_clinical_or_lab)
):
    return LabService.create_referral(db, data, vet_id=current_user.id)

@router.get("/referrals/{referral_id}", response_model=LabReferralResponse)
def get_referral(
    referral_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_lab)
):
    referral = LabService.get_referral(db, referral_id)
    if not referral:
        raise HTTPException(status_code=404, detail="Referral not found")
    return referral

@router.put("/referrals/{referral_id}", response_model=LabReferralResponse)
def update_referral(
    referral_id: str,
    data: LabReferralUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_lab)
):
    referral = LabService.update_referral(db, referral_id, data)
    if not referral:
        raise HTTPException(status_code=404, detail="Referral not found")
    return referral
