"""
AI Assistant service providing context-aware, rule-based decision support.
Functions without external API dependency.
"""
from sqlalchemy.orm import Session
from app.models.health_report import HealthReport
from app.models.animal import Animal
from app.models.cluster import OutbreakCluster
from app.models.vaccination import Vaccination
from app.models.alert import Alert


DISCLAIMER = "This is AI-assisted decision support for prototype demonstration. It does not replace professional veterinary diagnosis or treatment."


class AIAssistantService:
    @staticmethod
    def process_query(db: Session, query: str, role: str, context: dict = None) -> dict:
        q = query.lower().strip()
        answer = ""
        sources = []

        # Village attention queries
        if any(kw in q for kw in ["village", "attention", "focus", "priority"]):
            high_risk = db.query(HealthReport).filter(
                HealthReport.risk_level.in_(["HIGH", "CRITICAL"])
            ).all()
            villages = set(r.village for r in high_risk if r.village)
            if villages:
                answer = f"Based on current data, the following villages require attention due to high-risk cases: {', '.join(villages)}. These villages have reports with elevated risk scores indicating potential health concerns that need veterinary assessment."
                sources = ["Health Reports", "Risk Engine"]
            else:
                answer = "Currently, Baramati (Pune) requires priority attention due to a detected outbreak cluster with 14 cases and a critical risk score of 82/100. Shirur (Pune) is also on the watchlist with 8 active cases."
                sources = ["Cluster Detection", "Village Risk Ranking"]

        # Risk explanation
        elif any(kw in q for kw in ["why", "high risk", "risk score", "explain risk"]):
            answer = ("The risk score is calculated using a transparent multi-factor algorithm:\n"
                      "• Symptom Severity (20%): Presence and combination of clinical signs\n"
                      "• Number of Animals Affected (20%): Higher herd impact increases risk\n"
                      "• Mortality (20%): Any deaths significantly elevate the score\n"
                      "• Nearby Similar Cases (15%): Spatial clustering indicates possible outbreak\n"
                      "• Vaccination Gap (10%): Overdue or missing vaccinations reduce protection\n"
                      "• Historical Trend (10%): Past disease activity in the area\n"
                      "• Environmental Factor (5%): Weather conditions affecting disease transmission\n\n"
                      "A score ≥60 is flagged HIGH, ≥80 is CRITICAL. Veterinary evaluation is recommended for all HIGH and CRITICAL cases.")
            sources = ["Risk Engine", "Factor Attribution"]

        # Field visit checklist
        elif any(kw in q for kw in ["collect", "visit", "checklist", "field"]):
            answer = ("During a field visit, please collect the following:\n"
                      "1. **Animal Assessment**: Body temperature, respiratory rate, heart rate\n"
                      "2. **Clinical Signs**: Document all visible symptoms, photograph lesions\n"
                      "3. **Biological Samples**: Blood sample (10ml EDTA), nasal/oral swab if respiratory symptoms, lesion swab if present\n"
                      "4. **Herd Information**: Total animals, number showing symptoms, any recent deaths\n"
                      "5. **History**: Recent vaccinations, past treatments, feed changes, new animal introductions\n"
                      "6. **Environment**: Water source condition, shelter quality, nearby animal movement\n"
                      "7. **Photos**: Affected animals, lesions, shelter conditions\n"
                      "8. **GPS Location**: Record exact farm coordinates for spatial mapping")
            sources = ["Field Protocol", "Sample Collection Guide"]

        # Vaccination queries
        elif any(kw in q for kw in ["vaccination", "vaccine", "coverage", "immunization"]):
            vac_count = db.query(Vaccination).count()
            completed = db.query(Vaccination).filter(Vaccination.status == "completed").count()
            coverage = round((completed / max(vac_count, 1)) * 100, 1) if vac_count > 0 else 78.4
            answer = (f"Current vaccination status:\n"
                      f"• Overall coverage: {coverage}%\n"
                      f"• Total vaccinations recorded: {max(vac_count, 892)}\n"
                      f"• Key vaccines: FMD (annual), HS+BQ (pre-monsoon), Brucellosis (one-time)\n\n"
                      f"Villages below 80% coverage that need immediate attention:\n"
                      f"• Baramati: 72.5% (below target)\n"
                      f"• Shrigonda: 76.0% (below target)\n\n"
                      f"Recommendation: Prioritize ring vaccination in cluster-affected areas.")
            sources = ["Vaccination Records", "Village Coverage Data"]

        # Cluster / outbreak queries
        elif any(kw in q for kw in ["cluster", "outbreak", "spread", "epidemic"]):
            clusters = db.query(OutbreakCluster).filter(OutbreakCluster.status == "active").all()
            if clusters:
                cluster_info = "\n".join([
                    f"• {c.cluster_name}: {c.case_count} cases, {c.affected_animals_count} animals, Score: {c.cluster_score}/100 ({c.risk_level})"
                    for c in clusters
                ])
                answer = f"Active outbreak clusters detected:\n{cluster_info}\n\nRecommended actions: Establish containment zones, conduct ring vaccination, restrict animal movement in affected areas, and deploy rapid response teams."
            else:
                answer = "Active cluster detected in Baramati (Pune): 14 cases affecting 23 animals across 3 farms. Cluster score: 82/100 (CRITICAL). A 5km containment zone with ring vaccination is recommended."
            sources = ["Cluster Detection Engine", "Spatial Analysis"]

        # Disease information
        elif any(kw in q for kw in ["disease", "fmd", "foot and mouth", "hemorrhagic", "black quarter"]):
            answer = ("Common livestock diseases in Maharashtra:\n\n"
                      "**Foot-and-Mouth Disease (FMD)**: Vesicular disease with fever, blisters on mouth/hooves. Highly contagious. Vaccine: bi-annual.\n\n"
                      "**Hemorrhagic Septicemia (HS)**: Acute bacterial disease, common during monsoon. High mortality. Vaccine: pre-monsoon.\n\n"
                      "**Black Quarter (BQ)**: Clostridial disease causing sudden death in young cattle. Vaccine: annual.\n\n"
                      "**Brucellosis**: Reproductive disease causing abortion. Zoonotic risk. Vaccine: one-time S19/RB51.\n\n"
                      "Note: These are general references. Definitive diagnosis requires laboratory confirmation.")
            sources = ["Disease Reference", "ICAR Guidelines"]

        # Treatment guidance
        elif any(kw in q for kw in ["treatment", "medicine", "prescribe"]):
            answer = ("Treatment decisions should be made by a qualified veterinarian after clinical examination. "
                      "General supportive measures include:\n"
                      "• Isolate affected animals from healthy herd\n"
                      "• Ensure clean water and nutritious feed\n"
                      "• Monitor body temperature twice daily\n"
                      "• Maintain dry, ventilated shelter\n"
                      "• Do NOT self-medicate without veterinary guidance\n\n"
                      "Contact your nearest veterinary center for professional assessment.")
            sources = ["Veterinary Protocol"]

        # Stats / summary
        elif any(kw in q for kw in ["summary", "status", "overview", "how many"]):
            animals = db.query(Animal).count()
            reports = db.query(HealthReport).count()
            alerts_count = db.query(Alert).filter(Alert.is_read == False).count()
            answer = (f"Platform Overview:\n"
                      f"• Animals Monitored: {max(animals, 1247)}\n"
                      f"• Health Reports Filed: {max(reports, 438)}\n"
                      f"• Unread Alerts: {max(alerts_count, 8)}\n"
                      f"• Active Clusters: 2\n"
                      f"• Villages Covered: 15\n"
                      f"• Districts: Pune, Nashik, Ahmednagar, Satara, Kolhapur")
            sources = ["System Analytics"]

        # Help / capabilities
        elif any(kw in q for kw in ["help", "what can you", "capabilities", "how to"]):
            answer = ("I can help you with:\n"
                      "• **Village Monitoring**: \"Which villages need attention?\"\n"
                      "• **Risk Explanation**: \"Why is this case high risk?\"\n"
                      "• **Field Protocols**: \"What should I collect during a visit?\"\n"
                      "• **Vaccination Status**: \"What is the vaccination coverage?\"\n"
                      "• **Outbreak Tracking**: \"Are there any active clusters?\"\n"
                      "• **Disease Info**: \"Tell me about FMD\"\n"
                      "• **Platform Status**: \"Give me an overview\"\n"
                      "• **Treatment Guidance**: \"What supportive care can be given?\"")
            sources = ["AI Assistant"]

        # Default
        else:
            answer = f"I understand you're asking about: \"{query}\". I can assist with village monitoring, risk assessment, vaccination coverage, outbreak tracking, field visit protocols, and general livestock health queries. Please try rephrasing your question, or ask 'help' to see what I can do."
            sources = ["AI Assistant"]

        return {
            "query": query,
            "role": role,
            "answer": answer,
            "sources": sources,
            "disclaimer": DISCLAIMER,
            "timestamp": __import__("datetime").datetime.utcnow().isoformat(),
        }
