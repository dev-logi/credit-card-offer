"""Core recommendation engine for credit card selection."""

from typing import List, Optional
from datetime import date, datetime
from sqlalchemy.orm import Session
from dataclasses import dataclass

from app.models import Customer, CreditCard, CategoryBonus, Offer, MerchantCategory
from app.schemas import CardRecommendation
from app.services.merchant_matcher import MerchantMatcher


@dataclass
class CardScore:
    """Internal scoring result for a credit card."""
    card: CreditCard
    reward_rate: float
    reward_value: float
    reason: str
    categories_matched: List[str]


class RecommendationEngine:
    """Engine to score and rank credit cards for purchase recommendations."""
    
    def __init__(self, db: Session):
        self.db = db
        self.merchant_matcher = MerchantMatcher(db)
    
    def recommend(
        self,
        customer_id: str,
        merchant_name: str,
        purchase_amount: Optional[float] = None,
        top_n: int = 1,
        transaction_date: Optional[date] = None
    ) -> List[CardRecommendation]:
        """
        Generate top N credit card recommendations for a purchase.
        
        Args:
            customer_id: Customer identifier
            merchant_name: Name of merchant where purchase is being made
            purchase_amount: Purchase amount in dollars (optional)
            top_n: Number of recommendations to return
            transaction_date: Date of transaction (defaults to today)
        
        Returns:
            List of CardRecommendation objects, sorted by reward value (or rate if no amount)
        """
        if transaction_date is None:
            transaction_date = date.today()
        
        # 1. Get customer and their cards
        customer = self.db.query(Customer).filter(Customer.id == customer_id).first()
        if not customer or not customer.cards:
            return []
        
        # 2. Identify merchant categories and accepted networks
        categories = self.merchant_matcher.match(merchant_name)
        accepted_networks = self._get_accepted_networks(merchant_name)
        
        # 3. Filter cards by accepted networks
        eligible_cards = []
        rejected_cards = []
        for card in customer.cards:
            if self._is_card_accepted(card, accepted_networks):
                eligible_cards.append(card)
            else:
                rejected_cards.append((card, accepted_networks))
        
        if not eligible_cards:
            return []
        
        # 4. Score each eligible card (use 100.0 as default for comparison if no amount given)
        reference_amount = purchase_amount if purchase_amount else 100.0
        scored_cards = []
        for card in eligible_cards:
            score = self.calculate_card_score(
                card=card,
                merchant_name=merchant_name,
                categories=categories,
                purchase_amount=reference_amount,
                transaction_date=transaction_date
            )
            scored_cards.append(score)
        
        # 4. Sort by reward rate (descending) - rate is what matters without amount
        scored_cards.sort(key=lambda x: x.reward_rate, reverse=True)
        
        # 5. Convert to response format
        recommendations = []
        best_rate = scored_cards[0].reward_rate if scored_cards else 0
        
        for rank, score in enumerate(scored_cards[:top_n], start=1):
            # Generate comparison text
            comparison = self._generate_comparison(
                score, 
                scored_cards, 
                rank, 
                purchase_amount
            )
            
            recommendations.append(
                CardRecommendation(
                    rank=rank,
                    card_id=score.card.id,
                    card_name=score.card.card_name,
                    last_four=score.card.last_four,
                    estimated_reward=round(score.reward_value, 2) if purchase_amount else None,
                    reward_rate=score.reward_rate,
                    reason=score.reason,
                    details=self._format_reward_details(score.reward_value, score.reward_rate, purchase_amount),
                    comparison=comparison
                )
            )
        
        return recommendations
    
    def calculate_card_score(
        self,
        card: CreditCard,
        merchant_name: str,
        categories: List[str],
        purchase_amount: float,
        transaction_date: date
    ) -> CardScore:
        """
        Calculate reward score for a specific card.
        
        Priority order:
        1. Merchant-specific offers
        2. Category bonuses
        3. Base reward rate
        
        For points/miles cards, effective value = rate × points_value
        """
        # Get effective multiplier for points/miles cards
        points_multiplier = card.points_value if card.points_value else 1.0
        
        # Priority 1: Check for merchant-specific offers
        merchant_offer = self._find_merchant_offer(card, merchant_name, transaction_date)
        if merchant_offer:
            total_rate = card.base_reward_rate + merchant_offer.bonus_rate
            effective_rate = total_rate * points_multiplier
            reward_value = purchase_amount * (effective_rate / 100)
            reason = self._format_reward_reason(total_rate, card.reward_type, None, merchant_offer.description)
            return CardScore(
                card=card,
                reward_rate=effective_rate,
                reward_value=reward_value,
                reason=reason,
                categories_matched=categories
            )
        
        # Priority 2: Check for category-specific bonuses
        best_category_rate = card.base_reward_rate
        matching_category = None
        
        for category in categories:
            bonus = self._find_category_bonus(card, category, transaction_date)
            if bonus and bonus.reward_rate > best_category_rate:
                best_category_rate = bonus.reward_rate
                matching_category = category
        
        if matching_category:
            effective_rate = best_category_rate * points_multiplier
            reward_value = purchase_amount * (effective_rate / 100)
            reason = self._format_reward_reason(best_category_rate, card.reward_type, matching_category)
            return CardScore(
                card=card,
                reward_rate=effective_rate,
                reward_value=reward_value,
                reason=reason,
                categories_matched=[matching_category]
            )
        
        # Priority 3: Base reward rate
        effective_rate = card.base_reward_rate * points_multiplier
        reward_value = purchase_amount * (effective_rate / 100)
        reason = self._format_reward_reason(card.base_reward_rate, card.reward_type, None)
        return CardScore(
            card=card,
            reward_rate=effective_rate,
            reward_value=reward_value,
            reason=reason,
            categories_matched=categories
        )
    
    def _find_merchant_offer(
        self,
        card: CreditCard,
        merchant_name: str,
        transaction_date: date
    ) -> Optional[Offer]:
        """Find active merchant-specific offer for card."""
        for offer in card.offers:
            # Check if offer is for this merchant
            if offer.merchant_name:
                if merchant_name.lower() in offer.merchant_name.lower():
                    # Check if offer is not expired
                    if offer.expiry_date is None or offer.expiry_date >= transaction_date:
                        return offer
        return None
    
    def _find_category_bonus(
        self,
        card: CreditCard,
        category: str,
        transaction_date: date
    ) -> Optional[CategoryBonus]:
        """Find active category bonus for card."""
        best_bonus = None
        
        for bonus in card.category_bonuses:
            if bonus.category.lower() == category.lower():
                # Check if bonus is active
                is_active = True
                if bonus.start_date and bonus.start_date > transaction_date:
                    is_active = False
                if bonus.end_date and bonus.end_date < transaction_date:
                    is_active = False
                
                if is_active:
                    if best_bonus is None or bonus.reward_rate > best_bonus.reward_rate:
                        best_bonus = bonus
        
        return best_bonus
    
    def _format_reward_reason(
        self, 
        rate: float, 
        reward_type: str, 
        category: Optional[str] = None,
        special_offer: Optional[str] = None
    ) -> str:
        """
        Format reward reason based on card type and earning category.
        
        Args:
            rate: The earning rate (e.g., 2.0 for 2x)
            reward_type: 'cashback', 'points', or 'miles'
            category: Optional category name (e.g., 'grocery', 'travel')
            special_offer: Optional special offer description
        
        Returns:
            Formatted reason string
        """
        # Format the rate based on reward type
        if reward_type == 'cashback':
            rate_text = f"{rate}%"
        elif reward_type in ('points', 'miles'):
            rate_text = f"{rate}x {reward_type}"
        else:
            rate_text = f"{rate}%"
        
        # Build the reason
        if special_offer:
            return f"{rate_text} via {special_offer}"
        elif category:
            return f"{rate_text} on {category} purchases"
        else:
            return f"{rate_text} on all purchases"
    
    def _format_reward_details(self, reward_value: float, reward_rate: float, purchase_amount: Optional[float]) -> str:
        """Format reward details as readable string."""
        if purchase_amount:
            return f"${reward_value:.2f} value ({reward_rate}% effective rewards)"
        else:
            return f"{reward_rate}% effective rewards on this purchase"
    
    def _generate_comparison(
        self, 
        current_score: CardScore, 
        all_scores: List[CardScore],
        rank: int,
        purchase_amount: Optional[float]
    ) -> str:
        """
        Generate comparison text explaining why this card is best (or how it compares).
        
        Args:
            current_score: Score for the current card
            all_scores: All card scores sorted by reward rate (descending)
            rank: Current rank (1 = best)
            purchase_amount: Optional purchase amount
        
        Returns:
            Comparison text
        """
        if len(all_scores) == 1:
            return "This is your only card."
        
        if rank == 1:
            # This is the best card - compare to second best
            if len(all_scores) > 1:
                second_best = all_scores[1]
                rate_diff = current_score.reward_rate - second_best.reward_rate
                
                if rate_diff > 0.01:  # Meaningful difference
                    comparison_parts = [
                        f"Best choice! Earns {rate_diff:.1f}% more than {second_best.card.card_name}"
                    ]
                    
                    # Add other inferior cards
                    other_cards = [s.card.card_name for s in all_scores[1:4] if s.reward_rate < current_score.reward_rate]
                    if len(other_cards) > 1:
                        comparison_parts.append(f"Also beats: {', '.join(other_cards[:2])}")
                    
                    # Add dollar difference if amount provided
                    if purchase_amount:
                        value_diff = current_score.reward_value - second_best.reward_value
                        if value_diff > 0.5:
                            comparison_parts.append(f"(${value_diff:.2f} more back)")
                    
                    return ". ".join(comparison_parts) + "."
                else:
                    return f"Tied with {second_best.card.card_name} at {current_score.reward_rate}%."
            return "Best option among your cards."
        else:
            # Not the best - explain the gap
            best_score = all_scores[0]
            rate_diff = best_score.reward_rate - current_score.reward_rate
            
            if rate_diff < 0.01:
                return f"Tied with {best_score.card.card_name} for best rate."
            
            comparison = f"Earns {rate_diff:.1f}% less than {best_score.card.card_name}"
            
            if purchase_amount:
                value_diff = best_score.reward_value - current_score.reward_value
                if value_diff > 0.5:
                    comparison += f" (${value_diff:.2f} less back)"
            
            return comparison + "."
    
    def _get_accepted_networks(self, merchant_name: str) -> Optional[List[str]]:
        """
        Get list of accepted card networks for a merchant.
        Returns None if all networks accepted (or merchant not in database).
        """
        merchant = self.db.query(MerchantCategory).filter(
            MerchantCategory.merchant_name == merchant_name.lower()
        ).first()
        
        if merchant and merchant.accepted_networks:
            return merchant.accepted_networks
        return None  # Accept all networks if not specified
    
    def _is_card_accepted(self, card: CreditCard, accepted_networks: Optional[List[str]]) -> bool:
        """
        Check if a card's network is accepted by the merchant.
        
        Args:
            card: Credit card to check
            accepted_networks: List of accepted networks, or None if all accepted
        
        Returns:
            True if card is accepted, False otherwise
        """
        # If no restrictions, all cards accepted
        if accepted_networks is None:
            return True
        
        # If card has no network info, assume it's accepted
        if not card.network:
            return True
        
        # Check if card network is in accepted list
        return card.network.lower() in [n.lower() for n in accepted_networks]


