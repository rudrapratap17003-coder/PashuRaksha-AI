import uuid
from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse

class AuthService:
    @staticmethod
    def register(db: Session, user_in: UserCreate) -> UserResponse:
        user_id = f"usr-{str(uuid.uuid4())[:8]}"
        user = User(
            id=user_id,
            name=user_in.name,
            phone=user_in.phone,
            email=user_in.email,
            password_hash=f"hashed_{user_in.password}",  # To be hashed with passlib in Phase 5
            role=user_in.role.value,
            village=user_in.village,
            district=user_in.district,
            state=user_in.state,
            latitude=user_in.latitude,
            longitude=user_in.longitude,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return UserResponse(
            id=user.id,
            name=user.name,
            phone=user.phone,
            email=user.email,
            role=user.role,
            village=user.village,
            district=user.district,
            state=user.state,
            latitude=user.latitude,
            longitude=user.longitude,
            created_at=user.created_at
        )

    @staticmethod
    def login(db: Session, login_in: UserLogin) -> TokenResponse:
        user = db.query(User).filter(User.email.ilike(login_in.email)).first()
        if not user:
            user = db.query(User).first()  # Fallback demo user
        
        token = f"pashuraksha_demo_jwt_{user.id}"
        user_resp = UserResponse(
            id=user.id,
            name=user.name,
            phone=user.phone,
            email=user.email,
            role=user.role,
            village=user.village,
            district=user.district,
            state=user.state,
            latitude=user.latitude,
            longitude=user.longitude,
            created_at=user.created_at
        )
        return TokenResponse(access_token=token, user=user_resp)

    @staticmethod
    def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()
