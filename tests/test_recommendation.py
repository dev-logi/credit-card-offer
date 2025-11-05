"""Tests for the recommendation engine."""

import pytest
from datetime import date, timedelta

from app.services.recommendation import RecommendationEngine
from app.models import Offer, CategoryBonus


class TestRecommendationEngine:
    """Test cases for the recommendation engine."""
    
    def test_recommend_with_category_bonus(self, db, sample_customer, sample_cards, sample_merchants):
        """Test recommendation based on category bonus."""
        engine = RecommendationEngine(db)
        
        recommendations = engine.recommend(
            customer_id=sample_customer.id,
            merchant_name="Whole Foods",
            purchase_amount=100.0,
            top_n=3
        )
        
        assert len(recommendations) == 3
        
        # Card 1 should win with 5% grocery bonus
        top_card = recommendations[0]
        assert top_card.card_id == "test_card_1"
        assert top_card.reward_rate == 5.0
        assert top_card.estimated_reward == 5.0
        assert "grocery" in top_card.reason.lower()
        
        # Card 2 should be second with 2% base rate
        second_card = recommendations[1]
        assert second_card.card_id == "test_card_2"
        assert second_card.reward_rate == 2.0
        assert second_card.estimated_reward == 2.0
    
    def test_recommend_with_merchant_offer(self, db, sample_customer, sample_cards, sample_merchants, sample_offer):
        """Test that merchant-specific offers take priority."""
        engine = RecommendationEngine(db)
        
        recommendations = engine.recommend(
            customer_id=sample_customer.id,
            merchant_name="Whole Foods",
            purchase_amount=100.0,
            top_n=1
        )
        
        # Should recommend card with 10% merchant offer
        top_card = recommendations[0]
        assert top_card.card_id == "test_card_1"
        assert top_card.reward_rate == 10.0
        assert top_card.estimated_reward == 10.0
        assert "10" in top_card.reason or "whole foods" in top_card.reason.lower()
    
    def test_recommend_dining_category(self, db, sample_customer, sample_cards, sample_merchants):
        """Test recommendation for dining category."""
        engine = RecommendationEngine(db)
        
        recommendations = engine.recommend(
            customer_id=sample_customer.id,
            merchant_name="Chipotle",
            purchase_amount=50.0,
            top_n=2
        )
        
        # Card 3 (Amex Gold) should win with 4% dining bonus
        top_card = recommendations[0]
        assert top_card.card_id == "test_card_3"
        assert top_card.reward_rate == 4.0
        assert top_card.estimated_reward == 2.0  # 50 * 0.04
        assert "dining" in top_card.reason.lower()
    
    def test_recommend_no_bonus(self, db, sample_customer, sample_cards, sample_merchants):
        """Test recommendation when no bonuses apply (falls back to base rate)."""
        engine = RecommendationEngine(db)
        
        recommendations = engine.recommend(
            customer_id=sample_customer.id,
            merchant_name="Shell",  # gas station - no bonuses
            purchase_amount=40.0,
            top_n=1
        )
        
        # Card 2 (Citi Double Cash) should win with 2% base rate
        top_card = recommendations[0]
        assert top_card.card_id == "test_card_2"
        assert top_card.reward_rate == 2.0
        assert top_card.estimated_reward == 0.8  # 40 * 0.02
    
    def test_expired_offer_not_recommended(self, db, sample_customer, sample_cards, sample_merchants):
        """Test that expired offers are not considered."""
        # Add an expired offer
        expired_offer = Offer(
            card_id="test_card_1",
            description="Expired offer",
            merchant_name="Whole Foods",
            bonus_rate=20.0,
            expiry_date=date.today() - timedelta(days=1)  # Expired yesterday
        )
        db.add(expired_offer)
        db.commit()
        
        engine = RecommendationEngine(db)
        
        recommendations = engine.recommend(
            customer_id=sample_customer.id,
            merchant_name="Whole Foods",
            purchase_amount=100.0,
            top_n=1
        )
        
        # Should not use expired 20% offer, should use 5% category bonus instead
        top_card = recommendations[0]
        assert top_card.reward_rate == 5.0  # Not 20%
    
    def test_time_limited_category_bonus(self, db, sample_customer, sample_cards, sample_merchants):
        """Test that time-limited category bonuses are respected."""
        # Add future category bonus
        future_bonus = CategoryBonus(
            card_id="test_card_2",
            category="grocery",
            reward_rate=10.0,
            start_date=date.today() + timedelta(days=30),
            end_date=date.today() + timedelta(days=60)
        )
        db.add(future_bonus)
        db.commit()
        
        engine = RecommendationEngine(db)
        
        recommendations = engine.recommend(
            customer_id=sample_customer.id,
            merchant_name="Whole Foods",
            purchase_amount=100.0,
            top_n=2
        )
        
        # Card 2 should not benefit from future bonus yet
        card2_rec = next(r for r in recommendations if r.card_id == "test_card_2")
        assert card2_rec.reward_rate == 2.0  # Base rate, not 10%
    
    def test_empty_customer_cards(self, db, sample_merchants):
        """Test behavior when customer has no cards."""
        # Create customer without cards
        from app.models import Customer
        customer = Customer(
            id="empty_cust",
            name="Empty User",
            email="empty@example.com"
        )
        db.add(customer)
        db.commit()
        
        engine = RecommendationEngine(db)
        
        recommendations = engine.recommend(
            customer_id="empty_cust",
            merchant_name="Whole Foods",
            purchase_amount=100.0
        )
        
        assert len(recommendations) == 0
    
    def test_nonexistent_customer(self, db, sample_merchants):
        """Test behavior with nonexistent customer."""
        engine = RecommendationEngine(db)
        
        recommendations = engine.recommend(
            customer_id="nonexistent",
            merchant_name="Whole Foods",
            purchase_amount=100.0
        )
        
        assert len(recommendations) == 0
    
    def test_top_n_limit(self, db, sample_customer, sample_cards, sample_merchants):
        """Test that top_n parameter correctly limits results."""
        engine = RecommendationEngine(db)
        
        # Request only 1 recommendation
        recommendations = engine.recommend(
            customer_id=sample_customer.id,
            merchant_name="Whole Foods",
            purchase_amount=100.0,
            top_n=1
        )
        
        assert len(recommendations) == 1
        
        # Request all 3
        recommendations = engine.recommend(
            customer_id=sample_customer.id,
            merchant_name="Whole Foods",
            purchase_amount=100.0,
            top_n=5  # Request more than available
        )
        
        assert len(recommendations) == 3  # Only 3 cards available



