from typing import List, Optional
from app.schemas.alert import AlertResponse
from app.services.store import store

class AlertService:
    @staticmethod
    def get_all(target_role: Optional[str] = None) -> List[AlertResponse]:
        alerts = list(store.alerts.values())
        if target_role:
            alerts = [a for a in alerts if a.get("target_role") == target_role]
        return [AlertResponse(**a) for a in alerts]

    @staticmethod
    def mark_as_read(alert_id: str) -> bool:
        alert = store.alerts.get(alert_id)
        if alert:
            alert["is_read"] = True
            return True
        return False
