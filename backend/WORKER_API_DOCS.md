# Worker Module API Documentation

Complete REST API documentation for the Eco AI Waste Manager Worker Module.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All worker endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Quick Start

### 1. Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@ecowaste.com",
  "password": "password123"
}

# Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Smith",
    "email": "john@ecowaste.com",
    "role": "worker"
  }
}
```

### 2. Get Dashboard
```bash
GET /api/worker/dashboard
Authorization: Bearer <token>

# Response:
{
  "success": true,
  "data": {
    "worker": {...},
    "routes": [...],
    "session": {...},
    "stats": {
      "totalBins": 15,
      "completedBins": 8,
      "pendingBins": 7,
      "totalWeight": 45.5,
      "totalStarPoints": 355,
      "totalPayments": 18.75
    }
  }
}
```

---

## API Endpoints

### Authentication

#### Login Worker
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@ecowaste.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Smith",
    "email": "john@ecowaste.com",
    "role": "worker"
  }
}
```

---

### Dashboard

#### Get Worker Dashboard
```http
GET /api/worker/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "worker": {
      "id": "worker_id",
      "name": "John Smith",
      "email": "john@ecowaste.com",
      "employeeId": "W001"
    },
    "routes": [
      {
        "routeId": "ROUTE-001",
        "name": "North District Morning",
        "status": "in-progress",
        "totalBins": 15,
        "binIds": [...]
      }
    ],
    "session": {
      "sessionDate": "2025-10-17",
      "startTime": "2025-10-17T08:00:00Z",
      "status": "active",
      "binsCollected": 8
    },
    "stats": {
      "totalBins": 15,
      "completedBins": 8,
      "pendingBins": 7,
      "totalWeight": 45.5,
      "totalStarPoints": 355,
      "totalPayments": 18.75
    }
  }
}
```

#### Get Worker Routes
```http
GET /api/worker/dashboard/routes?date=2025-10-17&status=in-progress
Authorization: Bearer <token>
```

**Query Parameters:**
- `date` (optional): Filter by date (YYYY-MM-DD)
- `status` (optional): Filter by status (pending, in-progress, completed)

---

### Bins

#### Get Bin by ID
```http
GET /api/worker/bins/:binId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bin": {
      "_id": "bin_id",
      "binId": "BIN-001",
      "type": "recyclable",
      "status": "pending",
      "fillLevel": 75,
      "location": {
        "address": "123 Oak Street",
        "coordinates": { "lat": 40.7128, "lng": -74.0060 }
      },
      "residentId": {...}
    },
    "resident": {
      "_id": "resident_id",
      "name": "Alice Williams",
      "email": "alice@example.com",
      "phone": "+1234560001",
      "starPoints": 150,
      "address": "123 Oak Street"
    },
    "collectionHistory": [...]
  }
}
```

#### Search Bin by Code
```http
GET /api/worker/bins/search/:code
Authorization: Bearer <token>
```

**Example:**
```bash
GET /api/worker/bins/search/BIN-001
GET /api/worker/bins/search/QR-BIN-001
```

