import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.animal import Animal
from app.models.user import User
from app.schemas.animal import AnimalCreate, AnimalUpdate, AnimalResponse

class AnimalService:
    @staticmethod
    def get_all(db: Session, owner_id: Optional[str] = None) -> List[AnimalResponse]:
        query = db.query(Animal)
        if owner_id:
            query = query.filter(Animal.owner_id == owner_id)
        animals = query.order_by(Animal.created_at.desc()).all()
        return [
            AnimalResponse(
                id=a.id,
                animal_id=a.animal_id,
                owner_id=a.owner_id,
                owner_name=a.owner_name,
                species=a.species,
                breed=a.breed,
                age=a.age,
                gender=a.gender,
                weight=a.weight,
                vaccination_status=a.vaccination_status,
                previous_diseases=a.previous_diseases,
                milk_production=a.milk_production,
                village=a.village,
                district=a.district,
                current_risk_score=a.current_risk_score,
                current_risk_level=a.current_risk_level,
                created_at=a.created_at
            )
            for a in animals
        ]

    @staticmethod
    def get_by_id(db: Session, animal_id: str) -> Optional[AnimalResponse]:
        a = db.query(Animal).filter((Animal.id == animal_id) | (Animal.animal_id == animal_id)).first()
        if not a:
            return None
        return AnimalResponse(
            id=a.id,
            animal_id=a.animal_id,
            owner_id=a.owner_id,
            owner_name=a.owner_name,
            species=a.species,
            breed=a.breed,
            age=a.age,
            gender=a.gender,
            weight=a.weight,
            vaccination_status=a.vaccination_status,
            previous_diseases=a.previous_diseases,
            milk_production=a.milk_production,
            village=a.village,
            district=a.district,
            current_risk_score=a.current_risk_score,
            current_risk_level=a.current_risk_level,
            created_at=a.created_at
        )

    @staticmethod
    def create(db: Session, animal_in: AnimalCreate) -> AnimalResponse:
        owner_id = animal_in.owner_id or "usr-farmer-1"
        owner = db.query(User).filter(User.id == owner_id).first()
        owner_name = owner.name if owner else "Farmer"

        anim = Animal(
            id=f"anim-{str(uuid.uuid4())[:8]}",
            animal_id=animal_in.animal_id,
            owner_id=owner_id,
            owner_name=owner_name,
            species=animal_in.species,
            breed=animal_in.breed,
            age=animal_in.age,
            gender=animal_in.gender,
            weight=animal_in.weight,
            vaccination_status=animal_in.vaccination_status or "Up to date",
            previous_diseases=animal_in.previous_diseases or "None",
            milk_production=animal_in.milk_production,
            village=animal_in.village or (owner.village if owner else "Rampur"),
            district=animal_in.district or (owner.district if owner else "Jaipur Rural"),
            current_risk_score=0.0,
            current_risk_level="LOW",
        )
        db.add(anim)
        db.commit()
        db.refresh(anim)
        return AnimalResponse(
            id=anim.id,
            animal_id=anim.animal_id,
            owner_id=anim.owner_id,
            owner_name=anim.owner_name,
            species=anim.species,
            breed=anim.breed,
            age=anim.age,
            gender=anim.gender,
            weight=anim.weight,
            vaccination_status=anim.vaccination_status,
            previous_diseases=anim.previous_diseases,
            milk_production=anim.milk_production,
            village=anim.village,
            district=anim.district,
            current_risk_score=anim.current_risk_score,
            current_risk_level=anim.current_risk_level,
            created_at=anim.created_at
        )

    @staticmethod
    def update(db: Session, animal_id: str, animal_in: AnimalUpdate) -> Optional[AnimalResponse]:
        anim = db.query(Animal).filter((Animal.id == animal_id) | (Animal.animal_id == animal_id)).first()
        if not anim:
            return None
        update_data = animal_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(anim, key, value)
        db.commit()
        db.refresh(anim)
        return AnimalResponse(
            id=anim.id,
            animal_id=anim.animal_id,
            owner_id=anim.owner_id,
            owner_name=anim.owner_name,
            species=anim.species,
            breed=anim.breed,
            age=anim.age,
            gender=anim.gender,
            weight=anim.weight,
            vaccination_status=anim.vaccination_status,
            previous_diseases=anim.previous_diseases,
            milk_production=anim.milk_production,
            village=anim.village,
            district=anim.district,
            current_risk_score=anim.current_risk_score,
            current_risk_level=anim.current_risk_level,
            created_at=anim.created_at
        )

    @staticmethod
    def delete(db: Session, animal_id: str) -> bool:
        anim = db.query(Animal).filter((Animal.id == animal_id) | (Animal.animal_id == animal_id)).first()
        if not anim:
            return False
        db.delete(anim)
        db.commit()
        return True
