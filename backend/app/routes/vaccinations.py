from fastapi import APIRouter, HTTPException, Query, Depends, status
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.vaccination import VaccinationCreate, VaccinationResponse
from app.services.vaccination_service import VaccinationService

router = APIRouter(prefix="/vaccinations", tags=["Vaccinations"])

@router.get("", response_model=List[VaccinationResponse])
def list_vaccinations(
    animal_id: Optional[str] = Query(None, description="Filter by animal ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List vaccination records for livestock.
    Authenticated users only.
    """
    return VaccinationService.get_all(db, animal_id=animal_id)

@router.post("", response_model=VaccinationResponse, status_code=status.HTTP_201_CREATED)
def add_vaccination(
    vac_in: VaccinationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Record vaccination administration and compute booster schedule.
    """
    return VaccinationService.create(db, vac_in)
