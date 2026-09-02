from fastapi import APIRouter, Query
from app.services.weather_service import WeatherService

router = APIRouter(prefix="/weather", tags=["Weather & Environment"])

@router.get("")
def get_weather(village: str = Query(None), district: str = Query(None)):
    return WeatherService.get_weather_data(village, district)

@router.get("/risk-factors")
def get_risk_factors():
    return WeatherService.get_environmental_risk_factors()
