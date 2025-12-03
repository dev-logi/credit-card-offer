"""Main FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import customers, recommend, admin, merchants
from app.config.settings import settings

# Create FastAPI app
app = FastAPI(
    title="Credit Card Recommendation Service",
    description="Recommends the best credit card to use for purchases based on rewards and offers",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.DEBUG else settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(customers.router)
app.include_router(recommend.router)
app.include_router(admin.router)
app.include_router(merchants.router)


@app.on_event("startup")
def startup_event():
    """Initialize database on startup and auto-seed if empty."""
    from app.database import SessionLocal, get_db
    from app.models import CreditCard
    from scripts.seed.seed_data_comprehensive import seed_comprehensive_data
    
    # Initialize database tables
    init_db()
    print("✅ Database tables initialized")
    
    # Auto-seed if database is empty (important for ephemeral containers like Railway)
    db = SessionLocal()
    try:
        template_count = db.query(CreditCard).filter(CreditCard.customer_id.is_(None)).count()
        if template_count == 0:
            print("📊 Database is empty, auto-seeding...")
            seed_comprehensive_data(db)
            print("✅ Auto-seed completed")
        else:
            print(f"✅ Database already has {template_count} template cards")
    except Exception as e:
        print(f"⚠️  Auto-seed failed: {e}")
    finally:
        db.close()


@app.get("/")
def root():
    """Root endpoint with service information."""
    return {
        "service": "Credit Card Recommendation Service",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "docs": "/docs",
            "recommend": "/recommend",
            "customers": "/customers",
            "merchants": "/merchants"
        }
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}



# Force redeploy Thu Nov  6 20:28:42 EST 2025
