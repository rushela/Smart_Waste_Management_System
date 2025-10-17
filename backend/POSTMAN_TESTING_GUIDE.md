# 🚀 Postman Testing Guide - Worker Waste Collection API

## Prerequisites

1. **Postman Installed**: Download from https://www.postman.com/downloads/
2. **Backend Server Running**: Make sure MongoDB is connected and server is running

---

## Step 1: Start Your Backend Server

Open a terminal and run:

```bash
cd /Users/gavidurushela/Projects/Smart_Waste_Management_System/Untitled/backend

# Make sure MongoDB is running first
# For local MongoDB:
brew services start mongodb-community@7.0

# Start the server
npm start

# You should see:
# ✓ MongoDB Connected: localhost:27017
# Backend dev server listening on http://localhost:5000
```

---

## Step 2: Import Postman Collection

### Option A: Import via File

1. Open Postman
2. Click **"Import"** button (top left)
3. Click **"Choose Files"**
4. Navigate to:
   ```
   /Users/gavidurushela/Projects/Smart_Waste_Management_System/Untitled/backend/postman/WorkerWasteCollection.postman_collection.json
   ```
5. Click **"Import"**

### Option B: Drag & Drop

1. Open Postman
2. Drag the file `WorkerWasteCollection.postman_collection.json` into Postman
3. Collection will be imported automatically

---

## Step 3: Configure Environment Variables

1. In Postman, look for **"Worker Waste Collection API"** in the left sidebar
2. Click on the collection name
3. Go to **"Variables"** tab
4. Set these variables:
   - `baseUrl`: `http://localhost:5000`
   - `residentId`: (leave empty for now)
   - `binId`: (leave empty for now)
   - `collectionId`: (leave empty for now)

5. Click **"Save"**

---

## Step 4: Seed the Database (Optional but Recommended)

Before testing, populate with sample data:

```bash
# In a new terminal (keep server running in another)
cd /Users/gavidurushela/Projects/Smart_Waste_Management_System/Untitled/backend
node seed/collectionSeed.js

# This creates:
# - 5 residents
# - 10 bins
# - 30 collection records
```

---

## Step 5: Test the API - Step by Step

### 🟢 Test 1: Health Check

1. Create a new request in Postman
2. Method: **GET**
3. URL: `http://localhost:5000/health`
4. Click **"Send"**

**Expected Response:**
```json
{
  "ok": true
}
```

---

### 🟢 Test 2: Get All Residents

1. In collection: **Residents** → **Get All Residents**
2. Click **"Send"**

**Expected Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john.doe@email.com",
      "phone": "+1-555-0101",
      "address": "123 Main Street, Springfield",
      "starPoints": 120,
      "outstandingBalance": 25.5
    }
  ]
}
```

**Action**: Copy one of the `_id` values and set it as `residentId` variable in Postman

---

### 🟢 Test 3: Get Resident by ID

1. In collection: **Residents** → **Get Resident by ID**
2. Make sure `{{residentId}}` is set
3. Click **"Send"**

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "resident": {
      "name": "John Doe",
      "starPoints": 120,
      "outstandingBalance": 25.5
    },
    "bins": [...],
    "recentCollections": [...],
    "statistics": {
      "totalBins": 2,
      "totalCollections": 6,
      "recyclableCollections": 3
    }
  }
}
```

---

### 🟢 Test 4: Create New Resident

1. In collection: **Residents** → **Create Resident**
2. Request body is pre-filled:
   ```json
   {
     "name": "Test Resident",
     "address": "123 Test Street, Test City",
     "email": "test.resident@email.com",
     "phone": "+1-555-9999"
   }
   ```
3. Click **"Send"**

**Expected Response:**
```json
{
  "success": true,
  "message": "Resident created successfully",
  "data": {
    "_id": "...",
    "name": "Test Resident",
    "starPoints": 0,
    "outstandingBalance": 0
  }
}
```

---

### 🟢 Test 5: Get All Bins

1. In collection: **Bins** → **Get All Bins**
2. Click **"Send"**

**Expected Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "binID": "BIN-R001",
      "status": "emptied",
      "lastCollection": "2025-10-17T...",
      "resident": {
        "name": "John Doe",
        "email": "john.doe@email.com"
      }
    }
  ]
}
```

---

### 🟢 Test 6: Scan Bin (Worker Flow - Step 1)

This simulates a worker scanning a QR code on a bin.

1. In collection: **Bins** → **Get Bin by ID (or binID)**
2. URL should be: `{{baseUrl}}/api/bins/BIN-R001`
3. Click **"Send"**

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "bin": {
      "binID": "BIN-R001",
      "status": "emptied",
      "lastCollection": "2025-10-10T..."
    },
    "resident": {
      "name": "John Doe",
      "email": "john.doe@email.com",
      "phone": "+1-555-0101",
      "starPoints": 120,
      "outstandingBalance": 25.5
    },
    "recentCollections": [...]
  }
}
```

