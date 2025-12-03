# Foursquare Places API Setup

This guide explains how to set up the Foursquare Places API for dynamic nearby merchant discovery.

## Overview

The app uses Foursquare Places API to find nearby stores, restaurants, and merchants based on the user's location. This provides a better user experience by showing relevant nearby options instead of a static list.

## Getting a Foursquare API Key

1. **Sign up for Foursquare Developer Account**
   - Go to https://developer.foursquare.com/
   - Click "Get Started" or "Sign Up"
   - Create a free account

2. **Create a New Project**
   - After logging in, go to "My Apps" or "Projects"
   - Click "Create a new app" or "New Project"
   - Fill in the required information:
     - App Name: "Credit Card Recommender" (or your preferred name)
     - App Type: "Consumer"
     - Description: "Mobile app for credit card recommendations"

3. **Get Your API Key**
   - Once your project is created, you'll see your API credentials
   - Copy the **API Key** (not the API Secret for this implementation)
   - The API key will look like: `fsq3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Free Tier Limits

Foursquare offers a generous free tier:
- **100,000 requests per day**
- Perfect for development and moderate production use
- No credit card required

## Configuration

### Backend Configuration

Add the Foursquare API key to your `.env` file:

```bash
# Foursquare Places API
FOURSQUARE_API_KEY=fsq3xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

The backend will automatically use this key when the `/merchants/nearby` endpoint is called.

### Environment Variables

The following settings are available in `app/config/settings.py`:

- `FOURSQUARE_API_KEY` (required): Your Foursquare API key
- `FOURSQUARE_DEFAULT_RADIUS` (optional): Default search radius in meters (default: 5000)
- `FOURSQUARE_DEFAULT_LIMIT` (optional): Default number of results (default: 20)

## Testing

### Test the Backend Endpoint

You can test the endpoint directly:

```bash
# Using curl
curl "http://localhost:8000/merchants/nearby?lat=37.7749&lng=-122.4194&radius=5000"

# Or visit in browser (Swagger UI)
http://localhost:8000/docs
```

### Test in Mobile App

1. Ensure location permissions are granted
2. Open the "Find Your Best Card" screen
3. The app will automatically request location permission
4. Nearby stores should appear instead of the static "Popular Stores" list

## Fallback Behavior

If the Foursquare API is unavailable or the API key is not configured:
- The backend returns an empty list (graceful degradation)
- The frontend automatically falls back to the static "Popular Stores" list
- No errors are shown to the user

## Switching Location Service Providers

The location service is abstracted through the `LocationService` interface in `app/services/location_service.py`. To switch to a different provider (e.g., Google Places, Yelp):

1. Create a new service class implementing `LocationService`
2. Update `app/routers/merchants.py` to use the new service
3. Update configuration in `app/config/settings.py`
4. No frontend changes needed!

## Troubleshooting

### API Key Not Working
- Verify the API key is correct in `.env`
- Check that the API key hasn't expired
- Ensure you're using the API Key (not API Secret)

### No Nearby Stores Showing
- Check location permissions are granted
- Verify the API key is set correctly
- Check backend logs for API errors
- The app will fallback to popular stores if location is unavailable

### Rate Limit Exceeded
- Foursquare free tier: 100,000 requests/day
- If exceeded, wait until the next day or upgrade your plan
- Consider implementing caching for frequently requested locations

## API Documentation

- Foursquare Places API: https://developer.foursquare.com/reference/place-search
- API Explorer: https://developer.foursquare.com/docs/api-reference/places/search/

