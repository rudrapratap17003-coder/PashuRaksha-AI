from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    return AuthService.register(db, user_in)

@router.post("/login", response_model=TokenResponse)
def login_user(login_in: UserLogin, db: Session = Depends(get_db)):
    return AuthService.login(db, login_in)

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        phone=current_user.phone,
        email=current_user.email,
        role=current_user.role,
        village=current_user.village,
        district=current_user.district,
        state=current_user.state,
        latitude=current_user.latitude,
        longitude=current_user.longitude,
        created_at=current_user.created_at
    )
