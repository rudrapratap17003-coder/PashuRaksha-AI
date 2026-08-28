from fastapi import APIRouter, HTTPException, Query, Depends, status
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.animal import AnimalCreate, AnimalUpdate, AnimalResponse
from app.services.animal_service import AnimalService

router = APIRouter(prefix="/animals", tags=["Animals & Digital Records"])

@router.get("", response_model=List[AnimalResponse])
def list_animals(
    owner_id: Optional[str] = Query(None, description="Filter by owner user ID"),
    db: Session = Depends(get_db)
):
    return AnimalService.get_all(db, owner_id=owner_id)

@router.post("", response_model=AnimalResponse, status_code=status.HTTP_201_CREATED)
def create_animal(animal_in: AnimalCreate, db: Session = Depends(get_db)):
    return AnimalService.create(db, animal_in)

@router.get("/{animal_id}", response_model=AnimalResponse)
def get_animal(animal_id: str, db: Session = Depends(get_db)):
    animal = AnimalService.get_by_id(db, animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal record not found")
    return animal

@router.put("/{animal_id}", response_model=AnimalResponse)
def update_animal(animal_id: str, animal_in: AnimalUpdate, db: Session = Depends(get_db)):
    updated = AnimalService.update(db, animal_id, animal_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Animal record not found")
    return updated

@router.delete("/{animal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_animal(animal_id: str, db: Session = Depends(get_db)):
    success = AnimalService.delete(db, animal_id)
    if not success:
        raise HTTPException(status_code=404, detail="Animal record not found")
    return None
