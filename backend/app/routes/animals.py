from fastapi import APIRouter, HTTPException, Query, Depends, status
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.animal import AnimalCreate, AnimalUpdate, AnimalResponse
from app.services.animal_service import AnimalService

router = APIRouter(prefix="/animals", tags=["Animals & Digital Records"])

@router.get("", response_model=List[AnimalResponse])
def list_animals(
    owner_id: Optional[str] = Query(None, description="Filter by owner user ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List livestock records.
    RBAC: Farmers are restricted to viewing only their own animals.
    Other roles (vet, field worker, authority, admin) can view all or filter by owner.
    """
    if (current_user.role or "").lower() == "farmer":
        return AnimalService.get_all(db, owner_id=current_user.id)
    return AnimalService.get_all(db, owner_id=owner_id)

@router.post("", response_model=AnimalResponse, status_code=status.HTTP_201_CREATED)
def create_animal(
    animal_in: AnimalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Register a new livestock profile.
    Farmers are bound to their own ownership ID automatically.
    """
    if (current_user.role or "").lower() == "farmer":
        animal_in.owner_id = current_user.id
        animal_in.owner_name = current_user.name
    return AnimalService.create(db, animal_in)

@router.get("/{animal_id}", response_model=AnimalResponse)
def get_animal(
    animal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve single livestock profile by ID.
    """
    animal = AnimalService.get_by_id(db, animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal record not found")
    return animal

@router.put("/{animal_id}", response_model=AnimalResponse)
def update_animal(
    animal_id: str,
    animal_in: AnimalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update animal health status, risk scores, or profiles.
    Farmers can only modify their own animals.
    """
    animal = AnimalService.get_by_id(db, animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal record not found")
    if (current_user.role or "").lower() == "farmer" and animal.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: you are only authorized to modify your own animals."
        )
    updated = AnimalService.update(db, animal_id, animal_in)
    return updated

@router.delete("/{animal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_animal(
    animal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete animal record.
    Farmers can only delete their own animals. Admins can delete any.
    """
    animal = AnimalService.get_by_id(db, animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal record not found")
    if (current_user.role or "").lower() == "farmer" and animal.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: you are only authorized to remove your own animals."
        )
    AnimalService.delete(db, animal_id)
    return None
