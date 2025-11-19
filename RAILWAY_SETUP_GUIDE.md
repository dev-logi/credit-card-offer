# Railway Deployment Setup - Step by Step

## Prerequisites
- ✅ Railway CLI installed
- ✅ Feature branch pushed to GitHub: `feature/dynamic-nearby-merchants`

## Step 1: Authenticate Railway CLI

**Run this command in your terminal:**
```bash
railway login
```

This will:
1. Open your default browser
2. Show Railway authorization page
3. Click "Authorize" to grant CLI access
4. Return to terminal when complete

**Verify login:**
```bash
railway whoami
```
Should show your Railway email/username.

## Step 2: Link to Your Project

**Option A: If you know your project ID:**
```bash
railway link <project-id>
```

**Option B: Interactive selection:**
```bash
railway link
```
Then select your project from the list.

## Step 3: Set Environment Variable

**Set the Foursquare API key:**
```bash
railway variables set FOURSQUARE_API_KEY=0CKYX4ZA2ZW0JYBVPRG1OQSXRD55MXQRUSMFJFT5B3UI0CC3
```

**Verify it was set:**
```bash
railway variables
```

## Step 4: Change Branch (Manual - Required)

Railway CLI doesn't support branch changes, so this must be done in the dashboard:

1. **Go to Railway Dashboard**: https://railway.app
2. **Select your project**: credit-card-offer
3. **Click on your service** (the FastAPI service)
4. **Go to Settings tab**
5. **Scroll to "Source" section**
6. **Change Branch** dropdown from `main` to `feature/dynamic-nearby-merchants`
7. **Railway will automatically start a new deployment**

## Step 5: Monitor Deployment

**In Railway Dashboard:**
- Go to **Deployments** tab
- Watch the build logs
- Wait for deployment to complete (usually 2-5 minutes)

**Or via CLI:**
```bash
railway logs
```

## Step 6: Test Production API

Once deployment is complete, test the endpoint:
```bash
./test_production_api.sh
```

Or manually:
```bash
curl "https://web-production-f63eb.up.railway.app/merchants/nearby?lat=40.7128&lng=-74.0060&radius=1000&limit=5"
```

## Quick Command Reference

```bash
# Login
railway login

# Link project
railway link

# Set variable
railway variables set FOURSQUARE_API_KEY=0CKYX4ZA2ZW0JYBVPRG1OQSXRD55MXQRUSMFJFT5B3UI0CC3

# View variables
railway variables

# View logs
railway logs

# Check status
railway status
```

