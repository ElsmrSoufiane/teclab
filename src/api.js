import axios from 'axios';

// ==================== API CONFIGURATION ====================
const API_URL = process.env.REACT_APP_API_URL || 'https://techlabbackend-master-mtobwx.laravel.cloud/api/v1';
console.log('🔧 API URL configured as:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor with debugging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Request:', config.method.toUpperCase(), config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token added to request');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response from', response.config.url, 'Status:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      console.log('🔒 401 Unauthorized - redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== API METHODS ====================

// Favorites API methods
export const favoritesApi = {
  getFavorites: () => api.get('/favorites'),
  addToFavorites: (productId) => api.post(`/favorites/${productId}`),
  removeFromFavorites: (productId) => api.delete(`/favorites/${productId}`),
  checkFavorite: (productId) => api.get(`/favorites/check/${productId}`),
};

// Coupons API methods
export const couponsApi = {
  getCoupons: () => api.get('/coupons'),
  validateCoupon: (code, orderAmount) => api.post('/coupons/validate', { 
    code, 
    order_amount: orderAmount 
  }),
};

// Export the configured axios instance
export default api;
