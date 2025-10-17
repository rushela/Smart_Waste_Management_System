/**
 * API Configuration for Worker Module
 * Centralized configuration for backend API endpoints
 */

// Backend API base URL - change this when deploying to production
export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    logout: `${API_BASE_URL}/api/auth/logout`,
    signup: `${API_BASE_URL}/api/auth/signup`,
  },
  collections: {
    list: `${API_BASE_URL}/api/collections`,
    create: `${API_BASE_URL}/api/collections`,
    update: (id: string) => `${API_BASE_URL}/api/collections/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/collections/${id}`,
  },
  routes: {
    list: `${API_BASE_URL}/api/routes`,
    byWorker: (workerId: string) => `${API_BASE_URL}/api/routes/worker/${workerId}`,
  },
  bins: {
    list: `${API_BASE_URL}/api/bins`,
    byId: (binId: string) => `${API_BASE_URL}/api/bins/${binId}`,
  },
};

// Helper function for API requests
export const apiRequest = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};
