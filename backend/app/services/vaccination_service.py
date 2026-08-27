import uuid
from typing import List, Optional
from datetime import datetime
from app.schemas.vaccination import VaccinationCreate, VaccinationResponse
from app.services.store import store

class VaccinationService:
    @staticmethod
    def get_all(animal_id: Optional[str] = None) -> List[VaccinationResponse]:
        vacs = list(store.vaccinations.values())
        if animal_id:
            vacs = [v for v in vacs if v.get("animal_id") == animal_id]
        return [VaccinationResponse(**v) for v in vacs]

    @staticmethod
    def create(vac_in: VaccinationCreate) -> VaccinationResponse:
        vac_id = f"vac-{str(uuid.uuid4())[:8]}"
        vac_dict = vac_in.model_dump()
        vac_dict["id"] = vac_id
        vac_dict["created_at"] = datetime.utcnow()
        store.vaccinations[vac_id] = vac_dict
        
        # Update animal vaccination status
        for anim in store.animals.values():
            if anim["animal_id"] == vac_in.animal_id or anim["id"] == vac_in.animal_id:
                anim["vaccination_status"] = "Up to date"
                break
        
        return VaccinationResponse(**vac_dict)
