"""Location service for finding nearby places using external APIs."""

from abc import ABC, abstractmethod
from typing import List, Dict, Optional
import requests
from app.config.settings import settings


class LocationService(ABC):
    """Abstract base class for location services."""
    
    @abstractmethod
    def get_nearby_places(
        self,
        lat: float,
        lng: float,
        radius: int = 5000,
        categories: Optional[List[str]] = None,
        limit: int = 20
    ) -> List[Dict]:
        """
        Get nearby places based on coordinates.
        
        Args:
            lat: Latitude
            lng: Longitude
            radius: Search radius in meters
            categories: List of category filters (optional)
            limit: Maximum number of results
            
        Returns:
            List of place dictionaries with keys: name, category, icon, distance, address
        """
        pass


class FoursquareLocationService(LocationService):
    """Foursquare Places API implementation."""
    
    BASE_URL = "https://places-api.foursquare.com/places/search"
    
    # Map Foursquare category IDs to our merchant categories
    CATEGORY_MAPPING = {
        "13000": "grocery",  # Food & Drink Store
        "13001": "grocery",  # Grocery Store
        "13002": "grocery",  # Supermarket
        "13003": "grocery",  # Convenience Store
        "13026": "grocery",  # Farmers Market
        "13028": "grocery",  # Specialty Food Store
        "13034": "grocery",  # Wholesale Store
        "13035": "grocery",  # Warehouse Store
        "13065": "dining",   # Restaurant
        "13066": "dining",   # Fast Food Restaurant
        "13067": "dining",   # Coffee Shop
        "13068": "dining",   # Bar
        "13069": "dining",   # Food & Drink
        "17000": "retail",   # Retail & Shopping
        "17001": "retail",   # Department Store
        "17002": "retail",   # Shopping Mall
        "17003": "retail",   # Discount Store
        "17004": "retail",   # Electronics Store
        "17005": "retail",   # Clothing Store
        "17006": "retail",   # Home & Garden Store
        "17007": "retail",   # Furniture Store
        "17008": "retail",   # Sporting Goods Store
        "17009": "retail",   # Bookstore
        "17010": "retail",   # Toy Store
        "17011": "retail",   # Jewelry Store
        "17012": "retail",   # Shoe Store
        "17013": "retail",   # Beauty Supply Store
        "17014": "retail",   # Pharmacy
        "17015": "retail",   # Hardware Store
        "17016": "retail",   # Pet Store
        "17017": "retail",   # Office Supply Store
        "17018": "retail",   # Gift Shop
        "17019": "retail",   # Thrift Store
        "17020": "retail",   # Antique Store
        "17021": "retail",   # Art Gallery
        "17022": "retail",   # Music Store
        "17023": "retail",   # Video Game Store
        "17024": "retail",   # Camera Store
        "17025": "retail",   # Bike Store
        "17026": "retail",   # Car Dealership
        "17027": "retail",   # Motorcycle Dealership
        "17028": "retail",   # RV Dealership
        "17029": "retail",   # Boat Dealership
        "17030": "retail",   # ATV Dealership
        "17031": "retail",   # Trailer Dealership
        "17032": "retail",   # Auto Parts Store
        "17033": "retail",   # Tire Store
        "17034": "retail",   # Auto Repair Shop
        "17035": "retail",   # Car Wash
        "17036": "retail",   # Gas Station
        "17037": "retail",   # Parking
        "17038": "retail",   # Car Rental
        "17039": "retail",   # Car Service
        "17040": "retail",   # Car Sharing
        "17041": "retail",   # Car Wash
        "17042": "retail",   # Parking Garage
        "17043": "retail",   # Parking Lot
        "17044": "retail",   # Valet Parking
        "17045": "retail",   # EV Charging Station
        "17046": "retail",   # Gas Station
        "19000": "gas",      # Gas Station
        "19001": "gas",      # EV Charging Station
    }
    
    # Icon mapping based on category
    ICON_MAPPING = {
        "grocery": "🛒",
        "dining": "🍽️",
        "retail": "🛍️",
        "gas": "⛽",
        "coffee": "☕",
        "default": "📍",
    }
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize Foursquare service."""
        self.api_key = api_key or settings.FOURSQUARE_API_KEY
        if not self.api_key:
            raise ValueError("FOURSQUARE_API_KEY is required")
    
    def get_nearby_places(
        self,
        lat: float,
        lng: float,
        radius: int = 5000,
        categories: Optional[List[str]] = None,
        limit: int = 20
    ) -> List[Dict]:
        """
        Get nearby places from Foursquare API.
        
        Args:
            lat: Latitude
            lng: Longitude
            radius: Search radius in meters (default: 5000)
            categories: List of category filters (optional)
            limit: Maximum number of results (default: 20)
            
        Returns:
            List of place dictionaries
        """
        try:
            headers = {
                "Accept": "application/json",
                "Authorization": f"Bearer {self.api_key}",  # Service API Key uses Bearer format
                "X-Places-Api-Version": "2025-06-17",  # Required version header
            }
            
            params = {
                "ll": f"{lat},{lng}",
                "radius": radius,
                "limit": limit,
            }
            
            # Add category filters if provided
            if categories:
                # Map our categories to Foursquare category IDs
                foursquare_categories = self._map_categories_to_foursquare(categories)
                if foursquare_categories:
                    params["categories"] = ",".join(foursquare_categories)
            
            response = requests.get(
                self.BASE_URL,
                headers=headers,
                params=params,
                timeout=10
            )
            response.raise_for_status()
            
            data = response.json()
            places = data.get("results", [])
            
            # Transform Foursquare results to our format
            return self._transform_results(places, lat, lng)
            
        except requests.exceptions.RequestException as e:
            # Log error but don't raise - return empty list for graceful degradation
            print(f"Foursquare API error: {e}")
            return []
        except Exception as e:
            print(f"Unexpected error in Foursquare service: {e}")
            return []
    
    def _map_categories_to_foursquare(self, categories: List[str]) -> List[str]:
        """Map our category names to Foursquare category IDs."""
        # Reverse mapping: find Foursquare category IDs for our categories
        foursquare_ids = []
        for cat in categories:
            for fsq_id, our_cat in self.CATEGORY_MAPPING.items():
                if our_cat == cat.lower() and fsq_id not in foursquare_ids:
                    foursquare_ids.append(fsq_id)
        return foursquare_ids
    
    def _transform_results(self, places: List[Dict], lat: float, lng: float) -> List[Dict]:
        """Transform Foursquare API results to our format."""
        results = []
        
        for place in places:
            try:
                name = place.get("name", "Unknown")
                location = place.get("location", {})
                # Distance is now at top level, not in location object
                distance = place.get("distance", 0)  # Already in meters
                address = location.get("formatted_address", "")
                
                # Determine category from Foursquare categories
                categories = place.get("categories", [])
                category = "retail"  # default
                if categories:
                    # New API uses fsq_category_id (BSON format) instead of integer id
                    # We'll use category name matching as fallback since IDs changed
                    primary_category = categories[0]
                    category_name = primary_category.get("name", "").lower()
                    
                    # Try to match by category name first
                    if any(word in category_name for word in ["grocery", "supermarket", "food", "market"]):
                        category = "grocery"
                    elif any(word in category_name for word in ["restaurant", "dining", "cafe", "coffee"]):
                        category = "dining"
                    elif any(word in category_name for word in ["gas", "fuel", "station"]):
                        category = "gas"
                    else:
                        # Try old ID mapping as fallback (may not work with new BSON IDs)
                        category_id = str(primary_category.get("fsq_category_id", ""))
                        category = self.CATEGORY_MAPPING.get(category_id, "retail")
                
                # Get icon based on category
                icon = self.ICON_MAPPING.get(category, self.ICON_MAPPING["default"])
                
                results.append({
                    "name": name,
                    "category": category,
                    "icon": icon,
                    "distance": distance,
                    "address": address,
                })
            except Exception as e:
                print(f"Error transforming place result: {e}")
                continue
        
        return results

