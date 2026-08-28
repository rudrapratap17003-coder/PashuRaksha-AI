import math
from typing import List, Dict, Any, Tuple
from datetime import datetime, timedelta

class OutbreakClusterEngine:
    """
    PASHURAKSHA AI — Spatial-Temporal Outbreak & Cluster Detection Engine.
    Groups individual rural health reports using Great-Circle Haversine distance
    and symptom vector similarity to detect emerging livestock disease hotspots.
    """

    EARTH_RADIUS_KM = 6371.0
    DEFAULT_EPS_KM = 10.0  # Spatial proximity threshold: 10 km
    DEFAULT_TIME_WINDOW_DAYS = 14  # Temporal window: 14 days

    @classmethod
    def haversine_distance(cls, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculates Great-Circle distance in kilometers between two GPS coordinates.
        """
        d_lat = math.radians(lat2 - lat1)
        d_lon = math.radians(lon2 - lon1)
        a = (
            math.sin(d_lat / 2) ** 2
            + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return cls.EARTH_RADIUS_KM * c

    @classmethod
    def detect_clusters(
        cls,
        reports: List[Dict[str, Any]],
        eps_km: float = DEFAULT_EPS_KM,
        min_cases: int = 2,
    ) -> List[Dict[str, Any]]:
        """
        Executes spatial-temporal density grouping across geo-tagged health reports.
        """
        if not reports or len(reports) < min_cases:
            return []

        # Filter valid geo-tagged reports
        valid_reports = [
            r for r in reports
            if r.get("latitude") is not None and r.get("longitude") is not None
        ]

        if len(valid_reports) < min_cases:
            return []

        visited = set()
        clusters = []

        for i, rep in enumerate(valid_reports):
            if i in visited:
                continue

            # Find all neighbors within eps_km
            neighbors = [i]
            for j, other in enumerate(valid_reports):
                if i != j:
                    dist = cls.haversine_distance(
                        rep["latitude"], rep["longitude"],
                        other["latitude"], other["longitude"]
                    )
                    if dist <= eps_km:
                        neighbors.append(j)

            # Check if density threshold is satisfied (>= min_cases reports OR >= 4 affected animals)
            total_affected = sum(valid_reports[idx].get("number_of_animals_affected", 1) for idx in neighbors)
            if len(neighbors) >= min_cases or total_affected >= 4:
                for idx in neighbors:
                    visited.add(idx)

                cluster_reports = [valid_reports[idx] for idx in neighbors]
                cluster_data = cls._synthesize_cluster(cluster_reports)
                clusters.append(cluster_data)

        return clusters

    @classmethod
    def _synthesize_cluster(cls, cluster_reports: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Computes centroid coordinates, radius, dominant symptoms, and containment actions for a cluster.
        """
        case_count = len(cluster_reports)
        total_affected_animals = sum(r.get("number_of_animals_affected", 1) for r in cluster_reports)

        # 1. Centroid calculation (Mean latitude & longitude)
        avg_lat = sum(r["latitude"] for r in cluster_reports) / case_count
        avg_lon = sum(r["longitude"] for r in cluster_reports) / case_count

        # 2. Maximum bounding radius in km
        max_radius = 1.0
        for r in cluster_reports:
            dist = cls.haversine_distance(avg_lat, avg_lon, r["latitude"], r["longitude"])
            if dist > max_radius:
                max_radius = dist
        radius_km = round(max_radius, 2)

        # 3. Aggregate unique affected villages
        villages = list({r.get("village", "Unknown") for r in cluster_reports if r.get("village")})
        primary_village = villages[0] if villages else "Regional Area"

        # 4. Count symptom frequencies to extract top dominant symptoms
        symptom_counts = {
            "Fever": sum(1 for r in cluster_reports if r.get("fever")),
            "Cough": sum(1 for r in cluster_reports if r.get("cough")),
            "Nasal Discharge": sum(1 for r in cluster_reports if r.get("nasal_discharge")),
            "Difficulty Breathing": sum(1 for r in cluster_reports if r.get("difficulty_breathing")),
            "Lesions": sum(1 for r in cluster_reports if r.get("lesions")),
            "Salivation": sum(1 for r in cluster_reports if r.get("salivation")),
            "Diarrhea": sum(1 for r in cluster_reports if r.get("diarrhea")),
            "Reduced Milk": sum(1 for r in cluster_reports if r.get("reduced_milk")),
            "Swelling": sum(1 for r in cluster_reports if r.get("swelling")),
            "Lethargy": sum(1 for r in cluster_reports if r.get("lethargy")),
            "Reduced Appetite": sum(1 for r in cluster_reports if r.get("reduced_appetite")),
        }

        # Filter symptoms observed in at least 1 report, sorted by frequency
        sorted_symptoms = [
            sym for sym, count in sorted(symptom_counts.items(), key=lambda x: x[1], reverse=True)
            if count > 0
        ]
        dominant_symptoms = sorted_symptoms[:4] if sorted_symptoms else ["Undifferentiated Symptoms"]

        # 5. Determine primary disease concern for the cluster
        primary_concern = "Bovine Disease Outbreak Cluster"
        if "Lesions" in dominant_symptoms and "Salivation" in dominant_symptoms:
            primary_concern = "Suspected Vesicular / FMD Outbreak Cluster"
        elif "Difficulty Breathing" in dominant_symptoms and "Swelling" in dominant_symptoms:
            primary_concern = "Suspected Hemorrhagic Septicemia (HS) Outbreak Cluster"
        elif "Difficulty Breathing" in dominant_symptoms and ("Cough" in dominant_symptoms or "Nasal Discharge" in dominant_symptoms):
            primary_concern = "Acute Bovine Respiratory Disease (BRD) Cluster"
        elif "Diarrhea" in dominant_symptoms:
            primary_concern = "Community Enteric / Diarrheal Outbreak Cluster"

        # 6. Calculate aggregate cluster score (0.0 to 100.0)
        avg_case_risk = sum(r.get("risk_score", 50.0) for r in cluster_reports) / case_count
        density_multiplier = min(1.35, 1.0 + (case_count * 0.05) + (total_affected_animals * 0.03))
        cluster_score = round(min(100.0, avg_case_risk * density_multiplier), 1)

        # 7. Cluster risk tier
        if cluster_score >= 80.0:
            risk_level = "CRITICAL"
            recommended_action = (
                f"EMERGENCY CONTAINMENT: Deploy Rapid Veterinary Response Team to {', '.join(villages)}. "
                "Initiate ring vaccination protocol within a 5 km buffer. Restrict inter-village livestock movement "
                "and halt local cattle market operations immediately."
            )
        elif cluster_score >= 60.0:
            risk_level = "HIGH"
            recommended_action = (
                f"HIGH ALERT: Dispatch mobile veterinary inspection unit to {', '.join(villages)}. "
                "Audit local vaccination coverage, sample affected animals for laboratory confirmation, and advise farmers on bio-security."
            )
        elif cluster_score >= 30.0:
            risk_level = "MODERATE"
            recommended_action = (
                f"SURVEILLANCE WATCHLIST: Increase veterinary monitoring in {', '.join(villages)}. "
                "Issue prophylactic advisory to local farmers and review booster vaccination schedules."
            )
        else:
            risk_level = "LOW"
            recommended_action = "Standard periodic surveillance. Maintain routine health monitoring."

        cluster_id = f"clust-{abs(hash(f'{avg_lat}_{avg_lon}_{primary_village}')) % 10000:04d}"
        cluster_name = f"{primary_village} Outbreak Cluster #{cluster_id[-3:]}"

        return {
            "id": cluster_id,
            "cluster_name": cluster_name,
            "disease_concern": primary_concern,
            "latitude": round(avg_lat, 4),
            "longitude": round(avg_lon, 4),
            "radius_km": radius_km,
            "case_count": case_count,
            "affected_animals_count": total_affected_animals,
            "cluster_score": cluster_score,
            "risk_level": risk_level,
            "dominant_symptoms": dominant_symptoms,
            "affected_villages": villages,
            "status": "active",
            "recommended_action": recommended_action,
        }
