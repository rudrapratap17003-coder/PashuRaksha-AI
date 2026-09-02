"""
Notification service for managing user notifications across all roles.
"""
from sqlalchemy.orm import Session
from app.models.notification import Notification


class NotificationService:
    @staticmethod
    def get_notifications(db: Session, user_id: str = None, role: str = None, category: str = None):
        query = db.query(Notification).order_by(Notification.created_at.desc())
        if user_id:
            query = query.filter(Notification.user_id == user_id)
        if role:
            query = query.filter(Notification.target_role == role)
        if category:
            query = query.filter(Notification.category == category)
        return query.all()

    @staticmethod
    def mark_read(db: Session, notification_id: str):
        notif = db.query(Notification).filter(Notification.id == notification_id).first()
        if notif:
            notif.is_read = True
            db.commit()
            db.refresh(notif)
        return notif

    @staticmethod
    def mark_all_read(db: Session, user_id: str):
        db.query(Notification).filter(Notification.user_id == user_id).update({"is_read": True})
        db.commit()
        return {"status": "success", "message": "All notifications marked as read"}

    @staticmethod
    def create_notification(db: Session, title: str, message: str, category: str = "health_alert",
                            user_id: str = None, target_role: str = None, priority: str = "normal",
                            related_id: str = None, related_type: str = None):
        notif = Notification(
            title=title,
            message=message,
            category=category,
            user_id=user_id,
            target_role=target_role,
            priority=priority,
            related_id=related_id,
            related_type=related_type,
        )
        db.add(notif)
        db.commit()
        db.refresh(notif)
        return notif
