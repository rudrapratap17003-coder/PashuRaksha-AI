from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from app.schemas.animal import AnimalCreate, AnimalUpdate, AnimalResponse
from app.services.animal_service import AnimalService

router = APIRouter(prefix="/animals", tags=["Animals & Digital Records"])

@router.get("", response_model=List[AnimalResponse])
def list_animals(owner_id: Optional[str] = Query(None, description="Filter by owner user ID")):
    return AnimalService.get_all(owner_id=owner_id)

@router.post("", response_model=AnimalResponse, status_code=status.HTTP_201_CREATED)
def create_animal(animal_in: AnimalCreate):
    return AnimalService.create(animal_in)

@router.get("/{animal_id}", response_model=AnimalResponse)
def get_animal(animal_id: str):
    animal = AnimalService.get_by_id(animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal record not found")
    return animal

@router.put("/{animal_id}", response_model=AnimalResponse)
def update_animal(animal_id: str, animal_in: AnimalUpdate):
    updated = AnimalService.update(animal_id, animal_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Animal record not found")
    return updated

@router.delete("/{animal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_animal(animal_id: str):
    success = AnimalService.delete(animal_id)
    if not success:
        raise HTTPException(status_code=404, detail="Animal record not found")
    return None