**Note the resident's current starPoints and outstandingBalance!**

---

### 🟢 Test 7: Record Collection - Recyclable (Worker Flow - Step 2)

This simulates recording a recyclable waste collection.

1. In collection: **Collections** → **Create Collection - Recyclable**
2. Request body:
   ```json
   {
     "binID": "BIN-R001",
     "dateCollected": "2025-10-17T10:30:00Z",
     "wasteType": "recyclable",
     "weight": 5.5,
     "notes": "Full bin, good condition",
     "workerId": "WORKER-001",
     "status": "collected"
   }
   ```
3. Click **"Send"**

**Expected Response:**
```json
{
  "success": true,
  "message": "Collection recorded successfully",
  "data": {
    "collection": {
      "binID": "BIN-R001",
      "wasteType": "recyclable",
      "weight": 5.5,
      "starPointsAwarded": 55,
      "payment": 0,
      "status": "collected"
    },
    "bin": {
      "binID": "BIN-R001",
      "status": "emptied"
    },
    "resident": {
      "name": "John Doe",
      "starPoints": 175,  // Was 120, added 55!
      "outstandingBalance": 25.5
    }
  }
}
```

**✨ Magic happens:**
- Resident gets **55 star points** (5.5 kg × 10)
- Bin status changes to **"emptied"**
- Collection is recorded

---

### 🟢 Test 8: Record Collection - Non-Recyclable

This simulates collecting non-recyclable waste (charges payment).

1. In collection: **Collections** → **Create Collection - Non-Recyclable**
2. Request body:
   ```json
   {
     "binID": "BIN-G001",
     "wasteType": "non_recyclable",
     "weight": 3.2,
     "notes": "Regular collection",
     "workerId": "WORKER-001",
     "status": "collected"
   }
   ```
3. Click **"Send"**

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "collection": {
      "wasteType": "non_recyclable",
      "weight": 3.2,
      "starPointsAwarded": 0,
      "payment": 16.0,  // 3.2 kg × 5
      "status": "collected"
    },
    "resident": {
      "outstandingBalance": 41.5  // Was 25.5, added 16!
    }
  }
}
```

---

### 🟢 Test 9: Get All Collections

1. In collection: **Collections** → **Get All Collections**
2. Click **"Send"**

**Expected Response:**
```json
{
  "success": true,
  "count": 32,
  "data": [
    {
      "_id": "...",
      "binID": "BIN-R001",
      "wasteType": "recyclable",
      "weight": 5.5,
      "starPointsAwarded": 55,
      "dateCollected": "2025-10-17T...",
      "resident": {
        "name": "John Doe",
        "email": "john.doe@email.com"
      }
    }
  ]
}
```

---

### 🟢 Test 10: Filter Collections by Bin

1. In collection: **Collections** → **Filter Collections by Bin**
2. URL: `{{baseUrl}}/api/collections?binID=BIN-R001`
3. Click **"Send"**

**Shows only collections for BIN-R001**

---

### 🟢 Test 11: Update Collection (Correction Scenario)

Worker made a mistake - needs to change status to partial.

1. First, copy a `collectionId` from previous responses
2. Set it as `{{collectionId}}` variable
3. In collection: **Collections** → **Update Collection Status**
4. Request body:
   ```json
   {
     "status": "partial",
     "notes": "Corrected - was overflow"
   }
   ```
5. Click **"Send"**

**Expected Response:**
```json
{
  "success": true,
  "message": "Collection updated successfully",
  "data": {
    "collection": {
      "status": "partial",
      "notes": "Corrected - was overflow"
    },
    "resident": {
      "starPoints": "...",  // Recalculated
      "outstandingBalance": "..."  // Recalculated
    }
  }
}
```

---

### 🟢 Test 12: Delete Collection (Wrong Scan)

Worker scanned wrong bin - need to delete.

1. In collection: **Collections** → **Delete Collection**
2. Make sure `{{collectionId}}` is set
3. Click **"Send"**

**Expected Response:**
```json
{
  "success": true,
  "message": "Collection record deleted successfully",
  "data": {
    "deletedCollectionId": "...",
    "resident": {
      "starPoints": 120,  // Reversed back!
      "outstandingBalance": 25.5
    }
  }
}
```

---

## 🎯 Advanced Testing Scenarios

### Scenario 1: Complete Worker Day Flow

```
1. GET /api/bins?status=pending
   → See all bins waiting for collection

