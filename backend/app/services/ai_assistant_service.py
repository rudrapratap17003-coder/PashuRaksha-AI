import os
import datetime
from sqlalchemy.orm import Session
from app.models.health_report import HealthReport
from app.models.animal import Animal
from app.models.cluster import OutbreakCluster
from app.models.vaccination import Vaccination
from app.models.alert import Alert

try:
    from google import genai
except ImportError:
    genai = None

DISCLAIMER = "This is AI-assisted decision support. It does not replace professional veterinary diagnosis or treatment."

class AIAssistantService:
    @staticmethod
    def get_system_context(db: Session) -> str:
        # Gather live DB stats for RAG context
        animals = db.query(Animal).count()
        reports = db.query(HealthReport).count()
        vac_count = db.query(Vaccination).count()
        completed = db.query(Vaccination).filter(Vaccination.status == "completed").count()
        coverage = round((completed / max(vac_count, 1)) * 100, 1) if vac_count > 0 else 0.0
        
        high_risk = db.query(HealthReport).filter(HealthReport.risk_level.in_(["HIGH", "CRITICAL"])).all()
        high_risk_villages = list(set(r.village for r in high_risk if r.village))
        
        clusters = db.query(OutbreakCluster).filter(OutbreakCluster.status == "active").all()
        cluster_info = ", ".join([f"{c.cluster_name} ({c.case_count} cases)" for c in clusters]) or "None"

        return (
            f"Current System State:\n"
            f"- Total Animals: {animals}\n"
            f"- Total Health Reports: {reports}\n"
            f"- Vaccination Coverage: {coverage}%\n"
            f"- High Risk Villages: {', '.join(high_risk_villages) if high_risk_villages else 'None'}\n"
            f"- Active Outbreak Clusters: {cluster_info}\n"
        )

    @staticmethod
    def process_query(db: Session, query: str, role: str, language: str = "en", context: dict = None) -> dict:
        q = query.strip()
        answer = ""
        sources = ["Pashuraksha AI Engine"]

        system_context = AIAssistantService.get_system_context(db)
        
        lang_instruction = "English"
        if language == "hi":
            lang_instruction = "Hindi (हिन्दी)"
        elif language == "mr":
            lang_instruction = "Marathi (मराठी)"

        system_prompt = (
            f"You are Pashuraksha Copilot, an expert AI veterinary assistant for Maharashtra livestock health.\n"
            f"Your role is: {role}. You must tailor your response to this role (e.g. Farmer vs Authority vs Vet).\n"
            f"CRITICAL: You MUST respond ONLY in {lang_instruction}. Do not mix languages.\n"
            f"If the user asks about system stats, use this live context: {system_context}\n"
            f"Important rules:\n"
            f"1. Be concise, professional, and clear.\n"
            f"2. For severe symptoms, recommend contacting a registered veterinarian.\n"
            f"3. Do not invent medical diagnoses out of thin air, rely on standard epidemiology.\n"
            f"4. Format the response nicely.\n"
        )

        gemini_api_key = os.environ.get("GEMINI_API_KEY")
        if not gemini_api_key and os.environ.get("GOOGLE_API_KEY"):
            gemini_api_key = os.environ.get("GOOGLE_API_KEY")

        if genai and gemini_api_key:
            try:
                client = genai.Client(api_key=gemini_api_key)
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=[
                        {"role": "user", "parts": [{"text": system_prompt + "\n\nUser Query: " + q}]}
                    ]
                )
                answer = response.text
            except Exception as e:
                answer = AIAssistantService._fallback_response(q, lang_instruction)
        else:
            answer = AIAssistantService._fallback_response(q, lang_instruction)

        return {
            "query": query,
            "role": role,
            "answer": answer,
            "sources": sources,
            "disclaimer": DISCLAIMER,
            "timestamp": datetime.datetime.utcnow().isoformat(),
        }

    @staticmethod
    def _fallback_response(query: str, lang_instruction: str) -> str:
        if "Marathi" in lang_instruction:
            return "क्षमस्व, पशुरक्षा सहाय्यक सध्या तात्पुरता अनुपलब्ध आहे. कृपया पुन्हा प्रयत्न करा."
        elif "Hindi" in lang_instruction:
            return "क्षमा करें, पशुरक्षा सहायक अभी अस्थायी रूप से उपलब्ध नहीं है। कृपया फिर से प्रयास करें।"
        else:
            return "Sorry, the Copilot is temporarily unavailable. Please try again."
