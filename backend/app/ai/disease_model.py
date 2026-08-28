from typing import Dict, Any, List, Optional

class DiseasePatternModel:
    """
    PASHURAKSHA AI — Disease Pattern Recognition & Differential Assessment Engine.
    Evaluates clinical symptom signatures against known epidemiology profiles for livestock diseases.
    """

    MANDATORY_DISCLAIMER = (
        "PASHURAKSHA AI provides AI-assisted health risk assessment and early-warning support. "
        "It does not replace professional veterinary diagnosis or treatment."
    )

    DISEASE_PROFILES = [
        {
            "id": "fmd",
            "name": "Foot-and-Mouth Disease (FMD) Concern",
            "required_symptoms": ["lesions", "salivation"],
            "supporting_symptoms": ["fever", "reduced_milk", "swelling", "lethargy", "reduced_appetite"],
            "species_affinity": ["Cattle (Cow)", "Buffalo", "Goat", "Sheep", "Pig"],
            "weights": {
                "lesions": 30.0,
                "salivation": 25.0,
                "fever": 15.0,
                "reduced_milk": 15.0,
                "swelling": 10.0,
                "reduced_appetite": 5.0,
            },
            "suggested_lab_test": "Vesicular fluid / Epithelial tissue swab for Antigen-ELISA or RT-PCR",
            "urgency": "EMERGENCY — Highly Contagious Notifiable Disease",
            "isolation_protocol": "Immediate mandatory quarantine. Prevent all livestock movement and milk transport."
        },
        {
            "id": "hs",
            "name": "Hemorrhagic Septicemia (HS) Concern",
            "required_symptoms": ["swelling", "difficulty_breathing"],
            "supporting_symptoms": ["fever", "lethargy", "reduced_appetite", "salivation"],
            "species_affinity": ["Buffalo", "Cattle (Cow)"],
            "weights": {
                "swelling": 30.0,
                "difficulty_breathing": 30.0,
                "fever": 20.0,
                "salivation": 10.0,
                "lethargy": 10.0,
            },
            "suggested_lab_test": "Peripheral blood smear examination for bipolar Pasteurella multocida / Blood PCR",
            "urgency": "EMERGENCY — High Mortality Rate in Bovines",
            "isolation_protocol": "Urgent antibiotic therapy under veterinary supervision. Keep head elevated."
        },
        {
            "id": "bq",
            "name": "Black Quarter (BQ) Concern",
            "required_symptoms": ["swelling", "fever"],
            "supporting_symptoms": ["lethargy", "reduced_appetite", "difficulty_breathing"],
            "species_affinity": ["Cattle (Cow)", "Buffalo", "Sheep"],
            "weights": {
                "swelling": 35.0,
                "fever": 25.0,
                "lethargy": 20.0,
                "reduced_appetite": 10.0,
                "difficulty_breathing": 10.0,
            },
            "suggested_lab_test": "Muscle aspirate Gram stain / Direct Fluorescent Antibody Test for Clostridium chauvoei",
            "urgency": "HIGH — Acute Bacterial Toxemia",
            "isolation_protocol": "Isolate from pasture. Prevent other animals grazing in contaminated wet soils."
        },
        {
            "id": "brd",
            "name": "Bovine Respiratory Disease (BRD) Complex",
            "required_symptoms": ["cough", "nasal_discharge"],
            "supporting_symptoms": ["fever", "difficulty_breathing", "reduced_appetite", "lethargy", "reduced_milk"],
            "species_affinity": ["Cattle (Cow)", "Buffalo", "Goat", "Sheep"],
            "weights": {
                "difficulty_breathing": 25.0,
                "nasal_discharge": 20.0,
                "cough": 20.0,
                "fever": 20.0,
                "reduced_appetite": 10.0,
                "lethargy": 5.0,
            },
            "suggested_lab_test": "Nasopharyngeal swab multiplex RT-PCR for BRSV, IBR, Pasteurella & Mannheimia",
            "urgency": "MODERATE TO HIGH — Infectious Respiratory Illness",
            "isolation_protocol": "Relocate to a well-ventilated, dust-free shed. Maintain hydration."
        },
        {
            "id": "mastitis",
            "name": "Acute Mastitis / Udder Infection Concern",
            "required_symptoms": ["reduced_milk"],
            "supporting_symptoms": ["lesions", "swelling", "fever", "lethargy", "reduced_appetite"],
            "species_affinity": ["Cattle (Cow)", "Buffalo", "Goat"],
            "weights": {
                "reduced_milk": 40.0,
                "swelling": 25.0,
                "lesions": 20.0,
                "fever": 15.0,
            },
            "suggested_lab_test": "California Mastitis Test (CMT) & Aseptic Milk Culture with Antibiotic Sensitivity (ABST)",
            "urgency": "MODERATE — Production Loss & Infection Risk",
            "isolation_protocol": "Milk affected quarter last. Disinfect teats pre- and post-milking."
        },
        {
            "id": "enteric",
            "name": "Enteric Diarrheal / Colibacillosis Complex",
            "required_symptoms": ["diarrhea"],
            "supporting_symptoms": ["lethargy", "reduced_appetite", "fever", "difficulty_breathing"],
            "species_affinity": ["Cattle (Cow)", "Buffalo", "Goat", "Sheep", "Pig"],
            "weights": {
                "diarrhea": 45.0,
                "lethargy": 20.0,
                "reduced_appetite": 15.0,
                "fever": 15.0,
                "difficulty_breathing": 5.0,
            },
            "suggested_lab_test": "Fecal floatation for parasites & Fecal ELISA for Rotavirus, Cryptosporidium & E. coli",
            "urgency": "MODERATE TO HIGH — Severe Dehydration Threat",
            "isolation_protocol": "Provide oral rehydration solution (ORS) with electrolytes. Keep bedding dry."
        },
    ]

    @classmethod
    def evaluate_differentials(
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
        species: Optional[str] = "Cattle (Cow)",
        severity: str = "moderate",
        number_of_animals_affected: int = 1,
    ) -> Dict[str, Any]:
        """
        Calculates differential disease match percentages and clinical diagnostic testing referrals.
        """
        active_symptoms = {
            "fever": fever,
            "cough": cough,
            "nasal_discharge": nasal_discharge,
            "reduced_appetite": reduced_appetite,
            "diarrhea": diarrhea,
            "lethargy": lethargy,
            "reduced_milk": reduced_milk,
            "difficulty_breathing": difficulty_breathing,
            "salivation": salivation,
            "lesions": lesions,
            "swelling": swelling,
        }

        total_active_count = sum(1 for v in active_symptoms.values() if v)
        if total_active_count == 0:
            return {
                "primary_disease_match": "Baseline Vitals — No Clinical Signs",
                "primary_confidence": 0.0,
                "differential_matches": [],
                "clinical_summary": "Animal displays no reported clinical symptoms. Continue routine herd management.",
                "disclaimer": cls.MANDATORY_DISCLAIMER,
            }

        differentials = []

        for profile in cls.DISEASE_PROFILES:
            profile_weights = profile["weights"]
            total_possible_weight = sum(profile_weights.values())
            matched_weight = 0.0

            matching_signs = []
            missing_signs = []

            for sym_key, weight in profile_weights.items():
                if active_symptoms.get(sym_key, False):
                    matched_weight += weight
                    matching_signs.append(sym_key.replace('_', ' ').title())
                else:
                    missing_signs.append(sym_key.replace('_', ' ').title())

            # Calculate raw match score
            raw_match_pct = (matched_weight / total_possible_weight) * 100.0

            # Species affinity check
            is_species_matched = any(
                aff.lower() in (species or "").lower() for aff in profile["species_affinity"]
            )
            if not is_species_matched:
                raw_match_pct *= 0.85

            # Multi-animal contagious booster for infectious conditions (FMD / HS / BRD)
            if number_of_animals_affected > 1 and profile["id"] in ["fmd", "hs", "brd"]:
                raw_match_pct = min(100.0, raw_match_pct * 1.1)

            final_match_pct = round(min(max(raw_match_pct, 0.0), 100.0), 1)

            if final_match_pct >= 25.0:
                differentials.append({
                    "disease_id": profile["id"],
                    "disease_name": profile["name"],
                    "match_percentage": final_match_pct,
                    "matching_symptoms": matching_signs,
                    "missing_symptoms": missing_signs,
                    "suggested_diagnostic_test": profile["suggested_lab_test"],
                    "urgency": profile["urgency"],
                    "isolation_protocol": profile["isolation_protocol"],
                })

        # Sort differentials by highest match percentage
        differentials.sort(key=lambda x: x["match_percentage"], reverse=True)

        if differentials:
            top_match = differentials[0]
            summary = (
                f"Clinical indicators show strongest similarity ({top_match['match_percentage']}%) "
                f"with {top_match['disease_name']}. "
                f"Key observed signs: {', '.join(top_match['matching_symptoms'])}. "
                f"Confirmatory testing via '{top_match['suggested_diagnostic_test']}' recommended."
            )
            return {
                "primary_disease_match": top_match["disease_name"],
                "primary_confidence": top_match["match_percentage"],
                "differential_matches": differentials,
                "clinical_summary": summary,
                "disclaimer": cls.MANDATORY_DISCLAIMER,
            }
        else:
            return {
                "primary_disease_match": "Mild Undifferentiated Health Concern",
                "primary_confidence": 30.0,
                "differential_matches": [],
                "clinical_summary": "Symptoms do not match a single hallmark disease pattern. Supportive observation advised.",
                "disclaimer": cls.MANDATORY_DISCLAIMER,
            }