#### Get All Bins
```http
GET /api/worker/bins?status=pending&area=North
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): pending, collected, partial, not-collected
- `area` (optional): Filter by area
- `residentId` (optional): Filter by resident

#### Update Bin Status
```http
PUT /api/worker/bins/:binId/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "collected",
  "fillLevel": 0
}
```

---

### Collections

#### Create Collection Record
```http
POST /api/worker/collections
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "binId": "bin_id",
  "binCode": "BIN-001",
  "wasteType": "recyclable",
  "weight": 8.5,
  "fillLevel": 80,
  "notes": "Good quality recyclables",
  "contamination": false,
  "contaminationDetails": "",
  "routeId": "route_id",
  "residentId": "resident_id"
}
```

**Waste Types:**
- `recyclable` - Recyclable materials (10 points/kg, $0.50/kg)
- `organic` - Organic/compostable waste (5 points/kg, $0.20/kg)
- `general` - General waste (no rewards)
- `hazardous` - Hazardous waste (no rewards)
- `mixed` - Mixed recyclables (2 points/kg, $0.15/kg)

**Response:**
```json
{
  "success": true,
  "message": "Collection recorded successfully",
  "data": {
    "_id": "collection_id",
    "binCode": "BIN-001",
    "wasteType": "recyclable",
    "weight": 8.5,
    "starPointsAwarded": 85,
    "paymentAmount": 4.25,
    "status": "collected",
    "date": "2025-10-17T10:30:00Z",
    "residentName": "Alice Williams",
    "notes": "Good quality recyclables"
  }
}
```

#### Get Collection by ID
```http
GET /api/worker/collections/:id
Authorization: Bearer <token>
```

#### Update Collection (Error Correction)
```http
PUT /api/worker/collections/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "wasteType": "recyclable",
  "weight": 9.0,
  "notes": "Corrected weight",
  "contamination": false
}
```

#### Delete Collection
```http
DELETE /api/worker/collections/:id
Authorization: Bearer <token>
```

**Note:** Deleting a collection will reverse any rewards given to the resident.

---

### History

#### Get Collection History
```http
GET /api/worker/history?page=1&limit=20&sortBy=date&order=desc
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (default: 1): Page number
- `limit` (default: 20): Items per page
- `sortBy` (default: 'date'): Sort field
- `order` (default: 'desc'): Sort order (asc/desc)
- `status` (optional): Filter by status
- `wasteType` (optional): Filter by waste type
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)
- `binId` (optional): Filter by bin ID
- `search` (optional): Search in notes/resident name

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  },
  "stats": {
    "totalCollections": 45,
    "totalWeight": 285.5,
    "totalStarPoints": 2150,
    "totalPayments": 108.50,
    "contaminations": 3
  }
}
```

#### Get History Statistics
```http
GET /api/worker/history/stats?startDate=2025-10-01&endDate=2025-10-17
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "byWasteType": [
      {
        "_id": "recyclable",
        "count": 25,
        "totalWeight": 180.5,
        "totalStarPoints": 1805,
        "totalPayments": 90.25
      },
      ...
    ],
    "byStatus": [...],
    "dailyTrends": [...]
  }
}
```

---

### Manual Entry

#### Create Manual Collection Entry
```http
POST /api/worker/manual
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "binCode": "BIN-UNKNOWN",
  "wasteType": "recyclable",
  "weight": 5.5,
  "fillLevel": 50,
  "notes": "QR code damaged",
  "contamination": false,
  "manualEntryReason": "QR code not scannable",
  "residentName": "John Doe",
  "residentAddress": "999 Unknown Street",
  "location": "North District"
}
```

**Note:** Either `binCode` OR `residentAddress` is required.

**Response:**
```json
{
  "success": true,
  "message": "Manual collection entry recorded successfully",
  "data": {...},
  "warning": "Bin not found in system - created as manual entry"
}
```

#### Get Manual Entries
```http
GET /api/worker/manual?page=1&limit=20
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`, `limit`: Pagination
- `startDate`, `endDate`: Date range

---

### Summary

#### Get Current Session Summary
```http
GET /api/worker/summary
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session": {
      "sessionDate": "2025-10-17",
      "startTime": "2025-10-17T08:00:00Z",
      "status": "active",
      "duration": 150,
      "efficiency": 85,
      "totalBins": 15,
      "binsCollected": 12,
      "totalWeight": 95.5,
      "totalStarPoints": 750,
      "totalPayments": 42.50
    },
    "stats": {
      "totalCollections": 12,
      "successfulCollections": 11,
      "partialCollections": 1,
      "manualEntries": 2,
      "contaminations": 1,
      "recyclableWeight": 65.0,
      "organicWeight": 25.5,
      "generalWeight": 5.0
    },
    "collections": [...]
  }
}
```

#### End Work Session
```http
POST /api/worker/summary/end-session
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "notes": "Completed all routes successfully"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Session ended successfully",
  "data": {
    "sessionDate": "2025-10-17",
    "startTime": "2025-10-17T08:00:00Z",
    "endTime": "2025-10-17T14:30:00Z",
    "status": "completed",
    "binsCollected": 15,
    "totalWeight": 120.5,
    "totalStarPoints": 950,
    "totalPayments": 55.75
  }
}
```

#### Get Session History
```http
GET /api/worker/summary/history?page=1&limit=10
Authorization: Bearer <token>
```

#### Get Specific Session
```http
GET /api/worker/summary/:sessionId
Authorization: Bearer <token>
```

---

## Error Responses

All endpoints return error responses in this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rewards Calculation

### Star Points
- **Recyclable**: 10 points per kg
- **Organic**: 5 points per kg
- **Mixed**: 2 points per kg
- **General/Hazardous**: 0 points

### Payment Amount
- **Recyclable**: $0.50 per kg
- **Organic**: $0.20 per kg
- **Mixed**: $0.15 per kg
- **General/Hazardous**: $0.00

### Contamination Penalty
- **50% reduction** in both star points and payment if contaminated

**Example:**
```
Recyclable waste: 10 kg
Normal: 100 points, $5.00
Contaminated: 50 points, $2.50
```

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@ecowaste.com","password":"password123"}'
```

### Get Dashboard
```bash
curl -X GET http://localhost:5000/api/worker/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Collection
```bash
curl -X POST http://localhost:5000/api/worker/collections \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "binCode": "BIN-001",
    "wasteType": "recyclable",
    "weight": 8.5,
    "fillLevel": 80,
    "notes": "Good quality"
  }'
```

---

## Rate Limiting & Best Practices

1. **Token Expiration**: Tokens expire after 24 hours
2. **Pagination**: Use pagination for large datasets
3. **Error Handling**: Always check the `success` field
4. **Validation**: The API validates all inputs
5. **Timestamps**: All dates are in ISO 8601 format (UTC)

---

## Testing Credentials

```
Worker 1:
Email: john@ecowaste.com
Password: password123

Worker 2:
Email: sarah@ecowaste.com
Password: password123

Worker 3:
Email: mike@ecowaste.com
Password: password123
```

---

## Setup & Seeding

### 1. Start Backend
```bash
cd backend
npm start
```

### 2. Seed Worker Data
```bash
npm run seed:worker
```

This creates:
- 3 workers
- 5 residents
- 6 bins
- 3 routes
- 2 active sessions
- Sample collection records

---

## Frontend Integration

The worker frontend at `/frontend/src/worker` is configured to use these APIs:

**API Configuration:** `frontend/src/worker/config/api.ts`
```typescript
export const API_BASE_URL = 'http://localhost:5000';
```

**Authentication:** `frontend/src/worker/context/AuthContext.tsx`
- Automatically connects to backend
- Falls back to mock data if unavailable

---

## Support

For issues or questions:
1. Check backend logs
2. Verify MongoDB connection
3. Ensure JWT_SECRET is set in .env
4. Run seed script to create test data
5. Check WORKER_MODULE_UPDATES.md for changes

---

*Last Updated: October 17, 2025*
