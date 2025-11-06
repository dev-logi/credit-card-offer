# 🔗 How to Get Your Supabase PostgreSQL Connection String

Your Supabase project: **uifqzdahexyokikkzsgf**

---

## ⚠️ What You Provided vs What We Need

### ❌ What You Provided (API Key)
```
API Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**This is for Supabase's client-side API (JavaScript SDK)**
- Not used for direct PostgreSQL connections
- Used for browser/mobile apps calling Supabase's REST API

### ✅ What We Need (PostgreSQL Connection String)
```
postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```
**This is for direct database connections**
- Used by our FastAPI backend
- Contains database credentials
- Allows SQLAlchemy to connect to PostgreSQL

---

## 📍 Step-by-Step: Get PostgreSQL Connection String

### 1. Go to Your Supabase Project
https://supabase.com/dashboard/project/uifqzdahexyokikkzsgf

### 2. Navigate to Database Settings
- Click **⚙️ Settings** in the left sidebar (bottom left)
- Click **Database** in the submenu

### 3. Scroll to "Connection String" Section
You'll see several options:
- **Connection pooling** ← We want this one!
- Session mode
- Transaction mode

### 4. Click "URI" Tab (Not "PSQL" or others)
You should see something like:
```
postgresql://postgres.uifqzdahexyokikkzsgf:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

### 5. Important Notes
- The connection string will have `[YOUR-PASSWORD]` as a placeholder
- **You need to replace it with your actual database password**
- If you don't remember your password, you can reset it:
  - Same page (Database settings)
  - Scroll to "Database password"
  - Click "Reset database password"
  - Copy the new password
  - Update your connection string

---

## 🔐 Your Connection String Will Look Like This

Based on your project reference (`uifqzdahexyokikkzsgf`), your connection string should be:

```
postgresql://postgres.uifqzdahexyokikkzsgf:YOUR_ACTUAL_PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

**Parts breakdown:**
- `postgresql://` - Protocol
- `postgres.uifqzdahexyokikkzsgf` - Your database user
- `:YOUR_ACTUAL_PASSWORD` - Replace this with your database password
- `@aws-0-us-west-1.pooler.supabase.com` - Supabase host (region may vary)
- `:6543` - Connection pooler port
- `/postgres` - Database name

---

## 📝 What to Do Next

### Option 1: If You Have Your Password

1. Copy the connection string from Supabase
2. Replace `[YOUR-PASSWORD]` with your actual password
3. Paste the complete string here

### Option 2: If You Don't Remember Your Password

1. Go to Settings → Database in Supabase
2. Scroll to "Database password" section
3. Click "Reset database password"
4. Copy the new password shown
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with the new password
7. Paste the complete string here

---

## 🎯 Quick Visual Guide

1. **Open Supabase** → https://supabase.com/dashboard/project/uifqzdahexyokikkzsgf
2. **Click "Settings"** (bottom left, gear icon)
3. **Click "Database"** (in settings menu)
4. **Scroll down** to "Connection string"
5. **Make sure "Connection pooling" is selected**
6. **Click "URI" tab**
7. **Copy the connection string**
8. **Replace [YOUR-PASSWORD] with actual password**
9. **Share the complete string**

---

## ⚠️ Security Note

The database password is sensitive! When sharing:
- ✅ Share directly in this chat (it's private)
- ❌ Don't commit it to GitHub
- ❌ Don't post it publicly

We'll save it in your `.env` file, which is already in `.gitignore`.

---

## 🚀 Once You Have It

I'll help you:
1. ✅ Create your `.env` file with the connection string
2. ✅ Test the connection
3. ✅ Seed your database
4. ✅ Verify everything works

**Just paste your complete PostgreSQL connection string here!**

