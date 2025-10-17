# 🚀 Quick Postman Testing - TL;DR

## 1️⃣ Start Server
```bash
cd backend
npm start
```
**Must see**: `Backend dev server listening on http://localhost:5000`

---

## 2️⃣ Import to Postman
1. Open Postman
2. **Import** → Choose file
3. Select: `backend/postman/WorkerWasteCollection.postman_collection.json`
4. Set `baseUrl` = `http://localhost:5000`

---

## 3️⃣ Seed Database (Optional)
```bash
node seed/collectionSeed.js
```
Creates 5 residents, 10 bins, 30 collections

---

## 4️⃣ Test These in Order

### ✅ 1. Health Check
```
GET http://localhost:5000/health
→ {"ok": true}
```

### ✅ 2. Get Residents
```
GET http://localhost:5000/api/residents
→ Returns list of residents
→ Copy an "_id" for next steps
```

### ✅ 3. Scan Bin (Worker Scans QR)
```
GET http://localhost:5000/api/bins/BIN-R001
→ Shows bin + resident info
→ Note resident's starPoints
```

### ✅ 4. Record Recyclable Collection
```
POST http://localhost:5000/api/collections
Body:
{
  "binID": "BIN-R001",
  "wasteType": "recyclable",
  "weight": 5.5,
  "workerId": "WORKER-001",
  "status": "collected"
}
→ Resident gets +55 star points (5.5 × 10)
→ Bin status → "emptied"
```

### ✅ 5. Record Non-Recyclable Collection
```
POST http://localhost:5000/api/collections
Body:
{
  "binID": "BIN-G001",
  "wasteType": "non_recyclable",
  "weight": 3.2,
  "workerId": "WORKER-001",
  "status": "collected"
}
→ Resident gets +16 payment (3.2 × 5)
→ Bin status → "emptied"
```

### ✅ 6. View All Collections
```
GET http://localhost:5000/api/collections
→ See all recorded collections
```

---

## 🎯 Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/api/residents` | List all residents |
| GET | `/api/residents/:id` | Get resident details |
| POST | `/api/residents` | Create resident |
| GET | `/api/bins` | List all bins |
| GET | `/api/bins/:id` | Scan bin (accepts binID) |
| POST | `/api/bins` | Create bin |
| GET | `/api/collections` | List collections |
| POST | `/api/collections` | Record collection |
| PUT | `/api/collections/:id` | Update collection |
| DELETE | `/api/collections/:id` | Delete collection |

---

## 💡 Quick Business Rules

**Recyclable Waste:**
- ✅ Awards star points: `weight × 10`
- ✅ No payment charged
- ✅ Only if status is "collected" or "partial"

**Non-Recyclable Waste:**
- ✅ Charges payment: `weight × 5`
- ✅ No star points
- ✅ Only if status is "collected" or "partial"

**Status "not_collected":**
- ❌ No star points
- ❌ No payment
- ✅ Updates bin status only

---

## 🔥 Sample Test Bodies

### Create Resident
```json
{
  "name": "New Resident",
  "address": "456 Main St",
  "email": "new@email.com",
  "phone": "+1-555-1234"
}
```

### Create Bin
```json
{
  "binID": "BIN-TEST001",
  "resident": "RESIDENT_ID_HERE"
}
```

### Recyclable Collection
```json
{
  "binID": "BIN-R001",
  "wasteType": "recyclable",
  "weight": 5.5,
  "workerId": "WORKER-001",
  "status": "collected"
}
```

### Partial Collection
```json
{
  "binID": "BIN-R002",
  "wasteType": "recyclable",
  "weight": 2.5,
  "status": "partial",
  "notes": "Overflow"
}
```

### Not Collected
```json
{
  "binID": "BIN-R003",
  "wasteType": "recyclable",
  "weight": 0,
  "status": "not_collected",
  "notes": "Blocked by vehicle"
}
```

---

## ✅ Expected Results

**After Recyclable Collection (5.5 kg):**
- Resident: `starPoints += 55`
- Bin: `status = "emptied"`
- Collection: `starPointsAwarded = 55`

**After Non-Recyclable (3.2 kg):**
- Resident: `outstandingBalance += 16`
- Bin: `status = "emptied"`
- Collection: `payment = 16`

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect | Check server is running: `npm start` |
| 404 errors | Check baseUrl is `http://localhost:5000` |
| "Bin not found" | Run `node seed/collectionSeed.js` |
| MongoDB error | See `MONGODB_FIX.md` |

---

## 📚 Full Guide

For detailed testing scenarios: **`POSTMAN_TESTING_GUIDE.md`**

---

**Ready to test? Import the collection and start with the health check!** 🚀
