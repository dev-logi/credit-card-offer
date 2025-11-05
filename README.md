# Credit Card Recommendation Service

A full-stack application that recommends the best credit card to use for any purchase based on rewards, category bonuses, and special offers.

## 🚀 Tech Stack

### Backend
- **FastAPI** (Python) - High-performance web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Database (easily upgradeable to PostgreSQL)
- **Pydantic** - Data validation and settings management

### Frontend
- **React Native** (TypeScript) - Cross-platform mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation library
- **React Native Paper** - Material Design components
- **AsyncStorage** - Local data persistence
- **Axios** - HTTP client

## 📁 Project Structure

```
credit-card-offer/
├── app/                      # FastAPI backend
│   ├── config/               # Configuration and settings
│   │   ├── settings.py       # Pydantic settings
│   │   └── constants.py      # App constants
│   ├── core/                 # Core utilities
│   │   ├── exceptions.py     # Custom exceptions
│   │   └── logging.py        # Logging configuration
│   ├── models.py             # SQLAlchemy models
│   ├── schemas.py            # Pydantic schemas
│   ├── database.py           # Database configuration
│   ├── main.py               # FastAPI app entry point
│   ├── repositories/         # Repository layer (data access)
│   │   ├── base_repository.py
│   │   ├── customer_repository.py
│   │   ├── card_repository.py
│   │   └── recommendation_repository.py
│   ├── routers/              # API endpoints
│   │   ├── customers.py      # Customer & card management
│   │   └── recommend.py      # Recommendation engine
│   └── services/             # Business logic
│       ├── recommendation.py # Recommendation engine
│       └── merchant_matcher.py # Merchant categorization
│
├── mobile-app/               # React Native TypeScript app
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React contexts (Auth)
│   │   ├── hooks/            # Custom hooks
│   │   ├── navigation/       # Navigation configuration
│   │   ├── screens/          # Screen components
│   │   ├── services/         # API services
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Utility functions
│   │   ├── config/           # App configuration
│   │   └── data/             # Static data
│   ├── App.tsx               # App entry point
│   ├── tsconfig.json         # TypeScript configuration
│   └── package.json          # Dependencies
│
├── docs/                     # Documentation
│   ├── api/                  # API documentation
│   ├── mobile/               # Mobile app docs
│   ├── testing/              # Test reports
│   └── guides/               # User guides
│
├── scripts/                  # Utility scripts
│   ├── seed/                 # Database seeding
│   ├── utils/                # Helper scripts
│   └── setup/                # Setup scripts
│
├── tests/                    # Backend tests
│   ├── test_api.py
│   ├── test_merchant_matcher.py
│   └── test_recommendation.py
│
├── credit_cards.db           # SQLite database
├── requirements.txt          # Python dependencies
└── pytest.ini                # Pytest configuration
```

## 🏃 Quick Start

### Backend Setup

1. **Create virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment (optional):**
   ```bash
   # Copy example environment file
   cp .env.example .env
   
   # Edit .env if you want to use PostgreSQL instead of SQLite
   # For local development, the defaults work fine!
   ```

4. **Seed database:**
   ```bash
   python scripts/seed/seed_data_comprehensive.py
   ```

5. **Run server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **Access API documentation:**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Mobile App Setup

1. **Navigate to mobile app:**
   ```bash
   cd mobile-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run on web:**
   ```bash
   npm run web
   ```

4. **Run on iOS simulator:**
   ```bash
   npm run ios
   ```

5. **Run on Android:**
   ```bash
   npm run android
   ```

## 🎯 Features

### Core Features
- ✅ Credit card management for customers
- ✅ Real-time card recommendations based on merchant
- ✅ Category-based rewards calculation
- ✅ Special offers and promotions
- ✅ Network acceptance filtering (Visa/Mastercard/Amex/Discover)
- ✅ Spending cap tracking
- ✅ Comparison of multiple cards

### Mobile App Features
- ✅ User registration and authentication
- ✅ Card selection from 16 popular cards
- ✅ Best card finder by merchant
- ✅ Purchase amount-based recommendations
- ✅ Card portfolio management
- ✅ Profile management with logout

### Backend Features
- ✅ Repository pattern for clean architecture
- ✅ Pydantic settings management
- ✅ Custom exception handling
- ✅ Logging configuration
- ✅ Comprehensive card database with top 20 cards
- ✅ Merchant categorization with fuzzy matching

## 📝 API Endpoints

### Customer Management
- `POST /customers/` - Create new customer
- `GET /customers/{id}` - Get customer details
- `GET /customers/{id}/cards/` - Get all customer cards
- `POST /customers/{id}/cards/` - Add card to customer

### Recommendations
- `POST /recommend/` - Get card recommendations
  ```json
  {
    "customer_id": "cust_123",
    "merchant_name": "Whole Foods",
    "purchase_amount": 100.50,
    "top_n": 3
  }
  ```

## 🗄️ Database

### Supported Databases

- **SQLite** (Default) - Perfect for local development
  - Zero configuration
  - File-based (`credit_cards.db`)
  - Fast and simple
  
- **PostgreSQL** (Production) - For deployment
  - Recommended: Supabase (managed PostgreSQL)
  - Scalable and production-ready
  - Connection pooling included

### Schema

**Tables:**
- `customers` - User accounts
- `credit_cards` - Credit cards owned by customers
- `category_bonuses` - Reward rates by category
- `offers` - Special promotions
- `merchant_categories` - Merchant categorization

**Data:**
- 16 popular credit cards pre-configured
- Real reward structures (6% grocery, 3% dining, etc.)
- Merchant categorization with fuzzy matching
- Network acceptance rules (Visa/Mastercard/Amex/Discover)

## 🧪 Testing

### Run backend tests:
```bash
pytest
```

### Run specific test file:
```bash
pytest tests/test_recommendation.py
```

## 🔧 Configuration

### Backend Configuration

#### Option 1: SQLite (Default - Local Development)
No configuration needed! The app uses SQLite by default. Just run:
```bash
python scripts/seed/seed_data_comprehensive.py
uvicorn app.main:app --reload
```

#### Option 2: PostgreSQL (Production - Supabase)

1. **Create a Supabase project:**
   - Go to https://supabase.com/
   - Create a new project
   - Copy your PostgreSQL connection string

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` with your Supabase credentials:**
   ```bash
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres
   DEBUG=False
   CORS_ORIGINS=["https://your-frontend-domain.com"]
   ```

4. **Install PostgreSQL driver (if not already installed):**
   ```bash
   pip install psycopg2-binary
   ```

5. **Initialize database:**
   ```bash
   python scripts/seed/seed_data_comprehensive.py
   ```

The app automatically detects which database you're using and configures accordingly!

### Mobile App Configuration

Edit `mobile-app/src/config/constants.ts`:
```typescript
export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8000',  // For local development
  // BASE_URL: 'https://your-api.com',  // For production
  TIMEOUT: 10000,
};
```

## 📚 Documentation

- [API Documentation](docs/api/)
- [Mobile App Setup](docs/mobile/)
- [Testing Guide](docs/testing/)
- [User Guides](docs/guides/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- FastAPI for the excellent web framework
- React Native & Expo for cross-platform mobile development
- Credit card issuers for publicly available rewards information

---

**Built with ❤️ using FastAPI and React Native TypeScript**
