/**
 * API Configuration for Worker Module
 * 
 * DEPRECATED: Please use the new worker API service instead:
 * import workerApi from '../services/api';
 * 
 * This file is kept for backward compatibility only.
 */

// Backend API base URL - change this when deploying to production
export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

// Updated API endpoints to match backend worker routes
export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    logout: `${API_BASE_URL}/api/auth/logout`,
    signup: `${API_BASE_URL}/api/auth/signup`,
  },
  worker: {
    // Dashboard
    dashboard: `${API_BASE_URL}/api/worker/dashboard`,
    routes: `${API_BASE_URL}/api/worker/dashboard/routes`,
    
    // Bins
    binByQR: (qrCode: string) => `${API_BASE_URL}/api/worker/bins/qr/${qrCode}`,
    binById: (binId: string) => `${API_BASE_URL}/api/worker/bins/${binId}`,
    
    // Collections
    collections: `${API_BASE_URL}/api/worker/collections`,
    collectionById: (id: string) => `${API_BASE_URL}/api/worker/collections/${id}`,
    
    // History
    history: `${API_BASE_URL}/api/worker/history`,
    historyStats: `${API_BASE_URL}/api/worker/history/stats`,
    
    // Manual Entry
    manual: `${API_BASE_URL}/api/worker/manual`,
    
    // Summary/Session
    sessionStart: `${API_BASE_URL}/api/worker/summary/session/start`,
    sessionEnd: `${API_BASE_URL}/api/worker/summary/session/end`,
    sessionCurrent: `${API_BASE_URL}/api/worker/summary/session/current`,
    sessionReport: `${API_BASE_URL}/api/worker/summary/report`,
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
