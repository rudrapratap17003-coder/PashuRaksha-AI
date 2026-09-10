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

@router.post("/broadcast", response_model=AlertResponse)
def broadcast_alert(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    title = payload.get("title") or "🚨 Official Biosecurity Advisory"
    message = payload.get("message") or payload.get("text") or "Emergency livestock alert."
    target_role = payload.get("target_role") or "farmer"
    risk_level = payload.get("risk_level") or payload.get("severity") or "CRITICAL"
    village = payload.get("village") or "Baramati"
    return AlertService.create_alert(
        db,
        title=title,
        message=message,
        target_role=target_role,
        alert_type="broadcast",
        risk_level=risk_level,
        village=village
    )

@router.post("/emergency", response_model=AlertResponse)
def trigger_emergency_alert(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    village = payload.get("village") or "Baramati East"
    affected = payload.get("affected_heads") or "4"
    obs = payload.get("symptom_summary") or "Sudden severe salivation, mouth blisters & high fever"
    return AlertService.create_alert(
        db,
        title=f"🚨 1962 SOS PANIC ALARM: {village}",
        message=f"Emergency outbreak alarm triggered in {village}. Affected heads: {affected}. Observations: {obs}",
        target_role="authority",
        alert_type="emergency_panic",
        risk_level="CRITICAL",
        village=village
    )
