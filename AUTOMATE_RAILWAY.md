# Automating Railway Deployment

## Current Status
- ✅ Railway CLI installed
- ⏳ Authentication required
- ⏳ Branch change (manual in dashboard)

## Step 1: Authenticate Railway CLI

Run in your terminal:
```bash
railway login
```

This will:
1. Open your browser
2. Ask you to authorize Railway CLI
3. Complete authentication automatically

## Step 2: Run Automation Script

After authentication, run:
```bash
./setup_railway_deployment.sh
```

This script will:
- ✅ Link to your Railway project
- ✅ Set FOURSQUARE_API_KEY environment variable
- ⚠️  Remind you to change branch in dashboard

## Step 3: Change Branch (Manual)

Since Railway CLI doesn't support branch changes via command line, you need to:

1. Go to https://railway.app
2. Select your project: **credit-card-offer**
3. Click on your service
4. Go to **Settings** tab
5. Scroll to **Source** section
6. Change **Branch** from `main` to `feature/dynamic-nearby-merchants`
7. Railway will automatically trigger a new deployment

## Step 4: Test Production API

Once deployment completes (2-5 minutes), run:
```bash
./test_production_api.sh
```

## Alternative: Manual Steps

If you prefer to do everything manually:

1. **Login to Railway Dashboard**: https://railway.app
2. **Select Project**: credit-card-offer
3. **Change Branch**:
   - Settings → Source → Branch: `feature/dynamic-nearby-merchants`
4. **Add Environment Variable**:
   - Variables tab → Add Variable
   - Name: `FOURSQUARE_API_KEY`
   - Value: `0CKYX4ZA2ZW0JYBVPRG1OQSXRD55MXQRUSMFJFT5B3UI0CC3`
5. **Wait for Deployment**: Check Deployments tab
6. **Test**: Run `./test_production_api.sh`

