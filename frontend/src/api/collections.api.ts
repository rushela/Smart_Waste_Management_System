import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

// Types for the API responses
export interface Resident {
  _id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  starPoints: number;
  outstandingBalance: number;
}

export interface Bin {
  _id: string;
  binID: string;
  status: 'emptied' | 'pending' | 'partial' | 'not_collected';
  lastCollection: string | null;
  resident?: Resident;
}

export interface Collection {
  _id: string;
  binID: string;
  resident: string | Resident;
  dateCollected: string;
  wasteType: 'recyclable' | 'non_recyclable';
  weight: number;
  starPointsAwarded: number;
  payment: number;
  status: 'collected' | 'partial' | 'not_collected';
  workerId?: string;
  notes?: string;
}

export interface BinDetailsResponse {
  success: boolean;
  data: {
    bin: Bin;
    resident: Resident;
    recentCollections: Collection[];
  };
}

export interface CollectionResponse {
  success: boolean;
  message: string;
  data: {
    collection: Collection;
    bin: Bin;
    resident: Resident;
  };
}

export interface CreateCollectionPayload {
  binID: string;
  wasteType: 'recyclable' | 'non_recyclable';
  weight: number;
  status: 'collected' | 'partial' | 'not_collected';
  notes?: string;
  workerId?: string;
  dateCollected?: string;
}

export interface UpdateCollectionPayload {
  wasteType?: 'recyclable' | 'non_recyclable';
  weight?: number;
  status?: 'collected' | 'partial' | 'not_collected';
  notes?: string;
}

/**
 * Fetch bin details by binID or MongoDB _id
 * @param binId - The bin ID (can be QR code value like "BIN-R001" or MongoDB _id)
 */
export const getBinDetails = async (binId: string): Promise<BinDetailsResponse> => {
  const response = await axios.get<BinDetailsResponse>(`${API_BASE_URL}/bins/${binId}`);
  return response.data;
};

/**
 * Create a new waste collection record
 * @param payload - Collection data including binID, wasteType, weight, etc.
 */
export const createCollection = async (
  payload: CreateCollectionPayload
): Promise<CollectionResponse> => {
  const response = await axios.post<CollectionResponse>(
    `${API_BASE_URL}/collections`,
    payload
  );
  return response.data;
};

/**
 * Update an existing collection record
 * @param collectionId - The MongoDB _id of the collection
 * @param payload - Updated collection data
 */
export const updateCollection = async (
  collectionId: string,
  payload: UpdateCollectionPayload
): Promise<CollectionResponse> => {
  const response = await axios.put<CollectionResponse>(
    `${API_BASE_URL}/collections/${collectionId}`,
    payload
  );
  return response.data;
};

/**
 * Get all bins with optional status filter
 * @param status - Optional status filter
 */
export const getBins = async (status?: string) => {
  const params = status ? { status } : {};
  const response = await axios.get(`${API_BASE_URL}/bins`, { params });
  return response.data;
};

/**
 * Get all collections with optional filters
 * @param filters - Optional filters for binID, resident, wasteType, status, dates
 */
export const getCollections = async (filters?: {
  binID?: string;
  resident?: string;
  wasteType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const response = await axios.get(`${API_BASE_URL}/collections`, {
    params: filters,
  });
  return response.data;
};

/**
 * Calculate star points for recyclable waste
 * @param weight - Weight in kg
 */
export const calculateStarPoints = (weight: number): number => {
  return Math.round(weight * 10);
};

/**
 * Calculate payment for non-recyclable waste
 * @param weight - Weight in kg
 */
export const calculatePayment = (weight: number): number => {
  return Math.round(weight * 5 * 100) / 100;
};
