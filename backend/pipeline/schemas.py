from pydantic import BaseModel, Field
from typing import Optional

class CustomerInputSchema(BaseModel):
    gender: str = Field(..., description="Gender: Male/Female")
    SeniorCitizen: int = Field(..., description="Senior Citizen status: 0/1")
    Partner: str = Field(..., description="Has partner: Yes/No")
    Dependents: str = Field(..., description="Has dependents: Yes/No")
    tenure: int = Field(..., ge=0, description="Months with company")
    PhoneService: str = Field(..., description="Has phone service: Yes/No")
    MultipleLines: str = Field(..., description="Multiple lines: Yes, No, No phone service")
    InternetService: str = Field(..., description="Internet service type: DSL, Fiber optic, No")
    OnlineSecurity: str = Field(..., description="Online security: Yes, No, No internet service")
    OnlineBackup: str = Field(..., description="Online backup: Yes, No, No internet service")
    DeviceProtection: str = Field(..., description="Device protection: Yes, No, No internet service")
    TechSupport: str = Field(..., description="Tech support: Yes, No, No internet service")
    StreamingTV: str = Field(..., description="Streaming TV: Yes, No, No internet service")
    StreamingMovies: str = Field(..., description="Streaming movies: Yes, No, No internet service")
    Contract: str = Field(..., description="Contract term: Month-to-month, One year, Two year")
    PaperlessBilling: str = Field(..., description="Paperless billing: Yes/No")
    PaymentMethod: str = Field(..., description="Payment method details")
    MonthlyCharges: float = Field(..., ge=0, description="Monthly charges amount")
    TotalCharges: str = Field(..., description="Total charges (can be empty string space)")

class CustomerPredictionInput(BaseModel):
    tenure: int = Field(..., ge=0, description="Months with company")
    MonthlyCharges: float = Field(..., ge=0, description="Monthly charges amount")
    Contract: str = Field(..., description="Contract term: Month-to-month, One year, Two year")
    InternetService: str = Field(..., description="Internet service type: DSL, Fiber optic, No")
