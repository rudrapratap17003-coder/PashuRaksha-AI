import jwt
from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.user import User

# Header extractor for Bearer token (optional=True allows custom 401 handling)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Extracts and validates the JWT Bearer token.
    Strict enforcement:
    - Missing token -> 401 Unauthorized (fallback to first user ONLY if explicit DEMO_MODE=True)
    - Invalid/expired token -> 401 Unauthorized
    - Unknown user -> 401 Unauthorized
    - NEVER silently authenticate as another user when token is invalid or missing in production.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload: subject identifier missing.",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except jwt.PyJWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user account not found in database.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def require_role(allowed_roles: List[str]):
    """
    Role-Based Access Control (RBAC) dependency factory.
    Enforces that current_user has one of the allowed roles, or is an admin.
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        user_role = (current_user.role or "").lower()
        allowed = [r.lower() for r in allowed_roles]
        if user_role not in allowed and "admin" not in user_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden. Your role '{current_user.role}' is not authorized. Required: {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker

# Convenience Role Dependencies
require_farmer = require_role(["farmer"])
require_vet = require_role(["veterinarian"])
require_authority = require_role(["authority"])
require_field_worker = require_role(["field_worker"])
require_lab = require_role(["laboratory"])
require_admin = require_role(["admin"])
require_clinical = require_role(["veterinarian", "admin"])
require_surveillance = require_role(["veterinarian", "authority", "admin"])
require_clinical_or_lab = require_role(["veterinarian", "laboratory", "admin"])
