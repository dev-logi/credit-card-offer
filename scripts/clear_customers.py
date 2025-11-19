#!/usr/bin/env python3
"""Script to clear all customer data from the database."""

import sys
import os

# Add project root to path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

from app.database import SessionLocal, init_db
from app.models import Customer, CreditCard, CategoryBonus, Offer

def clear_customer_data():
    """Clear all customer data while preserving template cards and merchants."""
    # Initialize database
    init_db()
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Get counts before deletion
        customer_count = db.query(Customer).count()
        customer_cards = db.query(CreditCard).filter(CreditCard.customer_id.isnot(None)).all()
        customer_card_ids = [card.id for card in customer_cards]
        customer_card_count = len(customer_card_ids)
        
        print(f"📊 Current database state:")
        print(f"   Customers: {customer_count}")
        print(f"   Customer cards: {customer_card_count}")
        
        if customer_count == 0 and customer_card_count == 0:
            print("✅ Database is already clean - no customer data to clear")
            return
        
        # Delete category bonuses for customer cards
        if customer_card_ids:
            bonus_count = db.query(CategoryBonus).filter(
                CategoryBonus.card_id.in_(customer_card_ids)
            ).count()
            db.query(CategoryBonus).filter(
                CategoryBonus.card_id.in_(customer_card_ids)
            ).delete(synchronize_session=False)
            print(f"   Deleted {bonus_count} category bonuses")
            
            # Delete offers for customer cards
            offer_count = db.query(Offer).filter(
                Offer.card_id.in_(customer_card_ids)
            ).count()
            db.query(Offer).filter(
                Offer.card_id.in_(customer_card_ids)
            ).delete(synchronize_session=False)
            print(f"   Deleted {offer_count} offers")
            
            # Delete customer cards
            db.query(CreditCard).filter(
                CreditCard.customer_id.isnot(None)
            ).delete(synchronize_session=False)
            print(f"   Deleted {customer_card_count} customer cards")
        
        # Delete customers
        db.query(Customer).delete(synchronize_session=False)
        print(f"   Deleted {customer_count} customers")
        
        # Commit changes
        db.commit()
        
        # Verify deletion
        remaining_customers = db.query(Customer).count()
        remaining_customer_cards = db.query(CreditCard).filter(
            CreditCard.customer_id.isnot(None)
        ).count()
        template_cards = db.query(CreditCard).filter(
            CreditCard.customer_id.is_(None)
        ).count()
        
        print(f"\n✅ Customer data cleared successfully!")
        print(f"📊 Remaining data:")
        print(f"   Template cards: {template_cards}")
        print(f"   Customers: {remaining_customers}")
        print(f"   Customer cards: {remaining_customer_cards}")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error clearing customer data: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    clear_customer_data()

