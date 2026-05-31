from pydantic import BaseModel, Field
from typing import List

class PredictRequest(BaseModel):
    tenure: int = Field(..., ge=0, le=100, description="Customer tenure in months")
    MonthlyCharges: float = Field(..., ge=10, le=300, description="Monthly charges amount")
    Contract: str = Field(..., description="Contract type: Month-to-month, One year, Two year")
    InternetService: str = Field(..., description="Internet service type: Fiber optic, DSL, No Service (or No)")

class RecommendedAction(BaseModel):
    title: str
    icon: str
    status: str  # e.g., 'active', 'locked'

class PredictResponse(BaseModel):
    churn_probability: float = Field(..., description="Probability of churn (between 0 and 1)")
    churn_prediction: int = Field(..., description="Binary churn prediction: 0 or 1")
    risk_profile: str = Field(..., description="Risk evaluation level: Low Risk Profile, Moderate Concern, Critical Risk")
    predicted_ltv: float = Field(..., description="Estimated Lifetime Value of the customer")
    recommended_actions: List[RecommendedAction] = Field(..., description="Action items recommendation list")
