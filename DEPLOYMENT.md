# 🚀 Deployment Guide

This guide covers deploying the Credit Card Recommendation Service to production.

## Architecture Overview

```
Frontend (React Native)  →  Backend (FastAPI)  →  Database (PostgreSQL)
     Vercel/Expo              Railway/Render        Supabase
```

---

## 📦 Backend Deployment

### Option 1: Railway (Recommended)

**Pros:** Free tier, auto-deploy from GitHub, easy setup

1. **Sign up at https://railway.app/**

2. **Create New Project → Deploy from GitHub**
   - Connect your GitHub repository
   - Railway auto-detects Python/FastAPI

3. **Add Environment Variables:**
   ```
   DATABASE_URL=postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres
   DEBUG=False
   CORS_ORIGINS=["https://your-frontend.vercel.app"]
   ```

4. **Add Start Command:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

5. **Deploy!**
   - Railway generates a public URL: `https://your-app.up.railway.app`
   - Auto-deploys on every GitHub push

### Option 2: Render

**Pros:** Free tier, simple configuration

1. **Sign up at https://render.com/**

2. **New Web Service → Connect GitHub**

3. **Configure:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Add Environment Variables** (same as Railway)

5. **Deploy!**

### Option 3: Fly.io

**Pros:** Fast global deployment, generous free tier

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Initialize:**
   ```bash
   fly launch
   ```

3. **Set secrets:**
   ```bash
   fly secrets set DATABASE_URL="postgresql://..."
   fly secrets set DEBUG=False
   ```

4. **Deploy:**
   ```bash
   fly deploy
   ```

---

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project

1. **Go to https://supabase.com/**
2. **Create new project**
   - Choose a name
   - Generate a strong password
   - Select region closest to your users
   - Wait ~2 minutes for provisioning

### 2. Get Connection String

1. **Go to Settings → Database**
2. **Copy Connection String (URI format)**
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-REF].supabase.co:5432/postgres
   ```
3. **Replace `[YOUR-PASSWORD]` with your actual password**

### 3. Initialize Database

**From your local machine:**

```bash
# Set environment variable temporarily
export DATABASE_URL="postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres"

# Run seed script
python scripts/seed/seed_data_comprehensive.py
```

**Or via Supabase SQL Editor:**

Run the seed script SQL commands directly in the Supabase dashboard.

### 4. Add Database Indexes (Optional but recommended)

In Supabase SQL Editor:

```sql
CREATE INDEX idx_credit_cards_customer_id ON credit_cards(customer_id);
CREATE INDEX idx_category_bonuses_card_id ON category_bonuses(card_id);
CREATE INDEX idx_offers_card_id ON offers(card_id);
CREATE INDEX idx_merchant_categories_name ON merchant_categories(merchant_name);
```

---

## 📱 Frontend Deployment

### Option 1: Web Only (Vercel)

**Perfect for testing the app as a web app**

```bash
cd mobile-app

# Build for web
npm run build:web

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Update API URL:**
Edit `mobile-app/src/config/constants.ts`:
```typescript
export const API_CONFIG = {
  BASE_URL: 'https://your-backend.up.railway.app',
  TIMEOUT: 10000,
};
```

### Option 2: Full Mobile App (Expo EAS)

**For iOS and Android native apps**

```bash
cd mobile-app

# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Publish update
eas update --branch production
```

---

## ✅ Post-Deployment Checklist

### Backend
- [ ] Backend deployed and accessible
- [ ] `/health` endpoint returns `{"status": "healthy"}`
- [ ] `/docs` shows Swagger UI
- [ ] Database connected (test with `/customers/`)
- [ ] CORS configured for your frontend domain
- [ ] Environment variables set correctly

### Database
- [ ] Supabase project created
- [ ] Connection string works
- [ ] Tables created (5 tables)
- [ ] Seed data loaded (16 cards)
- [ ] Indexes created (optional)
- [ ] Backups enabled (automatic in Supabase)

### Frontend
- [ ] Mobile app connects to backend
- [ ] Registration works
- [ ] Card selection works
- [ ] Recommendations work
- [ ] All features tested

---

## 🔒 Security Checklist

- [ ] `.env` file not committed to Git
- [ ] `DEBUG=False` in production
- [ ] CORS restricted to your frontend domain
- [ ] Database password is strong
- [ ] Supabase RLS policies configured (if using Supabase auth)
- [ ] HTTPS enabled (automatic with Railway/Render/Vercel)

---

## 📊 Monitoring

### Backend Health Check

```bash
curl https://your-backend.com/health
# Expected: {"status": "healthy"}
```

### Database Connection

```bash
curl https://your-backend.com/docs
# Should load Swagger UI
```

### End-to-End Test

1. Register a new customer
2. Add 3 cards
3. Get recommendation for "Whole Foods"
4. Verify correct card is recommended

---

## 🐛 Troubleshooting

### "Connection refused" or "Cannot connect to database"
- Check DATABASE_URL is correct
- Verify Supabase project is running
- Check IP allowlist in Supabase (should allow all for Railway/Render)

### "CORS error" in browser
- Add your frontend domain to CORS_ORIGINS
- Ensure backend is using HTTPS
- Check preflight OPTIONS requests are allowed

### "Module not found" errors
- Verify `requirements.txt` is complete
- Check build logs for pip install errors
- Ensure `psycopg2-binary` is installed for PostgreSQL

### Seed script fails
- Check DATABASE_URL format
- Verify database is empty (or use `IF NOT EXISTS`)
- Check Supabase project is accessible

---

## 💰 Cost Estimate

### Free Tier (Sufficient for testing/MVP)
- **Supabase:** Free (500MB database, unlimited API requests)
- **Railway:** Free tier (500 hours/month)
- **Vercel:** Free (web app hosting)
- **Total:** $0/month

### Production (Small scale)
- **Supabase Pro:** $25/month (8GB database, more features)
- **Railway Pro:** $5/month (no sleep, more resources)
- **Vercel Pro:** $20/month (custom domains, analytics)
- **Total:** ~$50/month

---

## 🎯 Next Steps After Deployment

1. **Custom Domain:** Add your own domain to Railway/Vercel
2. **Analytics:** Add analytics to track usage
3. **Error Tracking:** Integrate Sentry for error monitoring
4. **Rate Limiting:** Add API rate limiting for production
5. **Caching:** Add Redis for caching recommendations
6. **Auto-scaling:** Configure auto-scaling based on traffic

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Expo EAS Documentation](https://docs.expo.dev/eas/)

---

**Need help?** Open an issue on GitHub or check the documentation links above.

