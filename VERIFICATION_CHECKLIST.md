# Quick Verification Checklist

## ✅ Pre-Check: Services Running

- [ ] Backend server running on port 5000
  - Check: Terminal shows "Backend dev server listening on http://localhost:5000"
  - Check: Terminal shows "Connected to MongoDB"
  
- [ ] Frontend server running on port 5173
  - Check: Terminal shows "VITE v5.4.20 ready"
  - Check: Can access http://localhost:5173

---

## ✅ Test Each Page

### Dashboard (http://localhost:5173/dashboard or /)
- [ ] Page loads without errors
- [ ] Waste collection chart displays
- [ ] Summary stats show numbers
- [ ] No 404 errors in console

### Payments Page (http://localhost:5173/payments)
- [ ] Page loads without errors
- [ ] Stats cards show data (Amount Due, Outstanding, Balance, Transactions)
- [ ] Payment history table displays
- [ ] "Pay Now" button opens modal
- [ ] Card payment form has all fields
- [ ] Can submit payment (shows success toast)
- [ ] No 404 errors in console

### Paybacks Page (http://localhost:5173/paybacks)
- [ ] Page loads without errors
- [ ] Can add items to cart
- [ ] Estimated payback calculates
- [ ] Can remove items from cart
- [ ] Can submit payback (shows success toast)
- [ ] No 404 errors in console

### Admin Pricing (http://localhost:5173/admin/pricing)
- [ ] Page loads without errors
- [ ] Stats cards show counts
- [ ] Pricing models table displays
- [ ] Can click "Add New Model"
- [ ] Modal opens with form
- [ ] Can create new pricing model
- [ ] Can edit existing model
- [ ] Can delete model (with confirmation)
- [ ] No 404 errors in console

### Admin Waste Reports (http://localhost:5173/admin/waste-reports)
- [ ] Page loads without errors
- [ ] Charts display data
- [ ] Trends chart shows
- [ ] Area/waste type filters work
- [ ] No 404 errors in console

### Admin Payment Reports (http://localhost:5173/admin/payment-reports)
- [ ] Page loads without errors
- [ ] Payment data displays
- [ ] Charts/tables show
- [ ] No 404 errors in console

---

## ✅ API Endpoint Tests

### Test Reports (Previously Failing)
```powershell
# Run these in PowerShell to verify APIs work

# 1. Reports Summary
Invoke-WebRequest -Uri "http://localhost:5000/api/reports/summary" | Select StatusCode
# Expected: StatusCode : 200

# 2. Reports Trends
Invoke-WebRequest -Uri "http://localhost:5000/api/reports/trends?granularity=monthly" | Select StatusCode
# Expected: StatusCode : 200

# 3. Payment Reports
Invoke-WebRequest -Uri "http://localhost:5000/api/reports/payments" | Select StatusCode
# Expected: StatusCode : 200
```

### Test Payments
```powershell
# Payment History
Invoke-WebRequest -Uri "http://localhost:5000/api/payments/history/me" `
  -Headers @{"x-user-id"="68f1f6dc4621b8535c48f216"} | Select StatusCode
# Expected: StatusCode : 200

# Payment Summary
Invoke-WebRequest -Uri "http://localhost:5000/api/payments/summary" | Select StatusCode
# Expected: StatusCode : 200
```

### Test Pricing
```powershell
# List Pricing Models
Invoke-WebRequest -Uri "http://localhost:5000/api/pricing" | Select StatusCode
# Expected: StatusCode : 200
```

---

## ✅ Browser Console Check

Open browser console (F12) and look for:

### Should NOT see:
- ❌ Any 404 errors
- ❌ "Failed to load resource" messages
- ❌ Network errors

### Should see:
- ✅ Successful API calls (200 status)
- ✅ Data being fetched and displayed
- ✅ No error messages

---

## ✅ Feature Tests

### Payment Flow
1. [ ] Go to Payments page
2. [ ] Click "Pay Now"
3. [ ] Enter card details:
   - Card: 4532 1234 5678 9010 (auto-formats with spaces)
   - Name: Test User
   - Expiry: 12/25 (auto-formats to MM/YY)
   - CVV: 123
4. [ ] Click "Confirm Payment"
5. [ ] See loading spinner
6. [ ] See success toast notification
7. [ ] Payment appears in history table
8. [ ] Account balance updates

### Payback Flow
1. [ ] Go to Paybacks page
2. [ ] Select material type: Plastic
3. [ ] Enter weight: 5
4. [ ] Click "Add to Cart"
5. [ ] See item in cart
6. [ ] Estimated payback shows (e.g., $1.00)
7. [ ] Add another item (Metal, 3 kg)
8. [ ] See updated payback estimate
9. [ ] Click "Submit All Items"
10. [ ] See success toast
11. [ ] Cart clears

### Admin Pricing Flow
1. [ ] Go to Admin Pricing page
2. [ ] Click "Add New Model"
3. [ ] Fill form:
   - City: Kandy
   - Model Type: Flat Fee
   - Flat Fee Amount: 40
   - Plastic rate: 0.25
   - eWaste rate: 1.8
   - Metal rate: 0.6
   - Paper rate: 0.15
4. [ ] Click "Create Model"
5. [ ] See success toast
6. [ ] New model appears in table
7. [ ] Click "Edit" on model
8. [ ] Change values
9. [ ] Save changes
10. [ ] Click "Delete"
11. [ ] Confirm deletion
12. [ ] Model removed from table

---

## 🐛 Troubleshooting

### If you see 404 errors:

1. **Check backend is running:**
   ```powershell
   Get-NetTCPConnection -LocalPort 5000
   ```
   If nothing shows, restart: `cd backend; node index.js`

2. **Check MongoDB connection:**
   Look at backend terminal - should say "Connected to MongoDB"
   If not, check .env file has correct MONGO_URI

3. **Restart both servers:**
   ```powershell
   # Stop all node processes
   taskkill /F /IM node.exe
   
   # Start backend
   cd "d:\wast mgt\Smart_Waste_Management_System\backend"
   node index.js
   
   # In another terminal, start frontend
   cd "d:\wast mgt\Smart_Waste_Management_System\frontend"
   npm run dev
   ```

4. **Clear browser cache:**
   Press Ctrl+Shift+Del, clear cache, hard refresh (Ctrl+Shift+R)

5. **Check user ID:**
   Verify `frontend/src/services/api.ts` has correct user ID:
   ```typescript
   const DEV_USER_ID = '68f1f6dc4621b8535c48f216';
   ```

### If data is missing:

1. **Re-seed database:**
   ```powershell
   cd backend
   node seed/seed.js
   ```

2. **Get fresh user IDs:**
   ```powershell
   cd backend
   node seed/get-users.js
   ```
   Update frontend api.ts with new IDs if they changed

---

## ✅ Success Criteria

**All checks should be ✅ if everything is working correctly!**

If any checks fail, refer to the troubleshooting section above or check:
- `FINAL_FIX_SUMMARY.md` - Complete fix explanation
- `API_TESTING_GUIDE.md` - API testing commands
- `404_FIX_SUMMARY.md` - 404 error fixes

---

**Last Updated:** October 17, 2025
**Status:** Ready for Testing
