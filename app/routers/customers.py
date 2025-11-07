"""Customer and credit card management endpoints."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Customer, CreditCard, CategoryBonus, Offer
from app.schemas import (
    CustomerCreate, CustomerResponse,
    CardCreate, CardResponse,
    CategoryBonusCreate, OfferCreate
)

router = APIRouter(prefix="/customers", tags=["customers"])


@router.post("/", response_model=CustomerResponse, status_code=201)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    """Create a new customer."""
    # Check if customer already exists
    existing = db.query(Customer).filter(Customer.id == customer.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Customer already exists")
    
    db_customer = Customer(
        id=customer.id,
        name=customer.name,
        email=customer.email
    )
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer


@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: str, db: Session = Depends(get_db)):
    """Get customer by ID."""
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.get("/{customer_id}/cards", response_model=List[CardResponse])
def get_customer_cards(customer_id: str, db: Session = Depends(get_db)):
    """Get all cards for a customer."""
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer.cards


@router.post("/{customer_id}/cards", response_model=CardResponse, status_code=201)
def add_card_to_customer(
    customer_id: str,
    card: CardCreate,
    db: Session = Depends(get_db)
):
    """Add a credit card to customer with automatic template lookup."""
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Check if card already exists
    existing = db.query(CreditCard).filter(CreditCard.id == card.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Card already exists")
    
    # Look for a template card with the same name (from seeded data)
    template_card = db.query(CreditCard).filter(
        CreditCard.card_name == card.card_name,
        CreditCard.issuer == card.issuer,
        CreditCard.customer_id.is_(None)  # Only match template cards (SQLAlchemy NULL check)
    ).first()
    
    # Create the card with template data if available
    db_card = CreditCard(
        id=card.id,
        customer_id=customer_id,
        card_name=card.card_name,
        issuer=card.issuer,
        last_four=card.last_four,
        base_reward_rate=template_card.base_reward_rate if template_card else card.base_reward_rate,
        network=template_card.network if template_card else None,
        annual_fee=template_card.annual_fee if template_card else 0.0,
        reward_type=template_card.reward_type if template_card else 'cashback',
        points_value=template_card.points_value if template_card else None
    )
    db.add(db_card)
    db.flush()  # Flush to get the card ID before adding bonuses
    
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
            db.add(db_bonus)
    
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
            db.add(db_offer)
    
    db.commit()
    db.refresh(db_card)
    return db_card


@router.post("/{customer_id}/cards/{card_id}/bonuses", status_code=201)
def add_category_bonus(
    customer_id: str,
    card_id: str,
    bonus: CategoryBonusCreate,
    db: Session = Depends(get_db)
):
    """Add a category bonus to a credit card."""
    card = db.query(CreditCard).filter(
        CreditCard.id == card_id,
        CreditCard.customer_id == customer_id
    ).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    db_bonus = CategoryBonus(
        card_id=card_id,
        category=bonus.category,
        reward_rate=bonus.reward_rate,
        start_date=bonus.start_date,
        end_date=bonus.end_date
    )
    db.add(db_bonus)
    db.commit()
    db.refresh(db_bonus)
    return {"message": "Category bonus added successfully"}


@router.post("/{customer_id}/cards/{card_id}/offers", status_code=201)
def add_offer(
    customer_id: str,
    card_id: str,
    offer: OfferCreate,
    db: Session = Depends(get_db)
):
    """Add an offer to a credit card."""
    card = db.query(CreditCard).filter(
        CreditCard.id == card_id,
        CreditCard.customer_id == customer_id
    ).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    db_offer = Offer(
        card_id=card_id,
        description=offer.description,
        merchant_name=offer.merchant_name,
        category=offer.category,
        bonus_rate=offer.bonus_rate,
        expiry_date=offer.expiry_date
    )
    db.add(db_offer)
    db.commit()
    db.refresh(db_offer)
    return {"message": "Offer added successfully"}


