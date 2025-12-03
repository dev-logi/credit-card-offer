#!/bin/bash
# Test script for production API endpoint

PROD_URL="https://web-production-f63eb.up.railway.app"
ENDPOINT="/merchants/nearby"

echo "🧪 Testing Production API: $PROD_URL$ENDPOINT"
echo ""

# Test health endpoint first
echo "1. Testing health endpoint..."
HEALTH=$(curl -s "$PROD_URL/health")
echo "   Response: $HEALTH"
echo ""

# Test merchants endpoint
echo "2. Testing merchants/nearby endpoint..."
echo "   URL: $PROD_URL$ENDPOINT?lat=40.7128&lng=-74.0060&radius=1000&limit=5"
echo ""

RESPONSE=$(curl -s "$PROD_URL$ENDPOINT?lat=40.7128&lng=-74.0060&radius=1000&limit=5")

# Check if response is valid JSON and has merchants
if echo "$RESPONSE" | python3 -m json.tool > /dev/null 2>&1; then
    echo "✅ Valid JSON response"
    MERCHANT_COUNT=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data.get('merchants', [])))" 2>/dev/null)
    if [ "$MERCHANT_COUNT" -gt 0 ]; then
        echo "✅ Found $MERCHANT_COUNT merchants"
        echo ""
        echo "Sample response:"
        echo "$RESPONSE" | python3 -m json.tool | head -30
        echo ""
        echo "✅ Production API is working correctly!"
    else
        echo "⚠️  No merchants returned (might be expected if API key not set)"
        echo "Response: $RESPONSE"
    fi
else
    echo "❌ Invalid JSON response"
    echo "Response: $RESPONSE"
    exit 1
fi

