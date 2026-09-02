from fastapi import APIRouter, Query
from app.services.nutrition_service import NutritionService
from typing import Dict, Any

router = APIRouter(prefix="/nutrition", tags=["AI Nutrition & Dietary Immunity"])

@router.get("/breeds")
def get_breed_profiles():
    """Retrieve nutritional and immunity profiles for native Maharashtra livestock breeds."""
    return NutritionService.get_all_profiles()

@router.get("/plan")
def get_nutrition_plan(
    breed: str = Query("Khillar"),
    lactation_liters: float = Query(8.0),
    health_condition: str = Query("Recovery"),
    body_weight_kg: float = Query(380.0)
):
    """Generate optimized daily ration with green/dry fodder, mineral mix, and recovery immunity boosters."""
    return NutritionService.get_nutrition_plan(
        breed=breed,
        lactation_liters=lactation_liters,
        health_condition=health_condition,
        body_weight_kg=body_weight_kg
    )
