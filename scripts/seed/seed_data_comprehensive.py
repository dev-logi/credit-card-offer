"""
Comprehensive seed data with Top 20 credit cards and their actual reward structures.
All data collected from public issuer websites (October 2025).
"""

from datetime import date, timedelta
from sqlalchemy.orm import Session

from app.database import SessionLocal, init_db
from app.models import Customer, CreditCard, CategoryBonus, Offer, MerchantCategory


# Top 20 Popular Credit Cards with Real Reward Structures
COMPREHENSIVE_CARD_DATABASE = [
    # ==================== CASHBACK CARDS ====================
    {
        "id": "amex_blue_cash_preferred",
        "card_name": "American Express Blue Cash Preferred",
        "issuer": "American Express",
        "annual_fee": 95,
        "base_reward_rate": 1.0,
        "reward_type": "cashback",
        "network": "amex",
        "category_bonuses": [
            {"category": "grocery", "reward_rate": 6.0, "cap_per_year": 6000, 
             "notes": "U.S. supermarkets only. After $6k, earns 1%."},
            {"category": "streaming", "reward_rate": 6.0, 
             "notes": "Select U.S. streaming subscriptions"},
            {"category": "gas", "reward_rate": 3.0, "notes": "U.S. gas stations"},
            {"category": "transit", "reward_rate": 3.0, 
             "notes": "Transit including rideshare, parking, tolls, trains, buses"}
        ],
        "source_url": "https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/"
    },
    
    {
        "id": "amex_blue_cash_everyday",
        "card_name": "American Express Blue Cash Everyday",
        "issuer": "American Express",
        "annual_fee": 0,
        "base_reward_rate": 1.0,
        "reward_type": "cashback",
        "network": "amex",
        "category_bonuses": [
            {"category": "grocery", "reward_rate": 3.0, "cap_per_year": 6000, 
             "notes": "U.S. supermarkets. After $6k, earns 1%."},
            {"category": "gas", "reward_rate": 3.0, "notes": "U.S. gas stations"},
            {"category": "online", "reward_rate": 3.0, 
             "notes": "Online retail purchases (U.S. only)"}
        ],
        "source_url": "https://www.americanexpress.com/us/credit-cards/card/blue-cash-everyday/"
    },
    
    {
        "id": "chase_freedom_flex",
        "card_name": "Chase Freedom Flex",
        "issuer": "Chase",
        "annual_fee": 0,
        "base_reward_rate": 1.0,
        "reward_type": "cashback",
        "network": "visa",
        "category_bonuses": [
            {"category": "grocery", "reward_rate": 5.0, 
             "start_date": date(2025, 10, 1), "end_date": date(2025, 12, 31),
             "cap_per_quarter": 1500, "activation_required": "yes",
             "notes": "Q4 2025 rotating category. Must activate."},
            {"category": "dining", "reward_rate": 3.0, 
             "notes": "Restaurants including takeout and eligible delivery"},
            {"category": "drugstore", "reward_rate": 3.0, "notes": "Drugstore purchases"},
            {"category": "travel", "reward_rate": 5.0, 
             "notes": "Travel purchased through Chase Ultimate Rewards"}
        ],
        "source_url": "https://creditcards.chase.com/cash-back-credit-cards/freedom/flex"
    },
    
    {
        "id": "chase_freedom_unlimited",
        "card_name": "Chase Freedom Unlimited",
        "issuer": "Chase",
        "annual_fee": 0,
        "base_reward_rate": 1.5,
        "reward_type": "cashback",
        "network": "visa",
        "category_bonuses": [
            {"category": "dining", "reward_rate": 3.0, 
             "notes": "Restaurants including takeout and delivery"},
            {"category": "drugstore", "reward_rate": 3.0, "notes": "Drugstore purchases"},
            {"category": "travel", "reward_rate": 5.0, 
             "notes": "Travel purchased through Chase Ultimate Rewards"}
        ],
        "source_url": "https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited"
    },
    
    {
        "id": "citi_double_cash",
        "card_name": "Citi Double Cash Card",
        "issuer": "Citi",
        "annual_fee": 0,
        "base_reward_rate": 2.0,
        "reward_type": "cashback",
        "network": "mastercard",
        "category_bonuses": [],  # Flat 2% on everything
        "source_url": "https://www.citi.com/credit-cards/citi-double-cash-credit-card"
    },
    
    {
        "id": "citi_custom_cash",
        "card_name": "Citi Custom Cash Card",
        "issuer": "Citi",
        "annual_fee": 0,
        "base_reward_rate": 1.0,
        "reward_type": "cashback",
        "network": "mastercard",
        "category_bonuses": [
            {"category": "auto_top_category", "reward_rate": 5.0, "cap_per_month": 500,
             "notes": "5% on top eligible category each billing cycle: gas, grocery, restaurants, travel, drugstores, home improvement, fitness clubs, live entertainment, select streaming"}
        ],
        "source_url": "https://www.citi.com/credit-cards/citi-custom-cash-credit-card"
    },
    
    {
        "id": "discover_it_cash_back",
        "card_name": "Discover it Cash Back",
        "issuer": "Discover",
        "annual_fee": 0,
        "base_reward_rate": 1.0,
        "reward_type": "cashback",
        "network": "discover",
        "category_bonuses": [
            {"category": "grocery", "reward_rate": 5.0,
             "start_date": date(2025, 10, 1), "end_date": date(2025, 12, 31),
             "cap_per_quarter": 1500, "activation_required": "yes",
             "notes": "Q4 2025 rotating category. Must activate."},
            {"category": "online", "reward_rate": 5.0,
             "start_date": date(2025, 10, 1), "end_date": date(2025, 12, 31),
             "cap_per_quarter": 1500, "activation_required": "yes",
             "notes": "Q4 2025 rotating category: PayPal and digital wallets"}
        ],
        "source_url": "https://www.discover.com/credit-cards/cash-back/it-card.html"
    },
    
    {
        "id": "capital_one_savor",
        "card_name": "Capital One Savor Cash Rewards",
        "issuer": "Capital One",
        "annual_fee": 95,
        "base_reward_rate": 1.0,
        "reward_type": "cashback",
        "network": "mastercard",
        "category_bonuses": [
            {"category": "dining", "reward_rate": 4.0, 
             "notes": "Restaurants and popular food delivery services"},
            {"category": "entertainment", "reward_rate": 4.0, 
             "notes": "Entertainment purchases"},
            {"category": "streaming", "reward_rate": 4.0, 
             "notes": "Popular streaming services"},
            {"category": "grocery", "reward_rate": 3.0, "notes": "Grocery stores"}
        ],
        "source_url": "https://www.capitalone.com/credit-cards/savor-dining-rewards-credit-card/"
    },
    
    {
        "id": "capital_one_savor_one",
        "card_name": "Capital One SavorOne Cash Rewards",
        "issuer": "Capital One",
        "annual_fee": 0,
        "base_reward_rate": 1.0,
        "reward_type": "cashback",
        "network": "mastercard",
        "category_bonuses": [
            {"category": "dining", "reward_rate": 3.0, "notes": "Dining and food delivery"},
            {"category": "entertainment", "reward_rate": 3.0, "notes": "Entertainment"},
            {"category": "streaming", "reward_rate": 3.0, "notes": "Popular streaming"},
            {"category": "grocery", "reward_rate": 3.0, "notes": "Grocery stores"}
        ],
        "source_url": "https://www.capitalone.com/credit-cards/savorone-dining-rewards-credit-card/"
    },
    
    {
        "id": "wells_fargo_active_cash",
        "card_name": "Wells Fargo Active Cash Card",
        "issuer": "Wells Fargo",
        "annual_fee": 0,
        "base_reward_rate": 2.0,
        "reward_type": "cashback",
        "network": "visa",
        "category_bonuses": [],  # Flat 2% on everything
        "source_url": "https://www.wellsfargo.com/credit-cards/active-cash/"
    },
    
    # ==================== TRAVEL REWARDS CARDS ====================
    {
        "id": "chase_sapphire_preferred",
        "card_name": "Chase Sapphire Preferred Card",
        "issuer": "Chase",
        "annual_fee": 95,
        "base_reward_rate": 1.0,
        "reward_type": "points",
        "network": "visa",
        "points_value": 1.25,  # 25% bonus when redeemed through Chase Travel
        "category_bonuses": [
            {"category": "travel", "reward_rate": 3.0, 
             "notes": "Travel including purchases through Chase Ultimate Rewards"},
            {"category": "dining", "reward_rate": 3.0, 
             "notes": "Dining worldwide, including takeout and delivery"},
            {"category": "streaming", "reward_rate": 3.0, 
             "notes": "Select streaming services"},
            {"category": "online_grocery", "reward_rate": 3.0, 
             "notes": "Online grocery purchases (excluding Target, Walmart)"}
        ],
        "source_url": "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred"
    },
    
    {
        "id": "chase_sapphire_reserve",
        "card_name": "Chase Sapphire Reserve",
        "issuer": "Chase",
        "annual_fee": 550,
        "base_reward_rate": 1.0,
        "reward_type": "points",
        "network": "visa",
        "points_value": 1.5,  # 50% bonus when redeemed through Chase Travel
        "category_bonuses": [
            {"category": "travel", "reward_rate": 5.0, 
             "notes": "Travel purchased through Chase Ultimate Rewards"},
            {"category": "dining", "reward_rate": 3.0, "notes": "Dining worldwide"},
            {"category": "airfare", "reward_rate": 3.0, 
             "notes": "Direct airline purchases (outside of Chase Travel)"},
            {"category": "hotel", "reward_rate": 3.0, 
             "notes": "Hotel stays (outside of Chase Travel)"}
        ],
        "source_url": "https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve"
    },
    
    {
        "id": "amex_gold",
        "card_name": "American Express Gold Card",
        "issuer": "American Express",
        "annual_fee": 250,
        "base_reward_rate": 1.0,
        "reward_type": "points",
        "network": "amex",
        "category_bonuses": [
            {"category": "dining", "reward_rate": 4.0, 
             "notes": "Restaurants worldwide, including takeout and delivery"},
            {"category": "grocery", "reward_rate": 4.0, "cap_per_year": 25000,
             "notes": "U.S. supermarkets. Up to $25k per year, then 1x."},
            {"category": "airfare", "reward_rate": 3.0, 
             "notes": "Flights booked directly with airlines or amextravel.com"}
        ],
        "source_url": "https://www.americanexpress.com/us/credit-cards/card/gold-card/"
    },
    
    {
        "id": "amex_platinum",
        "card_name": "American Express Platinum Card",
        "issuer": "American Express",
        "annual_fee": 695,
        "base_reward_rate": 1.0,
        "reward_type": "points",
        "network": "amex",
        "category_bonuses": [
            {"category": "airfare", "reward_rate": 5.0, 
             "notes": "Flights booked directly with airlines or amextravel.com"},
            {"category": "hotel", "reward_rate": 5.0, 
             "notes": "Hotels booked on amextravel.com"}
        ],
        "source_url": "https://www.americanexpress.com/us/credit-cards/card/platinum/"
    },
    
    {
        "id": "capital_one_venture",
        "card_name": "Capital One Venture Rewards",
        "issuer": "Capital One",
        "annual_fee": 95,
        "base_reward_rate": 2.0,
        "reward_type": "miles",
        "points_value": 1.0,  # Capital One miles worth 1 cent each
        "network": "visa",
        "category_bonuses": [
            {"category": "travel", "reward_rate": 5.0, 
             "notes": "Hotels and rental cars booked through Capital One Travel"}
        ],
        "source_url": "https://www.capitalone.com/credit-cards/venture/"
    },
    
    {
        "id": "capital_one_venture_x",
        "card_name": "Capital One Venture X Rewards",
        "issuer": "Capital One",
        "annual_fee": 395,
        "base_reward_rate": 2.0,
        "reward_type": "miles",
        "points_value": 1.0,  # Capital One miles worth 1 cent each
        "network": "visa",
        "category_bonuses": [
            {"category": "travel", "reward_rate": 10.0, 
             "notes": "Hotels and rental cars booked through Capital One Travel"},
            {"category": "airfare", "reward_rate": 5.0, 
             "notes": "Flights booked through Capital One Travel"}
        ],
        "source_url": "https://www.capitalone.com/credit-cards/venture-x/"
    },
    
    # ==================== NO ANNUAL FEE TRAVEL ====================
    {
        "id": "capital_one_venture_one",
        "card_name": "Capital One VentureOne Rewards",
        "issuer": "Capital One",
        "annual_fee": 0,
        "base_reward_rate": 1.25,
        "reward_type": "miles",
        "points_value": 1.0,  # Capital One miles worth 1 cent each
        "network": "visa",
        "category_bonuses": [],  # Flat rate
        "source_url": "https://www.capitalone.com/credit-cards/ventureone-rewards/"
    },
    
    {
        "id": "bank_of_america_travel_rewards",
        "card_name": "Bank of America Travel Rewards",
        "issuer": "Bank of America",
        "annual_fee": 0,
        "base_reward_rate": 1.5,
        "reward_type": "points",
        "network": "visa",
        "category_bonuses": [],  # Flat rate (can be boosted with Preferred Rewards)
        "source_url": "https://www.bankofamerica.com/credit-cards/products/travel-rewards-credit-card/"
    },
    
    # ==================== BUSINESS CARDS ====================
    {
        "id": "chase_ink_business_preferred",
        "card_name": "Chase Ink Business Preferred",
        "issuer": "Chase",
        "annual_fee": 95,
        "base_reward_rate": 1.0,
        "reward_type": "points",
        "network": "visa",
        "category_bonuses": [
            {"category": "travel", "reward_rate": 3.0, "cap_per_year": 150000,
             "notes": "Travel including hotels, car rentals. $150k annual cap."},
            {"category": "shipping", "reward_rate": 3.0, "cap_per_year": 150000,
             "notes": "Shipping purchases. $150k annual cap."},
            {"category": "advertising", "reward_rate": 3.0, "cap_per_year": 150000,
             "notes": "Internet, cable, phone services. $150k annual cap."},
            {"category": "online_advertising", "reward_rate": 3.0, "cap_per_year": 150000,
             "notes": "Social media and search advertising. $150k annual cap."}
        ],
        "source_url": "https://creditcards.chase.com/business-credit-cards/ink/business-preferred"
    },
    
    {
        "id": "amex_business_gold",
        "card_name": "American Express Business Gold Card",
        "issuer": "American Express",
        "annual_fee": 295,
        "base_reward_rate": 1.0,
        "reward_type": "points",
        "network": "amex",
        "category_bonuses": [
            {"category": "auto_top_2_categories", "reward_rate": 4.0, "cap_per_year": 150000,
             "notes": "4x on top 2 eligible categories each billing cycle: Airfare, advertising, gas, restaurants, shipping, software/hardware. Up to $150k per year."}
        ],
        "source_url": "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-gold-card-amex/"
    }
]


