from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.cluster import OutbreakCluster
from app.schemas.cluster import ClusterResponse

class ClusterService:
    @staticmethod
    def get_all(db: Session) -> List[ClusterResponse]:
        clusters = db.query(OutbreakCluster).order_by(OutbreakCluster.detected_at.desc()).all()
        return [
            ClusterResponse(
                id=c.id,
                cluster_name=c.cluster_name,
                disease_concern=c.disease_concern,
                latitude=c.latitude,
                longitude=c.longitude,
                radius_km=c.radius_km,
                case_count=c.case_count,
                affected_animals_count=c.affected_animals_count,
                cluster_score=c.cluster_score,
                risk_level=c.risk_level,
                dominant_symptoms=c.dominant_symptoms or [],
                affected_villages=c.affected_villages or [],
                status=c.status,
                detected_at=c.detected_at,
                recommended_action=c.recommended_action
            )
            for c in clusters
        ]

    @staticmethod
    def get_by_id(db: Session, cluster_id: str) -> Optional[ClusterResponse]:
        c = db.query(OutbreakCluster).filter(OutbreakCluster.id == cluster_id).first()
        if not c:
            return None
        return ClusterResponse(
            id=c.id,
            cluster_name=c.cluster_name,
            disease_concern=c.disease_concern,
            latitude=c.latitude,
            longitude=c.longitude,
            radius_km=c.radius_km,
            case_count=c.case_count,
            affected_animals_count=c.affected_animals_count,
            cluster_score=c.cluster_score,
            risk_level=c.risk_level,
            dominant_symptoms=c.dominant_symptoms or [],
            affected_villages=c.affected_villages or [],
            status=c.status,
            detected_at=c.detected_at,
            recommended_action=c.recommended_action
        )
