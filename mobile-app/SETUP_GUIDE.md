# 🚀 Quick Setup Guide - Smart Card Picker Mobile App

## Step-by-Step Setup (First Time)

### 1️⃣ **Start Backend API**

Open a terminal and run:

```bash
cd /Users/logesh/projects/credit-card-offer
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Keep this terminal running!

**Test it works:**
```bash
curl http://127.0.0.1:8000/health
# Should return: {"status":"healthy"}
```

---

### 2️⃣ **Install Mobile App Dependencies**

Open a NEW terminal:

```bash
cd /Users/logesh/projects/credit-card-offer/mobile-app
npm install
```

This will take a few minutes.

---

### 3️⃣ **Configure API Connection**

#### For iOS Simulator (Mac):
No changes needed! It can use `127.0.0.1`.

#### For Android Emulator:
Edit `src/config/api.js`:
```javascript
const API_BASE_URL = 'http://10.0.2.2:8000';  // Android emulator
```

#### For Real Phone:
1. Get your computer's local IP:
   ```bash
   ipconfig getifaddr en0  # Mac
   ```
2. Edit `src/config/api.js`:
   ```javascript
   const API_BASE_URL = 'http://YOUR_IP:8000';  // e.g., http://192.168.1.100:8000
   ```
3. Make sure phone is on same WiFi as computer

---

### 4️⃣ **Start the App**

```bash
npm start
```

Wait for QR code to appear, then:

- **iOS**: Press `i` to open iOS Simulator
- **Android**: Press `a` to open Android Emulator  
- **Phone**: Install "Expo Go" app and scan QR code

---

## ✅ Testing the Full Flow

### First Time User Journey

1. **Welcome Screen**
   - Tap "Get Started"

2. **Registration**
   - Name: `John Doe`
   - Email: `john@example.com`
   - Tap "Continue"

3. **Select Cards**
   - Tap on 3-5 cards you "own"
   - Tap "Continue"

4. **Main App Loads!** 🎉

5. **Try a Recommendation**
   - Tap "Whole Foods" quick select
   - (Optional) Enter amount: `100`
   - Tap "Find Best Card"
   - See results!

### Example Tests

```
Test 1: Grocery
Store: Whole Foods
Amount: 100
Expected: Amex Blue Cash Preferred (6%)

Test 2: Dining  
Store: Chipotle
Amount: 50
Expected: Capital One Savor or Amex Gold (4%)

Test 3: Gas
Store: Shell
Amount: 40
Expected: Amex Blue Cash Preferred (3%)

Test 4: Travel
Store: Delta
Amount: 800
Expected: Capital One Venture X (10%)

Test 5: Costco (Visa Only!)
Store: Costco
Amount: 100
Expected: Chase Freedom Flex (5%) - NO AMEX!
```

---

## 🐛 Common Issues

### "Network Error" in app

**Problem**: Can't reach backend API

**Solution**:
```bash
# 1. Check backend is running
curl http://127.0.0.1:8000/health

# 2. If using phone, check API_BASE_URL in src/config/api.js
# 3. Restart backend with 0.0.0.0 instead of 127.0.0.1
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### "Module not found" errors

**Solution**:
```bash
cd mobile-app
rm -rf node_modules
npm install
expo start -c  # Clear cache
```

### iOS Simulator not opening

**Solution**:
```bash
# Install Xcode from App Store first, then:
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

### Android Emulator not working

**Solution**:
```bash
# Make sure Android Studio is installed
# Open Android Studio > Tools > AVD Manager
# Create/Start a virtual device
# Then run: npm start → press 'a'
```

---

## 📱 App Screens Overview

### 1. Welcome Screen
- Intro to app
- "Get Started" button

### 2. Register Screen
- Name input
- Email input
- Creates account via API

### 3. Select Cards Screen
- Browse 16 popular cards
- Grouped by issuer (Chase, Amex, Citi, etc.)
- Search functionality
- Select 1+ cards

### 4. Recommend Screen (Main)
- Search box for store name
- Optional purchase amount
- Popular stores quick select
- Shows top 3 card recommendations
- Network filtering (e.g., Costco = Visa only)

### 5. My Cards Screen
- View all your cards
- FAB button to add more cards
- Card details with highlights

### 6. Profile Screen
- Account information
- Settings
- Logout

---

## 🎨 UI Features

✨ **Modern Design**
- Material Design 3 (React Native Paper)
- Beautiful animations
- Card-based layouts
- Bottom tab navigation

💳 **Smart Card Display**
- Color-coded by network
- Shows annual fee
- Key highlights for each card
- Network badges (Visa, Mastercard, Amex, Discover)

🔍 **Intelligent Search**
- Quick store selection
- Search cards by name or issuer
- Real-time filtering

---

## 🚀 Next Steps

### Try These Scenarios

1. **No Purchase Amount**
   ```
   Store: "Whole Foods"
   Result: Shows percentages only
   ```

2. **With Purchase Amount**
   ```
   Store: "Whole Foods"
   Amount: "100"
   Result: Shows $6.00 cashback (6%)
   ```

3. **Network Restriction**
   ```
   Store: "Costco"
   Result: Only Visa cards shown (Amex filtered out!)
   ```

4. **Quick Select**
   ```
   Tap "Chipotle" icon
   Tap "Find Best Card"
   Result: Instant recommendation
   ```

### Add LLM Auto-Correct (Future)

When you're ready to add the LLM feature:

1. Add OpenAI/Anthropic SDK
2. Create new service: `src/services/merchantCorrector.js`
3. Intercept user input in `RecommendScreen.js`
4. Auto-correct before API call
5. Show "Did you mean...?" message

Example:
```javascript
// User types: "cotsco"
// LLM corrects to: "Costco"
// Show toast: "Searching for Costco ✓"
```

---

## 📊 Architecture

```
Mobile App (React Native)
    ↓
API Service (axios)
    ↓
FastAPI Backend (127.0.0.1:8000)
    ↓
SQLite Database
```

---

## 🎯 What's Working

✅ User registration flow  
✅ Card selection during onboarding  
✅ View/manage cards  
✅ Store recommendations  
✅ Network filtering (Costco = Visa only)  
✅ Comparison explanations  
✅ Optional purchase amount  
✅ Popular stores quick select  
✅ Beautiful modern UI  
✅ Bottom tab navigation  
✅ Profile management  

---

## 📝 Notes

- Backend must be running on port 8000
- Database must be seeded with comprehensive data
- For real device, use local IP instead of localhost
- Cards are stored locally and synced with backend
- No authentication required for MVP

---

**Need Help?** Check the main README.md for more details!

**Ready to Start?** Run `npm start` in the mobile-app directory! 🚀


