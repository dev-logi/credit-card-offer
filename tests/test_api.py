"""Tests for API endpoints."""

import pytest
from datetime import date


class TestRecommendationAPI:
    """Test cases for recommendation API endpoint."""
    
    def test_recommend_success(self, client, sample_customer, sample_cards, sample_merchants):
        """Test successful recommendation request."""
        response = client.post(
            "/recommend/",
            json={
                "customer_id": sample_customer.id,
                "merchant_name": "Whole Foods",
                "purchase_amount": 100.0,
                "top_n": 2
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert "recommendations" in data
        assert "merchant_info" in data
        assert len(data["recommendations"]) == 2
        
        # Check recommendation structure
        rec = data["recommendations"][0]
        assert "rank" in rec
        assert "card_id" in rec
        assert "card_name" in rec
        assert "estimated_reward" in rec
        assert "reward_rate" in rec
        assert "reason" in rec
        
        # Check merchant info
        merchant_info = data["merchant_info"]
        assert merchant_info["merchant_name"] == "Whole Foods"
        assert "grocery" in merchant_info["identified_categories"]
    
    def test_recommend_invalid_customer(self, client, sample_merchants):
        """Test recommendation with nonexistent customer."""
        # sample_merchants ensures the merchant_categories table exists
        response = client.post(
            "/recommend/",
            json={
                "customer_id": "nonexistent",
                "merchant_name": "Whole Foods",
                "purchase_amount": 100.0
            }
        )
        
        assert response.status_code == 404
    
    def test_recommend_negative_amount(self, client, sample_customer):
        """Test validation for negative purchase amount."""
        response = client.post(
            "/recommend/",
            json={
                "customer_id": sample_customer.id,
                "merchant_name": "Whole Foods",
                "purchase_amount": -50.0
            }
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_recommend_zero_amount(self, client, sample_customer):
        """Test validation for zero purchase amount."""
        response = client.post(
            "/recommend/",
            json={
                "customer_id": sample_customer.id,
                "merchant_name": "Whole Foods",
                "purchase_amount": 0
            }
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_recommend_default_top_n(self, client, sample_customer, sample_cards, sample_merchants):
        """Test that top_n defaults to 1."""
        response = client.post(
            "/recommend/",
            json={
                "customer_id": sample_customer.id,
                "merchant_name": "Whole Foods",
                "purchase_amount": 100.0
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert len(data["recommendations"]) == 1


class TestCustomerAPI:
    """Test cases for customer management endpoints."""
    
    def test_create_customer(self, client, sample_merchants):
        """Test customer creation."""
        # sample_merchants ensures tables exist
        response = client.post(
            "/customers/",
            json={
                "id": "new_cust",
                "name": "New Customer",
                "email": "new@example.com"
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["id"] == "new_cust"
        assert data["name"] == "New Customer"
    
    def test_create_duplicate_customer(self, client, sample_customer):
        """Test that duplicate customer creation fails."""
        response = client.post(
            "/customers/",
            json={
                "id": sample_customer.id,
                "name": "Duplicate",
                "email": "dup@example.com"
            }
        )
        
        assert response.status_code == 400
    
    def test_get_customer(self, client, sample_customer):
        """Test getting customer details."""
        response = client.get(f"/customers/{sample_customer.id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == sample_customer.id
        assert data["name"] == sample_customer.name
    
    def test_get_nonexistent_customer(self, client, sample_merchants):
        """Test getting nonexistent customer."""
        # sample_merchants ensures tables exist
        response = client.get("/customers/nonexistent")
        assert response.status_code == 404
    
    def test_get_customer_cards(self, client, sample_customer, sample_cards):
        """Test getting customer's cards."""
        response = client.get(f"/customers/{sample_customer.id}/cards")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3
        assert all("card_name" in card for card in data)
    
    def test_add_card_to_customer(self, client, sample_customer, sample_merchants):
        """Test adding a card to customer."""
        # sample_merchants ensures tables exist
        response = client.post(
            f"/customers/{sample_customer.id}/cards",
            json={
                "id": "new_card",
                "card_name": "New Card",
                "issuer": "Bank",
                "last_four": "0000",
                "base_reward_rate": 1.5
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["id"] == "new_card"
        assert data["base_reward_rate"] == 1.5
    
    def test_add_category_bonus(self, client, sample_customer, sample_cards, sample_merchants):
        """Test adding a category bonus to a card."""
        # sample_merchants ensures tables exist
        response = client.post(
            f"/customers/{sample_customer.id}/cards/{sample_cards[0].id}/bonuses",
            json={
                "category": "travel",
                "reward_rate": 3.0
            }
        )
        
        assert response.status_code == 201
    
    def test_add_offer(self, client, sample_customer, sample_cards, sample_merchants):
        """Test adding an offer to a card."""
        # sample_merchants ensures tables exist
        response = client.post(
            f"/customers/{sample_customer.id}/cards/{sample_cards[0].id}/offers",
            json={
                "description": "Test offer",
                "merchant_name": "Test Merchant",
                "bonus_rate": 5.0
            }
        )
        
        assert response.status_code == 201


class TestSystemEndpoints:
    """Test system/utility endpoints."""
    
    def test_root_endpoint(self, client):
        """Test root endpoint."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "service" in data
        assert "version" in data
    
    def test_health_check(self, client):
        """Test health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"


