#!/bin/bash

# Quick start script for Smart Card Picker mobile app

echo "🚀 Starting Smart Card Picker Mobile App..."
echo ""

# Check if backend is running
echo "📡 Checking backend API..."
if curl -s http://127.0.0.1:8000/health > /dev/null 2>&1; then
    echo "✅ Backend API is running"
else
    echo "❌ Backend API is not running!"
    echo ""
    echo "Please start the backend first:"
    echo "  cd /Users/logesh/projects/credit-card-offer"
    echo "  source venv/bin/activate"
    echo "  uvicorn app.main:app --host 0.0.0.0 --port 8000"
    echo ""
    exit 1
fi

echo ""
echo "📱 Starting Expo development server..."
echo ""
echo "Once the QR code appears:"
echo "  • Press 'i' for iOS Simulator"
echo "  • Press 'a' for Android Emulator"
echo "  • Scan QR code with Expo Go app on your phone"
echo ""
echo "----------------------------------------"
echo ""

npm start


