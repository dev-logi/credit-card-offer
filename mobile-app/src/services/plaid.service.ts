import { apiService } from './api.service';

/**
 * Plaid service for handling Plaid Link integration.
 * Note: This is a wrapper around the Plaid Link SDK.
 * The actual SDK initialization will be done in PlaidLinkScreen.
 */
export class PlaidService {
  /**
   * Create a Plaid link token for the customer.
   */
  static async createLinkToken(customerId: string): Promise<string> {
    const response = await apiService.createPlaidLinkToken(customerId);
    return response.link_token;
  }
}

