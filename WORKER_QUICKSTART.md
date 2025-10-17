# 🚀 Worker Module - Quick Start Guide

Get your worker module up and running in 5 minutes!

## Prerequisites

- ✅ MongoDB Atlas account with cluster setup
- ✅ Node.js installed
- ✅ Backend and frontend folders exist

---

## Step 1: Start Backend (2 minutes)

```bash
# Navigate to backend
cd backend

# Start the server
npm start
```

**Expected Output:**
```
✅ Connected to MongoDB successfully!
📦 Database: smartwaste
✅ Worker module routes registered
Backend dev server listening on http://localhost:5000
```

---

## Step 2: Seed Test Data (1 minute)

```bash
# In backend directory
npm run seed:worker
```

**This creates:**
- 3 workers (john@ecowaste.com, sarah@ecowaste.com, mike@ecowaste.com)
- 5 residents with bins
- 6 waste bins with QR codes
- 3 active routes
- 2 active sessions

**Password for all:** `password123`

---

## Step 3: Test Backend API (1 minute)

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@ecowaste.com","password":"password123"}'
```

**Copy the token from response!**

### Test Dashboard
```bash
curl -X GET http://localhost:5000/api/worker/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**If you see data → Backend is working!** ✅

---

## Step 4: Start Frontend (1 minute)

```bash
# Navigate to frontend (in new terminal)
cd frontend

# Start dev server
npm run dev
```

**Open:** http://localhost:3000

---

## Step 5: Test Worker Frontend

1. **Go to:** http://localhost:3000/worker/login

2. **Login with:**
   - Email: `john@ecowaste.com`
   - Password: `password123`

3. **You should see:**
   - ✅ Worker Dashboard
   - ✅ Routes assigned
   - ✅ Bins to collect
   - ✅ Statistics

4. **Try scanning a bin:**
   - Click "Scan Bin"
   - Enter bin code: `BIN-001`
   - Fill in collection details
   - Submit

---

## 🎯 What You Can Do Now

### As a Worker:

✅ **Login** - http://localhost:3000/worker/login  
✅ **View Dashboard** - See assigned routes and stats  
✅ **Scan Bins** - Enter bin codes (BIN-001 to BIN-006)  
✅ **Record Collections** - Log waste collections  
✅ **View History** - See past collections  
✅ **Manual Entry** - Add collections without scanning  
✅ **View Summary** - Check shift performance  

### Test Bin Codes:
- `BIN-001` - Alice's recyclable bin
- `BIN-002` - Alice's organic bin
- `BIN-003` - Bob's recyclable bin
- `BIN-004` - Carol's general bin
- `BIN-005` - David's recyclable bin
- `BIN-006` - Emma's organic bin

---

## 📊 Monitor Activity

### Check Backend Logs
```bash
# In backend terminal
# You'll see collection records being created
```

### Check Database (Optional)
```bash
# Connect to MongoDB
mongosh "your_connection_string"

# View collections
use smartwaste
db.collectionrecords.find().pretty()
db.bins.find().pretty()
db.sessions.find().pretty()
```

---

## 🐛 Troubleshooting

### Backend won't start?
```bash
# Check if port 5000 is in use
lsof -i :5000

# If MongoDB not connected
# → Check .env file has MONGO_URI
# → Verify IP is whitelisted in MongoDB Atlas
```

### Frontend won't connect?
```bash
# Check API URL in: frontend/src/worker/config/api.ts
# Should be: http://localhost:5000

# If still issues, frontend will use mock data as fallback
```

### Can't login?
```bash
# Re-run seed script
cd backend
npm run seed:worker

# Try mock credentials:
# john@ecowaste.com / password123
```

---

## 📚 Next Steps

1. **Read Full API Docs:** `backend/WORKER_API_DOCS.md`
2. **Explore Code:** `backend/controllers/worker*.js`
3. **Customize:** Modify waste types, reward rates in `backend/utils/calculation.js`
4. **Add Features:** Refer to `BACKEND_WORKER_IMPLEMENTATION.md`

---

## 🎉 You're All Set!

Your worker module is now fully functional with:
- ✅ Backend API running on port 5000
- ✅ Frontend running on port 3000
- ✅ Test data seeded
- ✅ Authentication working
- ✅ Full worker workflow operational

**Start collecting waste and tracking rewards!** 🗑️♻️✨

---

## Quick Reference

| Component | URL/Command |
|-----------|-------------|
| Backend | http://localhost:5000 |
| Frontend | http://localhost:3000 |
| Worker Login | http://localhost:3000/worker/login |
| API Docs | `backend/WORKER_API_DOCS.md` |
| Seed Data | `npm run seed:worker` |
| Test Login | john@ecowaste.com / password123 |

---

**Need Help?** Check `WORKER_MODULE_UPDATES.md` or `BACKEND_WORKER_IMPLEMENTATION.md`
