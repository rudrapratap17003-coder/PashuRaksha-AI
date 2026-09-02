from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.lab_service import LabService
from app.schemas.lab_referral import LabReferralCreate, LabReferralUpdate, LabReferralResponse
from typing import List

router = APIRouter(prefix="/lab", tags=["Laboratory & Diagnostics"])

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    return LabService.get_lab_dashboard(db)

@router.get("/referrals", response_model=List[LabReferralResponse])
def get_referrals(status: str = Query(None), priority: str = Query(None), db: Session = Depends(get_db)):
    return LabService.get_referrals(db, status, priority)

@router.post("/referrals", response_model=LabReferralResponse)
def create_referral(data: LabReferralCreate, db: Session = Depends(get_db)):
    return LabService.create_referral(db, data)

@router.get("/referrals/{referral_id}", response_model=LabReferralResponse)
def get_referral(referral_id: str, db: Session = Depends(get_db)):
    referral = LabService.get_referral(db, referral_id)
    if not referral:
        raise HTTPException(status_code=404, detail="Referral not found")
    return referral

@router.put("/referrals/{referral_id}", response_model=LabReferralResponse)
def update_referral(referral_id: str, data: LabReferralUpdate, db: Session = Depends(get_db)):
    referral = LabService.update_referral(db, referral_id, data)
    if not referral:
        raise HTTPException(status_code=404, detail="Referral not found")
    return referral
