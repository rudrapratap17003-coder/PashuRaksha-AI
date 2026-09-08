import uuid
import jwt
import bcrypt
from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.config import settings
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse

class AuthService:
    @staticmethod
    def hash_password(password: str) -> str:
        # Standard direct bcrypt hashing (safe with 72-byte max)
        pwd_bytes = password.encode('utf-8')[:72]
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        if not hashed_password or not plain_password:
            return False
        try:
            plain_bytes = plain_password.encode('utf-8')[:72]
            hashed_bytes = hashed_password.encode('utf-8')
            return bcrypt.checkpw(plain_bytes, hashed_bytes)
        except Exception:
            # Safe backward-compatibility for seeded demo strings ONLY when DEMO_MODE is True
            if settings.DEMO_MODE and hashed_password in ("hashed_demo_password", "password123"):
                return plain_password == "password123"
            return False

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        now = datetime.utcnow()
        if expires_delta:
            expire = now + expires_delta
        else:
            expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire, "iat": now})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt

    @staticmethod
    def register(db: Session, user_in: UserCreate) -> UserResponse:
        email = (user_in.email or "").strip().lower()
        # Check if email exists
        existing = db.query(User).filter(User.email.ilike(email)).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists."
            )

        user_id = f"usr-{str(uuid.uuid4())[:8]}"
        hashed_password = AuthService.hash_password(user_in.password)
        
        user = User(
            id=user_id,
            name=user_in.name,
            phone=user_in.phone,
            email=email,
            password_hash=hashed_password,
            role=user_in.role.value if hasattr(user_in.role, 'value') else user_in.role,
            village=user_in.village,
            district=user_in.district,
            state=user_in.state or "Maharashtra",
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
        email = (login_in.email or "").strip().lower()
        password = login_in.password or ""

        user = db.query(User).filter(User.email.ilike(email)).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials: user not found."
            )

        if not AuthService.verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials: incorrect password."
            )

        token_data = {
            "sub": user.id,
            "email": user.email,
            "role": user.role,
            "name": user.name
        }
        token = AuthService.create_access_token(token_data)

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
        return TokenResponse(access_token=token, token_type="bearer", user=user_resp)

    @staticmethod
    def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()
