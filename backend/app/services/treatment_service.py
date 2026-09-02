"""
Treatment & AI Clinical Advisory Service
Provides standard veterinary treatment protocols, dosage calculation engines,
and official Government of Maharashtra Animal Husbandry Department prescription generator.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime

# Standard Veterinary Disease Treatment Protocols (Approved by Dept. of Animal Husbandry, GoM)
TREATMENT_PROTOCOLS: Dict[str, Dict[str, Any]] = {
    "FMD": {
        "disease_name": "Foot and Mouth Disease (लाळ-खुरकूत)",
        "pathogen_type": "Viral (Aphthovirus)",
        "isolation_protocol": "Strict isolation in dry shed. Disinfect premises with 4% Sodium Carbonate solution.",
        "supportive_care": [
            "Wash oral lesions with 1% Potassium Permanganate (KMnO4) or 2% Sodium Bicarbonate twice daily.",
            "Apply Boroglycerine to oral ulcers to facilitate feeding.",
            "Foot bath with 2% Copper Sulphate or 4% Washing Soda solution.",
            "Apply fly-repellent antiseptic ointment (e.g., Himax / Lorexane) on hoof clefts to prevent maggots.",
            "Feed soft green fodder, gruel (Ambil), and easily digestible mash."
        ],
        "medications": [
            {
                "drug_name": "Meloxicam + Paracetamol Injection (Melonex Plus)",
                "category": "NSAID / Antipyretic",
                "dosage": "0.5 mg/kg body weight",
                "route": "Deep Intramuscular (I/M)",
                "frequency": "Once daily for 3 days",
                "purpose": "Relief of pain, inflammation, and high fever"
            },
            {
                "drug_name": "Enrofloxacin 10% Injection (Fortivir / Enrocin)",
                "category": "Broad Spectrum Antibiotic",
                "dosage": "5 mg/kg body weight",
                "route": "Intramuscular (I/M)",
                "frequency": "Once daily for 3-5 days",
                "purpose": "Prevention of secondary bacterial infection in erosive lesions"
            },
            {
                "drug_name": "B-Complex with Liver Extract (Tribivet / Belamyl)",
                "category": "Supportive Vitamin Supplement",
                "dosage": "5-10 ml depending on body weight",
                "route": "Intramuscular (I/M)",
                "frequency": "Alternate days for 3 doses",
                "purpose": "Appetite stimulation and mucosal epithelial regeneration"
            }
        ],
        "withdrawal_period": {
            "milk": "7 days",
            "meat": "28 days"
        },
        "biosecurity_instructions": "Prohibit animal movement within 10 km ring zone. Dip footwear in disinfectant before entering shed."
    },
    "LSD": {
        "disease_name": "Lumpy Skin Disease (गाठींचा चर्मरोग)",
        "pathogen_type": "Viral (Capripoxvirus)",
        "isolation_protocol": "Immediate vector-proof netting isolation. Control stable flies and ticks.",
        "supportive_care": [
            "Topical application of Neem paste with Turmeric and Camphor on skin nodules.",
            "Clean burst nodules with 0.1% Povidone Iodine solution.",
            "Ensure vector control using Deltamethrin 1.25% EC spray on animal shed."
        ],
        "medications": [
            {
                "drug_name": "Ivermectin 1% Injection (Neomec / Ivomec)",
                "category": "Antiparasitic / Ectoparasiticide",
                "dosage": "0.2 mg/kg (1 ml per 50 kg)",
                "route": "Subcutaneous (S/C)",
                "frequency": "Single dose, repeat after 14 days if needed",
                "purpose": "Ectoparasite control and immune stimulation"
            },
            {
                "drug_name": "Flunixin Meglumine (Megludyne)",
                "category": "Potent Anti-inflammatory",
                "dosage": "1.1 to 2.2 mg/kg body weight",
                "route": "Intramuscular or Slow I/V",
                "frequency": "Once daily for 3 days",
                "purpose": "Relief of acute cutaneous inflammation and edema"
            },
            {
                "drug_name": "Amoxicillin + Cloxacillin (Intamox)",
                "category": "Antibiotic",
                "dosage": "10 mg/kg body weight",
                "route": "Deep I/M",
                "frequency": "Twice daily for 5 days",
                "purpose": "Prevent ulcerated skin secondary suppuration"
            }
        ],
        "withdrawal_period": {
            "milk": "5 days",
            "meat": "21 days"
        },
        "biosecurity_instructions": "Notify District Animal Husbandry Officer. Isolate affected animals for minimum 28 days."
    },
    "DEFAULT": {
        "disease_name": "General Acute Febrile Illness",
        "pathogen_type": "Suspected Infection",
        "isolation_protocol": "Keep animal isolated in well-ventilated dry pen.",
        "supportive_care": [
            "Provide clean, fresh drinking water with electrolytes.",
            "Offer fresh palatable green fodder.",
            "Monitor body temperature twice daily."
        ],
        "medications": [
            {
                "drug_name": "Meloxicam Injection",
                "category": "Antipyretic / Analgesic",
                "dosage": "0.5 mg/kg body weight",
                "route": "Intramuscular (I/M)",
                "frequency": "Once daily for 3 days",
                "purpose": "Fever and pain reduction"
            },
            {
                "drug_name": "Oxytetracycline 200 mg/ml LA",
                "category": "Broad Spectrum Antibiotic",
                "dosage": "20 mg/kg body weight",
                "route": "Deep I/M",
                "frequency": "Single dose (long-acting)",
                "purpose": "Broad-spectrum antimicrobial coverage"
            }
        ],
        "withdrawal_period": {
            "milk": "7 days",
            "meat": "21 days"
        },
        "biosecurity_instructions": "Monitor entire herd for similar symptoms. Report any escalation to local dispensary."
    }
}

class TreatmentService:
    @staticmethod
    def generate_prescription(
        case_id: int,
        animal_id: int,
        disease_code: str = "FMD",
        body_weight_kg: float = 350.0,
        vet_name: str = "Dr. Vivek Kulkarni, B.V.Sc & A.H.",
        reg_number: str = "MSVC-98421",
        clinic_name: str = "Taluka Veterinary Polyclinic, Baramati, Dist. Pune"
    ) -> Dict[str, Any]:
        """Generate a structured veterinary prescription slip with dosage calculations."""
        key = disease_code.upper()
        protocol = TREATMENT_PROTOCOLS.get(key, TREATMENT_PROTOCOLS["DEFAULT"])
        
        # Calculate tailored dosages based on body weight
        custom_meds = []
        for med in protocol["medications"]:
            custom_med = dict(med)
            if "mg/kg" in med["dosage"]:
                # Estimate total volume based on common vial concentration
                if "Meloxicam" in med["drug_name"]:
                    total_mg = 0.5 * body_weight_kg
                    total_ml = round(total_mg / 5.0, 1) # 5 mg/ml
                    custom_med["calculated_dose"] = f"{total_ml} ml ({round(total_mg)} mg)"
                elif "Enrofloxacin" in med["drug_name"]:
                    total_mg = 5.0 * body_weight_kg
                    total_ml = round(total_mg / 100.0, 1) # 100 mg/ml
                    custom_med["calculated_dose"] = f"{total_ml} ml ({round(total_mg)} mg)"
                elif "Flunixin" in med["drug_name"]:
                    total_mg = 1.5 * body_weight_kg
                    total_ml = round(total_mg / 50.0, 1) # 50 mg/ml
                    custom_med["calculated_dose"] = f"{total_ml} ml ({round(total_mg)} mg)"
                elif "Amoxicillin" in med["drug_name"]:
                    total_mg = 10.0 * body_weight_kg
                    custom_med["calculated_dose"] = f"{round(total_mg / 1000, 2)} g vial reconstituted"
                else:
                    custom_med["calculated_dose"] = f"Calculated for {body_weight_kg} kg weight"
            elif "1 ml per 50 kg" in med["dosage"]:
                total_ml = round(body_weight_kg / 50.0, 1)
                custom_med["calculated_dose"] = f"{total_ml} ml S/C"
            else:
                custom_med["calculated_dose"] = med["dosage"]
            custom_meds.append(custom_med)

        prescription = {
            "prescription_id": f"RX-MH-{datetime.now().strftime('%Y%m%d')}-{case_id:04d}",
            "issued_at": datetime.now().isoformat(),
            "veterinarian": {
                "name": vet_name,
                "reg_no": reg_number,
                "polyclinic": clinic_name,
                "state": "Maharashtra"
            },
            "patient": {
                "case_id": case_id,
                "animal_id": animal_id,
                "estimated_weight_kg": body_weight_kg,
            },
            "diagnosis": protocol["disease_name"],
            "pathogen_type": protocol["pathogen_type"],
            "medications": custom_meds,
            "supportive_care": protocol["supportive_care"],
            "isolation_protocol": protocol["isolation_protocol"],
            "withdrawal_period": protocol["withdrawal_period"],
            "biosecurity_instructions": protocol["biosecurity_instructions"],
            "follow_up_days": 3,
            "emergency_contact": "Toll-Free Pashu Sanjeevani: 1962 / Pune Control: 020-25538300"
        }
        return prescription

    @staticmethod
    def get_all_protocols() -> Dict[str, Any]:
        return TREATMENT_PROTOCOLS
