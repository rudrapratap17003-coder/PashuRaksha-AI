from fastapi import APIRouter, HTTPException, status
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate):
    return AuthService.register(user_in)

@router.post("/login", response_model=TokenResponse)
def login_user(login_in: UserLogin):
    return AuthService.login(login_in)

@router.get("/me", response_model=UserResponse)
def get_current_user():
    # Returns default demo user for Phase 3 exploration
    user = AuthService.get_user_by_id("usr-farmer-1")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(**user)
