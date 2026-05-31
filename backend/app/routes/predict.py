from fastapi import APIRouter, Depends, HTTPException, status

from ..models.predict import PredictRequest, PredictResponse
from ..services.auth_service import get_current_user
from ..services.ml_service import ml_service

router = APIRouter(prefix="/api/predict", tags=["prediction"])

@router.post("", response_model=PredictResponse)
async def predict_churn(
    request: PredictRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        response = ml_service.predict_churn(request)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference engine failure: {str(e)}"
        )
