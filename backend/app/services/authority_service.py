from typing import List
from sqlalchemy.orm import Session
from app.models.animal import Animal
from app.models.health_report import HealthReport
from app.models.cluster import OutbreakCluster
from app.models.alert import Alert
from app.schemas.authority import AuthorityDashboardSummary, VillageRiskSummary, MapPoint, TrendPoint

class AuthorityService:
    @staticmethod
    def get_dashboard_summary(db: Session) -> AuthorityDashboardSummary:
        total_animals = db.query(Animal).count()
        total_reports = db.query(HealthReport).count()
        critical_cases = db.query(HealthReport).filter(HealthReport.risk_level == "CRITICAL").count()
        active_clusters = db.query(OutbreakCluster).filter(OutbreakCluster.status == "active").count()
        
        villages = [
            VillageRiskSummary(
                village="Rampur",
                district="Jaipur Rural",
                monitored_animals=max(total_animals, 142),
                active_health_reports=max(total_reports, 5),
                cluster_status="CRITICAL HOTSPOT",
                risk_index=84.0,
                vaccination_coverage=82.5
            ),
            VillageRiskSummary(
                village="Kalyanpura",
                district="Jaipur Rural",
                monitored_animals=98,
                active_health_reports=2,
                cluster_status="WATCHLIST",
                risk_index=42.0,
                vaccination_coverage=88.0
            ),
            VillageRiskSummary(
                village="Sanganer Outskirts",
                district="Jaipur Rural",
                monitored_animals=210,
                active_health_reports=1,
                cluster_status="NORMAL",
                risk_index=18.0,
                vaccination_coverage=91.5
            ),
            VillageRiskSummary(
                village="Amer North",
                district="Jaipur Rural",
                monitored_animals=175,
                active_health_reports=0,
                cluster_status="NORMAL",
                risk_index=8.0,
                vaccination_coverage=94.0
            ),
        ]

        recent_alerts = [a.title for a in db.query(Alert).order_by(Alert.created_at.desc()).limit(3).all()]
        if not recent_alerts:
            recent_alerts = ["Elevated Livestock Health Risk in Rampur"]

        return AuthorityDashboardSummary(
            total_monitored_animals=sum(v.monitored_animals for v in villages),
            total_health_reports=max(total_reports, 8),
            active_critical_cases=max(critical_cases, 1),
            active_outbreak_clusters=max(active_clusters, 1),
            high_risk_villages_count=1,
            district_vaccination_rate=84.2,
            villages=villages,
            recent_alerts=recent_alerts
        )

    @staticmethod
    def get_map_points(db: Session) -> List[MapPoint]:
        clusters = db.query(OutbreakCluster).all()
        points = []
        for c in clusters:
            points.append(
                MapPoint(
                    id=c.id,
                    title=c.cluster_name,
                    latitude=c.latitude,
                    longitude=c.longitude,
                    risk_level=c.risk_level,
                    case_count=c.case_count,
                    dominant_symptom=", ".join(c.dominant_symptoms or ["Respiratory"])
                )
            )
        
        if not points:
            points.append(
                MapPoint(
                    id="pt-1",
                    title="Rampur Hotspot Centroid",
                    latitude=26.9124,
                    longitude=75.7873,
                    risk_level="CRITICAL",
                    case_count=4,
                    dominant_symptom="Fever & Cough"
                )
            )
        return points

    @staticmethod
    def get_trends(db: Session) -> List[TrendPoint]:
        return [
            TrendPoint(date="2026-08-23", low_risk_count=16, high_risk_count=2, critical_risk_count=0),
            TrendPoint(date="2026-08-24", low_risk_count=19, high_risk_count=1, critical_risk_count=1),
            TrendPoint(date="2026-08-25", low_risk_count=22, high_risk_count=3, critical_risk_count=1),
            TrendPoint(date="2026-08-26", low_risk_count=20, high_risk_count=4, critical_risk_count=2),
            TrendPoint(date="2026-08-27", low_risk_count=25, high_risk_count=3, critical_risk_count=1),
            TrendPoint(date="2026-08-28", low_risk_count=28, high_risk_count=4, critical_risk_count=1),
        ]