# Comprehensive merchant database
COMPREHENSIVE_MERCHANT_DATABASE = [
    # Grocery
    {"name": "whole foods", "categories": ["grocery", "organic"], 
     "aliases": ["whole foods market", "wfm", "amazon fresh"]},
    {"name": "trader joes", "categories": ["grocery"], 
     "aliases": ["trader joe's", "tj"]},
    {"name": "safeway", "categories": ["grocery"], "aliases": ["safeway store"]},
    {"name": "costco", "categories": ["grocery", "wholesale"], 
     "aliases": ["costco wholesale"],
     "accepted_networks": ["visa"]},  # Costco only accepts Visa!
    {"name": "walmart", "categories": ["retail", "shopping"], 
     "aliases": ["walmart supercenter"],
     "notes": "General merchandise store, not a supermarket"},
    {"name": "target", "categories": ["retail", "shopping"], 
     "aliases": ["target stores"],
     "notes": "General merchandise store, not a supermarket"},
    {"name": "kroger", "categories": ["grocery"], "aliases": []},
    {"name": "publix", "categories": ["grocery"], "aliases": []},
    {"name": "wegmans", "categories": ["grocery"], "aliases": []},
    {"name": "sprouts", "categories": ["grocery", "organic"], 
     "aliases": ["sprouts farmers market"]},
    
    # Dining/Restaurants
    {"name": "chipotle", "categories": ["dining", "restaurant", "fast-casual"], 
     "aliases": ["chipotle mexican grill"]},
    {"name": "starbucks", "categories": ["dining", "coffee"], "aliases": ["sbux"]},
    {"name": "mcdonalds", "categories": ["dining", "fast-food"], 
     "aliases": ["mcdonald's", "mcd"]},
    {"name": "subway", "categories": ["dining", "fast-food"], "aliases": []},
    {"name": "chick-fil-a", "categories": ["dining", "fast-food"], 
     "aliases": ["chick fil a"]},
    {"name": "olive garden", "categories": ["dining", "restaurant"], "aliases": []},
    {"name": "red lobster", "categories": ["dining", "restaurant"], "aliases": []},
    {"name": "panera bread", "categories": ["dining", "fast-casual"], "aliases": ["panera"]},
    {"name": "dunkin", "categories": ["dining", "coffee"], 
     "aliases": ["dunkin donuts", "dunkin'"]},
    {"name": "taco bell", "categories": ["dining", "fast-food"], "aliases": []},
    
    # Gas Stations
    {"name": "shell", "categories": ["gas"], "aliases": ["shell gas", "shell station"]},
    {"name": "chevron", "categories": ["gas"], "aliases": []},
    {"name": "exxon", "categories": ["gas"], "aliases": ["exxonmobil", "mobil"]},
    {"name": "bp", "categories": ["gas"], "aliases": ["british petroleum"]},
    {"name": "arco", "categories": ["gas"], "aliases": []},
    {"name": "76", "categories": ["gas"], "aliases": ["76 gas"]},
    {"name": "circle k", "categories": ["gas", "convenience"], "aliases": []},
    
    # Airlines
    {"name": "delta", "categories": ["travel", "airline", "airfare"], 
     "aliases": ["delta airlines", "delta air lines"]},
    {"name": "united", "categories": ["travel", "airline", "airfare"], 
     "aliases": ["united airlines"]},
    {"name": "american airlines", "categories": ["travel", "airline", "airfare"], 
     "aliases": ["aa"]},
    {"name": "southwest", "categories": ["travel", "airline", "airfare"], 
     "aliases": ["southwest airlines"]},
    {"name": "jetblue", "categories": ["travel", "airline", "airfare"], 
     "aliases": ["jetblue airways"]},
    
    # Hotels
    {"name": "marriott", "categories": ["travel", "hotel"], 
     "aliases": ["marriott hotels", "marriott international"]},
    {"name": "hilton", "categories": ["travel", "hotel"], 
     "aliases": ["hilton hotels"]},
    {"name": "hyatt", "categories": ["travel", "hotel"], "aliases": []},
    {"name": "holiday inn", "categories": ["travel", "hotel"], 
     "aliases": ["holiday inn express"]},
    {"name": "best western", "categories": ["travel", "hotel"], "aliases": []},
    
    # Online Shopping
    {"name": "amazon", "categories": ["shopping", "online"], 
     "aliases": ["amazon.com", "amazon prime"]},
    {"name": "ebay", "categories": ["shopping", "online"], "aliases": ["ebay.com"]},
    {"name": "walmart online", "categories": ["shopping", "online"], 
     "aliases": ["walmart.com"]},
    {"name": "target online", "categories": ["shopping", "online"], 
     "aliases": ["target.com"]},
    
    # Streaming Services
    {"name": "netflix", "categories": ["streaming", "entertainment"], "aliases": []},
    {"name": "hulu", "categories": ["streaming", "entertainment"], "aliases": []},
    {"name": "disney plus", "categories": ["streaming", "entertainment"], 
     "aliases": ["disney+", "disneyplus"]},
    {"name": "spotify", "categories": ["streaming", "entertainment"], "aliases": []},
    {"name": "apple tv", "categories": ["streaming", "entertainment"], 
     "aliases": ["apple tv+"]},
    {"name": "hbo max", "categories": ["streaming", "entertainment"], 
     "aliases": ["max"]},
    {"name": "amazon prime video", "categories": ["streaming", "entertainment"], 
     "aliases": ["prime video"]},
    
    # Transit/Transportation
    {"name": "uber", "categories": ["transit", "rideshare"], "aliases": []},
    {"name": "lyft", "categories": ["transit", "rideshare"], "aliases": []},
    {"name": "parking", "categories": ["transit", "parking"], "aliases": ["parkwhiz", "spothero"]},
    
    # Drugstores
    {"name": "cvs", "categories": ["drugstore", "pharmacy"], 
     "aliases": ["cvs pharmacy"]},
    {"name": "walgreens", "categories": ["drugstore", "pharmacy"], "aliases": []},
    {"name": "rite aid", "categories": ["drugstore", "pharmacy"], "aliases": []},
]


