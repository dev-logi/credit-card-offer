"""Plaid service for credit card linking and metadata extraction."""

from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.config.settings import settings
from app.models import CreditCard


class PlaidService:
    """Service for interacting with Plaid API."""
    
    def __init__(self):
        """Initialize Plaid client."""
        # Plaid client will be initialized here once API keys are available
        self.client = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize Plaid client with credentials."""
        # TODO: Initialize Plaid client once API keys are available
        # from plaid.api import plaid_api
        # from plaid.configuration import Configuration
        # from plaid.api_client import ApiClient
        # 
        # configuration = Configuration(
        #     host=plaid.Environment.sandbox if settings.PLAID_ENVIRONMENT == "sandbox" else plaid.Environment.production,
        #     api_key={
        #         'clientId': settings.PLAID_CLIENT_ID,
        #         'secret': settings.PLAID_SECRET_SANDBOX if settings.PLAID_ENVIRONMENT == "sandbox" else settings.PLAID_SECRET_PRODUCTION
        #     }
        # )
        # api_client = ApiClient(configuration)
        # self.client = plaid_api.PlaidApi(api_client)
        pass
    
    def exchange_public_token(self, public_token: str) -> Dict[str, Any]:
        """
        Exchange Plaid public token for access token.
        
        Args:
            public_token: Public token from Plaid Link SDK
            
        Returns:
            Dictionary with access_token and item_id
        """
        # TODO: Implement once Plaid client is initialized
        # item_public_token_exchange_request = ItemPublicTokenExchangeRequest(
        #     public_token=public_token
        # )
        # response = self.client.item_public_token_exchange(item_public_token_exchange_request)
        # return {
        #     'access_token': response['access_token'],
        #     'item_id': response['item_id']
        # }
        raise NotImplementedError("Plaid client not initialized. Please add API keys to .env file.")
    
    def get_accounts(self, access_token: str) -> list:
        """
        Fetch accounts for a Plaid item.
        
        Args:
            access_token: Plaid access token
            
        Returns:
            List of account dictionaries
        """
        # TODO: Implement once Plaid client is initialized
        # accounts_get_request = AccountsGetRequest(access_token=access_token)
        # response = self.client.accounts_get(accounts_get_request)
        # return response['accounts']
        raise NotImplementedError("Plaid client not initialized. Please add API keys to .env file.")
    
    def extract_card_metadata(self, account: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract card metadata from Plaid account.
        
        Args:
            account: Plaid account dictionary
            
        Returns:
            Dictionary with card_type, network, last_four, issuer
        """
        # Extract metadata from account
        card_type = account.get('type', 'unknown')
        mask = account.get('mask')  # Last 4 digits
        name = account.get('name', '')
        
        # Determine network from account subtype or name
        network = self._determine_network(account)
        
        # Extract issuer from institution or account name
        issuer = self._identify_issuer(account)
        
        return {
            'card_type': card_type,
            'network': network,
            'last_four': mask or '0000',
            'issuer': issuer,
            'account_name': name
        }
    
    def _determine_network(self, account: Dict[str, Any]) -> Optional[str]:
        """Determine card network from Plaid account data."""
        subtype = account.get('subtype', '').lower()
        name = account.get('name', '').lower()
        
        # Check subtype first
        if 'visa' in subtype or 'visa' in name:
            return 'visa'
        elif 'mastercard' in subtype or 'mastercard' in name or 'master' in subtype:
            return 'mastercard'
        elif 'amex' in subtype or 'american express' in name or 'amex' in name:
            return 'amex'
        elif 'discover' in subtype or 'discover' in name:
            return 'discover'
        
        return None
    
    def _identify_issuer(self, account: Dict[str, Any]) -> str:
        """
        Identify card issuer from Plaid account data.
        
        Maps Plaid institution names to our issuer names.
        """
        # This will be populated from Plaid institution data
        # For now, try to extract from account name
        name = account.get('name', '').lower()
        institution_name = account.get('institution_name', '').lower()
        
        # Common issuer mappings
        issuer_mappings = {
            'chase': 'Chase',
            'american express': 'American Express',
            'amex': 'American Express',
            'capital one': 'Capital One',
            'citi': 'Citi',
            'citibank': 'Citi',
            'bank of america': 'Bank of America',
            'bofa': 'Bank of America',
            'wells fargo': 'Wells Fargo',
            'discover': 'Discover',
        }
        
        # Check institution name first
        for key, issuer in issuer_mappings.items():
            if key in institution_name:
                return issuer
        
        # Check account name
        for key, issuer in issuer_mappings.items():
            if key in name:
                return issuer
        
        # Default to "Unknown" if no match
        return "Unknown"
    
    def match_to_template(self, issuer: str, network: Optional[str], db: Session) -> Optional[CreditCard]:
        """
        Match Plaid card to template card in database.
        
        Uses same matching logic as manual card selection.
        
        Args:
            issuer: Card issuer name
            network: Card network (visa, mastercard, amex, discover)
            db: Database session
            
        Returns:
            Template CreditCard if match found, None otherwise
        """
        # Try to find template card by issuer (same logic as add_card_to_customer)
        # We'll match by issuer name, and optionally by network if available
        template_query = db.query(CreditCard).filter(
            CreditCard.issuer == issuer,
            CreditCard.customer_id.is_(None)  # Only template cards
        )
        
        # If network is available, prefer cards with matching network
        if network:
            # Try exact match first
            template = template_query.filter(CreditCard.network == network).first()
            if template:
                return template
        
        # Fall back to any card from this issuer
        template = template_query.first()
        return template

