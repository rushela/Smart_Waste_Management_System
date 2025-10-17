import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token or dev user ID
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Use JWT token if available (user is logged in)
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Fallback to dev user ID if no token (for backward compatibility)
      const DEV_USER_ID = '507f1f77bcf86cd799439011';
      config.headers['x-user-id'] = DEV_USER_ID;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Report APIs
export const reportService = {
  // Get waste summary
  getSummary: (params?: { from?: string; to?: string; area?: string; wasteType?: string }) =>
    api.get('/reports/summary', { params }),

  // Get trends
  getTrends: (params?: { from?: string; to?: string; granularity?: 'daily' | 'weekly' | 'monthly' }) =>
    api.get('/reports/trends', { params }),

  // Get route efficiency
  getRouteEfficiency: (params?: { from?: string; to?: string; routeId?: string }) =>
    api.get('/reports/route-efficiency', { params }),

  // Get user report
  getUserReport: (userId: string, params?: { from?: string; to?: string }) =>
    api.get(`/reports/user/${userId}`, { params }),

  // Get payment reports
  getPayments: (params?: { from?: string; to?: string }) =>
    api.get('/reports/payments', { params }),

  // Custom report configs
  createConfig: (data: { name: string; filters?: any; dateRange?: { from?: string; to?: string } }) =>
    api.post('/reports/config', data),

  getConfigs: () => api.get('/reports/config'),

  updateConfig: (id: string, data: any) => api.put(`/reports/config/${id}`, data),

  deleteConfig: (id: string) => api.delete(`/reports/config/${id}`),

  // Export
  exportPdf: () => {
    window.open(`${API_BASE_URL}/reports/export/pdf`, '_blank');
  },

  exportExcel: () => {
    window.open(`${API_BASE_URL}/reports/export/excel`, '_blank');
  },
};

// User APIs
export const userService = {
  // Placeholder endpoints; no auth
  getProfile: () => Promise.resolve({ data: { name: 'Guest' } }),
  updateProfile: (data: any) => Promise.resolve({ data }),
  listUsers: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get('/users', { params }),
};

export default api;

// Payment-specific client helpers (optional usage from pages)
export const paymentsApi = {
  listHistory: (headers?: any) => api.get('/payments/history/me', { headers }),
  createPayment: (data: any, headers?: any) => api.post('/payments', data, { headers }),
  createPayback: (data: any, headers?: any) => api.post('/payments/payback', data, { headers }),
  summary: () => api.get('/payments/summary'),
  pricing: {
    list: () => api.get('/pricing'),
    create: (data: any) => api.post('/pricing', data),
    update: (id: string, data: any) => api.put(`/pricing/${id}`, data),
    remove: (id: string) => api.delete(`/pricing/${id}`),
  }
};