def seed_comprehensive_data(db: Session):
    """
    Seed database with comprehensive card and merchant data (template cards only).
    This version takes a db session and doesn't create customers.
    """
    print("🌱 Seeding comprehensive database...")
    
    # Don't clear customer data - only clear template data
    print("  Clearing existing template data...")
    db.query(CategoryBonus).filter(CategoryBonus.card_id.in_(
        db.query(CreditCard.id).filter(CreditCard.customer_id == None)
    )).delete(synchronize_session=False)
    db.query(Offer).filter(Offer.card_id.in_(
        db.query(CreditCard.id).filter(CreditCard.customer_id == None)
    )).delete(synchronize_session=False)
    db.query(CreditCard).filter(CreditCard.customer_id == None).delete()
    db.query(MerchantCategory).delete()
    db.commit()
    
    # Create all credit cards as TEMPLATES (no customer_id)
    print(f"  Creating {len(COMPREHENSIVE_CARD_DATABASE)} template credit cards...")
    card_count = 0
    bonus_count = 0
    
    for card_data in COMPREHENSIVE_CARD_DATABASE:
        card = CreditCard(
            id=card_data['id'],
            customer_id=None,  # Template card - no customer
            card_name=card_data['card_name'],
            issuer=card_data['issuer'],
            last_four="0000",  # Placeholder for templates
            base_reward_rate=card_data['base_reward_rate'],
            annual_fee=card_data.get('annual_fee', 0),
            reward_type=card_data.get('reward_type', 'cashback'),
            points_value=card_data.get('points_value'),
            network=card_data.get('network')
        )
        db.add(card)
        card_count += 1
        
        # Add category bonuses
        for bonus_data in card_data.get('category_bonuses', []):
            bonus = CategoryBonus(
                card_id=card_data['id'],
                category=bonus_data['category'],
                reward_rate=bonus_data['reward_rate'],
                start_date=bonus_data.get('start_date'),
                end_date=bonus_data.get('end_date'),
                cap_per_year=bonus_data.get('cap_per_year'),
                cap_per_quarter=bonus_data.get('cap_per_quarter'),
                cap_per_month=bonus_data.get('cap_per_month'),
                activation_required=bonus_data.get('activation_required', 'no'),
                notes=bonus_data.get('notes'),
                source_url=card_data.get('source_url'),
                last_verified=date.today()
            )
            db.add(bonus)
            bonus_count += 1
    
    db.commit()
    print(f"  ✅ Created {card_count} template cards with {bonus_count} category bonuses")
    
    # Create merchant categories
    print(f"  Creating {len(COMPREHENSIVE_MERCHANT_DATABASE)} merchant mappings...")
    for merchant_data in COMPREHENSIVE_MERCHANT_DATABASE:
        merchant = MerchantCategory(
            merchant_name=merchant_data['name'],
            categories=merchant_data['categories'],
            aliases=merchant_data.get('aliases', []),
            accepted_networks=merchant_data.get('accepted_networks')
        )
        db.add(merchant)
    
    db.commit()
    print(f"  ✅ Created {len(COMPREHENSIVE_MERCHANT_DATABASE)} merchant mappings")
    print(f"  ✅ Database seeded successfully!")
    
    return {
        "cards": card_count,
        "bonuses": bonus_count,
        "merchants": len(COMPREHENSIVE_MERCHANT_DATABASE)
    }


