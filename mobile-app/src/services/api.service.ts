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

// Update this to your computer's local IP when testing on device
// Run `ipconfig getifaddr en0` on Mac to get your IP
const API_BASE_URL = 'http://127.0.0.1:8000';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const apiService = {
  // Customer APIs
  createCustomer: async (customerData: CustomerCreate): Promise<Customer> => {
    const response = await api.post<Customer>('/customers/', customerData);
    return response.data;
  },

  getCustomer: async (customerId: string): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${customerId}/`);
    return response.data;
  },

  // Card APIs
  getCustomerCards: async (customerId: string): Promise<CreditCard[]> => {
    const response = await api.get<CreditCard[]>(`/customers/${customerId}/cards/`);
    return response.data;
  },

  addCard: async (customerId: string, cardData: CardCreate): Promise<CreditCard> => {
    const response = await api.post<CreditCard>(`/customers/${customerId}/cards/`, cardData);
    return response.data;
  },

  // Recommendation API
  getRecommendation: async (requestData: RecommendationRequest): Promise<RecommendationResponse> => {
    const response = await api.post<RecommendationResponse>('/recommend/', requestData);
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<HealthCheckResponse> => {
    const response = await api.get<HealthCheckResponse>('/health/');
    return response.data;
  },
};

export default api;

