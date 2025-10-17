# Quick Test Guide - Payment System

## Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5174` (or 5173)
- MongoDB connected (or in-memory fallback active)

## Test Scenario 1: New User Registration & Payment

### Step 1: Register a New User
1. Open browser to `http://localhost:5174/signup`
2. Fill in the form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
   - Phone: `0771234567`
   - Address: `123 Main St, Colombo`
3. Select Role: **Resident**
4. Check "I agree to terms"
5. Click **Create Account**
6. ✅ Should redirect to homepage and show user logged in

### Step 2: Navigate to Payments
1. Click **Payments 💳** in navbar
2. ✅ Should see Payments Page
3. ✅ Should NOT see "400 Bad Request" errors in console
4. ✅ Should see "Account Balance" and "Outstanding Amount" cards

### Step 3: Create a Payment
1. Click **Pay Now** button
2. Select payment method: **Credit Card**
3. Fill in card details (mock):
   - Card Number: `4111111111111111`
   - Expiry: `12/25`
   - CVV: `123`
4. Click **Confirm Payment**
5. ✅ Should see success message
6. ✅ Payment should appear in "Payment History" table immediately

### Step 4: Verify Payment Persistence
1. Refresh the page (F5)
2. ✅ Payment should still be visible in history
3. ✅ Account balance should reflect the payment
4. ✅ Summary stats should be updated

### Step 5: Logout and Login Again
1. Click **Logout** button in navbar
2. Navigate to `/login`
3. Login with:
   - Email: `john.doe@example.com`
   - Password: `password123`
4. Navigate back to Payments page
5. ✅ Payment history should still be there
6. ✅ Same balance and summary

## Test Scenario 2: Report an Issue

### Step 1: Navigate to Report Issue
1. Click **📝 Report Issue** in navbar (should be visible when logged in)
2. ✅ Should see Issue Reporting form

### Step 2: Submit an Issue
1. Fill in the form:
   - Category: Select **Bin Issue**
   - Description: `Broken bin lid needs replacement`
   - City: `Colombo`
   - Area: `Mount Lavinia`
   - Address: `123 Main St`
2. Click **Submit Issue**
3. ✅ Should see success message
4. ✅ Issue should appear in "Your Issues" list below

### Step 3: Filter Issues
1. Use the filter dropdown above the issue list
2. Select **Pending**
3. ✅ Should see only pending issues
4. Select **All Issues**
5. ✅ Should see all issues again

## Test Scenario 3: Staff/Admin Access

### Step 1: Register as Staff
1. Logout
2. Register new account with role: **Staff**
3. ✅ Should see **⚙️ Manage Issues** button in navbar

### Step 2: Manage Issues
1. Click **⚙️ Manage Issues**
2. ✅ Should see all reported issues from all users
3. ✅ Should see filters (Status, Category, City, Search)

### Step 3: Update an Issue
1. Click **Manage** on any issue
2. Change Status to **In Progress**
3. Add Resolution Notes: `Scheduled for repair tomorrow`
4. Click **Update Issue**
5. ✅ Should see success message
6. ✅ Issue status should update in table

## Common Issues & Solutions

### Error: "400 Bad Request on /api/payments/summary"
**Solution**: ✅ FIXED - Backend now filters by authenticated user

### Error: "Payment created but not showing in history"
**Solution**: ✅ FIXED - Frontend now sends JWT token with requests

### Error: "Unauthorized (401)"
**Solution**: Make sure you're logged in and JWT token is in localStorage
- Open DevTools → Application → Local Storage
- Check for `token` and `user` keys
- If missing, login again

### Error: "CORS error"
**Solution**: Backend CORS already configured for ports 5173, 5174, 3000

### Backend not responding
**Solution**: 
```powershell
cd "d:\wast mgt\Smart_Waste_Management_System\backend"
npm start
```

### Frontend not responding
**Solution**:
```powershell
cd "d:\wast mgt\Smart_Waste_Management_System\frontend"
npm run dev
```

## Expected Console Outputs

### Successful Payment Creation:
```
POST http://localhost:5000/api/payments 201 Created
{
  "status": "completed",
  "transactionId": "TXN_1234567890",
  "record": { ... }
}
```

### Successful Payment History Fetch:
```
GET http://localhost:5000/api/payments/history/me 200 OK
{
  "total": 1,
  "items": [
    {
      "_id": "...",
      "amount": 30,
      "type": "payment",
      "status": "completed",
      "date": "2025-10-17T..."
    }
  ]
}
```

### Successful Summary Fetch:
```
GET http://localhost:5000/api/payments/summary 200 OK
{
  "totals": [
    { "type": "payment", "total": -30 }
  ],
  "outstanding": 0
}
```

## Debug Checklist

If payments still not showing:

1. ✅ Check browser DevTools → Network tab for API calls
2. ✅ Verify JWT token in request headers: `Authorization: Bearer eyJ...`
3. ✅ Check backend console for errors
4. ✅ Verify user is logged in: `localStorage.getItem('user')`
5. ✅ Check MongoDB connection (backend should print "Connected to MongoDB")
6. ✅ Verify payment was actually created in database

## Quick Commands

### View all payments in MongoDB (if using MongoDB Compass):
```
Database: waste_management
Collection: paymentrecords
Filter: { "userId": ObjectId("...") }
```

### Check backend logs:
Backend console should show:
```
Backend dev server listening on http://localhost:5000
Connected to MongoDB
```

### Check frontend is using correct API:
DevTools → Network → Fetch/XHR → Check request URL starts with:
```
http://localhost:5000/api/...
```

## Success Criteria

✅ User can register and login
✅ User sees their own payments only
✅ Payments persist after page refresh
✅ Payments persist after logout/login
✅ No 400/401 errors in console
✅ Summary shows correct totals
✅ Payment history shows transaction list
✅ Report Issue feature works
✅ Staff can manage all issues
✅ Navbar shows correct options based on role
