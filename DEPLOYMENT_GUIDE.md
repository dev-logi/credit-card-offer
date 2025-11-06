# Deployment Guide - Credit Card Recommendation Service

This guide will help you deploy your credit card recommendation service to Railway using SQLite.

## Prerequisites

- GitHub account with your code pushed
- Railway account (sign up at https://railway.app)
- Your service is using SQLite (no external database needed!)

## Deployment Steps

### 1. Prepare Your Repository

Ensure these files are committed to your GitHub repository:

- ✅ `Procfile` - Tells Railway how to start your app
- ✅ `runtime.txt` - Specifies Python version
- ✅ `requirements.txt` - Lists all dependencies
- ✅ `railway.json` - Railway configuration
- ✅ `.gitignore` - Excludes unnecessary files

### 2. Deploy to Railway

#### Option A: Via Railway Dashboard (Recommended)

1. **Go to Railway**: https://railway.app

2. **Sign in** with your GitHub account

3. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `credit-card-offer` repository
   - Railway will automatically detect it's a Python app

4. **Configure Environment Variables**:
   - Click on your deployment
   - Go to "Variables" tab
   - Add these variables:
     ```
     APP_NAME=Credit Card Recommendation Service
     APP_VERSION=1.0.0
     DEBUG=False
     CORS_ORIGINS=["*"]
     API_PREFIX=
     DEFAULT_TOP_N=3
     DEFAULT_REFERENCE_AMOUNT=100.0
     ```

5. **Deploy**:
   - Railway will automatically deploy
   - Wait for build to complete (2-3 minutes)
   - You'll get a URL like: `https://your-service.up.railway.app`

#### Option B: Via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Link to your GitHub repo
railway link

# Add environment variables
railway variables set APP_NAME="Credit Card Recommendation Service"
railway variables set DEBUG=False
railway variables set CORS_ORIGINS='["*"]'

# Deploy
railway up
```

### 3. Seed the Database

After deployment, seed your database with credit card data:

```bash
# Using Railway CLI
railway run python scripts/seed/seed_data_comprehensive.py

# Or via Railway dashboard
# Go to your service → Settings → Deploy → Run Command
# Enter: python scripts/seed/seed_data_comprehensive.py
```

### 4. Test Your Deployment

Once deployed, test your API:

```bash
# Get your Railway URL from the dashboard
export API_URL="https://your-service.up.railway.app"

# Test health check
curl $API_URL/

# Test recommendations
curl -X POST "$API_URL/recommendations" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "test_customer",
    "merchant": "Whole Foods",
    "purchase_amount": 150
  }'
```

### 5. Enable Your Domain (Optional)

Railway provides a free `.up.railway.app` domain. To use a custom domain:

1. Go to your service settings
2. Click "Generate Domain" for the free Railway domain
3. Or add your custom domain in the "Domains" section

### 6. Monitor Your Service

Railway Dashboard provides:
- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: History of all deployments

## Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `APP_NAME` | Application name | Credit Card Recommendation Service | No |
| `APP_VERSION` | Version number | 1.0.0 | No |
| `DEBUG` | Debug mode (set to False in production) | True | **Yes** |
| `CORS_ORIGINS` | Allowed origins for CORS | ["*"] | No |
| `DATABASE_URL` | Database connection (not needed for SQLite) | sqlite:///./credit_cards.db | No |
| `DEFAULT_TOP_N` | Default number of recommendations | 3 | No |
| `DEFAULT_REFERENCE_AMOUNT` | Default purchase amount | 100.0 | No |

## Database Files

Railway will automatically persist your SQLite database file (`credit_cards.db`) across deployments in the same volume.

## Updating Your Service

To deploy updates:

```bash
# Commit your changes
git add .
git commit -m "Your update message"
git push origin main

# Railway will automatically detect and deploy the changes
```

## Troubleshooting

### Build Fails

- Check logs in Railway dashboard
- Verify all files are committed to Git
- Ensure `requirements.txt` has all dependencies

### Service Won't Start

- Check that `Procfile` is correct
- Verify Python version in `runtime.txt` matches your development environment
- Check environment variables are set correctly

### Database is Empty

- Run the seed script: `railway run python scripts/seed/seed_data_comprehensive.py`
- Check logs to ensure script completed successfully

### API Returns Errors

- Check logs in Railway dashboard
- Verify environment variables (especially `DEBUG=False`)
- Test endpoints locally first

## Cost

Railway offers:
- **Free Tier**: $5 credit per month (enough for small apps)
- **Hobby Plan**: $5/month for more resources
- Your SQLite database has no additional cost!

## Security Notes

1. **CORS**: Update `CORS_ORIGINS` with your frontend URL in production
2. **API Keys**: Add authentication if handling sensitive data
3. **Rate Limiting**: Consider adding rate limiting for production
4. **HTTPS**: Railway provides free SSL certificates automatically

## Next Steps

1. ✅ Deploy to Railway
2. ✅ Seed database with credit card data
3. ✅ Test API endpoints
4. 🚀 Connect your mobile app to the deployed API
5. 📊 Monitor usage and performance
6. 🔒 Add authentication (optional)
7. 🎯 Set up custom domain (optional)

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- FastAPI Docs: https://fastapi.tiangolo.com

---

**Your service is production-ready with SQLite!** 🎉

You can handle thousands of users without needing PostgreSQL.