def seed_comprehensive_database():
    """
    Seed database with comprehensive card and merchant data (standalone version).
    """
    print("🌱 Seeding comprehensive database...")
    
    init_db()
    db = SessionLocal()
    
    try:
        # Clear existing data
        print("  Clearing existing data...")
        db.query(Offer).delete()
        db.query(CategoryBonus).delete()
        db.query(CreditCard).delete()
        db.query(Customer).delete()
        db.query(MerchantCategory).delete()
        db.commit()
        
        # Create sample customer
        print("  Creating sample customer...")
        customer = Customer(
            id="cust_1",
            name="John Doe",
            email="john.doe@example.com"
        )
        db.add(customer)
        db.commit()
        
        # Create all credit cards
        print(f"  Creating {len(COMPREHENSIVE_CARD_DATABASE)} credit cards...")
        card_count = 0
        bonus_count = 0
        
        for card_data in COMPREHENSIVE_CARD_DATABASE:
            card = CreditCard(
                id=card_data['id'],
                customer_id="cust_1",
                card_name=card_data['card_name'],
                issuer=card_data['issuer'],
                last_four="0000",  # Placeholder
                base_reward_rate=card_data['base_reward_rate'],
                annual_fee=card_data.get('annual_fee', 0),
                reward_type=card_data.get('reward_type', 'cashback'),
                points_value=card_data.get('points_value'),
                network=card_data.get('network')
            )
            db.add(card)
            card_count += 1
            
            # Add category bonuses
            for bonus_data in card_data.get('category_bonuses', []):
                bonus = CategoryBonus(
                    card_id=card_data['id'],
                    category=bonus_data['category'],
                    reward_rate=bonus_data['reward_rate'],
                    start_date=bonus_data.get('start_date'),
                    end_date=bonus_data.get('end_date'),
                    cap_per_year=bonus_data.get('cap_per_year'),
                    cap_per_quarter=bonus_data.get('cap_per_quarter'),
                    cap_per_month=bonus_data.get('cap_per_month'),
                    activation_required=bonus_data.get('activation_required', 'no'),
                    notes=bonus_data.get('notes'),
                    source_url=card_data.get('source_url'),
                    last_verified=date.today()
                )
                db.add(bonus)
                bonus_count += 1
        
        db.commit()
        print(f"  ✅ Created {card_count} cards with {bonus_count} category bonuses")
        
        # Create merchant categories
        print(f"  Creating {len(COMPREHENSIVE_MERCHANT_DATABASE)} merchant mappings...")
        for merchant_data in COMPREHENSIVE_MERCHANT_DATABASE:
            merchant = MerchantCategory(
                merchant_name=merchant_data['name'],
                categories=merchant_data['categories'],
                aliases=merchant_data.get('aliases', []),
                accepted_networks=merchant_data.get('accepted_networks')
            )
            db.add(merchant)
        
        db.commit()
        print(f"  ✅ Created {len(COMPREHENSIVE_MERCHANT_DATABASE)} merchant mappings")
        
        # Add some sample offers
        print("  Adding sample time-limited offers...")
        sample_offers = [
            # Example: Special Delta offer for Chase Sapphire Preferred
            # Normally 3x on airfare, offer adds 2x more = 5x total
            Offer(
                card_id="chase_sapphire_preferred",
                description="Limited time: 5x bonus points on Delta flights",
                category="airfare",
                bonus_rate=2.0,  # Adds to 3x category = 5x total
                expiry_date=date.today() + timedelta(days=60)
            ),
            # Example: Special streaming offer
            Offer(
                card_id="chase_sapphire_preferred",
                description="Extra 2x points on streaming services",
                category="streaming",
                bonus_rate=2.0,  # Adds to 3x category = 5x total  
                expiry_date=date.today() + timedelta(days=30)
            ),
        ]
        
        # Note: We don't add an offer for Amex Blue Cash Preferred at Whole Foods
        # because the 6% category bonus is already excellent and an offer would
        # only make sense if it was higher than 6%
        
        for offer in sample_offers:
            db.add(offer)
        db.commit()
        print(f"  ✅ Created {len(sample_offers)} time-limited offers")
        
        print("\n✅ Comprehensive database seeded successfully!")
        print("\n📊 Summary:")
        print(f"  • Customer: {customer.name} ({customer.id})")
        print(f"  • Credit Cards: {card_count}")
        print(f"  • Category Bonuses: {bonus_count}")
        print(f"  • Merchant Mappings: {len(COMPREHENSIVE_MERCHANT_DATABASE)}")
        print(f"  • Special Offers: {len(sample_offers)}")
        
        print("\n🎯 Card Categories:")
        print("  • Cashback Cards: 10")
        print("  • Travel Rewards: 8")
        print("  • Business Cards: 2")
        
        print("\n💡 Try these test cases:")
        print('  1. Grocery: POST /recommend { "customer_id": "cust_1", "merchant_name": "Whole Foods", "purchase_amount": 100 }')
        print('  2. Dining: POST /recommend { "customer_id": "cust_1", "merchant_name": "Chipotle", "purchase_amount": 50 }')
        print('  3. Travel: POST /recommend { "customer_id": "cust_1", "merchant_name": "Delta", "purchase_amount": 500 }')
        print('  4. Gas: POST /recommend { "customer_id": "cust_1", "merchant_name": "Shell", "purchase_amount": 40 }')
        print('  5. Streaming: POST /recommend { "customer_id": "cust_1", "merchant_name": "Netflix", "purchase_amount": 15 }')
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_comprehensive_database()

