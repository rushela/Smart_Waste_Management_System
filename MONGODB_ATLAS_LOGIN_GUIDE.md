# Setup MongoDB Atlas & Login Guide

## Issue: IP Address Not Whitelisted

Your MongoDB Atlas cluster is blocking the connection because your IP address is not whitelisted.

## Solution 1: Whitelist Your IP Address (Recommended)

### Step 1: Go to MongoDB Atlas
1. Open browser and go to: https://cloud.mongodb.com
2. Login to your account

### Step 2: Whitelist Your IP
1. Click on **"Network Access"** in the left sidebar
2. Click **"Add IP Address"** button
3. Choose one of these options:
   - **Option A (Easy):** Click **"Add Current IP Address"** - Whitelists your current IP
   - **Option B (Open):** Click **"Allow Access from Anywhere"** - Enter `0.0.0.0/0` (less secure, but good for testing)
4. Click **"Confirm"**
5. Wait 1-2 minutes for changes to take effect

### Step 3: Run Seed Script Again
```bash
cd backend
node seed/seedAllData.js
```

## Solution 2: Create Users via Signup Page (Alternative)

If you don't want to configure MongoDB Atlas right now, you can create test accounts directly through the web interface:

### Step 1: Start Frontend
```bash
cd frontend
npm run dev
```

### Step 2: Create Test Accounts
Open browser: `http://localhost:5173/signup`

**Create these accounts:**

1. **Admin Account**
   - Name: Admin User
   - Email: admin@smartwaste.lk
   - Password: admin123
   - Role: Admin
   - Phone: 0112345678
   - Address: Smart Waste HQ, Colombo
   - Department: Operations

2. **Worker/Staff Account**
   - Name: John Worker
   - Email: worker@smartwaste.lk
   - Password: worker123
   - Role: Staff
   - Phone: 0771234567
   - Address: 45 Worker Lane, Kandy
   - Staff ID: WRK001

3. **Resident Account**
   - Name: Jane Resident
   - Email: resident@smartwaste.lk
   - Password: resident123
   - Role: Resident
   - Phone: 0761234567
   - Address: 123 Green Street, Galle
   - Household Size: 4-5

4. **Your Account (Already Created?)**
   - Email: sanjulakalpani1212@gmail.com
   - Password: test123

## How to Login & Test the System

### Step 1: Make Sure Backend is Running
```bash
cd backend
npm start
```
✅ You should see: `Backend dev server listening on http://localhost:5000`

### Step 2: Make Sure Frontend is Running
```bash
cd frontend
npm run dev
```
✅ You should see: `Local: http://localhost:5173/`

### Step 3: Login to the System

#### A. Login Page
1. Go to: `http://localhost:5173/login`
2. Enter credentials:
   - **Admin:** admin@smartwaste.lk / admin123
   - **Worker:** worker@smartwaste.lk / worker123  
   - **Resident:** resident@smartwaste.lk / resident123
   - **Your Account:** sanjulakalpani1212@gmail.com / test123
3. Click **"Sign In"**

#### B. What Happens After Login?

**For Admin/Staff:**
- Redirected to: `/admin/dashboard`
- You'll see the admin dashboard with reports and analytics
- Access to:
  - Waste Reports
  - User Reports
  - Payment Reports
  - Custom Reports

**For Resident:**
- Redirected to: `/` (Home page)
- Access to resident features
- Can view waste collection schedules
- Can make payments

### Step 4: Test Worker Collection Module

1. Go to: `http://localhost:5173/worker/collection`
2. Click **"Scan QR Code"** (simulated scanner)
3. Enter a bin ID: `BIN001` (if you seeded data)
4. Fill the collection form:
   - Waste Type: Recyclable or Non-Recyclable
   - Weight: Enter weight in kg (e.g., 5.5)
   - Notes: Optional notes
5. Click **"Submit Collection"**

## Testing Checklist

### ✅ Backend Tests
- [ ] Backend server starts successfully
- [ ] Connects to MongoDB Atlas
- [ ] No errors in terminal

### ✅ Authentication Tests
- [ ] Can register new user
- [ ] Can login with email/password
- [ ] Token saved to localStorage
- [ ] User redirected based on role

### ✅ Admin Dashboard Tests (Admin/Staff only)
- [ ] Can access `/admin/dashboard`
- [ ] Can view waste reports
- [ ] Can view user reports
- [ ] Can view payment reports

### ✅ Worker Collection Tests (Staff only)
- [ ] Can access `/worker/collection`
- [ ] Can scan/enter bin ID
- [ ] Can view resident info
- [ ] Can submit collection record
- [ ] Rewards calculated correctly

### ✅ Payment Tests
- [ ] Can access payment dashboard
- [ ] Can make payment
- [ ] Can view transaction history

## Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:** Whitelist your IP address in MongoDB Atlas (see Solution 1 above)

### Issue: "Invalid credentials" on login
**Solution:** 
- Make sure you created the user account first (via signup)
- Check email and password are correct
- Passwords are case-sensitive

### Issue: "CORS error"
**Solution:** Already fixed! Backend is configured to allow frontend origins

### Issue: "Cannot access /admin/dashboard"
**Solution:** 
- Make sure you logged in with admin or staff account
- Residents cannot access admin dashboard

### Issue: Page not found
**Solution:**
- Make sure frontend is running on port 5173
- Make sure you're using the correct URL

## Current Status

✅ **Backend:** Configured and ready
✅ **Frontend:** Configured and ready
✅ **CORS:** Fixed
✅ **Database:** MongoDB Atlas connected (needs IP whitelist)
✅ **User Model:** Supports all signup fields
✅ **Auth System:** Login & Registration working

⚠️ **Action Required:** Whitelist IP address in MongoDB Atlas to run seed script

## Next Steps

1. **Whitelist IP** in MongoDB Atlas (2 minutes)
2. **Run seed script** to populate database (30 seconds)
3. **Login** to test the system (2 minutes)
4. **Test all features** (10 minutes)

---

**Ready to test!** 🚀

After whitelisting your IP, run the seed script and then login with any of the test credentials above.
