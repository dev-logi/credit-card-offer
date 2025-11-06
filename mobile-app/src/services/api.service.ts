import axios, { AxiosInstance } from 'axios';
import {
  Customer,
  CustomerCreate,
  CreditCard,
  CardCreate,
  RecommendationRequest,
  RecommendationResponse,
  HealthCheckResponse,
} from '../types';

// Production API URL
const API_BASE_URL = 'https://web-production-f63eb.up.railway.app';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds for Railway API (handles cold starts and slower responses)
});

export const apiService = {
  // Customer APIs
  createCustomer: async (customerData: CustomerCreate): Promise<Customer> => {
    const response = await api.post<Customer>('/customers/', customerData);
    return response.data;
  },

  getCustomer: async (customerId: string): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${customerId}`);
    return response.data;
  },

  // Card APIs
  getCustomerCards: async (customerId: string): Promise<CreditCard[]> => {
    const response = await api.get<CreditCard[]>(`/customers/${customerId}/cards`);
    return response.data;
  },

  addCard: async (customerId: string, cardData: CardCreate): Promise<CreditCard> => {
    const response = await api.post<CreditCard>(`/customers/${customerId}/cards`, cardData);
    return response.data;
  },

  // Recommendation API
  getRecommendation: async (requestData: RecommendationRequest): Promise<RecommendationResponse> => {
    const response = await api.post<RecommendationResponse>('/recommend/', requestData);
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<HealthCheckResponse> => {
    const response = await api.get<HealthCheckResponse>('/health');
    return response.data;
  },
};

export default api;

