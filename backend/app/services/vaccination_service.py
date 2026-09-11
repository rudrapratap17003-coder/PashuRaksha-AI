import uuid
from typing import List, Optional
from datetime import timezone
from sqlalchemy.orm import Session
from app.models.vaccination import Vaccination
from app.models.animal import Animal
from app.schemas.vaccination import VaccinationCreate, VaccinationResponse
from app.utils import get_logger, get_utc_now

logger = get_logger(__name__)

class VaccinationService:
    @staticmethod
    def get_all(db: Session, animal_id: Optional[str] = None, limit: int = 100, offset: int = 0) -> List[VaccinationResponse]:
        query = db.query(Vaccination)
        if animal_id:
            query = query.filter(Vaccination.animal_id == animal_id)
        vacs = query.order_by(Vaccination.vaccination_date.desc()).offset(offset).limit(limit).all()
        return [
            VaccinationResponse(
                id=v.id,
                animal_id=v.animal_id,
                vaccine_name=v.vaccine_name,
                vaccination_date=v.vaccination_date,
                next_due_date=v.next_due_date,
                status=v.status,
                notes=v.notes,
                created_at=v.created_at
            )
            for v in vacs
        ]

    @staticmethod
    def create(db: Session, vac_in: VaccinationCreate) -> VaccinationResponse:
        logger.info("[VACCINATION_CREATE_START]", extra={"extra_data": {"animal_id": vac_in.animal_id, "vaccine_name": vac_in.vaccine_name}})
        vac = Vaccination(
            id=f"vac-{str(uuid.uuid4())[:8]}",
            animal_id=vac_in.animal_id,
            vaccine_name=vac_in.vaccine_name,
            vaccination_date=vac_in.vaccination_date,
            next_due_date=vac_in.next_due_date,
            status=vac_in.status,
            notes=vac_in.notes,
            created_at=get_utc_now()
        )
        try:
            db.add(vac)

            # Update animal vaccination status
            animal = db.query(Animal).filter((Animal.animal_id == vac_in.animal_id) | (Animal.id == vac_in.animal_id)).first()
            if animal:
                animal.vaccination_status = "Up to date"

            db.commit()
            db.refresh(vac)
            logger.info("[VACCINATION_CREATE_SUCCESS]", extra={"extra_data": {"vaccination_id": vac.id, "animal_id": vac.animal_id}})
            return VaccinationResponse(
                id=vac.id,
                animal_id=vac.animal_id,
                vaccine_name=vac.vaccine_name,
                vaccination_date=vac.vaccination_date,
                next_due_date=vac.next_due_date,
                status=vac.status,
                notes=vac.notes,
                created_at=vac.created_at
            )
        except Exception as e:
            db.rollback()
            logger.error("[VACCINATION_CREATE_ERROR]", extra={"extra_data": {"error": str(e), "animal_id": vac_in.animal_id}})
            raise
