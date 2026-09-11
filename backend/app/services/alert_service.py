from typing import List, Optional
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.models.alert import Alert
from app.schemas.alert import AlertResponse
from app.utils import get_logger

logger = get_logger("alert_service")

class AlertService:
    @staticmethod
    def get_all(
        db: Session,
        target_role: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[AlertResponse]:
        query = db.query(Alert)
        if target_role:
            query = query.filter(Alert.target_role == target_role)
        alerts = query.order_by(Alert.created_at.desc()).offset(offset).limit(limit).all()
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
    def create_alert(
        db: Session,
        title: str,
        message: str,
        target_role: str = "farmer",
        alert_type: str = "broadcast",
        risk_level: str = "CRITICAL",
        village: Optional[str] = "Baramati",
        related_cluster_id: Optional[str] = None,
        deduplicate: bool = True
    ) -> AlertResponse:
        # Prevent identical duplicate alerts within a 15-minute window
        if deduplicate:
            fifteen_mins_ago = datetime.now(timezone.utc) - timedelta(minutes=15)
            existing = db.query(Alert).filter(
                Alert.title == title,
                Alert.target_role == target_role,
                Alert.village == village,
                Alert.created_at >= fifteen_mins_ago
            ).first()
            if existing:
                logger.info(f"[ALERT_DEDUPLICATED] Reusing active alert ID: {existing.id}")
                return AlertResponse(
                    id=existing.id,
                    user_id=existing.user_id,
                    target_role=existing.target_role,
                    alert_type=existing.alert_type,
                    title=existing.title,
                    message=existing.message,
                    risk_level=existing.risk_level,
                    related_cluster_id=existing.related_cluster_id,
                    village=existing.village,
                    is_read=existing.is_read,
                    created_at=existing.created_at
                )

        alert = Alert(
            title=title,
            message=message,
            target_role=target_role,
            alert_type=alert_type,
            risk_level=risk_level,
            village=village,
            related_cluster_id=related_cluster_id,
            is_read=False
        )
        try:
            db.add(alert)
            db.commit()
            db.refresh(alert)
            logger.info(f"[ALERT_CREATED] ID: {alert.id} | Role: {target_role} | Level: {risk_level} | Title: {title}")
        except Exception as e:
            db.rollback()
            logger.error(f"[ALERT_CREATE_FAILED] Title: {title} | Error: {e}")
            raise

        return AlertResponse(
            id=alert.id,
            user_id=alert.user_id,
            target_role=alert.target_role,
            alert_type=alert.alert_type,
            title=alert.title,
            message=alert.message,
            risk_level=alert.risk_level,
            related_cluster_id=alert.related_cluster_id,
            village=alert.village,
            is_read=alert.is_read,
            created_at=alert.created_at
        )

    @staticmethod
    def mark_as_read(db: Session, alert_id: str) -> bool:
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if not alert:
            return False
        alert.is_read = True
        try:
            db.commit()
            logger.info(f"[ALERT_MARKED_READ] ID: {alert_id}")
            return True
        except Exception as e:
            db.rollback()
            logger.error(f"[ALERT_MARK_READ_FAILED] ID: {alert_id} | Error: {e}")
            raise

