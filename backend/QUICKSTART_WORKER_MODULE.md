# Worker Waste Collection Module - Quick Start Guide

## Installation

1. **Install Dependencies** (if not already done):
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**:
   Create/update your `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/waste_management
   PORT=5000
   NODE_ENV=development
   ```

3. **Start MongoDB**:
   ```bash
   # If using local MongoDB
   mongod
   
   # Or if using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

4. **Seed the Database** (Optional - adds sample data):
   ```bash
   node seed/collectionSeed.js
   ```

5. **Start the Server**:
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

## Testing the API

### Using Postman

1. Import the collection: `backend/postman/WorkerWasteCollection.postman_collection.json`
2. Set the `baseUrl` variable to `http://localhost:5000`
3. Try the example requests

### Using cURL

#### 1. Get all bins (after seeding)
```bash
curl http://localhost:5000/api/bins
```

#### 2. Scan a bin (worker flow - step 1)
```bash
curl http://localhost:5000/api/bins/BIN-R001
```

#### 3. Record a collection (worker flow - step 2)
```bash
curl -X POST http://localhost:5000/api/collections \
  -H "Content-Type: application/json" \
  -d '{
    "binID": "BIN-R001",
    "wasteType": "recyclable",
    "weight": 5.5,
    "workerId": "WORKER-001",
    "status": "collected"
  }'
```

#### 4. Get resident details
```bash
# First, get a resident ID from the bins response above
curl http://localhost:5000/api/residents/{RESIDENT_ID}
```

#### 5. View collection history
```bash
# All collections
curl http://localhost:5000/api/collections

# Filter by bin
curl http://localhost:5000/api/collections?binID=BIN-R001

# Filter by date range
curl "http://localhost:5000/api/collections?startDate=2025-10-01&endDate=2025-10-17"
```

## Worker Mobile App Flow

### Typical Collection Workflow

```
1. Worker scans QR code on bin
   GET /api/bins/{binID}
   → Returns bin info + resident profile

2. Worker selects waste type and enters weight
   UI captures: wasteType, weight, notes

3. Worker submits collection
   POST /api/collections
   → System calculates rewards/payments
   → Updates bin status
   → Returns confirmation

4. If mistake, worker can correct
   PUT /api/collections/{id}
   → Recalculates rewards
   → Updates all related records
```

### Example: Full Collection Cycle

```javascript
// Step 1: Scan bin
GET /api/bins/BIN-R001

Response:
{
  "bin": { "binID": "BIN-R001", "status": "pending" },
  "resident": { "name": "John Doe", "starPoints": 50 }
}

// Step 2: Record recyclable waste collection
POST /api/collections
{
  "binID": "BIN-R001",
  "wasteType": "recyclable",
  "weight": 5.5,
  "workerId": "WORKER-001",
  "status": "collected"
}

Response:
{
  "success": true,
  "data": {
    "collection": { ... },
    "bin": { "status": "emptied" },
    "resident": { 
      "name": "John Doe",
      "starPoints": 105  // Was 50, added 55 (5.5 kg × 10)
    }
  }
}

// Step 3: Verify in database
GET /api/residents/{id}

Shows:
- Total star points: 105
- Recent collections
- All assigned bins
```

## Business Rules Reference

### Star Points (Recyclable Waste)
- **Formula**: `weight (kg) × 10 = star points`
- **Example**: 5.5 kg → 55 points
- **Not awarded when**:
  - Waste type is non-recyclable
  - Status is 'not_collected'

### Payment (Non-Recyclable Waste)
- **Formula**: `weight (kg) × 5 = payment units`
- **Example**: 3.2 kg → 16.00 units
- **Not charged when**:
  - Waste type is recyclable
  - Status is 'not_collected'

### Collection Status
- **collected**: Full collection → Bin status: 'emptied'
- **partial**: Overflow/incomplete → Bin status: 'partial'
- **not_collected**: Inaccessible → Bin status: 'not_collected', no rewards/charges

## Troubleshooting

### Error: "Bin with ID XXX not found"
- Ensure bin exists in database (check with `GET /api/bins`)
- Verify binID is uppercase (e.g., "BIN-R001" not "bin-r001")
- Run seed script if database is empty

### Error: "Resident not found for this bin"
- Check if resident was deleted
- Verify bin-resident relationship (GET /api/bins/{id})

### Collection not awarding star points
- Verify `wasteType` is "recyclable" (not "non_recyclable")
- Verify `status` is "collected" or "partial" (not "not_collected")
- Check `weight` is greater than 0

### Need to correct a mistake
```bash
# Update the collection
curl -X PUT http://localhost:5000/api/collections/{id} \
  -H "Content-Type: application/json" \
  -d '{"status": "partial", "notes": "Corrected"}'

# Or delete completely
curl -X DELETE http://localhost:5000/api/collections/{id}
```

## Database Schema

### Collections
- **residents**: Resident profiles
- **bins**: Waste bins with QR/barcode IDs
- **collectionhistories**: Collection event log

### Indexes
All models have indexes for efficient querying:
- Resident: email
- Bin: binID, resident
- CollectionHistory: binID, resident, dateCollected, wasteType

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error description",
  "status": 400
}
```

## Next Steps

1. **Add Authentication**: Uncomment auth middleware in routes
2. **Add Validation**: Use validation middleware for input
3. **Add Role-Based Access**: Different permissions for workers/supervisors/admins
4. **Add Logging**: Track worker actions for audit
5. **Add Webhooks**: Notify residents of collections
6. **Add Analytics**: Collection statistics dashboard

## Support

For issues or questions:
1. Check the comprehensive README: `WORKER_COLLECTION_MODULE.md`
2. Review API tests in Postman collection
3. Check console logs for detailed error messages
4. Verify MongoDB connection and data with `mongo` shell

## File Structure

```
backend/
├── models/
│   ├── Resident.js           # Resident schema
│   ├── Bin.js                # Bin schema
│   └── CollectionHistory.js  # Collection schema
├── controllers/
│   ├── residentController.js # Resident CRUD
│   ├── binController.js      # Bin CRUD
│   └── collectionController.js # Collection CRUD + rewards
├── routes/
│   ├── residents.js          # Resident routes
│   ├── bins.js              # Bin routes
│   └── collections.js       # Collection routes
├── seed/
│   └── collectionSeed.js    # Sample data generator
├── postman/
│   └── WorkerWasteCollection.postman_collection.json
└── WORKER_COLLECTION_MODULE.md # Full documentation
```
