# Sample API Requests

This document provides real-world examples of how to use the Credit Card Recommendation API.

---

## 🎯 **Two Usage Modes**

### **Mode 1: Pre-Purchase Planning** (No Amount Needed)
Customer is planning where to shop or which card to bring.
- ✅ **No purchase amount required**
- ✅ Returns percentage rates
- ✅ Perfect for pre-point-of-sale scenarios

### **Mode 2: At Checkout** (Amount Known)
Customer is at the checkout counter or making an online purchase.
- ✅ **Include purchase amount**
- ✅ Returns exact dollar rewards
- ✅ Shows dollar difference vs other cards

---

## 📝 **Sample Requests**

### **1. Pre-Purchase: Going to Whole Foods**

**Scenario**: "I'm heading to Whole Foods. Which card should I use?"

```bash
curl -L -X POST "http://127.0.0.1:8000/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cust_1",
    "merchant_name": "Whole Foods",
    "top_n": 3
  }' | python3 -m json.tool
```

**Response**:
```json
{
  "recommendations": [
    {
      "rank": 1,
      "card_name": "American Express Blue Cash Preferred",
      "reward_rate": 5.0,
      "reason": "5.0% via Extra 10% cashback at Whole Foods",
      "details": "5.0% rewards on this purchase",
      "comparison": "Tied with Chase Freedom Flex at 5.0%."
    }
  ]
}
```

**Key Insight**: ✅ No amount needed - just tells you which card gives best rate!

---

### **2. At Checkout: $100 Grocery Bill**

**Scenario**: "My bill is $100 at Whole Foods. Which card?"

```bash
curl -L -X POST "http://127.0.0.1:8000/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cust_1",
    "merchant_name": "Whole Foods",
    "purchase_amount": 100.0,
    "top_n": 3
  }' | python3 -m json.tool
```

**Response**:
```json
{
  "recommendations": [
    {
      "rank": 1,
      "card_name": "American Express Blue Cash Preferred",
      "estimated_reward": 5.0,
      "reward_rate": 5.0,
      "reason": "5.0% via Extra 10% cashback at Whole Foods",
      "details": "$5.00 cashback (5.0% rewards)",
      "comparison": "Tied with Chase Freedom Flex at 5.0%."
    }
  ]
}
```

**Key Insight**: ✅ Shows exact dollar amount you'll earn ($5.00)

---

### **3. Dining at Chipotle** (Clear Winner)

**Scenario**: "Going to Chipotle. Which card?"

```bash
curl -L -X POST "http://127.0.0.1:8000/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cust_1",
    "merchant_name": "Chipotle",
    "top_n": 3
  }' | python3 -m json.tool
```

**Response Highlights**:
```json
{
  "recommendations": [
    {
      "rank": 1,
      "card_name": "Capital One Savor Cash Rewards",
      "reward_rate": 4.0,
      "reason": "4.0% on dining purchases",
      "comparison": "Tied with American Express Gold Card at 4.0%."
    },
    {
      "rank": 2,
      "card_name": "American Express Gold Card",
      "reward_rate": 4.0,
      "comparison": "Tied with Capital One Savor Cash Rewards for best rate."
    },
    {
      "rank": 3,
      "card_name": "Chase Freedom Flex",
      "reward_rate": 3.0,
      "comparison": "Earns 1.0% less than Capital One Savor Cash Rewards."
    }
  ]
}
```

**Key Insight**: ✅ Shows why each card is better/worse than others!

---

### **4. Big Purchase: $800 Flight on Delta**

**Scenario**: "Booking an $800 Delta flight. Which card maximizes rewards?"

```bash
curl -L -X POST "http://127.0.0.1:8000/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cust_1",
    "merchant_name": "Delta",
    "purchase_amount": 800.0,
    "top_n": 5
  }' | python3 -m json.tool
```

**Response Highlights**:
```json
{
  "recommendations": [
    {
      "rank": 1,
      "card_name": "Capital One Venture X Rewards",
      "estimated_reward": 80.0,
      "reward_rate": 10.0,
      "reason": "10.0% on travel purchases",
      "details": "$80.00 cashback (10.0% rewards)",
      "comparison": "Best choice! Earns 5.0% more than Chase Freedom Flex. Also beats: Chase Freedom Flex, Chase Freedom Unlimited. ($40.00 more back)."
    },
    {
      "rank": 2,
      "card_name": "Chase Freedom Flex",
      "estimated_reward": 40.0,
      "reward_rate": 5.0,
      "comparison": "Earns 5.0% less than Capital One Venture X Rewards ($40.00 less back)."
    },
    {
      "rank": 3,
      "card_name": "Chase Sapphire Reserve",
      "estimated_reward": 40.0,
      "reward_rate": 5.0,
      "comparison": "Earns 5.0% less than Capital One Venture X Rewards ($40.00 less back)."
    }
  ]
}
```

**Key Insights**: 
- ✅ Winner earns **$80 back** (10%)
- ✅ Shows you'd lose **$40** by using the wrong card!
- ✅ Clear comparison: "Best choice! Earns 5.0% more..."

---

### **5. Gas Station - Shell**

**Scenario**: "Filling up at Shell. Which card?"

```bash
curl -L -X POST "http://127.0.0.1:8000/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cust_1",
    "merchant_name": "Shell",
    "top_n": 3
  }' | python3 -m json.tool
```

**Response Highlights**:
```json
{
  "recommendations": [
    {
      "rank": 1,
      "card_name": "American Express Blue Cash Preferred",
      "reward_rate": 3.0,
      "reason": "3.0% on gas purchases",
      "comparison": "Tied with American Express Blue Cash Everyday at 3.0%."
    },
    {
      "rank": 2,
      "card_name": "American Express Blue Cash Everyday",
      "reward_rate": 3.0,
      "reason": "3.0% on gas purchases"
    },
    {
      "rank": 3,
      "card_name": "Citi Double Cash Card",
      "reward_rate": 2.0,
      "reason": "2.0% base cashback on all purchases",
      "comparison": "Earns 1.0% less than American Express Blue Cash Preferred."
    }
  ]
}
```

