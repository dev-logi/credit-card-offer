# Railway Deployment Steps for Feature Branch

## Step 1: Change Railway Branch to Feature Branch

### Via Railway Dashboard:
1. Go to https://railway.app
2. Log in and select your project: **credit-card-offer**
3. Click on your service
4. Go to **Settings** tab
5. Scroll to **Source** section
6. Change **Branch** from `main` to `feature/dynamic-nearby-merchants`
7. Railway will automatically trigger a new deployment

### Via Railway CLI (if installed):
```bash
railway link
railway variables set BRANCH=feature/dynamic-nearby-merchants
```

## Step 2: Add Environment Variable

In Railway Dashboard:
1. Go to your service
2. Click on **Variables** tab
3. Add new variable:
   - **Name**: `FOURSQUARE_API_KEY`
   - **Value**: `0CKYX4ZA2ZW0JYBVPRG1OQSXRD55MXQRUSMFJFT5B3UI0CC3`
4. Save

Or via CLI:
```bash
railway variables set FOURSQUARE_API_KEY=0CKYX4ZA2ZW0JYBVPRG1OQSXRD55MXQRUSMFJFT5B3UI0CC3
```

## Step 3: Wait for Deployment

- Railway will automatically build and deploy
- Check deployment logs in Railway dashboard
- Usually takes 2-5 minutes

## Step 4: Test Production API

Once deployed, test the endpoint:
```bash
curl "https://web-production-f63eb.up.railway.app/merchants/nearby?lat=40.7128&lng=-74.0060&radius=1000&limit=5"
```

Expected response: JSON with `merchants` array containing nearby places.

## Step 5: After Testing

Once testing is complete:
1. Change Railway branch back to `main`
2. Merge feature branch to main
3. Railway will redeploy from main with the tested changes

