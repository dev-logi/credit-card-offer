#!/bin/bash
# Script to set up Railway deployment for feature branch

set -e

echo "🚂 Setting up Railway deployment for feature branch..."
echo ""

# Check if logged in
if ! railway whoami &>/dev/null; then
    echo "❌ Not logged in to Railway"
    echo "Please run: railway login"
    echo "This will open a browser for authentication"
    exit 1
fi

echo "✅ Logged in to Railway"
echo ""

# List projects to help identify
echo "📋 Your Railway projects:"
railway list
echo ""

# Link to project (if not already linked)
if [ ! -f .railway/project.json ]; then
    echo "🔗 Linking to Railway project..."
    echo "Please enter your project ID (or press Enter to select interactively):"
    read -r PROJECT_ID
    if [ -n "$PROJECT_ID" ]; then
        railway link "$PROJECT_ID"
    else
        railway link
    fi
else
    echo "✅ Already linked to Railway project"
fi

echo ""
echo "📝 Setting environment variable..."
railway variables set FOURSQUARE_API_KEY=0CKYX4ZA2ZW0JYBVPRG1OQSXRD55MXQRUSMFJFT5B3UI0CC3

echo ""
echo "⚠️  IMPORTANT: Branch change must be done in Railway Dashboard"
echo ""
echo "To change the branch:"
echo "1. Go to https://railway.app"
echo "2. Select your project"
echo "3. Go to Settings > Source"
echo "4. Change branch from 'main' to 'feature/dynamic-nearby-merchants'"
echo "5. Railway will automatically redeploy"
echo ""
echo "✅ Environment variable set"
echo "⏳ Waiting for you to change branch in dashboard..."
echo ""
echo "Once branch is changed, run: ./test_production_api.sh"

