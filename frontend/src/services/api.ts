import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth removed: no token headers or 401 redirects

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
