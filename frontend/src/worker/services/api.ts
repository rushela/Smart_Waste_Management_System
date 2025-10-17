/**
 * Worker Module API Service
 * Handles all API calls to the backend worker endpoints
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  const token = localStorage.getItem('token');
  return token;
};

// Helper function for API requests with authentication
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// ============ DASHBOARD API ============
export const dashboardApi = {
  // GET /api/worker/dashboard - Get worker dashboard data
  getDashboard: async () => {
    return apiRequest('/api/worker/dashboard');
  },

  // GET /api/worker/dashboard/routes - Get worker routes
  getRoutes: async () => {
    return apiRequest('/api/worker/dashboard/routes');
  },
};

// ============ BINS API ============
export const binsApi = {
  // GET /api/worker/bins/qr/:qrCode - Lookup bin by QR code
  lookupByQR: async (qrCode: string) => {
    return apiRequest(`/api/worker/bins/qr/${encodeURIComponent(qrCode)}`);
  },

  // GET /api/worker/bins/:binId - Get bin details
  getById: async (binId: string) => {
    return apiRequest(`/api/worker/bins/${binId}`);
  },
};

// ============ COLLECTIONS API ============
export const collectionsApi = {
  // POST /api/worker/collections - Create new collection record
  create: async (data: {
    binId: string;
    weight: number;
    wasteType: 'recyclable' | 'organic' | 'general';
    notes?: string;
    contamination?: {
      detected: boolean;
      severity?: 'low' | 'medium' | 'high';
      notes?: string;
    };
  }) => {
    return apiRequest('/api/worker/collections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // GET /api/worker/collections/:id - Get collection by ID
  getById: async (id: string) => {
    return apiRequest(`/api/worker/collections/${id}`);
  },

  // PUT /api/worker/collections/:id - Update collection record
  update: async (id: string, data: {
    weight?: number;
    wasteType?: 'recyclable' | 'organic' | 'general';
    notes?: string;
    contamination?: {
      detected: boolean;
      severity?: 'low' | 'medium' | 'high';
      notes?: string;
    };
  }) => {
    return apiRequest(`/api/worker/collections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /api/worker/collections/:id - Delete collection record
  delete: async (id: string) => {
    return apiRequest(`/api/worker/collections/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ HISTORY API ============
export const historyApi = {
  // GET /api/worker/history - Get collection history
  getHistory: async (params?: {
    startDate?: string;
    endDate?: string;
    wasteType?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.wasteType) queryParams.append('wasteType', params.wasteType);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return apiRequest(`/api/worker/history${query ? `?${query}` : ''}`);
  },

  // GET /api/worker/history/stats - Get statistics
  getStats: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const query = queryParams.toString();
    return apiRequest(`/api/worker/history/stats${query ? `?${query}` : ''}`);
  },
};

// ============ MANUAL ENTRY API ============
export const manualApi = {
  // POST /api/worker/manual - Create manual entry
  create: async (data: {
    residentInfo: {
      name: string;
      address: string;
      phone?: string;
    };
    weight: number;
    wasteType: 'recyclable' | 'organic' | 'general';
    reason: string;
    notes?: string;
    contamination?: {
      detected: boolean;
      severity?: 'low' | 'medium' | 'high';
      notes?: string;
    };
  }) => {
    return apiRequest('/api/worker/manual', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // GET /api/worker/manual - Get all manual entries
  getAll: async (params?: {
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return apiRequest(`/api/worker/manual${query ? `?${query}` : ''}`);
  },
};

// ============ SUMMARY API ============
export const summaryApi = {
  // POST /api/worker/summary/session/start - Start new session
  startSession: async (data?: { routeId?: string }) => {
    return apiRequest('/api/worker/summary/session/start', {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  },

  // POST /api/worker/summary/session/end - End current session
  endSession: async () => {
    return apiRequest('/api/worker/summary/session/end', {
      method: 'POST',
    });
  },

  // GET /api/worker/summary/session/current - Get current session
  getCurrentSession: async () => {
    return apiRequest('/api/worker/summary/session/current');
  },

  // GET /api/worker/summary/report - Get session report
  getReport: async (sessionId?: string) => {
    const query = sessionId ? `?sessionId=${sessionId}` : '';
    return apiRequest(`/api/worker/summary/report${query}`);
  },
};

// Export all APIs
export const workerApi = {
  dashboard: dashboardApi,
  bins: binsApi,
  collections: collectionsApi,
  history: historyApi,
  manual: manualApi,
  summary: summaryApi,
};

export default workerApi;
