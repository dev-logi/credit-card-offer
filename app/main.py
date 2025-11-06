"""Main FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import customers, recommend, admin
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


@app.on_event("startup")
def startup_event():
    """Initialize database on startup."""
    init_db()
    print("✅ Database initialized")


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
            "customers": "/customers"
        }
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}



