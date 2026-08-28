from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.alert import Alert
from app.schemas.alert import AlertResponse

class AlertService:
    @staticmethod
    def get_all(db: Session, target_role: Optional[str] = None) -> List[AlertResponse]:
        query = db.query(Alert)
        if target_role:
            query = query.filter(Alert.target_role == target_role)
        alerts = query.order_by(Alert.created_at.desc()).all()
        return [
            AlertResponse(
                id=a.id,
                user_id=a.user_id,
                target_role=a.target_role,
                alert_type=a.alert_type,
                title=a.title,
                message=a.message,
                risk_level=a.risk_level,
                related_cluster_id=a.related_cluster_id,
                village=a.village,
                is_read=a.is_read,
                created_at=a.created_at
            )
            for a in alerts
        ]

    @staticmethod
    def mark_as_read(db: Session, alert_id: str) -> bool:
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if not alert:
            return False
        alert.is_read = True
        db.commit()
        return True
