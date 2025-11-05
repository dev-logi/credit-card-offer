"""Pytest configuration and fixtures."""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from datetime import date, timedelta

from app.database import Base, get_db
from app.main import app
from app.models import Customer, CreditCard, CategoryBonus, Offer, MerchantCategory


# Use in-memory SQLite for tests
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    """Create a fresh database for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db, request):
    """Create a test client with database override."""
    # Check if sample_merchants fixture is being used in this test
    # If not, create minimal merchant data for the test
    if 'sample_merchants' not in request.fixturenames:
        from app.models import MerchantCategory
        
        # Only add if table is completely empty
        existing = db.query(MerchantCategory).count()
        if existing == 0:
            merchants = [
                MerchantCategory(merchant_name="whole foods", categories=["grocery"], aliases=[]),
                MerchantCategory(merchant_name="chipotle", categories=["dining"], aliases=[]),
                MerchantCategory(merchant_name="shell", categories=["gas"], aliases=[]),
            ]
            db.add_all(merchants)
            db.commit()
    
    def override_get_db():
        try:
            yield db
        finally:
            pass
    
    # Override the dependency
    app.dependency_overrides[get_db] = override_get_db
    
    # Prevent startup events from running
    app.router.on_startup = []
    app.router.on_shutdown = []
    
    with TestClient(app, raise_server_exceptions=True) as test_client:
        yield test_client
    
    # Clean up
    app.dependency_overrides.clear()


@pytest.fixture
def sample_customer(db):
    """Create a sample customer."""
    customer = Customer(
        id="test_cust_1",
        name="Test User",
        email="test@example.com"
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


@pytest.fixture
def sample_cards(db, sample_customer):
    """Create sample credit cards for testing."""
    # Card 1: High grocery bonus
    card1 = CreditCard(
        id="test_card_1",
        customer_id=sample_customer.id,
        card_name="Chase Freedom Flex",
        issuer="Chase",
        last_four="1234",
        base_reward_rate=1.0
    )
    
    # Card 2: Flat 2% cashback
    card2 = CreditCard(
        id="test_card_2",
        customer_id=sample_customer.id,
        card_name="Citi Double Cash",
        issuer="Citi",
        last_four="5678",
        base_reward_rate=2.0
    )
    
    # Card 3: High dining bonus
    card3 = CreditCard(
        id="test_card_3",
        customer_id=sample_customer.id,
        card_name="Amex Gold",
        issuer="American Express",
        last_four="9999",
        base_reward_rate=1.0
    )
    
    db.add_all([card1, card2, card3])
    db.commit()
    
    # Add category bonuses
    bonus1 = CategoryBonus(
        card_id="test_card_1",
        category="grocery",
        reward_rate=5.0
    )
    
    bonus2 = CategoryBonus(
        card_id="test_card_3",
        category="dining",
        reward_rate=4.0
    )
    
    db.add_all([bonus1, bonus2])
    db.commit()
    
    return [card1, card2, card3]


@pytest.fixture
def sample_merchants(db):
    """Create sample merchant mappings."""
    merchants = [
        MerchantCategory(
            merchant_name="whole foods",
            categories=["grocery", "organic"],
            aliases=["whole foods market"]
        ),
        MerchantCategory(
            merchant_name="chipotle",
            categories=["dining", "restaurant"],
            aliases=["chipotle mexican grill"]
        ),
        MerchantCategory(
            merchant_name="shell",
            categories=["gas"],
            aliases=["shell gas station"]
        ),
    ]
    
    for merchant in merchants:
        db.add(merchant)
    db.commit()
    
    return merchants


@pytest.fixture
def sample_offer(db, sample_cards):
    """Create a sample special offer."""
    offer = Offer(
        card_id="test_card_1",
        description="10% cashback at Whole Foods",
        merchant_name="Whole Foods",
        bonus_rate=9.0,  # 1% base + 9% bonus = 10% total
        expiry_date=date.today() + timedelta(days=30)
    )
    db.add(offer)
    db.commit()
    db.refresh(offer)
    return offer


