# Complete API Testing Guide

## Quick Test Commands (PowerShell)

### Reports API (Fixing Current 404 Errors)

#### 1. Waste Reports Summary
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/reports/summary?from=2025-09-17T00:00:00.000Z&to=2025-10-17T23:59:59.999Z" -Method GET | Select-Object -ExpandProperty Content
```

#### 2. Waste Trends
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/reports/trends?granularity=monthly" -Method GET | Select-Object -ExpandProperty Content
```

#### 3. Payment Reports
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/reports/payments" -Method GET | Select-Object -ExpandProperty Content
```

#### 4. Route Efficiency
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/reports/route-efficiency" -Method GET | Select-Object -ExpandProperty Content
```

---

### Payment API

#### 5. Payment History
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/payments/history/me" `
  -Headers @{"x-user-id"="68f1f6dc4621b8535c48f216"} `
  -Method GET | Select-Object -ExpandProperty Content
```

#### 6. Payment Summary
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/payments/summary" -Method GET | Select-Object -ExpandProperty Content
```

#### 7. Create Payment
```powershell
$paymentBody = @{
  amount = 50
  method = "card"
  type = "payment"
  paymentType = "collection_fee"
  billingModel = "flat_fee"
  city = "Colombo"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/payments" `
  -Method POST `
  -Headers @{
    "Content-Type"="application/json"
    "x-user-id"="68f1f6dc4621b8535c48f216"
  } `
  -Body $paymentBody
```

#### 8. Create Payback
```powershell
$paybackBody = @{
  items = @(
    @{ materialType = "plastic"; weightKg = 5 },
    @{ materialType = "metal"; weightKg = 3 }
  )
  city = "Colombo"
} | ConvertTo-Json -Depth 3

Invoke-WebRequest -Uri "http://localhost:5000/api/payments/payback" `
  -Method POST `
  -Headers @{
    "Content-Type"="application/json"
    "x-user-id"="68f1f6dc4621b8535c48f216"
  } `
  -Body $paybackBody
```

---

### Pricing API

#### 9. List Pricing Models
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/pricing" -Method GET | Select-Object -ExpandProperty Content
```

#### 10. Create Pricing Model
```powershell
$pricingBody = @{
  city = "Kandy"
  modelType = "flat_fee"
  flatFeeAmount = 40
  ratePerKg = 0
  recyclablePaybackRates = @{
    plastic = 0.25
    eWaste = 1.8
    metal = 0.6
    paper = 0.15
  }
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/pricing" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $pricingBody
```

---

### User API

#### 11. List All Users (Admin)
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/users" `
  -Headers @{
    "x-user-id"="68f1f6dd4621b8535c48f21c"
  } `
  -Method GET
```

#### 12. Get User Profile
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/users/me" `
  -Headers @{"x-user-id"="68f1f6dc4621b8535c48f216"} `
  -Method GET
```

---

### Authentication API

#### 13. Register User
```powershell
$registerBody = @{
  name = "Test User"
  email = "test@example.com"
  password = "password123"
  role = "resident"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $registerBody
```

#### 14. Login User
```powershell
$loginBody = @{
  email = "alice@resident.com"
  password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $loginBody
```

---

## Browser Testing (Easier!)

Just open your browser and navigate to:

### Reports
- http://localhost:5173/dashboard - Dashboard with reports
- http://localhost:5173/admin/waste-reports - Waste reports page
- http://localhost:5173/admin/payment-reports - Payment reports page

### Payments
- http://localhost:5173/payments - Payment dashboard
- http://localhost:5173/paybacks - Payback page
- http://localhost:5173/admin/pricing - Pricing management

---

## Expected Responses

### Reports Summary (Success)
```json
{
  "totalWeight": 1050,
  "totalCollections": 42,
  "averageWeight": 25,
  "byArea": {
    "North": { "weight": 525, "collections": 21 },
    "South": { "weight": 525, "collections": 21 }
  },
  "byWasteType": {
    "recyclable": { "weight": 350 },
    "organic": { "weight": 350 },
    "general": { "weight": 350 }
  }
}
```

### Payment History (Success)
```json
[
  {
    "_id": "...",
    "userId": "68f1f6dc4621b8535c48f216",
    "amount": 50,
    "date": "2025-10-17T00:00:00.000Z",
    "method": "online",
    "type": "payment",
    "status": "completed"
  }
]
```

### Pricing Models (Success)
```json
[
  {
    "_id": "...",
    "city": "Colombo",
    "modelType": "weight_based",
    "ratePerKg": 2.5,
    "flatFeeAmount": 30,
    "recyclablePaybackRates": {
      "plastic": 0.2,
      "eWaste": 1.5,
      "metal": 0.5,
      "paper": 0.1
    }
  }
]
```

---

## Troubleshooting

### Still Getting 404?
1. Check backend is running: `Get-NetTCPConnection -LocalPort 5000`
2. Check MongoDB connected: Look for "Connected to MongoDB" in backend terminal
3. Restart backend: `taskkill /F /IM node.exe; cd backend; node index.js`

### Getting Empty Results?
1. Re-seed database: `cd backend; node seed/seed.js`
2. Verify user IDs: `node seed/get-users.js`
3. Check frontend is using correct user ID in `frontend/src/services/api.ts`

### CORS Errors?
- Backend already has `app.use(cors())` - should work
- If issues persist, clear browser cache

---

## Current Status

✅ Backend running on: http://localhost:5000
✅ Frontend running on: http://localhost:5173
✅ MongoDB connected
✅ All routes mounted:
  - /api/auth
  - /api/payments
  - /api/pricing
  - /api/reports
  - /api/users

✅ Database seeded with sample data
✅ User ID configured in frontend

**All 404 errors should now be resolved!**
