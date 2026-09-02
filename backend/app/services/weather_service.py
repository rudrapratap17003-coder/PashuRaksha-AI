"""
Weather and environmental risk service.
Uses synthetic demonstration data for Maharashtra monsoon conditions.
Clearly labeled as prototype data.
"""
import random
from datetime import datetime


class WeatherService:
    # Maharashtra district weather profiles (monsoon season Aug-Sep)
    MAHARASHTRA_WEATHER = {
        "Pune": {"temp_range": (24, 30), "humidity_range": (75, 92), "rainfall_range": (80, 200), "season": "Monsoon"},
        "Nashik": {"temp_range": (22, 28), "humidity_range": (78, 95), "rainfall_range": (100, 250), "season": "Monsoon"},
        "Ahmednagar": {"temp_range": (25, 32), "humidity_range": (70, 88), "rainfall_range": (60, 150), "season": "Monsoon"},
        "Satara": {"temp_range": (21, 27), "humidity_range": (80, 95), "rainfall_range": (150, 350), "season": "Monsoon"},
        "Kolhapur": {"temp_range": (22, 28), "humidity_range": (82, 96), "rainfall_range": (180, 400), "season": "Monsoon"},
        "Solapur": {"temp_range": (26, 34), "humidity_range": (65, 82), "rainfall_range": (40, 100), "season": "Monsoon"},
    }

    @staticmethod
    def get_weather_data(village: str = None, district: str = None) -> dict:
        """Get synthetic weather data for a Maharashtra location."""
        profile = WeatherService.MAHARASHTRA_WEATHER.get(district, WeatherService.MAHARASHTRA_WEATHER["Pune"])

        temp = round(random.uniform(*profile["temp_range"]), 1)
        humidity = round(random.uniform(*profile["humidity_range"]), 1)
        rainfall = round(random.uniform(*profile["rainfall_range"]), 1)

        # Calculate environmental risk score
        env_score = WeatherService._calculate_env_risk(temp, humidity, rainfall)

        return {
            "location": village or district or "Maharashtra",
            "district": district or "Pune",
            "data_source": "Prototype Demonstration Data",
            "temperature_celsius": temp,
            "humidity_percent": humidity,
            "rainfall_mm": rainfall,
            "season": profile["season"],
            "wind_speed_kmh": round(random.uniform(8, 25), 1),
            "conditions": "Overcast with intermittent rain" if rainfall > 100 else "Partly cloudy",
            "seasonal_risk": "High" if humidity > 85 and rainfall > 150 else "Moderate" if humidity > 75 else "Low",
            "environmental_risk_score": env_score,
            "risk_factors": WeatherService._get_risk_factors(temp, humidity, rainfall),
            "advisory": WeatherService._get_advisory(env_score),
            "last_updated": datetime.utcnow().isoformat(),
            "disclaimer": "Synthetic weather data for demonstration purposes only.",
        }

    @staticmethod
    def get_environmental_risk_factors() -> list:
        """Environmental risk factors relevant to livestock health in Maharashtra monsoon."""
        return [
            {
                "factor": "High Humidity (>85%)",
                "impact": "Increased vector breeding (mosquitoes, flies), higher bacterial/fungal proliferation",
                "severity": "High",
                "diseases_affected": ["Foot-and-Mouth Disease", "Mastitis", "Dermatophilosis"],
                "mitigation": "Ensure adequate ventilation in shelters, maintain dry bedding",
            },
            {
                "factor": "Heavy Rainfall & Waterlogging",
                "impact": "Contaminated water sources, waterborne pathogens, fluke transmission",
                "severity": "High",
                "diseases_affected": ["Hemorrhagic Septicemia", "Leptospirosis", "Fasciolosis"],
                "mitigation": "Provide clean drinking water, avoid grazing in waterlogged areas",
            },
            {
                "factor": "Temperature Fluctuation",
                "impact": "Thermal stress, reduced immunity, increased susceptibility to respiratory infections",
                "severity": "Moderate",
                "diseases_affected": ["Bovine Respiratory Disease", "Pneumonia"],
                "mitigation": "Provide shelter from rain and wind, ensure adequate nutrition",
            },
            {
                "factor": "Post-Monsoon Stagnant Water",
                "impact": "Breeding ground for disease vectors, increased snail populations (fluke hosts)",
                "severity": "Moderate",
                "diseases_affected": ["Theileriosis", "Babesiosis", "Trypanosomiasis"],
                "mitigation": "Drain stagnant water, use approved ectoparasite treatments",
            },
            {
                "factor": "Reduced Grazing Quality",
                "impact": "Nutritional stress from reduced forage quality during continuous rain",
                "severity": "Low",
                "diseases_affected": ["General immunosuppression", "Mineral deficiencies"],
                "mitigation": "Supplement feed with mineral mixtures and concentrates",
            },
        ]

    @staticmethod
    def _calculate_env_risk(temp: float, humidity: float, rainfall: float) -> float:
        """Calculate 0-100 environmental risk score."""
        score = 0.0
        # Humidity contribution (max 35 pts)
        if humidity > 90:
            score += 35
        elif humidity > 80:
            score += 25
        elif humidity > 70:
            score += 15
        # Rainfall contribution (max 35 pts)
        if rainfall > 250:
            score += 35
        elif rainfall > 150:
            score += 25
        elif rainfall > 80:
            score += 15
        # Temperature contribution (max 30 pts)
        if temp > 35 or temp < 10:
            score += 30
        elif temp > 32 or temp < 15:
            score += 20
        else:
            score += 10
        return min(score, 100.0)

    @staticmethod
    def _get_risk_factors(temp: float, humidity: float, rainfall: float) -> list:
        factors = []
        if humidity > 85:
            factors.append({"factor": "High Humidity", "value": f"{humidity}%", "impact": "Vector breeding risk"})
        if rainfall > 150:
            factors.append({"factor": "Heavy Rainfall", "value": f"{rainfall}mm", "impact": "Waterborne disease risk"})
        if temp > 32:
            factors.append({"factor": "Heat Stress", "value": f"{temp}°C", "impact": "Thermal stress on livestock"})
        if not factors:
            factors.append({"factor": "Normal Conditions", "value": "Within range", "impact": "Low environmental risk"})
        return factors

    @staticmethod
    def _get_advisory(risk_score: float) -> str:
        if risk_score >= 70:
            return "HIGH ENVIRONMENTAL RISK: Ensure livestock shelters are waterproof, provide clean water, and monitor for respiratory symptoms. Pre-monsoon vaccinations (HS, BQ) should be completed."
        elif risk_score >= 40:
            return "MODERATE RISK: Monitor weather forecasts, maintain dry bedding, and ensure vaccination schedules are up to date."
        return "LOW RISK: Continue routine health monitoring and standard preventive measures."