2. GET /api/bins/BIN-R001
   → Scan first bin

3. POST /api/collections
   → Record recyclable collection (5.5 kg)

4. GET /api/bins/BIN-R002
   → Scan second bin

5. POST /api/collections
   → Record non-recyclable (3.0 kg)

6. GET /api/collections?workerId=WORKER-001
   → View all collections by this worker today
```

### Scenario 2: Partial Collection

```json
POST /api/collections
{
  "binID": "BIN-R003",
  "wasteType": "recyclable",
  "weight": 2.5,
  "status": "partial",
  "notes": "Bin overflow - could only collect half"
}
```

### Scenario 3: Not Collected

```json
POST /api/collections
{
  "binID": "BIN-R004",
  "wasteType": "recyclable",
  "weight": 0,
  "status": "not_collected",
  "notes": "Bin blocked by parked vehicle"
}
```

---

## 📊 Expected Business Logic

| Scenario | Star Points | Payment | Bin Status |
|----------|-------------|---------|------------|
| 5kg recyclable, collected | +50 | 0 | emptied |
| 5kg non-recyclable, collected | 0 | +25 | emptied |
| 5kg recyclable, partial | +50 | 0 | partial |
| 5kg recyclable, not_collected | 0 | 0 | not_collected |
| 5kg non-recyclable, partial | 0 | +25 | partial |

**Formula:**
- Star Points = `weight × 10` (recyclable only, if collected/partial)
- Payment = `weight × 5` (non-recyclable only, if collected/partial)

---

## 🔍 Verification Checklist

After each test, verify:

✅ **Status Code**: Should be `200 OK` or `201 Created`  
✅ **Response Structure**: Has `success: true` and `data` object  
✅ **Star Points**: Correctly calculated (weight × 10 for recyclable)  
✅ **Payment**: Correctly calculated (weight × 5 for non-recyclable)  
✅ **Bin Status**: Updated correctly (emptied/partial/not_collected)  
✅ **Timestamps**: `createdAt` and `updatedAt` present  
✅ **Resident Data**: Populated correctly  

---

## 🐛 Common Issues

### Issue: 404 Not Found
- **Fix**: Make sure server is running on port 5000
- **Check**: `http://localhost:5000/health` works

### Issue: "Bin not found"
- **Fix**: Run seed script first: `node seed/collectionSeed.js`
- **Check**: Use exact binID like `BIN-R001` (uppercase)

### Issue: "Resident not found"
- **Fix**: Ensure resident exists
- **Check**: GET `/api/residents` first

### Issue: MongoDB connection error
- **Fix**: See `MONGODB_FIX.md`
- **Quick fix**: Use local MongoDB

---

## 📚 Postman Features to Use

### 1. Tests Tab

Add this to any request's "Tests" tab to auto-save IDs:

```javascript
// Auto-save resident ID
if (pm.response.json().data && pm.response.json().data._id) {
    pm.collectionVariables.set("residentId", pm.response.json().data._id);
}

// Auto-save from array response
if (pm.response.json().data && pm.response.json().data[0]) {
    pm.collectionVariables.set("residentId", pm.response.json().data[0]._id);
}
```

### 2. Collection Runner

Run all tests automatically:
1. Click collection name
2. Click "Run"
3. Select requests to run
4. Click "Run Worker Waste Collection API"

### 3. Environments

Create separate environments:
- **Local**: `baseUrl = http://localhost:5000`
- **Production**: `baseUrl = https://your-api.com`

---

## ✅ Success Metrics

You'll know it's working when:

1. ✅ Health check returns `{"ok": true}`
2. ✅ Can create residents, bins, and collections
3. ✅ Star points increase for recyclable waste
4. ✅ Payment increases for non-recyclable waste
5. ✅ Bin status updates correctly
6. ✅ Can filter collections by various criteria
7. ✅ Can update and delete collections
8. ✅ Resident totals update automatically

---

**Happy Testing! 🎉**

For issues, see:
- `MONGODB_FIX.md` - Database connection help
- `WORKER_COLLECTION_MODULE.md` - Full API documentation
- `QUICKSTART_WORKER_MODULE.md` - Quick setup guide
