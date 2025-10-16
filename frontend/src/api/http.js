import axios from 'axios';

// Prefer a fully-qualified API URL (with /api) via VITE_API_URL for common setups.
// Fall back to VITE_API_BASE_URL or a sensible default on localhost:5000
const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
// Must be a valid 24-hex ObjectId if your authHeader validates strictly
const X_USER_ID = import.meta.env.VITE_X_USER_ID || '67101a9c7a1d9a4b8d1a9c77';

const http = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (!config.headers['x-user-id']) {
    config.headers['x-user-id'] = X_USER_ID;
  }
  return config;
});

http.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('authToken')) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default http;
