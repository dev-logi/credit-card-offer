"""Repository for Credit Card database operations."""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import CreditCard, CategoryBonus, Offer
from app.repositories.base_repository import BaseRepository


class CardRepository(BaseRepository[CreditCard]):
    """Repository for credit card-related database operations."""
    
    def __init__(self, db: Session):
        super().__init__(CreditCard, db)
    
    def get_by_customer(self, customer_id: str) -> List[CreditCard]:
        """Get all cards for a specific customer."""
        return self.db.query(CreditCard).filter(CreditCard.customer_id == customer_id).all()
    
    def get_template_card(self, card_name: str, issuer: str) -> Optional[CreditCard]:
        """
        Find a template card (one without customer_id or with NULL customer_id)
        that matches the name and issuer.
        """
        return self.db.query(CreditCard).filter(
            CreditCard.card_name == card_name,
            CreditCard.issuer == issuer,
            CreditCard.customer_id.is_(None)
        ).first()
    
    def create_card_with_details(
        self,
        customer_id: str,
        card_data: dict,
        template_card: Optional[CreditCard] = None
    ) -> CreditCard:
        """
        Create a credit card with optional template copying.
        
        If template_card is provided, copies base_reward_rate, network,
        annual_fee, reward_type, points_value, category bonuses, and offers.
        """
        # Create the card with basic info
        db_card = CreditCard(
            id=card_data.get('id'),
            customer_id=customer_id,
            card_name=card_data.get('card_name'),
            issuer=card_data.get('issuer'),
            last_four=card_data.get('last_four', '0000'),
            base_reward_rate=template_card.base_reward_rate if template_card else card_data.get('base_reward_rate', 1.0),
            network=template_card.network if template_card else card_data.get('network'),
            annual_fee=template_card.annual_fee if template_card else card_data.get('annual_fee', 0.0),
            reward_type=template_card.reward_type if template_card else card_data.get('reward_type', 'cashback'),
            points_value=template_card.points_value if template_card else card_data.get('points_value')
        )
        self.db.add(db_card)
        self.db.flush()  # Flush to get the card ID
        
        # Copy category bonuses from template if available
        if template_card and template_card.category_bonuses:
            for template_bonus in template_card.category_bonuses:
                db_bonus = CategoryBonus(
                    card_id=db_card.id,
                    category=template_bonus.category,
                    reward_rate=template_bonus.reward_rate,
                    start_date=template_bonus.start_date,
                    end_date=template_bonus.end_date,
                    cap_per_year=template_bonus.cap_per_year,
                    cap_per_quarter=template_bonus.cap_per_quarter,
                    cap_per_month=template_bonus.cap_per_month,
                    activation_required=template_bonus.activation_required,
                    notes=template_bonus.notes,
                    source_url=template_bonus.source_url,
                    last_verified=template_bonus.last_verified
                )
                self.db.add(db_bonus)
        
        # Copy offers from template if available
        if template_card and template_card.offers:
            for template_offer in template_card.offers:
                db_offer = Offer(
                    card_id=db_card.id,
                    description=template_offer.description,
                    merchant_name=template_offer.merchant_name,
                    category=template_offer.category,
                    bonus_rate=template_offer.bonus_rate,
                    expiry_date=template_offer.expiry_date
                )
                self.db.add(db_offer)
        
        self.db.commit()
        self.db.refresh(db_card)
        return db_card
    
    def get_cards_by_network(self, network: str) -> List[CreditCard]:
        """Get all cards of a specific network."""
        return self.db.query(CreditCard).filter(CreditCard.network == network).all()

