"""Credit card recommendation endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import RecommendationRequest, RecommendationResponse, MerchantInfo
from app.services.recommendation import RecommendationEngine

router = APIRouter(prefix="/recommend", tags=["recommendations"])


@router.post("/", response_model=RecommendationResponse)
def get_recommendation(
    request: RecommendationRequest,
    db: Session = Depends(get_db)
):
    """
    Get credit card recommendation for a planned purchase.
    
    Given a customer, merchant name, and purchase amount,
    returns the best card(s) to use ranked by estimated rewards.
    """
    engine = RecommendationEngine(db)
    
    # Get recommendations
    recommendations = engine.recommend(
        customer_id=request.customer_id,
        merchant_name=request.merchant_name,
        purchase_amount=request.purchase_amount,
        top_n=request.top_n
    )
    
    if not recommendations:
        raise HTTPException(
            status_code=404,
            detail="No cards found for customer or customer does not exist"
        )
    
    # Get merchant info
    categories = engine.merchant_matcher.match(request.merchant_name)
    confidence = engine.merchant_matcher.get_confidence(request.merchant_name)
    
    return RecommendationResponse(
        recommendations=recommendations,
        merchant_info=MerchantInfo(
            merchant_name=request.merchant_name,
            identified_categories=categories,
            confidence=confidence
        )
    )



