from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from app.schemas.vaccination import VaccinationCreate, VaccinationResponse
from app.services.vaccination_service import VaccinationService

router = APIRouter(prefix="/vaccinations", tags=["Vaccinations"])

@router.get("", response_model=List[VaccinationResponse])
def list_vaccinations(animal_id: Optional[str] = Query(None, description="Filter by animal ID")):
    return VaccinationService.get_all(animal_id=animal_id)

@router.post("", response_model=VaccinationResponse, status_code=status.HTTP_201_CREATED)
def add_vaccination(vac_in: VaccinationCreate):
    return VaccinationService.create(vac_in)
