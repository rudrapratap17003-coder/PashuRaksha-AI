from fastapi import APIRouter, HTTPException, Query, Depends, status
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.vaccination import VaccinationCreate, VaccinationResponse
from app.services.vaccination_service import VaccinationService

router = APIRouter(prefix="/vaccinations", tags=["Vaccinations"])

@router.get("", response_model=List[VaccinationResponse])
def list_vaccinations(
    animal_id: Optional[str] = Query(None, description="Filter by animal ID"),
    db: Session = Depends(get_db)
):
    return VaccinationService.get_all(db, animal_id=animal_id)

@router.post("", response_model=VaccinationResponse, status_code=status.HTTP_201_CREATED)
def add_vaccination(vac_in: VaccinationCreate, db: Session = Depends(get_db)):
    return VaccinationService.create(db, vac_in)
