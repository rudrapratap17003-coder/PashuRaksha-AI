from fastapi import APIRouter, HTTPException, Query, Depends, status
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.animal import Animal
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
    Farmers are restricted to vaccinations of animals in their own herd.
    """
    if (current_user.role or "").lower() == "farmer":
        farmer_animals = db.query(Animal.animal_id).filter(Animal.owner_id == current_user.id).all()
        farmer_animal_ids = {a[0] for a in farmer_animals}
        if animal_id and animal_id not in farmer_animal_ids:
            return []
        all_vacs = VaccinationService.get_all(db, animal_id=animal_id)
        return [v for v in all_vacs if v.animal_id in farmer_animal_ids]
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
    if (current_user.role or "").lower() == "farmer":
        animal = db.query(Animal).filter((Animal.animal_id == vac_in.animal_id) | (Animal.id == vac_in.animal_id)).first()
        if animal and animal.owner_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access forbidden: you can only record vaccinations for your own livestock."
            )
    return VaccinationService.create(db, vac_in)
