"""SQLAlchemy database models."""

from sqlalchemy import Column, String, Float, Integer, Date, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class Customer(Base):
    """Customer with multiple credit cards."""
    __tablename__ = "customers"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    
    cards = relationship("CreditCard", back_populates="customer", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Customer(id={self.id}, name={self.name})>"


class CreditCard(Base):
    """Credit card with base reward rate and bonuses."""
    __tablename__ = "credit_cards"
    
    id = Column(String, primary_key=True)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=True)  # NULL for template cards
    card_name = Column(String, nullable=False)
    issuer = Column(String, nullable=False)
    last_four = Column(String, nullable=False)
    base_reward_rate = Column(Float, nullable=False, default=1.0)  # 1.0 = 1%
    
    # NEW: Additional card details
    annual_fee = Column(Float, default=0.0)
    reward_type = Column(String, default='cashback')  # 'cashback', 'points', 'miles'
    points_value = Column(Float, nullable=True)  # For points cards (e.g., 1.25 for Sapphire)
    network = Column(String, nullable=True)  # 'visa', 'mastercard', 'amex', 'discover'
    
    customer = relationship("Customer", back_populates="cards")
    category_bonuses = relationship("CategoryBonus", back_populates="card", cascade="all, delete-orphan")
    offers = relationship("Offer", back_populates="card", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<CreditCard(id={self.id}, name={self.card_name})>"


class CategoryBonus(Base):
    """Category-specific reward bonuses for credit cards."""
    __tablename__ = "category_bonuses"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    card_id = Column(String, ForeignKey("credit_cards.id"), nullable=False)
    category = Column(String, nullable=False)
    reward_rate = Column(Float, nullable=False)  # 3.0 = 3%
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    
    # NEW: Spending caps
    cap_per_year = Column(Float, nullable=True)      # Annual spending cap
    cap_per_quarter = Column(Float, nullable=True)   # Quarterly cap
    cap_per_month = Column(Float, nullable=True)     # Monthly cap
    
    # NEW: Special requirements and tracking
    activation_required = Column(String, nullable=True, default='no')  # 'yes', 'no', 'automatic'
    notes = Column(String, nullable=True)
    source_url = Column(String, nullable=True)
    last_verified = Column(Date, nullable=True)
    
    card = relationship("CreditCard", back_populates="category_bonuses")
    
    def __repr__(self):
        return f"<CategoryBonus(category={self.category}, rate={self.reward_rate}%)>"


class Offer(Base):
    """Special offers on credit cards (merchant-specific or category-wide)."""
    __tablename__ = "offers"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    card_id = Column(String, ForeignKey("credit_cards.id"), nullable=False)
    description = Column(String, nullable=False)
    merchant_name = Column(String, nullable=True)  # Specific merchant
    category = Column(String, nullable=True)  # Or category-wide
    bonus_rate = Column(Float, nullable=False)  # Additional % bonus
    expiry_date = Column(Date, nullable=True)
    
    card = relationship("CreditCard", back_populates="offers")
    
    def __repr__(self):
        return f"<Offer(description={self.description}, bonus={self.bonus_rate}%)>"


class MerchantCategory(Base):
    """Merchant to category mapping for merchant identification."""
    __tablename__ = "merchant_categories"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    merchant_name = Column(String, nullable=False, unique=True)
    categories = Column(JSON, nullable=False)  # List of categories
    aliases = Column(JSON, nullable=True)  # Alternative names
    accepted_networks = Column(JSON, nullable=True)  # Accepted card networks: ['visa', 'mastercard', 'amex', 'discover']
    
    def __repr__(self):
        return f"<MerchantCategory(merchant={self.merchant_name}, categories={self.categories})>"


