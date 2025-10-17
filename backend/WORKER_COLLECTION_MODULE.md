# Worker Waste Collection Module

A comprehensive Node.js/Express module for managing waste collection operations with resident rewards and payment tracking.

## Features

- **Resident Management**: Track residents with contact info, star points, and balances
- **Bin Management**: QR/barcode-based bin tracking with collection status
- **Collection Recording**: Log waste collections with automatic rewards calculation
- **Recyclable Rewards**: Award star points for recyclable waste (10 points per kg)
- **Payment Tracking**: Calculate charges for non-recyclable waste (5 units per kg)
- **Collection History**: Complete audit trail of all collection events
- **Idempotent Operations**: Safe retry mechanism for all API endpoints

## Table of Contents

- [Models](#models)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [Business Logic](#business-logic)

## Models

### Resident

Represents a resident who owns bins and accumulates rewards.

```javascript
{
  name: String,              // Required, max 100 chars
  address: String,           // Required, max 200 chars
  email: String,             // Required, unique, validated
  phone: String,             // Required, validated format
  starPoints: Number,        // Default: 0, min: 0
  outstandingBalance: Number // Default: 0, min: 0
}
```

### Bin

Represents a waste bin assigned to a resident with QR/barcode ID.

```javascript
{
  binID: String,             // Required, unique, uppercase
  resident: ObjectId,        // Required, ref: 'Resident'
  status: String,            // enum: ['emptied', 'pending', 'partial', 'not_collected']
  lastCollection: Date       // Updated on collection
}
```

### CollectionHistory

Records each waste collection event with rewards/payment data.

```javascript
{
  binID: String,             // Required, uppercase
  resident: ObjectId,        // Required, ref: 'Resident'
  dateCollected: Date,       // Required, default: now
  wasteType: String,         // Required, enum: ['recyclable', 'non_recyclable']
  weight: Number,            // Optional, min: 0
  starPointsAwarded: Number, // Auto-calculated
  payment: Number,           // Auto-calculated
  status: String,            // Required, enum: ['collected', 'partial', 'not_collected']
  workerId: String,          // Optional, worker identifier
  notes: String              // Optional, max 500 chars
}
```

## API Endpoints

### Collections

#### Create Collection
```http
POST /api/collections
```

**Request Body:**
```json
{
  "binID": "BIN-12345",
  "dateCollected": "2025-10-17T10:30:00Z",
  "wasteType": "recyclable",
  "weight": 5.5,
  "notes": "Full bin, good condition",
  "workerId": "WORKER-001",
  "status": "collected"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Collection recorded successfully",
  "data": {
    "collection": { ... },
    "bin": {
      "binID": "BIN-12345",
      "status": "emptied",
      "lastCollection": "2025-10-17T10:30:00Z"
    },
    "resident": {
      "_id": "...",
      "name": "John Doe",
      "starPoints": 55,
      "outstandingBalance": 0
    }
  }
}
```

#### Update Collection
```http
PUT /api/collections/:id
```

**Request Body:**
```json
{
  "status": "partial",
  "weight": 3.2,
  "notes": "Partially collected due to overflow"
}
```

#### Delete Collection
```http
DELETE /api/collections/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Collection record deleted successfully",
  "data": {
    "deletedCollectionId": "...",
    "resident": {
      "starPoints": 0,
      "outstandingBalance": 0
    }
  }
}
```

#### Get Collections
```http
GET /api/collections
GET /api/collections?binID=BIN-12345
GET /api/collections?resident=507f1f77bcf86cd799439011
GET /api/collections?wasteType=recyclable&status=collected
GET /api/collections?startDate=2025-10-01&endDate=2025-10-17
```

#### Get Collection by ID
```http
GET /api/collections/:id
```

### Bins

#### Get Bin Details
```http
GET /api/bins/:id
```

Accepts either `binID` (e.g., "BIN-12345") or MongoDB `_id`. Returns bin details with resident profile and recent collection history.

**Response:**
```json
{
  "success": true,
  "data": {
    "bin": {
      "binID": "BIN-12345",
      "status": "emptied",
      "lastCollection": "2025-10-17T10:30:00Z"
    },
    "resident": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "starPoints": 55,
      "outstandingBalance": 0
    },
    "recentCollections": [...]
  }
}
```

#### Get All Bins
```http
GET /api/bins
GET /api/bins?status=pending
GET /api/bins?resident=507f1f77bcf86cd799439011
```

#### Create Bin
```http
POST /api/bins
```

**Request Body:**
```json
{
  "binID": "BIN-12345",
  "resident": "507f1f77bcf86cd799439011"
}
```

#### Update Bin
```http
PUT /api/bins/:id
```

**Request Body:**
```json
{
  "status": "emptied",
  "resident": "507f1f77bcf86cd799439011"
}
```

#### Delete Bin
```http
DELETE /api/bins/:id
```

Note: Can only delete bins with no collection history.

### Residents

#### Get Residents
```http
GET /api/residents
GET /api/residents?email=john@example.com
GET /api/residents?phone=+1234567890
```

#### Get Resident by ID
```http
GET /api/residents/:id
```

Returns resident details with bins, collection history, and statistics.

#### Create Resident
```http
POST /api/residents
```

**Request Body:**
```json
{
  "name": "John Doe",
  "address": "123 Main St, City",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

#### Update Resident
```http
PUT /api/residents/:id
```

**Request Body:**
```json
{
  "name": "John Doe Jr.",
  "address": "456 Oak Ave, City",
  "email": "john.jr@example.com",
  "phone": "+0987654321"
}
```

#### Delete Resident
```http
DELETE /api/residents/:id
```

Note: Can only delete residents with no bins or collection history.

## Configuration

### Rewards Configuration

Located in `controllers/collectionController.js`:

```javascript
const REWARDS_CONFIG = {
  STAR_POINTS_PER_KG: 10,  // Star points per kg of recyclable waste
  PAYMENT_PER_KG: 5,       // Payment per kg of non-recyclable waste
  MIN_WEIGHT: 0            // Minimum weight to process
};
```

### Environment Variables

Ensure your `.env` file includes:

```env
MONGODB_URI=mongodb://localhost:27017/waste_management
PORT=5000
NODE_ENV=development
```

### Express App Integration

The routes are registered in `app.js`:

```javascript
app.use('/api/collections', require('./routes/collections'));
app.use('/api/bins', require('./routes/bins'));
app.use('/api/residents', require('./routes/residents'));
```

## Business Logic

### Star Points Calculation

For **recyclable waste** that is successfully collected:
- Formula: `starPoints = weight (kg) × 10`
- Example: 5.5 kg recyclable → 55 star points

Star points are **NOT awarded** when:
- Waste type is non-recyclable
- Collection status is 'not_collected'

### Payment Calculation

For **non-recyclable waste** that is collected or partially collected:
- Formula: `payment = weight (kg) × 5`
- Example: 3.2 kg non-recyclable → 16.00 payment units

Payment is **NOT charged** when:
- Waste type is recyclable
- Collection status is 'not_collected'

### Collection Status Flow

```
pending → [Worker scans bin]
  ↓
collected (full collection)
  OR
partial (overflow/incomplete)
  OR
not_collected (bin inaccessible)
  ↓
Updates:
- Bin status (emptied/partial/not_collected)
- Resident star points (if recyclable + collected)
- Resident balance (if non-recyclable + collected/partial)
```

### Idempotency & Error Handling

- **Validation**: All inputs validated before processing
- **Transaction-like**: Updates to bin, resident, and collection are sequential
- **Reversible**: DELETE endpoint reverses all rewards/payments
- **Safe Updates**: PUT endpoint recalculates from scratch

### Collection Update Logic

When updating a collection:
1. Reverse previous rewards/payments
2. Apply new values
3. Recalculate rewards/payments
4. Update bin status accordingly

## Usage Examples

### Worker Scanning QR Code Flow

```javascript
// 1. Worker scans bin QR code (binID: BIN-12345)
GET /api/bins/BIN-12345

// Returns resident info and bin status

// 2. Worker records collection
POST /api/collections
{
  "binID": "BIN-12345",
  "wasteType": "recyclable",
  "weight": 5.5,
  "workerId": "WORKER-001",
  "status": "collected"
}

// System automatically:
// - Awards 55 star points to resident
// - Updates bin status to 'emptied'
// - Creates collection history record
```

### Correcting a Mistake

```javascript
// Worker accidentally marked as 'collected', should be 'partial'
PUT /api/collections/507f1f77bcf86cd799439011
{
  "status": "partial",
  "notes": "Corrected - was overflow"
}

// System recalculates rewards based on new status
```

### Deleting Incorrect Entry

```javascript
// Worker scanned wrong bin
DELETE /api/collections/507f1f77bcf86cd799439011

// System:
// - Reverses star points/payments
// - Sets bin status back to 'pending'
// - Removes collection record
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "status": 400
}
```

Common error codes:
- `400`: Bad request (validation errors)
- `404`: Resource not found
- `500`: Server error

## Testing

Example test scenarios:

1. **Create resident and bin**
2. **Record recyclable collection** → verify star points awarded
3. **Record non-recyclable collection** → verify payment charged
4. **Update collection status** → verify recalculation
5. **Delete collection** → verify reversal
6. **Try deleting bin with history** → verify error

## Authentication & Authorization

The routes include commented-out authentication middleware. To enable:

```javascript
// In routes/collections.js
const auth = require('../middleware/auth');
router.post('/', auth, collectionController.createCollection);
```

Recommended access levels:
- **Worker**: POST/PUT collections, GET bins
- **Supervisor**: DELETE collections, all bin operations
- **Admin**: All resident operations, system configuration

## License

Part of the Smart Waste Management System
