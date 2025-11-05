import axios from 'axios';

// Update this to your computer's local IP when testing on device
// Run `ipconfig getifaddr en0` on Mac to get your IP
const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const apiService = {
  // Customer APIs
  createCustomer: async (customerData) => {
    const response = await api.post('/customers/', customerData);
    return response.data;
  },

  getCustomer: async (customerId) => {
    const response = await api.get(`/customers/${customerId}/`);
    return response.data;
  },

  // Card APIs
  getCustomerCards: async (customerId) => {
    const response = await api.get(`/customers/${customerId}/cards/`);
    return response.data;
  },

  addCard: async (customerId, cardData) => {
    const response = await api.post(`/customers/${customerId}/cards/`, cardData);
    return response.data;
  },

  // Recommendation API
  getRecommendation: async (requestData) => {
    const response = await api.post('/recommend/', requestData);
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health/');
    return response.data;
  },
};

export default api;

