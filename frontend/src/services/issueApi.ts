import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Issue API endpoints
export const issueAPI = {
  // Create new issue (resident/business)
  create: (data: {
    category: string;
    description: string;
    location?: { city?: string; area?: string; address?: string };
  }) => apiClient.post('/issues', data),

  // Get my issues
  getMine: (params?: { page?: number; limit?: number; status?: string }) =>
    apiClient.get('/issues/my', { params }),

  // Get all issues (admin/staff)
  getAll: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    city?: string;
    q?: string;
  }) => apiClient.get('/issues', { params }),

  // Get single issue
  getById: (id: string) => apiClient.get(`/issues/${id}`),

  // Update issue (staff/admin)
  update: (
    id: string,
    data: { status?: string; assignedTo?: string; resolutionNotes?: string }
  ) => apiClient.put(`/issues/${id}`, data),

  // Delete issue (admin)
  delete: (id: string) => apiClient.delete(`/issues/${id}`),
};

// Auth API endpoints
export const authAPI = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    city?: string;
    area?: string;
  }) => apiClient.post('/auth/register', data),

  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  getProfile: () => apiClient.get('/auth/profile'),

  updateProfile: (data: {
    name?: string;
    address?: string;
    area?: string;
    userType?: string;
    paymentInfo?: string;
  }) => apiClient.put('/auth/profile', data),

  deleteUser: (id: string) => apiClient.delete(`/auth/${id}`),
};

export default apiClient;
