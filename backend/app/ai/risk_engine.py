from typing import Dict, Any, List, Optional

class ExplainableRiskEngine:
    """
    PASHURAKSHA AI — Explainable Livestock Health Risk & Early-Warning Engine.
    Implements multi-factorial clinical evaluation with transparent factor attribution.
    """

    MANDATORY_DISCLAIMER = (
        "PASHURAKSHA AI provides AI-assisted health risk assessment and early-warning support. "
        "It does not replace professional veterinary diagnosis or treatment."
    )

    # Base Symptom Weights (Points)
    BASE_SYMPTOM_WEIGHTS = {
        "difficulty_breathing": 26.0,
        "lesions": 24.0,
        "fever": 18.0,
        "salivation": 16.0,
        "nasal_discharge": 12.0,
        "cough": 12.0,
        "diarrhea": 14.0,
        "reduced_milk": 12.0,
        "reduced_appetite": 10.0,
        "lethargy": 10.0,
        "swelling": 10.0,
    }

    # Severity Multipliers
    SEVERITY_MULTIPLIERS = {
        "mild": 1.0,
        "moderate": 1.2,
        "severe": 1.45,
    }

    @classmethod
    def evaluate(
        cls,
        fever: bool = False,
        cough: bool = False,
        nasal_discharge: bool = False,
        reduced_appetite: bool = False,
        diarrhea: bool = False,
        lethargy: bool = False,
        reduced_milk: bool = False,
        difficulty_breathing: bool = False,
        salivation: bool = False,
        lesions: bool = False,
        swelling: bool = False,
        other_symptoms: Optional[str] = None,
        severity: str = "moderate",
        duration_days: int = 1,
        number_of_animals_affected: int = 1,
        vaccination_status: Optional[str] = "Up to date",
        species: Optional[str] = "Cattle (Cow)",
        previous_diseases: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Executes multi-dimensional clinical rule evaluation and returns transparent risk output.
        """
        factors: List[Dict[str, Any]] = []
        raw_score = 0.0

        # 1. Base Symptom Scoring
        symptom_flags = {
            "difficulty_breathing": (difficulty_breathing, "Severe respiratory distress / Dyspnea", "Critical Vitals"),
            "lesions": (lesions, "Vesicles / Ulcerative lesions on mouth, hooves, or teats", "Critical Signs"),
            "fever": (fever, "Elevated body temperature / Systemic fever", "Vitals"),
            "salivation": (salivation, "Excessive drooling / Frothing at mouth", "Critical Signs"),
            "cough": (cough, "Persistent coughing reflex", "Respiratory"),
            "nasal_discharge": (nasal_discharge, "Nasal mucus / Catarrhal discharge", "Respiratory"),
            "diarrhea": (diarrhea, "Loose watery dung / Enteric distress", "Digestive"),
            "reduced_milk": (reduced_milk, "Sudden drop in daily milk yield", "Production"),
            "reduced_appetite": (reduced_appetite, "Loss of appetite / Refusal of fodder", "General State"),
            "lethargy": (lethargy, "Lethargy / Dull demeanor / Weakness", "General State"),
            "swelling": (swelling, "Swelling in submandibular/neck region or lameness", "Physical Signs"),
        }

        for key, (present, label, category) in symptom_flags.items():
            if present:
                weight = cls.BASE_SYMPTOM_WEIGHTS.get(key, 10.0)
                raw_score += weight
                factors.append({
                    "factor": label,
                    "weight_contribution": round(weight, 1),
                    "category": category
                })

        # 2. Synergistic Clinical Pattern Boosts (Dangerous Co-Occurrences)
        possible_diseases: List[str] = []

        # A. Vesicular / FMD-like Syndrome
        if fever and lesions and salivation:
            synergy_weight = 18.0
            raw_score += synergy_weight
            possible_diseases.append("Elevated Vesicular Disease Concern (FMD-like presentation)")
            factors.append({
                "factor": "Synergistic Cluster: Fever + Lesions + Salivation triad",
                "weight_contribution": synergy_weight,
                "category": "Pattern Synergy"
            })
        elif lesions and fever:
            possible_diseases.append("Possible Viral Vesicular / Mucosal Concern")

        # B. Severe Acute Respiratory Complex (BRD-like)
        if fever and (cough or nasal_discharge) and difficulty_breathing:
            synergy_weight = 16.0
            raw_score += synergy_weight
            possible_diseases.append("Acute Bovine Respiratory Complex Concern")
            factors.append({
                "factor": "Synergistic Cluster: High fever with severe respiratory distress",
                "weight_contribution": synergy_weight,
                "category": "Pattern Synergy"
            })
        elif cough and nasal_discharge:
            possible_diseases.append("Possible Upper Respiratory Infection")

        # C. Hemorrhagic / Submandibular Edema Complex (HS-like)
        if fever and swelling and difficulty_breathing:
            synergy_weight = 18.0
            raw_score += synergy_weight
            possible_diseases.append("Elevated Septicemic / Hemorrhagic Distress Concern")
            factors.append({
                "factor": "Synergistic Cluster: Fever + Edema + Acute Respiratory Distress",
                "weight_contribution": synergy_weight,
                "category": "Pattern Synergy"
            })

        # D. Acute Enteric Complex
        if diarrhea and lethargy and reduced_appetite:
            synergy_weight = 12.0
            raw_score += synergy_weight
            possible_diseases.append("Severe Gastrointestinal / Enteric Concern")
            factors.append({
                "factor": "Synergistic Cluster: Acute diarrhea with systemic weakness and anorexia",
                "weight_contribution": synergy_weight,
                "category": "Pattern Synergy"
            })

        if not possible_diseases:
            if raw_score > 0:
                possible_diseases.append("Mild Undifferentiated Clinical Signs")
            else:
                possible_diseases.append("Normal Health Profile — No active clinical symptoms reported")

        # 3. Severity Multiplier
        severity_mult = cls.SEVERITY_MULTIPLIERS.get(severity.lower(), 1.2)
        if severity.lower() == "severe" and raw_score > 0:
            severity_bonus = round(raw_score * 0.25, 1)
            raw_score += severity_bonus
            factors.append({
                "factor": f"Severe acute clinical presentation (Multiplier {severity_mult}x)",
                "weight_contribution": severity_bonus,
                "category": "Clinical Severity"
            })
        elif severity.lower() == "moderate" and raw_score > 0:
            severity_bonus = round(raw_score * 0.1, 1)
            raw_score += severity_bonus
            factors.append({
                "factor": f"Moderate clinical severity (Multiplier {severity_mult}x)",
                "weight_contribution": severity_bonus,
                "category": "Clinical Severity"
            })

        # 4. Duration Escalation Factor
        if duration_days >= 7:
            duration_weight = 12.0
            raw_score += duration_weight
            factors.append({
                "factor": f"Prolonged illness duration ({duration_days} days uninterrupted)",
                "weight_contribution": duration_weight,
                "category": "Chronicity"
            })
        elif duration_days >= 3:
            duration_weight = 6.0
            raw_score += duration_weight
            factors.append({
                "factor": f"Subacute illness duration ({duration_days} days)",
                "weight_contribution": duration_weight,
                "category": "Chronicity"
            })

        # 5. Multi-Animal Spread / Contagion Factor
        if number_of_animals_affected >= 4:
            spread_weight = 16.0
            raw_score += spread_weight
            factors.append({
                "factor": f"Community flock transmission ({number_of_animals_affected} animals showing signs)",
                "weight_contribution": spread_weight,
                "category": "Epidemiology"
            })
        elif number_of_animals_affected > 1:
            spread_weight = 8.0
            raw_score += spread_weight
            factors.append({
                "factor": f"Multiple herd animals affected ({number_of_animals_affected} animals)",
                "weight_contribution": spread_weight,
                "category": "Epidemiology"
            })

        # 6. Vaccination Deficit Factor
        if vaccination_status in ["Overdue", "Never vaccinated"]:
            vac_weight = 12.0
            raw_score += vac_weight
            factors.append({
                "factor": f"Immunity vulnerability ({vaccination_status})",
                "weight_contribution": vac_weight,
                "category": "Immunization Deficit"
            })
        elif vaccination_status == "Due soon":
            vac_weight = 5.0
            raw_score += vac_weight
            factors.append({
                "factor": "Booster vaccination due soon",
                "weight_contribution": vac_weight,
                "category": "Immunization Deficit"
            })

        # 7. Score Normalization (Strictly 0.0 to 100.0)
        normalized_score = min(max(round(raw_score, 1), 0.0), 100.0)

        # 8. Canonical 4-Tier Classification
        if normalized_score >= 80.0:
            risk_level = "CRITICAL"
            recommendation = (
                "Urgent veterinary attention required. Isolate animal immediately in a dry, ventilated shed. "
                "Disinfect feeding troughs and restrict herd movement pending on-site clinical assessment."
            )
        elif normalized_score >= 60.0:
            risk_level = "HIGH"
            recommendation = (
                "Veterinary assessment recommended within 24 hours. Separate affected livestock from the main herd, "
                "ensure constant access to clean water and electrolytes, and monitor body temperature."
            )
        elif normalized_score >= 30.0:
            risk_level = "MODERATE"
            recommendation = (
                "Moderate health concern. Maintain clean fodder, observe appetite and dung consistency, "
                "and record vitals twice daily. Consult a veterinarian if signs persist beyond 48 hours."
            )
        else:
            risk_level = "LOW"
            recommendation = (
                "Routine health monitoring. Animal displays baseline vital parameters. "
                "Maintain standard feeding, hygiene, and scheduled vaccination regimens."
            )

        primary_concern = possible_diseases[0] if possible_diseases else "General Livestock Health Assessment"

        return {
            "risk_score": normalized_score,
            "risk_level": risk_level,
            "disease_risk_score": normalized_score,
            "possible_disease_concern": primary_concern,
            "contributing_factors": factors,
            "recommendation": recommendation,
            "disclaimer": cls.MANDATORY_DISCLAIMER,
        }
