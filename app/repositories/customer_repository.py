"""Repository for Customer database operations."""

from typing import Optional
from sqlalchemy.orm import Session
from app.models import Customer, CreditCard
from app.repositories.base_repository import BaseRepository


class CustomerRepository(BaseRepository[Customer]):
    """Repository for customer-related database operations."""
    
    def __init__(self, db: Session):
        super().__init__(Customer, db)
    
    def get_by_email(self, email: str) -> Optional[Customer]:
        """Get customer by email address."""
        return self.db.query(Customer).filter(Customer.email == email).first()
    
    def get_with_cards(self, customer_id: str) -> Optional[Customer]:
        """Get customer with all their credit cards loaded."""
        return self.db.query(Customer).filter(Customer.id == customer_id).first()
    
    def get_customer_cards(self, customer_id: str):
        """Get all credit cards for a customer."""
        customer = self.get_by_id(customer_id)
        return customer.cards if customer else []
    
    def count_cards(self, customer_id: str) -> int:
        """Count number of cards a customer has."""
        customer = self.get_by_id(customer_id)
        return len(customer.cards) if customer else 0

