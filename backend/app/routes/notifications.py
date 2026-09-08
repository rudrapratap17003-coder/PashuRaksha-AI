from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.services.notification_service import NotificationService
from app.schemas.notification import NotificationResponse
from typing import List

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationResponse])
def get_notifications(
    category: str = Query(None),
    role: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    target_role = role or (current_user.role or "").lower()
    return NotificationService.get_notifications(db, category=category, role=target_role)

@router.put("/{notification_id}/read", response_model=NotificationResponse)
def mark_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notif = NotificationService.mark_read(db, notification_id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notif

@router.put("/read-all")
def mark_all_read(
    user_id: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    target_id = user_id or current_user.id
    return NotificationService.mark_all_read(db, target_id)