---

### **6. Streaming - Netflix Subscription**

**Scenario**: "Paying for Netflix. Which card?"

```bash
curl -L -X POST "http://127.0.0.1:8000/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cust_1",
    "merchant_name": "Netflix",
    "purchase_amount": 15.0,
    "top_n": 3
  }' | python3 -m json.tool
```

**Response Highlights**:
```json
{
  "recommendations": [
    {
      "rank": 1,
      "card_name": "American Express Blue Cash Preferred",
      "estimated_reward": 0.9,
      "reward_rate": 6.0,
      "reason": "6.0% on streaming purchases",
      "details": "$0.90 cashback (6.0% rewards)",
      "comparison": "Best choice! Earns 2.0% more than Capital One Savor Cash Rewards."
    },
    {
      "rank": 2,
      "card_name": "Capital One Savor Cash Rewards",
      "estimated_reward": 0.6,
      "reward_rate": 4.0,
      "comparison": "Earns 2.0% less than American Express Blue Cash Preferred ($0.30 less back)."
    }
  ]
}
```

**Key Insight**: Even small purchases show the difference! ($0.90 vs $0.60)

---

### **7. Ride Share - Uber**

**Scenario**: "Taking an Uber. Which card?"

```bash
curl -L -X POST "http://127.0.0.1:8000/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cust_1",
    "merchant_name": "Uber",
    "purchase_amount": 20.0,
    "top_n": 3
  }' | python3 -m json.tool
```

**Response Highlights**:
```json
{
  "recommendations": [
    {
      "rank": 1,
      "card_name": "American Express Blue Cash Preferred",
      "estimated_reward": 0.6,
      "reward_rate": 3.0,
      "reason": "3.0% on transit purchases",
      "details": "$0.60 cashback (3.0% rewards)"
    }
  ]
}
```

---

### **8. Drugstore - CVS**

**Scenario**: "Buying medicine at CVS. Which card?"

```bash
curl -L -X POST "http://127.0.0.1:8000/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cust_1",
    "merchant_name": "CVS",
    "top_n": 2
  }' | python3 -m json.tool
```

**Response Highlights**:
```json
{
  "recommendations": [
    {
      "rank": 1,
      "card_name": "Chase Freedom Flex",
      "reward_rate": 3.0,
      "reason": "3.0% on drugstore purchases",
      "comparison": "Tied with Chase Freedom Unlimited at 3.0%."
    },
    {
      "rank": 2,
      "card_name": "Chase Freedom Unlimited",
      "reward_rate": 3.0,
      "reason": "3.0% on drugstore purchases"
    }
  ]
}
```

---

### **9. Unknown Merchant**

**Scenario**: "Shopping at a store not in the database"

```bash
curl -L -X POST "http://127.0.0.1:8000/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cust_1",
    "merchant_name": "Random Local Store",
    "top_n": 3
  }' | python3 -m json.tool
```

**Response**: Falls back to base rates and makes best guess at category.

---

## 🎨 **What Makes This Response Great**

### **1. Comparison Field** - NEW! ✨
Shows **why** this card is the best:
- ✅ "Best choice! Earns 5.0% more than [second-best card]"
- ✅ "Also beats: [list of inferior cards]"
- ✅ "($40.00 more back)" - Shows dollar impact

### **2. Optional Purchase Amount**
- ✅ **Without amount**: Shows percentages for planning
- ✅ **With amount**: Shows exact dollar rewards

### **3. Clear Ranking**
- Rank 1 = Best card with explanation
- Rank 2-N = How much worse than #1

### **4. Merchant Confidence**
```json
"merchant_info": {
  "merchant_name": "Whole Foods",
  "identified_categories": ["grocery", "organic"],
  "confidence": "high"
}
```

---

## 🚀 **Quick Reference**

### **Minimal Request** (Pre-Purchase)
```json
{
  "customer_id": "cust_1",
  "merchant_name": "Whole Foods"
}
```

### **Full Request** (At Checkout)
```json
{
  "customer_id": "cust_1",
  "merchant_name": "Whole Foods",
  "purchase_amount": 127.50,
  "top_n": 3
}
```

---

## 📊 **Best Practices**

### **For Mobile Apps**
1. **Pre-purchase**: Show `top_n: 1` with comparison
2. **At checkout**: Show `top_n: 3` with dollar amounts

### **For POS Systems**
1. Always include `purchase_amount`
2. Request `top_n: 1` for speed
3. Display `estimated_reward` prominently

### **For Web Dashboards**
1. Show `top_n: 5` with full comparison
2. Include purchase amount for realistic scenarios
3. Display `comparison` field to educate users

---

## 🎯 **Real Value Proposition**

**Example: $800 Flight**
- ✅ **Right card**: Capital One Venture X = $80 back (10%)
- ❌ **Wrong card**: Citi Double Cash = $16 back (2%)
- 💰 **Difference**: **$64 saved** by using the API!

**Example: Monthly Spending**
- $500 groceries → $30 vs $10 = **$20/month** = **$240/year**
- $300 dining → $12 vs $6 = **$6/month** = **$72/year**
- $150 gas → $4.50 vs $3 = **$1.50/month** = **$18/year**
- **Total**: **$330/year saved** by always using the right card!

---

**Last Updated**: October 25, 2025  
**API Version**: 1.0  
**Feature**: Optional purchase_amount + Comparison explanations


