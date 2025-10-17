# 404 Error Fix - Summary

## Problem
Frontend was getting 404 errors when trying to call payment API endpoints:
```
Failed to load resource: the server responded with a status of 404 (Not Found)
:5000/api/payments
```

## Root Causes
1. **Payment routes not mounted**: The backend `index.js` wasn't importing or mounting the payment and pricing routes
2. **Server not restarted**: After adding routes, the server needed to be restarted
3. **Missing user ID header**: API calls weren't including the `x-user-id` header required by backend auth middleware
4. **No seeded data**: Database was empty, needed sample data

## Solutions Applied

### 1. Added ALL Route Mounting to Backend
**File:** `backend/index.js`

Added the following code to mount all API routes:
```javascript
// Import and mount all API routes
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payments');
const pricingRoutes = require('./routes/pricing');
const reportsRoutes = require('./routes/reports');
const usersRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/users', usersRoutes);
```

### 2. Added User ID Header to Frontend
**File:** `frontend/src/services/api.ts`

Updated axios instance to include user ID:
```typescript
const DEV_USER_ID = '68f1f6dc4621b8535c48f216'; // Alice (resident)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': DEV_USER_ID, // Dev mode: pass user ID directly
  },
});
```

### 3. Seeded Database
**Command:** `node seed/seed.js`

Populated database with:
- 3 users (resident, staff, admin)
- Sample collection records
- Sample payment records
- Pricing model for Colombo

### 4. Restarted Backend Server
**Command:** `node index.js`

Backend now running on: http://localhost:5000
Frontend running on: http://localhost:5173

## Current Status ✅

### Backend (Port 5000)
- ✅ Express server running
- ✅ MongoDB connected
- ✅ Payment routes mounted at `/api/payments`
- ✅ Pricing routes mounted at `/api/pricing`
- ✅ Database seeded with sample data

### Frontend (Port 5173)
- ✅ Vite dev server running
- ✅ API configured with correct base URL
- ✅ User ID header included in all requests
- ✅ All payment pages ready

### Available API Endpoints
```
# Authentication
POST   /api/auth/register             - User registration
POST   /api/auth/login                - User login

# Payments
GET    /api/payments/history/me       - User payment history
GET    /api/payments/summary          - Payment summary stats
POST   /api/payments                  - Create payment
POST   /api/payments/payback          - Record payback

# Pricing
GET    /api/pricing                   - List pricing models
POST   /api/pricing                   - Create pricing model
PUT    /api/pricing/:id               - Update pricing model
DELETE /api/pricing/:id               - Delete pricing model

# Reports
GET    /api/reports/summary           - Waste collection summary
GET    /api/reports/trends            - Waste trends (daily/weekly/monthly)
GET    /api/reports/route-efficiency  - Route efficiency metrics
GET    /api/reports/payments          - Payment reports
GET    /api/reports/export/pdf        - Export report as PDF
GET    /api/reports/export/excel      - Export report as Excel

# Users
GET    /api/users                     - List all users (admin)
GET    /api/users/me                  - Get current user profile
PUT    /api/users/me                  - Update user profile
GET    /api/users/:id                 - Get user by ID (admin)
POST   /api/users                     - Create user (admin)
```

### Test Users (from seed)
```
RESIDENT: alice@resident.com - ID: 68f1f6dc4621b8535c48f216
STAFF:    bob@staff.com    - ID: 68f1f6dd4621b8535c48f219
ADMIN:    admin@admin.com  - ID: 68f1f6dd4621b8535c48f21c
```

## How to Test

1. **Open browser**: Navigate to http://localhost:5173
2. **Go to Payments**: Click "Payments" in navbar or go to `/payments`
3. **Verify data loads**: Should see payment history and account balance
4. **Test payment**: Click "Pay Now" and fill card form
5. **Test payback**: Go to `/paybacks` and add recyclable items
6. **Test admin**: Go to `/admin/pricing` to manage pricing models

## Verification Commands

### Test API Endpoint (PowerShell)
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/payments/history/me" `
  -Headers @{"x-user-id"="68f1f6dc4621b8535c48f216"} `
  -Method GET
```

### Check Running Processes
```powershell
# Backend on port 5000
Get-NetTCPConnection -LocalPort 5000

# Frontend on port 5173
Get-NetTCPConnection -LocalPort 5173
```

### Get User IDs
```powershell
cd backend
node seed/get-users.js
```

## Files Modified
1. `backend/index.js` - Added payment/pricing route mounting
2. `frontend/src/services/api.ts` - Added x-user-id header
3. `backend/seed/get-users.js` - Created helper script to get user IDs

## Next Steps
- ✅ Backend running with routes mounted
- ✅ Frontend configured with user ID
- ✅ Database seeded
- ✅ Ready to test payment flows!

Navigate to http://localhost:5173/payments to verify the fix!
