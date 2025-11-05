"""Script to seed the database with sample data."""

from datetime import date, timedelta
from sqlalchemy.orm import Session

from app.database import SessionLocal, init_db
from app.models import Customer, CreditCard, CategoryBonus, Offer, MerchantCategory


def seed_database():
    """Populate database with sample customers, cards, merchants, and offers."""
    print("🌱 Seeding database...")
    
    # Initialize database tables
    init_db()
    
    db = SessionLocal()
    
    try:
        # Clear existing data (optional - comment out to preserve data)
        db.query(Offer).delete()
        db.query(CategoryBonus).delete()
        db.query(CreditCard).delete()
        db.query(Customer).delete()
        db.query(MerchantCategory).delete()
        db.commit()
        
        # 1. Create sample customer
        customer = Customer(
            id="cust_1",
            name="John Doe",
            email="john.doe@example.com"
        )
        db.add(customer)
        
        # 2. Create sample credit cards
        # Chase Freedom Flex - 5% rotating categories
        chase_freedom = CreditCard(
            id="card_1",
            customer_id="cust_1",
            card_name="Chase Freedom Flex",
            issuer="Chase",
            last_four="1234",
            base_reward_rate=1.0
        )
        db.add(chase_freedom)
        
        # Amex Gold - 4x dining and groceries
        amex_gold = CreditCard(
            id="card_2",
            customer_id="cust_1",
            card_name="American Express Gold",
            issuer="American Express",
            last_four="5678",
            base_reward_rate=1.0
        )
        db.add(amex_gold)
        
        # Citi Double Cash - flat 2% on everything
        citi_double = CreditCard(
            id="card_3",
            customer_id="cust_1",
            card_name="Citi Double Cash",
            issuer="Citi",
            last_four="9999",
            base_reward_rate=2.0
        )
        db.add(citi_double)
        
        # Chase Sapphire Preferred - 3x dining and travel
        chase_sapphire = CreditCard(
            id="card_4",
            customer_id="cust_1",
            card_name="Chase Sapphire Preferred",
            issuer="Chase",
            last_four="4321",
            base_reward_rate=1.0
        )
        db.add(chase_sapphire)
        
        db.commit()
        
        # 3. Add category bonuses
        # Chase Freedom Flex - Q4 2025: 5% on grocery
        bonus1 = CategoryBonus(
            card_id="card_1",
            category="grocery",
            reward_rate=5.0,
            start_date=date(2025, 10, 1),
            end_date=date(2025, 12, 31)
        )
        db.add(bonus1)
        
        # Chase Freedom Flex - Q1 2026: 5% on gas
        bonus2 = CategoryBonus(
            card_id="card_1",
            category="gas",
            reward_rate=5.0,
            start_date=date(2026, 1, 1),
            end_date=date(2026, 3, 31)
        )
        db.add(bonus2)
        
        # Amex Gold - 4x on dining (permanent)
        bonus3 = CategoryBonus(
            card_id="card_2",
            category="dining",
            reward_rate=4.0
        )
        db.add(bonus3)
        
        # Amex Gold - 4x on grocery (permanent)
        bonus4 = CategoryBonus(
            card_id="card_2",
            category="grocery",
            reward_rate=4.0
        )
        db.add(bonus4)
        
        # Chase Sapphire Preferred - 3x on dining
        bonus5 = CategoryBonus(
            card_id="card_4",
            category="dining",
            reward_rate=3.0
        )
        db.add(bonus5)
        
        # Chase Sapphire Preferred - 3x on travel
        bonus6 = CategoryBonus(
            card_id="card_4",
            category="travel",
            reward_rate=3.0
        )
        db.add(bonus6)
        
        db.commit()
        
        # 4. Add special offers
        # Chase Freedom: 10% bonus at Whole Foods (limited time)
        offer1 = Offer(
            card_id="card_1",
            description="10% cashback at Whole Foods",
            merchant_name="Whole Foods",
            bonus_rate=9.0,  # Added to 1% base = 10% total
            expiry_date=date.today() + timedelta(days=30)
        )
        db.add(offer1)
        
        # Amex Gold: $10 credit at select restaurants
        offer2 = Offer(
            card_id="card_2",
            description="Extra 2x points on dining this month",
            category="dining",
            bonus_rate=2.0,  # 4x + 2x = 6x total
            expiry_date=date.today() + timedelta(days=15)
        )
        db.add(offer2)
        
        db.commit()
        
        # 5. Add merchant category mappings
        merchants = [
            MerchantCategory(
                merchant_name="whole foods",
                categories=["grocery", "organic"],
                aliases=["whole foods market", "wfm"]
            ),
            MerchantCategory(
                merchant_name="trader joes",
                categories=["grocery"],
                aliases=["trader joe's", "tj"]
            ),
            MerchantCategory(
                merchant_name="safeway",
                categories=["grocery"],
                aliases=[]
            ),
            MerchantCategory(
                merchant_name="costco",
                categories=["grocery", "wholesale"],
                aliases=["costco wholesale"]
            ),
            MerchantCategory(
                merchant_name="chipotle",
                categories=["dining", "restaurant", "fast-casual"],
                aliases=["chipotle mexican grill"]
            ),
            MerchantCategory(
                merchant_name="starbucks",
                categories=["dining", "coffee"],
                aliases=["sbux"]
            ),
            MerchantCategory(
                merchant_name="mcdonalds",
                categories=["dining", "fast-food"],
                aliases=["mcdonald's", "mcd"]
            ),
            MerchantCategory(
                merchant_name="olive garden",
                categories=["dining", "restaurant"],
                aliases=[]
            ),
            MerchantCategory(
                merchant_name="shell",
                categories=["gas"],
                aliases=["shell gas", "shell station"]
            ),
            MerchantCategory(
                merchant_name="chevron",
                categories=["gas"],
                aliases=[]
            ),
            MerchantCategory(
                merchant_name="exxon",
                categories=["gas"],
                aliases=["exxonmobil"]
            ),
            MerchantCategory(
                merchant_name="delta",
                categories=["travel", "airline"],
                aliases=["delta airlines", "delta air lines"]
            ),
            MerchantCategory(
                merchant_name="united",
                categories=["travel", "airline"],
                aliases=["united airlines"]
            ),
            MerchantCategory(
                merchant_name="marriott",
                categories=["travel", "hotel"],
                aliases=["marriott hotels"]
            ),
            MerchantCategory(
                merchant_name="hilton",
                categories=["travel", "hotel"],
                aliases=["hilton hotels"]
            ),
            MerchantCategory(
                merchant_name="amazon",
                categories=["shopping", "online"],
                aliases=["amazon.com"]
            ),
            MerchantCategory(
                merchant_name="target",
                categories=["shopping", "retail"],
                aliases=[]
            ),
            MerchantCategory(
                merchant_name="walmart",
                categories=["shopping", "retail"],
                aliases=[]
            ),
        ]
        
        for merchant in merchants:
            db.add(merchant)
        
        db.commit()
        
        print("✅ Database seeded successfully!")
        print("\n📊 Sample Data Summary:")
        print(f"  • Customer: {customer.name} ({customer.id})")
        print(f"  • Credit Cards: 4")
        print(f"  • Category Bonuses: 6")
        print(f"  • Special Offers: 2")
        print(f"  • Merchant Mappings: {len(merchants)}")
        print("\n💡 Try the recommendation endpoint:")
        print('  POST /recommend with body:')
        print('  {')
        print('    "customer_id": "cust_1",')
        print('    "merchant_name": "Whole Foods",')
        print('    "purchase_amount": 100.00,')
        print('    "top_n": 3')
        print('  }')
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()



