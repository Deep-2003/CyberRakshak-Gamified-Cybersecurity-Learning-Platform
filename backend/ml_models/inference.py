from pathlib import Path
import joblib


class ScamDetector:
    def __init__(self):
        # Classical Models Directory
        self.classical_models = Path(__file__).parent / "classical_models"

        # Load Models
        self.load_classical_models()

        print("✅ All ML models loaded successfully!")

    def load_classical_models(self):
        self.vectorizer = joblib.load(
            self.classical_models / "tfidf_vectorizer.pkl"
        )

        self.rf_model = joblib.load(
            self.classical_models / "random_forest_model.pkl"
        )

        self.xgb_model = joblib.load(
            self.classical_models / "xgboost_model.pkl"
        )

        self.nb_model = joblib.load(
            self.classical_models / "naive_bayes_model.pkl"
        )

    def predict(self, text: str) -> dict:
        # Transform text
        X = self.vectorizer.transform([text])

        # Individual Predictions
        rf_pred = int(self.rf_model.predict(X)[0])
        xgb_pred = int(self.xgb_model.predict(X)[0])
        nb_pred = int(self.nb_model.predict(X)[0])

        # Probabilities for class 1 (scam)
        rf_prob = float(self.rf_model.predict_proba(X)[0][1])
        xgb_prob = float(self.xgb_model.predict_proba(X)[0][1])
        nb_prob = float(self.nb_model.predict_proba(X)[0][1])

        # Average ensemble probability
        avg_scam_prob = (rf_prob*0.4 + xgb_prob*0.4 + nb_prob*0.2)

        final_is_scam = avg_scam_prob >= 0.5

        # Confidence = certainty of chosen class
        confidence = (
            avg_scam_prob if final_is_scam
            else (1 - avg_scam_prob)
        ) * 100

        return {
            "label": "scam" if final_is_scam else "legitimate",
            "confidence": round(confidence, 2),
            "is_scam": final_is_scam,
            "details": {
                "random_forest_probability": round(rf_prob * 100, 2),
                "xgboost_probability": round(xgb_prob * 100, 2),
                "naive_bayes_probability": round(nb_prob * 100, 2),
                "ensemble_probability": round(avg_scam_prob * 100, 2)
            }
        }


# Singleton
detector = ScamDetector()