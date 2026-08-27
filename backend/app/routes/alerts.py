from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.alert import AlertResponse
from app.services.alert_service import AlertService

router = APIRouter(prefix="/alerts", tags=["Alerts & Notifications"])

@router.get("", response_model=List[AlertResponse])
def list_alerts(role: Optional[str] = Query(None, description="Filter alerts by target role (farmer/veterinarian/authority)")):
    return AlertService.get_all(target_role=role)

@router.put("/{alert_id}/read", response_model=dict)
def mark_alert_read(alert_id: str):
    success = AlertService.mark_as_read(alert_id)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"status": "success", "message": f"Alert {alert_id} marked as read"}
