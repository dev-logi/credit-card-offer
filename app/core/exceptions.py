"""Custom exception classes for the application."""

from fastapi import HTTPException, status


class CardNotFoundException(HTTPException):
    """Raised when a credit card is not found."""
    
    def __init__(self, card_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Card with ID '{card_id}' not found"
        )


class CustomerNotFoundException(HTTPException):
    """Raised when a customer is not found."""
    
    def __init__(self, customer_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Customer with ID '{customer_id}' not found"
        )


class ValidationError(HTTPException):
    """Raised when validation fails."""
    
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail
        )


class DatabaseError(Exception):
    """Raised when a database operation fails."""
    pass


class MerchantNotFound(HTTPException):
    """Raised when a merchant is not found."""
    
    def __init__(self, merchant_name: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Merchant '{merchant_name}' not found"
        )

