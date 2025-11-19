#!/bin/bash
# Wait for Railway deployment and test when ready

PROD_URL="https://web-production-f63eb.up.railway.app"
ENDPOINT="/merchants/nearby"

echo "⏳ Waiting for Railway deployment to complete..."
echo "Production URL: $PROD_URL"
echo ""
echo "This will check every 15 seconds for up to 10 minutes..."
echo "Press Ctrl+C to stop"
echo ""

MAX_ATTEMPTS=40
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT + 1))
    
    echo "[$ATTEMPT/$MAX_ATTEMPTS] Checking deployment status..."
    
    # Check health first
    HEALTH=$(curl -s "$PROD_URL/health" 2>/dev/null)
    if [ "$HEALTH" = '{"status":"healthy"}' ]; then
        echo "   ✅ Service is healthy"
        
        # Check merchants endpoint
        RESPONSE=$(curl -s "$PROD_URL$ENDPOINT?lat=40.7128&lng=-74.0060&radius=1000&limit=5" 2>/dev/null)
        
        if echo "$RESPONSE" | python3 -m json.tool > /dev/null 2>&1; then
            MERCHANT_COUNT=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data.get('merchants', [])))" 2>/dev/null)
            
            if [ "$MERCHANT_COUNT" -gt 0 ]; then
                echo ""
                echo "🎉 SUCCESS! Deployment is complete and working!"
                echo "   Found $MERCHANT_COUNT merchants"
                echo ""
                echo "Sample response:"
                echo "$RESPONSE" | python3 -m json.tool | head -30
                echo ""
                echo "✅ Production API is ready!"
                exit 0
            elif [ "$MERCHANT_COUNT" = "0" ]; then
                echo "   ⚠️  Endpoint exists but returned 0 merchants"
                echo "   This might mean FOURSQUARE_API_KEY is not set correctly"
                echo "   Response: $RESPONSE" | head -100
            else
                echo "   ⏳ Endpoint exists but checking response..."
            fi
        else
            # Check if it's a 404 (endpoint not deployed yet)
            STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL$ENDPOINT?lat=40.7128&lng=-74.0060&radius=1000&limit=5" 2>/dev/null)
            if [ "$STATUS" = "404" ]; then
                echo "   ⏳ Endpoint not available yet (404) - deployment may still be in progress"
            else
                echo "   ⏳ Endpoint responding but format unexpected"
            fi
        fi
    else
        echo "   ⏳ Service not ready yet (health check failed)"
    fi
    
    if [ $ATTEMPT -lt $MAX_ATTEMPTS ]; then
        echo "   Waiting 15 seconds before next check..."
        sleep 15
    fi
done

echo ""
echo "⏱️  Timeout reached. Deployment may still be in progress."
echo "Check Railway Dashboard for deployment status."
echo ""
echo "To test manually:"
echo "  curl \"$PROD_URL$ENDPOINT?lat=40.7128&lng=-74.0060&radius=1000&limit=5\""

