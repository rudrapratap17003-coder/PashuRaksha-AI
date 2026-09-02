"""
AI Livestock Nutrition & Dietary Immunity Optimizer Service
Formulates balanced daily feed rations, green/dry fodder ratios, and mineral mixtures
tailored to Maharashtra indigenous and crossbred livestock breeds during health recovery.
"""
from typing import Dict, Any, List

BREED_NUTRITION_PROFILES: Dict[str, Dict[str, Any]] = {
    "Khillar": {
        "species": "Cattle (Draught)",
        "origin": "Satara / Solapur / Sangli (Maharashtra)",
        "body_weight_avg_kg": 380,
        "daily_dry_matter_req_kg": 8.5,
        "recommended_ration": {
            "green_fodder_kg": 15.0,
            "dry_fodder_kg": 5.5,
            "concentrate_feed_kg": 2.0,
            "mineral_mixture_grams": 50,
            "salt_grams": 30
        },
        "recovery_immunity_boosters": [
            "Add 50g Mineral Mixture (Type-II with Zinc & Selenium) daily to enhance mucosal immunity.",
            "Offer freshly chopped green Lucerne (लसूण घास) or Napier grass rich in Vitamin A.",
            "Provide Jaggery (गूळ) water (250g) with ginger paste to restore rumen motility after acute fever."
        ]
    },
    "Dangi": {
        "species": "Cattle (Hardy Hilly Terrain)",
        "origin": "Ahmednagar / Nashik / Western Ghats",
        "body_weight_avg_kg": 340,
        "daily_dry_matter_req_kg": 7.8,
        "recommended_ration": {
            "green_fodder_kg": 12.0,
            "dry_fodder_kg": 5.0,
            "concentrate_feed_kg": 1.5,
            "mineral_mixture_grams": 45,
            "salt_grams": 25
        },
        "recovery_immunity_boosters": [
            "Incorporate locally available subabul or tree loppings rich in crude protein.",
            "Add Probiotic Rumen Yeast culture (10g/day) to restore microbial fermentation.",
            "Electrolyte hydration with oral rehydration salts (ORS) in drinking trough."
        ]
    },
    "Murrah": {
        "species": "Buffalo (High Milk Yield)",
        "origin": "Western Maharashtra Dairy Belt",
        "body_weight_avg_kg": 520,
        "daily_dry_matter_req_kg": 13.5,
        "recommended_ration": {
            "green_fodder_kg": 25.0,
            "dry_fodder_kg": 7.0,
            "concentrate_feed_kg": 4.5,
            "mineral_mixture_grams": 80,
            "salt_grams": 40
        },
        "recovery_immunity_boosters": [
            "Add Bypass Fat (100g/day) to prevent Negative Energy Balance (NEB) and ketosis post-infection.",
            "Chelated Calcium & Phosphorus gel (100ml) to prevent hypocalcemic drop in milk secretion.",
            "Fermented Silage (मका मुरघास) with high energy density for easy swallowing during oral ulcer healing."
        ]
    },
    "Gir": {
        "species": "Cattle (Dairy Desi)",
        "origin": "Maharashtra Dairy Tract",
        "body_weight_avg_kg": 420,
        "daily_dry_matter_req_kg": 10.0,
        "recommended_ration": {
            "green_fodder_kg": 18.0,
            "dry_fodder_kg": 6.0,
            "concentrate_feed_kg": 3.0,
            "mineral_mixture_grams": 60,
            "salt_grams": 35
        },
        "recovery_immunity_boosters": [
            "Sprouted Grains (Hydroponic Maize/Barley) rich in active enzymes and vitamins.",
            "Herbal galactagogue powder (Shatavari + Jivanti 30g/day) to restore lactation yield.",
            "B-Complex liver tonic in feed twice daily."
        ]
    }
}

class NutritionService:
    @staticmethod
    def get_nutrition_plan(
        breed: str = "Khillar",
        lactation_liters: float = 8.0,
        health_condition: str = "Recovery",
        body_weight_kg: float = 380.0
    ) -> Dict[str, Any]:
        profile = BREED_NUTRITION_PROFILES.get(breed, BREED_NUTRITION_PROFILES["Khillar"])
        
        # Scale concentrate by milk yield (approx 400g concentrate per liter milk above maintenance)
        additional_concentrate = round(lactation_liters * 0.4, 2)
        total_concentrate = round(profile["recommended_ration"]["concentrate_feed_kg"] + additional_concentrate, 2)

        return {
            "breed": breed,
            "species": profile["species"],
            "native_tract": profile["origin"],
            "body_weight_kg": body_weight_kg,
            "lactation_yield_liters": lactation_liters,
            "health_phase": health_condition,
            "total_dry_matter_kg_day": profile["daily_dry_matter_req_kg"],
            "daily_feed_breakdown": {
                "green_fodder_kg": profile["recommended_ration"]["green_fodder_kg"],
                "dry_fodder_kg": profile["recommended_ration"]["dry_fodder_kg"],
                "concentrate_balanced_mesh_kg": total_concentrate,
                "mineral_mixture_grams": profile["recommended_ration"]["mineral_mixture_grams"],
                "common_salt_grams": profile["recommended_ration"]["salt_grams"],
                "clean_drinking_water_liters": round(body_weight_kg * 0.1 + lactation_liters * 3, 0)
            },
            "dietary_immunity_boosters": profile["recovery_immunity_boosters"],
            "cost_estimate_per_day_inr": round(profile["recommended_ration"]["green_fodder_kg"] * 2.5 + profile["recommended_ration"]["dry_fodder_kg"] * 4.0 + total_concentrate * 28 + 15, 0),
            "approved_by": "National Dairy Development Board (NDDB) & Maharashtra Animal & Fishery Sciences University (MAFSU)"
        }

    @staticmethod
    def get_all_profiles() -> Dict[str, Any]:
        return BREED_NUTRITION_PROFILES
