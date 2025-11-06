# 🗄️ Supabase PostgreSQL Setup Guide

## Step-by-Step Guide to Migrate from SQLite to PostgreSQL

---

## ✅ What We've Done

- ✅ Added `psycopg2-binary==2.9.9` to `requirements.txt`
- ✅ Updated `app/database.py` to support both SQLite and PostgreSQL
- ✅ Database automatically detects which DB you're using
- ✅ Added connection pooling for PostgreSQL

---

## 🚀 Step 1: Create Supabase Project

### 1.1 Sign Up / Login

Go to: **https://supabase.com/**

- Click "Start your project"
- Sign in with GitHub (recommended)

### 1.2 Create New Project

Click **"New Project"**

Fill in:
- **Name**: `credit-card-service` (or your preferred name)
- **Database Password**: Generate a strong password
  - ⚠️ **SAVE THIS PASSWORD!** You'll need it for the connection string
  - Example: `yourSecurePassword123!`
- **Region**: Choose closest to your location
  - 🇺🇸 US West (Oregon)
  - 🇪🇺 EU Central (Frankfurt)
  - 🇸🇬 Southeast Asia (Singapore)
- **Pricing Plan**: Free (sufficient for development)

Click **"Create new project"**

⏱️ Wait ~2 minutes while Supabase provisions your database

---

## 🔗 Step 2: Get Your Connection String

### 2.1 Navigate to Database Settings

1. In your Supabase project dashboard
2. Click **⚙️ Settings** (bottom left)
3. Click **Database** in the sidebar

### 2.2 Find Connection String

Scroll to **"Connection string"** section

You'll see several tabs:
- **URI** ← Use this one!
- Session mode
- Transaction mode

### 2.3 Copy the URI

The connection string looks like:
```
postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

**Important:**
- Replace `[YOUR-PASSWORD]` with your actual database password
- Keep this secure - don't commit it to Git!

**Example of a complete connection string:**
```
postgresql://postgres.abcdefghijklmnop:yourSecurePassword123!@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

---

## 🔐 Step 3: Configure Environment Variable

### 3.1 Create .env File

In your project root:

```bash
cd /Users/logesh/projects/credit-card-offer
cp .env.example .env
```

### 3.2 Edit .env File

Open `.env` in your editor and update:

```bash
# Application Settings
APP_NAME=Credit Card Recommendation Service
APP_VERSION=1.0.0
DEBUG=True

# Database Configuration - UPDATE THIS LINE:
DATABASE_URL=postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres

# CORS Settings
CORS_ORIGINS=["*"]

# API Configuration
API_PREFIX=
DEFAULT_TOP_N=3
DEFAULT_REFERENCE_AMOUNT=100.0
```

**⚠️ Important:**
- Replace the entire DATABASE_URL with your Supabase connection string
- Include your actual password
- Don't commit this file to Git (it's already in .gitignore)

---

## 🌱 Step 4: Initialize Your PostgreSQL Database

### 4.1 Test Connection

```bash
cd /Users/logesh/projects/credit-card-offer
source venv/bin/activate

# Test if settings are loaded correctly
python -c "from app.config.settings import settings; print(f'Database: {settings.DATABASE_URL[:20]}...')"
```

You should see: `Database: postgresql://postg...`

### 4.2 Run Seed Script

```bash
python scripts/seed/seed_data_comprehensive.py
```

**Expected output:**
```
🗄️  Using PostgreSQL database
✅ Database tables initialized
✅ Created 16 credit cards
✅ Created 100+ category bonuses
✅ Created 20+ merchant categories
✅ Database seeded successfully!
```

**If you see any errors, check:**
- Is your Supabase project running?
- Is the DATABASE_URL correct in `.env`?
- Did you replace `[YOUR-PASSWORD]` with the actual password?
- Did you activate the virtual environment?

---

## ✅ Step 5: Verify in Supabase Dashboard

### 5.1 Open Table Editor

1. Go to your Supabase project
2. Click **📊 Table Editor** in the left sidebar

### 5.2 Check Tables

You should see **5 tables**:

1. **credit_cards** (should have ~16 rows)
   - Template cards like Amex Blue Cash Preferred, Chase Sapphire, etc.

2. **category_bonuses** (should have 100+ rows)
   - Reward rates by category (6% grocery, 3% gas, etc.)

3. **customers** (empty - will be populated when users register)

4. **offers** (may have some special promotions)

5. **merchant_categories** (should have 20+ rows)
   - Whole Foods, Costco, Target, etc.

### 5.3 Verify Data

Click on **credit_cards** table and you should see:
- American Express Blue Cash Preferred
- Chase Sapphire Preferred
- Citi Custom Cash
- Capital One Venture
- ... and more

---

## 🧪 Step 6: Test Your Application

### 6.1 Start Backend Server

```bash
cd /Users/logesh/projects/credit-card-offer
source venv/bin/activate
uvicorn app.main:app --reload
```

