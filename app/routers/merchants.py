"""Merchants endpoints for location-based merchant discovery."""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from app.schemas import NearbyMerchantsResponse, NearbyMerchant
from app.services.location_service import FoursquareLocationService
from app.config.settings import settings

router = APIRouter(prefix="/merchants", tags=["merchants"])


@router.get("/nearby", response_model=NearbyMerchantsResponse)
def get_nearby_merchants(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius: Optional[int] = Query(None, description="Search radius in meters (default: 5000)"),
    limit: Optional[int] = Query(None, description="Maximum number of results (default: 20)"),
):
    """
    Get nearby merchants based on user's location.
    
    Uses Foursquare Places API to find nearby stores, restaurants, and other merchants.
    Returns empty list if location service is unavailable (frontend should fallback to popular stores).
    
    Args:
        lat: Latitude coordinate
        lng: Longitude coordinate
        radius: Search radius in meters (default: 5000)
        limit: Maximum number of results (default: 20)
        
    Returns:
        NearbyMerchantsResponse with list of nearby merchants
    """
    # Validate coordinates
    if not (-90 <= lat <= 90):
        raise HTTPException(status_code=400, detail="Latitude must be between -90 and 90")
    if not (-180 <= lng <= 180):
        raise HTTPException(status_code=400, detail="Longitude must be between -180 and 180")
    
    # Use defaults from settings if not provided
    search_radius = radius or settings.FOURSQUARE_DEFAULT_RADIUS
    result_limit = limit or settings.FOURSQUARE_DEFAULT_LIMIT
    
    # Validate radius and limit
    if search_radius < 100 or search_radius > 50000:
        raise HTTPException(status_code=400, detail="Radius must be between 100 and 50000 meters")
    if result_limit < 1 or result_limit > 50:
        raise HTTPException(status_code=400, detail="Limit must be between 1 and 50")
    
    try:
        # Initialize location service
        location_service = FoursquareLocationService()
        
        # Get nearby places
        places = location_service.get_nearby_places(
            lat=lat,
            lng=lng,
            radius=search_radius,
            limit=result_limit
        )
        
        # Transform to response format
        merchants = [
            NearbyMerchant(
                name=place["name"],
                category=place["category"],
                icon=place["icon"],
                distance=place["distance"],
                address=place.get("address")
            )
            for place in places
        ]
        
        return NearbyMerchantsResponse(
            merchants=merchants,
            location={"lat": lat, "lng": lng}
        )
        
    except ValueError as e:
        # API key not configured
        # Return empty list instead of error for graceful degradation
        return NearbyMerchantsResponse(
            merchants=[],
            location={"lat": lat, "lng": lng}
        )
    except Exception as e:
        # Any other error - return empty list for graceful degradation
        print(f"Error getting nearby merchants: {e}")
        return NearbyMerchantsResponse(
            merchants=[],
            location={"lat": lat, "lng": lng}
        )

