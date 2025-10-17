# 🔧 Quick Fix for MongoDB Issues

## ✅ Issues Fixed

1. **Duplicate Index Warnings** - ✅ FIXED
   - Removed `unique: true` from schema field definitions
   - Moved unique constraint to index definitions
   - No more duplicate index warnings

2. **MongoDB Atlas Connection Error** - Solutions provided below

---

## 🚀 Quick Solution (Recommended for Development)

### Use Local MongoDB Instead of Atlas

Run this one command:

```bash
cd /Users/gavidurushela/Projects/Smart_Waste_Management_System/Untitled/backend
bash setup-local-mongodb.sh
```

This script will:
- ✅ Install MongoDB locally (if not installed)
- ✅ Start MongoDB service
- ✅ Update your `.env` file
- ✅ Test the connection

Then:
```bash
npm start
node seed/collectionSeed.js
```

---

## 🌐 Alternative: Fix MongoDB Atlas Connection

If you prefer to keep using MongoDB Atlas:

### Step 1: Whitelist Your IP

```bash
# Get your current IP
curl ifconfig.me
```

### Step 2: Add IP to Atlas
1. Go to https://cloud.mongodb.com/
2. Select your cluster
3. Click **"Network Access"** → **"Add IP Address"**
4. Click **"Add Current IP Address"**
5. Click **"Confirm"**
6. Wait 1-2 minutes

### Step 3: Test
```bash
npm start
```

---

## 📋 What Changed

### Fixed Files:

1. **`models/Resident.js`**
   ```javascript
   // Before: unique: true in field definition + index
   // After: only in index definition
   residentSchema.index({ email: 1 }, { unique: true });
   ```

2. **`models/Bin.js`**
   ```javascript
   // Before: unique: true in field definition + index
   // After: only in index definition
   binSchema.index({ binID: 1 }, { unique: true });
   ```

3. **`config/db.js`**
   - Added better error messages
   - Added connection timeout
   - Added helpful fix suggestions

---

## 🎯 Recommended Setup

**For Development (Local):**
```env
MONGO_URI=mongodb://localhost:27017/waste_management
PORT=5000
NODE_ENV=development
```

**For Production (Atlas):**
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/waste_management
PORT=5000
NODE_ENV=production
```

---

## ✅ Verify Everything Works

After fixing, you should see:

```bash
npm start
# ✓ MongoDB Connected: localhost:27017
# Backend dev server listening on http://localhost:5000

node seed/collectionSeed.js
# ✓ Connected to MongoDB
# ✓ Created 5 residents
# ✓ Created 10 bins
# ✓ Created 30 collection records
# ✅ Seed completed successfully!
```

No warnings or errors!

---

## 🆘 Still Having Issues?

### Check MongoDB Status
```bash
# Is MongoDB running?
brew services list | grep mongodb

# Or with Docker
docker ps | grep mongo
```

### Test Connection Directly
```bash
mongosh mongodb://localhost:27017/waste_management
# Should connect without errors
```

### View Detailed Logs
```bash
# Check MongoDB logs
brew services info mongodb-community

# Or check your .env
cat .env
```

---

## 📚 Full Documentation

- **MongoDB Fix Guide**: `MONGODB_FIX.md`
- **Module Documentation**: `WORKER_COLLECTION_MODULE.md`
- **Quick Start**: `QUICKSTART_WORKER_MODULE.md`

---

**Need more help?** See `MONGODB_FIX.md` for detailed troubleshooting steps.
