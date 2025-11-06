"""Database configuration and session management."""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config.settings import settings

# Use settings from config (supports both SQLite and PostgreSQL)
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

# Configure engine based on database type
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    # SQLite-specific configuration
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args={"check_same_thread": False}  # SQLite specific
    )
    print("🗄️  Using SQLite database")
else:
    # PostgreSQL/MySQL configuration with connection pooling
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,      # Verify connections before using
        pool_size=10,             # Connection pool size
        max_overflow=20,          # Max overflow connections
        pool_recycle=3600,        # Recycle connections after 1 hour
        echo=False                # Set to True for SQL debugging
    )
    print("🗄️  Using PostgreSQL database")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency for FastAPI routes to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables."""
    from app.models import Customer, CreditCard, CategoryBonus, Offer, MerchantCategory
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables initialized")



