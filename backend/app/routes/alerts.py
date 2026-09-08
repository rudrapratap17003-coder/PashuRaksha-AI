from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.alert import AlertResponse
from app.services.alert_service import AlertService

router = APIRouter(prefix="/alerts", tags=["Alerts & Notifications"])

@router.get("", response_model=List[AlertResponse])
def list_alerts(
    role: Optional[str] = Query(None, description="Filter alerts by target role (farmer/veterinarian/authority)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    target_role = role or (current_user.role or "").lower()
    alerts = AlertService.get_all(db, target_role=target_role)
    if (current_user.role or "").lower() == "farmer":
        alerts = [a for a in alerts if a.target_role in ("farmer", "all") or a.user_id == current_user.id]
    return alerts

@router.put("/{alert_id}/read", response_model=dict)
def mark_alert_read(
    alert_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = AlertService.mark_as_read(db, alert_id)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"status": "success", "message": f"Alert {alert_id} marked as read"}
