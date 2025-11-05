"""Merchant matching service to identify categories from merchant names."""

from typing import List, Dict
from sqlalchemy.orm import Session
from app.models import MerchantCategory


class MerchantMatcher:
    """Matches merchant names to categories using lookup table and fuzzy matching."""
    
    def __init__(self, db: Session):
        self.db = db
        self.merchant_map = self._load_merchants()
    
    def _load_merchants(self) -> Dict[str, List[str]]:
        """Load all merchants from database into memory for fast lookup."""
        merchant_map = {}
        merchants = self.db.query(MerchantCategory).all()
        
        for merchant in merchants:
            normalized_name = merchant.merchant_name.lower().strip()
            merchant_map[normalized_name] = merchant.categories
            
            # Add aliases if they exist
            if merchant.aliases:
                for alias in merchant.aliases:
                    alias_normalized = alias.lower().strip()
                    merchant_map[alias_normalized] = merchant.categories
        
        return merchant_map
    
    def match(self, merchant_name: str) -> List[str]:
        """
        Match merchant name to categories.
        
        Returns list of categories (e.g., ["grocery", "organic"]).
        Falls back to ["general"] if no match found.
        """
        normalized = merchant_name.lower().strip()
        
        # Try exact match first
        if normalized in self.merchant_map:
            return self.merchant_map[normalized]
        
        # Try fuzzy match (substring matching)
        for key, categories in self.merchant_map.items():
            if normalized in key or key in normalized:
                return categories
        
        # Try partial word match
        words = normalized.split()
        for word in words:
            if len(word) > 3:  # Only match meaningful words
                for key, categories in self.merchant_map.items():
                    if word in key:
                        return categories
        
        # Default fallback
        return ["general"]
    
    def get_confidence(self, merchant_name: str) -> str:
        """
        Return confidence level of the match.
        """
        normalized = merchant_name.lower().strip()
        
        # Exact match
        if normalized in self.merchant_map:
            return "high"
        
        # Fuzzy match
        for key in self.merchant_map.keys():
            if normalized in key or key in normalized:
                return "medium"
        
        # Partial match or default
        return "low"



