"""Repository for Recommendation-related database operations."""

from typing import List
from sqlalchemy.orm import Session
from app.models import CreditCard, MerchantCategory


class RecommendationRepository:
    """Repository for fetching data needed for recommendations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_customer_cards(self, customer_id: str) -> List[CreditCard]:
        """Get all active credit cards for a customer."""
        return self.db.query(CreditCard).filter(
            CreditCard.customer_id == customer_id
        ).all()
    
    def get_merchant_categories(self, merchant_name: str) -> List[str]:
        """Get categories for a merchant."""
        merchant = self.db.query(MerchantCategory).filter(
            MerchantCategory.merchant_name.ilike(f'%{merchant_name}%')
        ).first()
        return merchant.categories if merchant else []
    
    def get_merchant_accepted_networks(self, merchant_name: str) -> List[str]:
        """Get accepted networks for a merchant."""
        merchant = self.db.query(MerchantCategory).filter(
            MerchantCategory.merchant_name.ilike(f'%{merchant_name}%')
        ).first()
        return merchant.accepted_networks if merchant and merchant.accepted_networks else []
    
    def get_all_merchants(self) -> List[MerchantCategory]:
        """Get all merchants in the database."""
        return self.db.query(MerchantCategory).all()

