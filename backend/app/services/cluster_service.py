import uuid
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.cluster import OutbreakCluster
from app.models.health_report import HealthReport
from app.models.alert import Alert
from app.schemas.cluster import ClusterResponse
from app.ai.clustering import OutbreakClusterEngine

class ClusterService:
    @staticmethod
    def get_all(db: Session) -> List[ClusterResponse]:
        clusters = db.query(OutbreakCluster).order_by(OutbreakCluster.cluster_score.desc()).all()
        
        # If no clusters found, run detection automatically
        if not clusters:
            return ClusterService.run_detection(db)

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

    @staticmethod
    def run_detection(db: Session) -> List[ClusterResponse]:
        """
        Executes AI spatial-temporal clustering over all stored health reports,
        persists detected clusters into the database, and emits alerts.
        """
        reports = db.query(HealthReport).all()
        
        report_dicts = [
            {
                "id": r.id,
                "animal_id": r.animal_id,
                "latitude": r.latitude,
                "longitude": r.longitude,
                "village": r.village,
                "district": r.district,
                "fever": r.fever,
                "cough": r.cough,
                "nasal_discharge": r.nasal_discharge,
                "difficulty_breathing": r.difficulty_breathing,
                "lesions": r.lesions,
                "salivation": r.salivation,
                "diarrhea": r.diarrhea,
                "reduced_milk": r.reduced_milk,
                "swelling": r.swelling,
                "lethargy": r.lethargy,
                "reduced_appetite": r.reduced_appetite,
                "severity": r.severity,
                "number_of_animals_affected": r.number_of_animals_affected,
                "risk_score": r.risk_score,
                "reported_at": r.reported_at,
            }
            for r in reports
        ]

        detected = OutbreakClusterEngine.detect_clusters(report_dicts, eps_km=12.0, min_cases=2)
        persisted_clusters = []

        for d in detected:
            existing = db.query(OutbreakCluster).filter(OutbreakCluster.id == d["id"]).first()
            if not existing:
                cluster_obj = OutbreakCluster(
                    id=d["id"],
                    cluster_name=d["cluster_name"],
                    disease_concern=d["disease_concern"],
                    latitude=d["latitude"],
                    longitude=d["longitude"],
                    radius_km=d["radius_km"],
                    case_count=d["case_count"],
                    affected_animals_count=d["affected_animals_count"],
                    cluster_score=d["cluster_score"],
                    risk_level=d["risk_level"],
                    dominant_symptoms=d["dominant_symptoms"],
                    affected_villages=d["affected_villages"],
                    status="active",
                    recommended_action=d["recommended_action"],
                    detected_at=datetime.utcnow()
                )
                db.add(cluster_obj)

                # If High or Critical, generate multi-tier alerts
                if d["risk_level"] in ["HIGH", "CRITICAL"]:
                    # Vet Alert
                    db.add(Alert(
                        id=f"alt-vet-{str(uuid.uuid4())[:6]}",
                        target_role="veterinarian",
                        alert_type="outbreak_cluster",
                        title=f"Outbreak Alert: {d['cluster_name']}",
                        message=f"{d['disease_concern']} detected affecting {d['affected_animals_count']} livestock across {', '.join(d['affected_villages'])}. Cluster score: {d['cluster_score']}/100.",
                        risk_level=d["risk_level"],
                        related_cluster_id=d["id"],
                        village=d["affected_villages"][0] if d["affected_villages"] else "Rampur",
                    ))
                    # Authority Alert
                    db.add(Alert(
                        id=f"alt-auth-{str(uuid.uuid4())[:6]}",
                        target_role="authority",
                        alert_type="outbreak_cluster",
                        title=f"Epidemic Surveillance Alert: {d['cluster_name']}",
                        message=f"Spatial cluster formed in {', '.join(d['affected_villages'])} with {d['case_count']} reports ({d['affected_animals_count']} animals). Action required: {d['recommended_action']}",
                        risk_level=d["risk_level"],
                        related_cluster_id=d["id"],
                        village=d["affected_villages"][0] if d["affected_villages"] else "Rampur",
                    ))
                    # Farmer Advisory Broadcast
                    db.add(Alert(
                        id=f"alt-farm-{str(uuid.uuid4())[:6]}",
                        target_role="farmer",
                        alert_type="village_advisory",
                        title=f"Livestock Advisory for {d['affected_villages'][0] if d['affected_villages'] else 'Your Village'}",
                        message=f"Elevated livestock health concern ({d['disease_concern']}) reported nearby. Check your livestock vitals and isolate animals with fever or lesions.",
                        risk_level=d["risk_level"],
                        related_cluster_id=d["id"],
                        village=d["affected_villages"][0] if d["affected_villages"] else "Rampur",
                    ))
            else:
                existing.case_count = d["case_count"]
                existing.affected_animals_count = d["affected_animals_count"]
                existing.cluster_score = d["cluster_score"]
                existing.risk_level = d["risk_level"]
                existing.dominant_symptoms = d["dominant_symptoms"]
                existing.affected_villages = d["affected_villages"]
                existing.recommended_action = d["recommended_action"]
                existing.disease_concern = d["disease_concern"]

            db.commit()

        return ClusterService.get_all(db)
