#!/bin/bash
# Quick Railway setup script (run after railway login)

echo "🚂 Railway Deployment Setup"
echo ""

# Check if logged in
if ! railway whoami &>/dev/null; then
    echo "❌ Please login first: railway login"
    exit 1
fi

echo "✅ Logged in as: $(railway whoami)"
echo ""

# Link project
echo "🔗 Linking to Railway project..."
if [ ! -f .railway/project.json ]; then
    railway link
else
    echo "✅ Already linked"
fi

echo ""

# Set environment variable
echo "📝 Setting FOURSQUARE_API_KEY..."
railway variables set FOURSQUARE_API_KEY=0CKYX4ZA2ZW0JYBVPRG1OQSXRD55MXQRUSMFJFT5B3UI0CC3

echo ""
echo "✅ Environment variable set"
echo ""
echo "⚠️  IMPORTANT: Now change branch in Railway Dashboard:"
echo "   1. Go to https://railway.app"
echo "   2. Settings > Source > Branch: feature/dynamic-nearby-merchants"
echo "   3. Wait for deployment (2-5 min)"
echo "   4. Run: ./test_production_api.sh"