**Look for:**
```
🗄️  Using PostgreSQL database
✅ Database tables initialized
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### 6.2 Test API

Open browser: **http://127.0.0.1:8000/docs**

Try these endpoints:

**1. Health Check:**
```
GET /health
```
Expected: `{"status": "healthy"}`

**2. Create Customer:**
```
POST /customers/
{
  "id": "test_user_1",
  "name": "Test User",
  "email": "test@example.com"
}
```

**3. Add Card:**
```
POST /customers/test_user_1/cards/
{
  "id": "card_1",
  "card_name": "American Express Blue Cash Preferred",
  "issuer": "American Express",
  "last_four": "1234",
  "base_reward_rate": 1.0
}
```

**4. Get Recommendation:**
```
POST /recommend/
{
  "customer_id": "test_user_1",
  "merchant_name": "Whole Foods",
  "purchase_amount": 100.00
}
```

Expected: Should recommend Amex Blue Cash Preferred with 6% rewards!

---

## 📊 Step 7: Add Database Indexes (Optional but Recommended)

For better performance, add indexes:

### 7.1 Open SQL Editor in Supabase

1. Go to **SQL Editor** in Supabase dashboard
2. Click **"New query"**

### 7.2 Run This SQL

```sql
-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_credit_cards_customer_id 
  ON credit_cards(customer_id);

CREATE INDEX IF NOT EXISTS idx_category_bonuses_card_id 
  ON category_bonuses(card_id);

CREATE INDEX IF NOT EXISTS idx_offers_card_id 
  ON offers(card_id);

CREATE INDEX IF NOT EXISTS idx_merchant_categories_name 
  ON merchant_categories(merchant_name);

-- Verify indexes were created
SELECT schemaname, tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

Click **"Run"** - you should see your indexes listed!

---

## 🔄 Step 8: Update Mobile App (If Testing)

Update the API URL in your mobile app:

**File: `mobile-app/src/config/constants.ts`**

For local testing with PostgreSQL (backend on your machine):
```typescript
export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8000',  // Still localhost
  TIMEOUT: 10000,
};
```

For production (after deploying to Railway):
```typescript
export const API_CONFIG = {
  BASE_URL: 'https://your-app.up.railway.app',
  TIMEOUT: 10000,
};
```

---

## 🎯 Step 9: Commit Your Changes

```bash
cd /Users/logesh/projects/credit-card-offer

# Stage changes
git add requirements.txt app/database.py

# Commit
git commit -m "Add PostgreSQL support via Supabase

- Add psycopg2-binary to requirements.txt
- Update database.py to support both SQLite and PostgreSQL
- Add connection pooling for PostgreSQL
- Auto-detect database type from DATABASE_URL"

# Push to GitHub
git push origin main
```

---

## ✅ Verification Checklist

Check off each item as you complete it:

- [ ] Supabase project created
- [ ] Database password saved securely
- [ ] Connection string copied
- [ ] `.env` file created with DATABASE_URL
- [ ] PostgreSQL driver installed (`psycopg2-binary`)
- [ ] Seed script ran successfully
- [ ] All 5 tables visible in Supabase
- [ ] 16 credit cards in database
- [ ] Backend starts with "Using PostgreSQL database" message
- [ ] API endpoints working (tested in /docs)
- [ ] Can create customer
- [ ] Can add card to customer
- [ ] Can get recommendations
- [ ] Changes committed to Git

---

## 🐛 Troubleshooting

### "Connection refused" or "Could not connect"

**Check:**
- Is your Supabase project running? (check dashboard)
- Is the DATABASE_URL correct in `.env`?
- Did you replace `[YOUR-PASSWORD]`?
- Try pinging: `ping aws-0-us-west-1.pooler.supabase.com`

### "Password authentication failed"

**Fix:**
- Double-check your database password
- Go to Supabase → Settings → Database → Reset database password
- Update `.env` with new password

### "psycopg2 module not found"

**Fix:**
```bash
source venv/bin/activate
pip install psycopg2-binary
```

### "Table already exists" errors

**Fix:**
- Tables might exist from a previous run
- Either drop tables in Supabase SQL Editor:
  ```sql
  DROP TABLE IF EXISTS offers CASCADE;
  DROP TABLE IF EXISTS category_bonuses CASCADE;
  DROP TABLE IF EXISTS credit_cards CASCADE;
  DROP TABLE IF EXISTS customers CASCADE;
  DROP TABLE IF EXISTS merchant_categories CASCADE;
  ```
- Or modify seed script to skip if exists

### Seed script takes a long time

**Normal!** PostgreSQL over the internet is slower than local SQLite.
- Expect 10-30 seconds instead of instant
- This is only during seeding, API will be fast

---

## 📚 Useful Supabase Features

### Database Backups
- Go to Settings → Database → Backups
- Free tier: Daily backups for 7 days
- Can restore with one click

### Database URL Types
- **Connection pooling (recommended)**: Port 6543
- **Direct connection**: Port 5432
- Use pooling for apps, direct for admin tools

### Monitoring
- Go to Reports to see:
  - Database size
  - Active connections
  - Query performance

---

## 🎉 Success!

You're now running on PostgreSQL via Supabase! 

**Next Steps:**
1. Test all features thoroughly
2. Deploy backend to Railway (see DEPLOYMENT.md)
3. Update mobile app with production URL
4. Monitor Supabase dashboard for usage

---

## 💰 Pricing Note

**Free Tier Includes:**
- 500 MB database (plenty for thousands of users)
- Unlimited API requests
- 2 GB bandwidth
- Daily backups

**When to upgrade?**
- Database > 500 MB
- Need more than 7-day backups
- Want priority support

Supabase Pro is $25/month (8 GB database)

---

**Questions?** Check the [Supabase Documentation](https://supabase.com/docs) or open an issue on GitHub!

