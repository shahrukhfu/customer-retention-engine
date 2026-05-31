import os
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any

from ..models.predict import PredictRequest, PredictResponse, RecommendedAction

class MLService:
    def __init__(self):
        self.model = None
        self.preprocessor = None

    def load_artifacts(self, model_path: str, preprocessor_path: str):
        if not os.path.exists(model_path) or not os.path.exists(preprocessor_path):
            raise FileNotFoundError("Model or preprocessor artifacts not found on disk. Run pipeline training first.")
        
        # Add the pipeline directory to sys.path to allow unpickling the preprocessor class
        import sys
        current_dir = os.path.dirname(os.path.abspath(__file__))
        pipeline_dir = os.path.abspath(os.path.join(current_dir, '..', '..', 'pipeline'))
        if pipeline_dir not in sys.path:
            sys.path.append(pipeline_dir)

        self.preprocessor = joblib.load(preprocessor_path)
        self.model = joblib.load(model_path)
        print("ML Model and preprocessor loaded successfully.")


    def predict_churn(self, request: PredictRequest) -> PredictResponse:
        if self.model is None or self.preprocessor is None:
            raise ValueError("ML model not loaded.")

        # Map 'No Service' to 'No' for InternetService to match dataset mapping
        internet_service_mapped = request.InternetService
        if internet_service_mapped == "No Service":
            internet_service_mapped = "No"

        # Create a single-row dataframe for processing
        input_data = pd.DataFrame([{
            'tenure': request.tenure,
            'MonthlyCharges': request.MonthlyCharges,
            'Contract': request.Contract,
            'InternetService': internet_service_mapped
        }])

        # Transform using fitted preprocessor
        X_trans = self.preprocessor.transform(input_data)

        # Run inference
        prob = self.model.predict_proba(X_trans)[0][1]  # Prob of class 1 (Churn)
        prediction = int(self.model.predict(X_trans)[0])

        # Convert to percentage-scale probability (0-100)
        prob_pct = float(prob)

        # Risk profile definitions matching the UI template
        if prob_pct < 0.30:
            risk_profile = "Low Risk Profile"
            recommended_actions = [
                RecommendedAction(title="Auto-renew loyalty credit", icon="redeem", status="active"),
                RecommendedAction(title="Priority Support Escalation", icon="support_agent", status="locked")
            ]
        elif prob_pct < 0.60:
            risk_profile = "Moderate Concern"
            recommended_actions = [
                RecommendedAction(title="Loyalty Survey Incentive", icon="verified_user", status="active"),
                RecommendedAction(title="Discount Extension Plan", icon="redeem", status="active"),
                RecommendedAction(title="Priority Support Escalation", icon="support_agent", status="locked")
            ]
        else:
            risk_profile = "Critical Risk"
            recommended_actions = [
                RecommendedAction(title="Direct Representative Call", icon="phone_in_talk", status="active"),
                RecommendedAction(title="Priority Support Escalation", icon="support_agent", status="active"),
                RecommendedAction(title="20% Bill Credit Offer", icon="redeem", status="active")
            ]

        # Calculate estimated Lifetime Value: tenure * monthly charges * 0.8 (approximate stability factor)
        predicted_ltv = float(request.tenure * request.MonthlyCharges * 0.8)
        if predicted_ltv <= 0:
            predicted_ltv = float(request.MonthlyCharges * 0.8) # Default fallback

        return PredictResponse(
            churn_probability=prob_pct,
            churn_prediction=prediction,
            risk_profile=risk_profile,
            predicted_ltv=predicted_ltv,
            recommended_actions=recommended_actions
        )

ml_service = MLService()
