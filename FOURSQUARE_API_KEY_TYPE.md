# Foursquare API Key Types - Important!

## Issue Identified

The **Service API Key** you created is for **User Management API**, not for the **Places API**.

## Solution: Create a Places API Key

You need to create a **separate API key** specifically for the Places API.

### Steps to Get Places API Key:

1. **Go to Foursquare Developer Console**
   - Visit https://developer.foursquare.com/
   - Log in to your account

2. **Navigate to Your Project**
   - Go to "My Apps" or "Projects"
   - Select your project

3. **Generate Places API Key**
   - Look for a section specifically for **"Places API"** or **"Places API Key"**
   - This is different from the "Service API Key" you already have
   - Generate a new key for Places API access

4. **Key Format**
   - Places API keys typically start with `fsq3` or similar
   - They are specifically labeled as "Places API Key" or "API Key" (not Service API Key)

5. **Update Your .env File**
   ```bash
   FOURSQUARE_API_KEY=fsq3your_places_api_key_here
   ```

## Key Types in Foursquare:

- **Service API Key**: For User Management API (creating/deleting users) - ❌ NOT for Places API
- **Places API Key**: For accessing Places API (searching for venues) - ✅ This is what we need
- **Legacy API Key**: Old format, being phased out

## Current Status

The implementation is complete and ready. Once you have the correct **Places API Key**, the endpoint will work immediately.

## Testing

After updating with the Places API Key:
```bash
curl "http://localhost:8000/merchants/nearby?lat=40.7128&lng=-74.0060&radius=1000&limit=5"
```

You should see a list of nearby merchants instead of an empty array.

