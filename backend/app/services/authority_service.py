from typing import List
from app.schemas.authority import AuthorityDashboardSummary, VillageRiskSummary, MapPoint, TrendPoint
from app.services.store import store

class AuthorityService:
    @staticmethod
    def get_dashboard_summary() -> AuthorityDashboardSummary:
        villages = [
            VillageRiskSummary(
                village="Rampur",
                district="Jaipur Rural",
                monitored_animals=142,
                active_health_reports=5,
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
        
        return AuthorityDashboardSummary(
            total_monitored_animals=sum(v.monitored_animals for v in villages),
            total_health_reports=len(store.health_reports),
            active_critical_cases=1,
            active_outbreak_clusters=len(store.clusters),
            high_risk_villages_count=1,
            district_vaccination_rate=84.2,
            villages=villages,
            recent_alerts=[a["title"] for a in list(store.alerts.values())[:3]]
        )

    @staticmethod
    def get_map_points() -> List[MapPoint]:
        return [
            MapPoint(
                id="pt-1",
                title="Rampur Hotspot Centroid",
                latitude=26.9124,
                longitude=75.7873,
                risk_level="CRITICAL",
                case_count=4,
                dominant_symptom="Fever & Cough"
            ),
            MapPoint(
                id="pt-2",
                title="Kalyanpura Observation Post",
                latitude=26.8500,
                longitude=75.7500,
                risk_level="MODERATE",
                case_count=2,
                dominant_symptom="Diarrhea"
            ),
            MapPoint(
                id="pt-3",
                title="Sanganer Center",
                latitude=26.8000,
                longitude=75.8200,
                risk_level="LOW",
                case_count=1,
                dominant_symptom="Routine check"
            ),
        ]

    @staticmethod
    def get_trends() -> List[TrendPoint]:
        return [
            TrendPoint(date="2026-08-22", low_risk_count=18, high_risk_count=1, critical_risk_count=0),
            TrendPoint(date="2026-08-23", low_risk_count=16, high_risk_count=2, critical_risk_count=0),
            TrendPoint(date="2026-08-24", low_risk_count=19, high_risk_count=1, critical_risk_count=1),
            TrendPoint(date="2026-08-25", low_risk_count=22, high_risk_count=3, critical_risk_count=1),
            TrendPoint(date="2026-08-26", low_risk_count=20, high_risk_count=4, critical_risk_count=2),
            TrendPoint(date="2026-08-27", low_risk_count=25, high_risk_count=3, critical_risk_count=1),
        ]
