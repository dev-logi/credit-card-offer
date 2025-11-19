"""Pydantic schemas for request/response validation."""

from typing import List, Optional, Dict
from pydantic import BaseModel, validator
from datetime import date


# Request Schemas
class RecommendationRequest(BaseModel):
    """Request for credit card recommendation."""
    customer_id: str
    merchant_name: str
    purchase_amount: Optional[float] = None  # Optional - for pre-purchase planning
    location: Optional[str] = None
    top_n: int = 1
    
    @validator('purchase_amount')
    def amount_must_be_positive(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Purchase amount must be positive')
        return v
    
    @validator('top_n')
    def top_n_must_be_positive(cls, v):
        if v < 1:
            raise ValueError('top_n must be at least 1')
        return v


class CustomerCreate(BaseModel):
    """Schema for creating a customer."""
    id: str
    name: str
    email: str


class CardCreate(BaseModel):
    """Schema for creating a credit card."""
    id: str
    card_name: str
    issuer: str
    last_four: str
    base_reward_rate: float = 1.0


class CategoryBonusCreate(BaseModel):
    """Schema for creating a category bonus."""
    category: str
    reward_rate: float
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class OfferCreate(BaseModel):
    """Schema for creating an offer."""
    description: str
    merchant_name: Optional[str] = None
    category: Optional[str] = None
    bonus_rate: float
    expiry_date: Optional[date] = None


# Response Schemas
class CardRecommendation(BaseModel):
    """Individual card recommendation with scoring details."""
    rank: int
    card_id: str
    card_name: str
    last_four: str
    estimated_reward: Optional[float] = None  # Only when purchase_amount provided
    reward_rate: float
    reason: str
    details: str
    comparison: Optional[str] = None  # Why this card beats others
    
    class Config:
        from_attributes = True


class MerchantInfo(BaseModel):
    """Information about identified merchant."""
    merchant_name: str
    identified_categories: List[str]
    confidence: str = "high"


class RecommendationResponse(BaseModel):
    """Response containing card recommendations."""
    recommendations: List[CardRecommendation]
    merchant_info: MerchantInfo


class CustomerResponse(BaseModel):
    """Response for customer data."""
    id: str
    name: str
    email: str
    
    class Config:
        from_attributes = True


class CardResponse(BaseModel):
    """Response for credit card data."""
    id: str
    card_name: str
    issuer: str
    last_four: str
    base_reward_rate: float
    network: Optional[str] = None
    annual_fee: Optional[float] = None
    reward_type: Optional[str] = None
    points_value: Optional[float] = None
    
    class Config:
        from_attributes = True


class NearbyMerchant(BaseModel):
    """Nearby merchant information."""
    name: str
    category: str
    icon: str
    distance: float  # in meters
    address: Optional[str] = None


class NearbyMerchantsResponse(BaseModel):
    """Response containing nearby merchants."""
    merchants: List[NearbyMerchant]
    location: Optional[Dict[str, float]] = None  # {lat, lng}


