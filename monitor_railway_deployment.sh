#!/bin/bash
# Monitor Railway deployment and test when ready

PROD_URL="https://web-production-f63eb.up.railway.app"
ENDPOINT="/merchants/nearby"

echo "🔍 Monitoring Railway deployment..."
echo "Production URL: $PROD_URL"
echo ""

# Check health endpoint first
echo "1. Checking service health..."
for i in {1..30}; do
    HEALTH=$(curl -s "$PROD_URL/health" 2>/dev/null)
    if [ "$HEALTH" = '{"status":"healthy"}' ]; then
        echo "   ✅ Service is healthy"
        break
    else
        echo "   ⏳ Attempt $i/30: Service not ready yet..."
        sleep 10
    fi
done

echo ""
echo "2. Testing merchants endpoint..."
RESPONSE=$(curl -s "$PROD_URL$ENDPOINT?lat=40.7128&lng=-74.0060&radius=1000&limit=5")

if echo "$RESPONSE" | python3 -m json.tool > /dev/null 2>&1; then
    MERCHANT_COUNT=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data.get('merchants', [])))" 2>/dev/null)
    
    if [ "$MERCHANT_COUNT" -gt 0 ]; then
        echo "   ✅ SUCCESS! Found $MERCHANT_COUNT merchants"
        echo ""
        echo "Sample response:"
        echo "$RESPONSE" | python3 -m json.tool | head -25
        echo ""
        echo "✅ Production API is working correctly!"
        exit 0
    else
        echo "   ⚠️  Endpoint working but no merchants returned"
        echo "   This might mean FOURSQUARE_API_KEY is not set"
        echo "   Response: $RESPONSE"
        exit 1
    fi
else
    echo "   ❌ Invalid response or endpoint not available"
    echo "   Response: $RESPONSE"
    exit 1
fi

