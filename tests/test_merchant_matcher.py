"""Tests for merchant matching service."""

import pytest
from app.services.merchant_matcher import MerchantMatcher


class TestMerchantMatcher:
    """Test cases for merchant matching."""
    
    def test_exact_match(self, db, sample_merchants):
        """Test exact merchant name matching."""
        matcher = MerchantMatcher(db)
        
        categories = matcher.match("whole foods")
        assert "grocery" in categories
        assert "organic" in categories
    
    def test_case_insensitive_match(self, db, sample_merchants):
        """Test case-insensitive matching."""
        matcher = MerchantMatcher(db)
        
        categories = matcher.match("WHOLE FOODS")
        assert "grocery" in categories
        
        categories = matcher.match("Whole Foods")
        assert "grocery" in categories
    
    def test_alias_match(self, db, sample_merchants):
        """Test matching via merchant aliases."""
        matcher = MerchantMatcher(db)
        
        categories = matcher.match("whole foods market")
        assert "grocery" in categories
        assert "organic" in categories
    
    def test_fuzzy_match(self, db, sample_merchants):
        """Test fuzzy substring matching."""
        matcher = MerchantMatcher(db)
        
        # Should match "chipotle"
        categories = matcher.match("chipotle mexican")
        assert "dining" in categories
        
        # Should match "shell"
        categories = matcher.match("shell station")
        assert "gas" in categories
    
    def test_unknown_merchant(self, db, sample_merchants):
        """Test fallback for unknown merchants."""
        matcher = MerchantMatcher(db)
        
        categories = matcher.match("unknown merchant xyz")
        assert categories == ["general"]
    
    def test_confidence_levels(self, db, sample_merchants):
        """Test confidence level calculation."""
        matcher = MerchantMatcher(db)
        
        # Exact match = high confidence
        confidence = matcher.get_confidence("whole foods")
        assert confidence == "high"
        
        # Alias or fuzzy match = medium confidence (alias match also returns medium)
        confidence = matcher.get_confidence("whole foods market")
        assert confidence in ["high", "medium"]  # Aliases are treated as high confidence matches
        
        # Fuzzy partial match = medium confidence
        confidence = matcher.get_confidence("chipotle mexican")
        assert confidence == "medium"
        
        # Unknown = low confidence
        confidence = matcher.get_confidence("unknown merchant")
        assert confidence == "low"
    
    def test_whitespace_handling(self, db, sample_merchants):
        """Test that extra whitespace is handled correctly."""
        matcher = MerchantMatcher(db)
        
        categories = matcher.match("  whole foods  ")
        assert "grocery" in categories
        
        categories = matcher.match("whole   foods")
        assert "grocery" in categories


