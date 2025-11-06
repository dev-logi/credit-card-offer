"""Admin endpoints for database management."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import CreditCard, CategoryBonus, MerchantCategory

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/seed-database")
def seed_database(db: Session = Depends(get_db)):
    """
    Seed the database with comprehensive card data.
    WARNING: This should be protected in production!
    """
    # Check if already seeded
    existing_cards = db.query(CreditCard).filter(CreditCard.customer_id == None).count()
    if existing_cards > 0:
        return {
            "status": "already_seeded",
            "message": f"Database already has {existing_cards} template cards",
            "template_cards": existing_cards
        }
    
    # Import seed function
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    
    from scripts.seed.seed_data_comprehensive import seed_comprehensive_data
    
    # Run seeding
    try:
        seed_comprehensive_data(db)
        
        # Count what was seeded
        template_cards = db.query(CreditCard).filter(CreditCard.customer_id == None).count()
        category_bonuses = db.query(CategoryBonus).count()
        merchants = db.query(MerchantCategory).count()
        
        return {
            "status": "success",
            "message": "Database seeded successfully",
            "template_cards": template_cards,
            "category_bonuses": category_bonuses,
            "merchants": merchants
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Seeding failed: {str(e)}")


@router.get("/database-stats")
def get_database_stats(db: Session = Depends(get_db)):
    """Get current database statistics."""
    from app.models import Customer, Offer
    
    template_cards = db.query(CreditCard).filter(CreditCard.customer_id == None).count()
    customer_cards = db.query(CreditCard).filter(CreditCard.customer_id != None).count()
    customers = db.query(Customer).count()
    category_bonuses = db.query(CategoryBonus).count()
    merchants = db.query(MerchantCategory).count()
    offers = db.query(Offer).count()
    
    return {
        "template_cards": template_cards,
        "customer_cards": customer_cards,
        "customers": customers,
        "category_bonuses": category_bonuses,
        "merchants": merchants,
        "offers": offers
    }

