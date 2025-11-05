# Smart Card Picker - React Native App

A beautiful mobile app that helps users find the best credit card for every purchase, maximizing their rewards effortlessly.

## 🎯 Features

### ✅ MVP Features (Implemented)

1. **User Registration Flow**
   - Welcome screen with app introduction
   - User registration (name & email)
   - Credit card selection during onboarding
   - Seamless flow to main app

2. **Card Management**
   - Select from 16 popular credit cards
   - View all cards in wallet
   - Add more cards anytime
   - Beautiful card visualization with issuer colors

3. **Smart Recommendations**
   - Enter store name to get instant recommendations
   - Optional purchase amount for precise rewards calculation
   - Top 3 card suggestions with detailed comparison
   - Quick selection of popular stores
   - Real-time API integration

4. **User Profile**
   - View account information
   - Manage cards
   - Settings and preferences

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Backend API running on `http://127.0.0.1:8000`

### Backend Setup

Make sure your FastAPI backend is running:

```bash
cd /Users/logesh/projects/credit-card-offer
source venv/bin/activate
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### Installation

1. **Navigate to mobile app directory:**
```bash
cd /Users/logesh/projects/credit-card-offer/mobile-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Update API configuration:**

For testing on a real device, update `src/config/api.js`:
```javascript
// Get your local IP: run `ipconfig getifaddr en0` on Mac
const API_BASE_URL = 'http://YOUR_LOCAL_IP:8000';
```

4. **Start the app:**
```bash
npm start
```

5. **Run on device:**
   - **iOS**: Press `i` or scan QR code with Expo Go app
   - **Android**: Press `a` or scan QR code with Expo Go app
   - **Web**: Press `w`

## 📱 App Structure

```
mobile-app/
├── App.js                      # Main app with navigation
├── src/
│   ├── screens/
│   │   ├── WelcomeScreen.js    # Landing page
│   │   ├── RegisterScreen.js   # User registration
│   │   ├── SelectCardsScreen.js # Card selection
│   │   ├── RecommendScreen.js   # Main recommendation screen
│   │   ├── MyCardsScreen.js     # View/manage cards
│   │   └── ProfileScreen.js     # User profile
│   ├── config/
│   │   └── api.js              # API configuration & services
│   └── data/
│       └── availableCards.js   # Card database
├── package.json
└── README.md
```

## 🎨 User Flow

### First Time User

```
Welcome → Register → Select Cards → Main App (Recommendations)
```

1. **Welcome Screen**
   - App introduction
   - "Get Started" button

2. **Registration**
   - Enter name and email
   - Creates customer account via API

3. **Card Selection**
   - Browse 16 popular credit cards
   - Grouped by issuer
   - Search functionality
   - Must select at least 1 card
   - Cards are added to user's wallet via API

4. **Main App**
   - Bottom tab navigation:
     - 🔍 Find Card (Recommendations)
     - 💳 My Cards
     - 👤 Profile

### Returning User

Starts directly at **Main App** with bottom tabs.

## 🔍 Using Recommendations

### Quick Flow (No Amount)

```
1. Enter store name (e.g., "Costco")
2. Press "Find Best Card"
3. Get top 3 recommendations with:
   - Card name & network
   - Reward percentage
   - Reason for recommendation
   - Comparison with other cards
```

### Detailed Flow (With Amount)

```
1. Enter store name (e.g., "Whole Foods")
2. Enter purchase amount (e.g., "100")
3. Press "Find Best Card"
4. Get top 3 recommendations with:
   - Card name & network
   - Reward percentage
   - Exact dollar amount earned
   - Detailed comparison (e.g., "Earns $2 more than...")
```

### Popular Stores Quick Selection

Tap any popular store icon to auto-fill the store name:
- 🛒 Whole Foods
- 🏬 Costco
- 🎯 Target
- 🌯 Chipotle
- ☕ Starbucks
- ⛽ Shell
- ✈️ Delta
- And more...

## 📊 Example API Responses

### Request (No Amount)
```json
{
  "customer_id": "cust_1234567890",
  "merchant_name": "Whole Foods",
  "top_n": 3
}
```

### Response
```json
{
  "recommendations": [
    {
      "rank": 1,
      "card_name": "American Express Blue Cash Preferred",
      "reward_rate": 6.0,
      "reason": "6.0% on grocery purchases",
      "comparison": "Best choice! Earns 1.0% more than Chase Freedom Flex."
    }
  ],
  "merchant_info": {
    "merchant_name": "Whole Foods",
    "identified_categories": ["grocery", "organic"],
    "confidence": "high"
  }
}
```

## 🎯 Future Enhancements

### Phase 2: LLM Integration

```
User types: "cotsco" → Auto-corrects to "Costco"
User types: "strbks" → Auto-corrects to "Starbucks"
```

**Implementation Plan:**
1. Add LLM API service (OpenAI/Anthropic)
2. Intercept merchant name input
3. Auto-correct before sending to backend
4. Show correction to user ("Did you mean Costco?")

### Phase 3: Advanced Features

- 📊 Spending analytics & insights
- 📈 Rewards tracking & history
- 🔔 Push notifications for special offers
- 🎯 Personalized recommendations based on spending patterns
- 💰 Annual fee optimization
- 📍 Location-based recommendations
- 🏆 Gamification (rewards milestones)

## 🐛 Troubleshooting

### Cannot connect to API

1. **Check backend is running:**
```bash
curl http://127.0.0.1:8000/health
```

2. **For real device testing:**
   - Use your computer's local IP
   - Make sure device is on same WiFi network
   - Update `API_BASE_URL` in `src/config/api.js`

3. **Get your local IP:**
```bash
# Mac
ipconfig getifaddr en0

# Windows
ipconfig

# Linux
hostname -I
```

### App won't start

```bash
# Clear cache
rm -rf node_modules
npm install

# Clear Expo cache
expo start -c
```

### Cards not showing up

1. Make sure backend database is seeded:
```bash
python seed_data_comprehensive.py
```

2. Check API response in console logs

## 📝 API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/customers` | POST | Create new customer |
| `/customers/{id}` | GET | Get customer details |
| `/customers/{id}/cards` | GET | List customer's cards |
| `/customers/{id}/cards` | POST | Add card to customer |
| `/recommend` | POST | Get card recommendation |
| `/health` | GET | Health check |

## 🎨 Design System

- **Primary Color**: `#6200ee` (Purple)
- **Secondary Color**: `#03dac6` (Teal)
- **Background**: `#f5f5f5` (Light gray)
- **Card Elevation**: Material Design shadows
- **Typography**: React Native Paper (Material Design 3)

## 📦 Dependencies

- **expo**: React Native framework
- **react-navigation**: Navigation
- **react-native-paper**: Material Design UI components
- **axios**: HTTP client
- **async-storage**: Local storage

## 🤝 Contributing

This is an MVP. Future contributions welcome for:
- LLM integration for merchant name auto-correction
- Spending analytics
- Advanced filtering
- Rewards tracking

## 📄 License

MIT License - feel free to use for your projects!

---

**Built with ❤️ using React Native & Expo**


