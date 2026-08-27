import uuid
from typing import List, Optional
from datetime import datetime
from app.schemas.animal import AnimalCreate, AnimalUpdate, AnimalResponse
from app.services.store import store

class AnimalService:
    @staticmethod
    def get_all(owner_id: Optional[str] = None) -> List[AnimalResponse]:
        animals = list(store.animals.values())
        if owner_id:
            animals = [a for a in animals if a.get("owner_id") == owner_id]
        return [AnimalResponse(**a) for a in animals]

    @staticmethod
    def get_by_id(animal_id: str) -> Optional[AnimalResponse]:
        # Search by internal id or ear-tag animal_id
        for a in store.animals.values():
            if a["id"] == animal_id or a["animal_id"] == animal_id:
                return AnimalResponse(**a)
        return None

    @staticmethod
    def create(animal_in: AnimalCreate) -> AnimalResponse:
        internal_id = f"anim-{str(uuid.uuid4())[:8]}"
        animal_dict = animal_in.model_dump()
        animal_dict["id"] = internal_id
        animal_dict["owner_id"] = animal_in.owner_id or "usr-farmer-1"
        animal_dict["owner_name"] = store.users.get(animal_dict["owner_id"], {}).get("name", "Farmer")
        animal_dict["current_risk_score"] = 0.0
        animal_dict["current_risk_level"] = "LOW"
        animal_dict["created_at"] = datetime.utcnow()
        store.animals[internal_id] = animal_dict
        return AnimalResponse(**animal_dict)

    @staticmethod
    def update(animal_id: str, animal_in: AnimalUpdate) -> Optional[AnimalResponse]:
        for key, val in store.animals.items():
            if val["id"] == animal_id or val["animal_id"] == animal_id:
                update_data = animal_in.model_dump(exclude_unset=True)
                val.update(update_data)
                return AnimalResponse(**val)
        return None

    @staticmethod
    def delete(animal_id: str) -> bool:
        to_delete = None
        for key, val in store.animals.items():
            if val["id"] == animal_id or val["animal_id"] == animal_id:
                to_delete = key
                break
        if to_delete:
            del store.animals[to_delete]
            return True
        return False
