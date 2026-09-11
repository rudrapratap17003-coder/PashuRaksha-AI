from pathlib import Path
from typing import Dict, Any

import joblib
import pandas as pd

from app.utils import get_logger

logger = get_logger("ml_prediction_service")


class MLPredictionService:
    """
    Production wrapper around the trained PashuRaksha ML model.

    The model predicts the likelihood of a clinical episode.
    It does NOT diagnose a specific disease.
    """

    MODEL_PATH = (
        Path(__file__).resolve().parents[3]
        / "ml"
        / "models"
        / "pashuraksha_clinical_model.joblib"
    )

    _model = None

    @classmethod
    def load_model(cls):
        """Load the trained model once and reuse it."""

        if cls._model is None:
            if not cls.MODEL_PATH.exists():
                raise FileNotFoundError(
                    f"ML model not found at: {cls.MODEL_PATH}"
                )

            cls._model = joblib.load(cls.MODEL_PATH)

            logger.info(
                f"[ML_MODEL_LOADED] {cls.MODEL_PATH}"
            )

        return cls._model

    @classmethod
    def predict(
        cls,
        *,
        animal,
        report,
    ) -> Dict[str, Any]:
        """
        Predict clinical-episode probability using only
        real observed/registered animal information.

        Missing values are intentionally passed as None.
        The trained preprocessing pipeline handles imputation.
        """

        model = cls.load_model()

        data = {
            # Animal information
            "Calf sex": getattr(animal, "gender", None),
            "Weight": getattr(animal, "weight", None),
            "Breed": getattr(animal, "breed", None),

            # Clinical assessment
            "Girth": getattr(report, "girth", None),
            "Rectal temperature": getattr(
                report,
                "rectal_temperature",
                None,
            ),
            "Famacha score (left)": getattr(
                report,
                "famacha_score_left",
                None,
            ),
            "Famacha score (right)": getattr(
                report,
                "famacha_score_right",
                None,
            ),
            "Elasticity": getattr(
                report,
                "elasticity",
                None,
            ),
            "Consistency of faeces": getattr(
                report,
                "consistency_of_faeces",
                None,
            ),
            "Suckling": getattr(
                report,
                "suckling",
                None,
            ),
            "Grazing": getattr(
                report,
                "grazing",
                None,
            ),
        }

        X = pd.DataFrame([data])

        prediction = int(model.predict(X)[0])

        probability = float(
            model.predict_proba(X)[0][1]
        )

        # Convert probability into an operational risk level.
        if probability >= 0.80:
            risk_level = "CRITICAL"
        elif probability >= 0.60:
            risk_level = "HIGH"
        elif probability >= 0.30:
            risk_level = "MODERATE"
        else:
            risk_level = "LOW"

        animal_id = getattr(
            animal,
            "animal_id",
            "unknown",
        )

        logger.info(
            "[ML_PREDICTION] "
            f"Animal={animal_id} "
            f"Prediction={prediction} "
            f"Probability={probability:.4f} "
            f"Risk={risk_level}"
        )

        return {
            "prediction": prediction,
            "clinical_probability": round(
                probability * 100,
                2,
            ),
            "risk_level": risk_level,
            "model": "PashuRaksha Clinical Episode Random Forest",
            "model_version": "1.0",
        }