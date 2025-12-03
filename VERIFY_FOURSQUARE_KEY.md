# Verifying Your Foursquare API Key

## Current Issue
The API key in your `.env` file is returning a 401 "Invalid request token" error.

## Key Format Check
Your current key: `0CKYX4ZA2ZW0JYBVPRG1OQSXRD55MXQRUSMFJFT5B3UI0CC3`

**Expected Foursquare API Key format:**
- Typically starts with `fsq3` or `fsq`
- Usually 40-50 characters long
- Alphanumeric string

## How to Verify in Foursquare Developer Portal

1. **Log in to Foursquare Developer Portal**
   - Go to https://developer.foursquare.com/
   - Sign in to your account

2. **Navigate to Your Project**
   - Click on "My Apps" or "Projects" in the dashboard
   - Select the project you just created

3. **Find the Correct Credential**
   - Look for a section labeled **"API Key"** or **"Access Token"**
   - **DO NOT** use "API Secret" - that's different
   - The API Key should be clearly labeled

4. **Check the Key Format**
   - Foursquare API keys typically start with `fsq3`
   - If your key doesn't start with `fsq`, you might have:
     - Copied the API Secret instead
     - Copied a different type of credential
     - Used an old/different API format

5. **Copy the Correct Key**
   - Make sure you copy the entire key (no spaces, no line breaks)
   - It should be one continuous string

## Update Your .env File

Once you have the correct API key:

```bash
# Edit .env file
FOURSQUARE_API_KEY=fsq3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Then restart your server:
```bash
# Stop the server (Ctrl+C) and restart
uvicorn app.main:app --reload
```

## Test the Key

After updating, test with:
```bash
curl "http://localhost:8000/merchants/nearby?lat=40.7128&lng=-74.0060&radius=1000&limit=5"
```

If it works, you should see a list of nearby merchants instead of an empty array.

## Alternative: Check API Key Type

If you're unsure which credential to use:
- **API Key / Access Token**: Used for authentication (this is what we need)
- **API Secret**: Used for server-side authentication (not needed for this implementation)
- **Client ID / Client Secret**: Used for OAuth flows (not needed here)

## Still Having Issues?

If the key format is correct but still not working:
1. Wait a few minutes - newly created keys sometimes need activation time
2. Check that "Places API" is enabled for your project
3. Verify you're using the correct API endpoint (v3)
4. Check Foursquare's status page for any service issues

