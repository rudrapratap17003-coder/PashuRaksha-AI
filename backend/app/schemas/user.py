from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from enum import Enum
from datetime import datetime

class UserRole(str, Enum):
    FARMER = "farmer"
    FIELD_WORKER = "field_worker"
    VETERINARIAN = "veterinarian"
    LABORATORY = "laboratory"
    AUTHORITY = "authority"
    ADMIN = "admin"

class UserBase(BaseModel):
    name: str = Field(..., example="Ramesh Kumar")
    phone: str = Field(..., example="9876543210")
    email: EmailStr = Field(..., example="farmer.ramesh@pashuraksha.ai")
    role: UserRole = Field(default=UserRole.FARMER)
    village: Optional[str] = Field(None, example="Baramati")
    district: Optional[str] = Field(None, example="Pune")
    state: Optional[str] = Field(default="Maharashtra", example="Maharashtra")
    latitude: Optional[float] = Field(None, example=18.1515)
    longitude: Optional[float] = Field(None, example=74.5772)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, example="password123")

class UserLogin(BaseModel):
    email: EmailStr = Field(..., example="farmer.ramesh@pashuraksha.ai")
    password: str = Field(..., example="password123")

class UserResponse(UserBase):
    id: str = Field(..., example="usr-101")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
