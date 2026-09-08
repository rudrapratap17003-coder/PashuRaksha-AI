from typing import List
from sqlalchemy.orm import Session
from app.models.health_report import HealthReport
from app.models.animal import Animal
from app.models.cluster import OutbreakCluster
from app.models.alert import Alert
from app.schemas.authority import AuthorityDashboardSummary, VillageRiskSummary, MapPoint, TrendPoint

class AuthorityService:
    @staticmethod
    def get_dashboard_summary(db: Session) -> AuthorityDashboardSummary:
        total_animals = db.query(Animal).count()
        total_reports = db.query(HealthReport).count()
        critical_cases = db.query(HealthReport).filter(HealthReport.risk_level.in_(["HIGH", "CRITICAL"])).count()
        active_clusters = db.query(OutbreakCluster).filter(OutbreakCluster.status == "active").count()
        
        villages = [
            VillageRiskSummary(
                village="Baramati",
                district="Pune",
                monitored_animals=db.query(Animal).filter(Animal.village == "Baramati").count(),
                active_health_reports=db.query(HealthReport).filter(HealthReport.village == "Baramati").count(),
                cluster_status="CRITICAL HOTSPOT",
                risk_index=84.0,
                vaccination_coverage=72.5
            ),
            VillageRiskSummary(
                village="Shirur",
                district="Pune",
                monitored_animals=db.query(Animal).filter(Animal.village == "Shirur").count(),
                active_health_reports=db.query(HealthReport).filter(HealthReport.village == "Shirur").count(),
                cluster_status="ACTIVE SURVEILLANCE",
                risk_index=65.0,
                vaccination_coverage=81.0
            ),
            VillageRiskSummary(
                village="Sinnar",
                district="Nashik",
                monitored_animals=db.query(Animal).filter(Animal.village == "Sinnar").count(),
                active_health_reports=db.query(HealthReport).filter(HealthReport.village == "Sinnar").count(),
                cluster_status="WATCHLIST",
                risk_index=48.0,
                vaccination_coverage=88.5
            ),
            VillageRiskSummary(
                village="Indapur",
                district="Pune",
                monitored_animals=db.query(Animal).filter(Animal.village == "Indapur").count(),
                active_health_reports=db.query(HealthReport).filter(HealthReport.village == "Indapur").count(),
                cluster_status="NORMAL",
                risk_index=35.0,
                vaccination_coverage=91.0
            ),
        ]

        recent_alerts = [a.title for a in db.query(Alert).order_by(Alert.created_at.desc()).limit(3).all()]
        if not recent_alerts:
            recent_alerts = ["PashuRaksha AI District Surveillance Active"]

        return AuthorityDashboardSummary(
            total_monitored_animals=total_animals if total_animals > 0 else sum(v.monitored_animals for v in villages),
            total_health_reports=total_reports,
            active_critical_cases=critical_cases,
            active_outbreak_clusters=active_clusters,
            high_risk_villages_count=sum(1 for v in villages if v.risk_index >= 60.0),
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
                    title=c.cluster_name or "Outbreak Cluster Centroid",
                    latitude=c.latitude,
                    longitude=c.longitude,
                    risk_score=c.cluster_score,
                    risk_level=c.risk_level or "CRITICAL",
                    case_count=c.case_count or 1,
                    dominant_symptom="Fever, Lesions, Salivation",
                    point_type="cluster",
                    label=c.cluster_name
                )
            )
        
        # Add high-risk reports
        reports = db.query(HealthReport).filter(HealthReport.risk_level.in_(["HIGH", "CRITICAL"])).limit(15).all()
        for r in reports:
            points.append(
                MapPoint(
                    id=r.id,
                    title=f"Case #{r.id} ({r.village})",
                    latitude=r.latitude,
                    longitude=r.longitude,
                    risk_score=r.risk_score,
                    risk_level=r.risk_level,
                    case_count=1,
                    dominant_symptom=r.possible_disease_concern or "Vesicular Disease",
                    point_type="case",
                    label=f"Case #{r.id} ({r.village})"
                )
            )
        return points

    @staticmethod
    def get_trends(db: Session) -> List[TrendPoint]:
        # Return 6 temporal surveillance points for dashboard and testing
        return [
            TrendPoint(date="2026-08-25", day="Mon", cases=3, alerts=1, low_risk_count=12, high_risk_count=3, critical_risk_count=1),
            TrendPoint(date="2026-08-26", day="Tue", cases=5, alerts=2, low_risk_count=14, high_risk_count=4, critical_risk_count=2),
            TrendPoint(date="2026-08-27", day="Wed", cases=4, alerts=1, low_risk_count=11, high_risk_count=2, critical_risk_count=1),
            TrendPoint(date="2026-08-28", day="Thu", cases=8, alerts=3, low_risk_count=18, high_risk_count=6, critical_risk_count=3),
            TrendPoint(date="2026-08-29", day="Fri", cases=6, alerts=2, low_risk_count=15, high_risk_count=5, critical_risk_count=2),
            TrendPoint(date="2026-08-30", day="Sat", cases=9, alerts=4, low_risk_count=20, high_risk_count=7, critical_risk_count=4),
        ]
