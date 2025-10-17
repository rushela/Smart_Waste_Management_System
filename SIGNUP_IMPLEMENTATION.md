# Signup Implementation - MongoDB Integration ✅

## Changes Made

### 1. Backend - User Model (`backend/models/User.js`)
Added new fields to support signup form data:

```javascript
{
  phone: String,              // Contact phone number
  householdSize: String,      // For residents (1, 2-3, 4-5, 6+)
  staffId: String,            // For staff members
  department: String,         // For admins (operations, planning, etc.)
}
```

### 2. Backend - Auth Controller (`backend/controllers/authController.js`)
Updated `register` endpoint to:
- Accept all signup form fields (phone, householdSize, staffId, department)
- Conditionally save role-specific fields to database
- Create user with complete profile information

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "resident",
  "address": "123 Main St",
  "phone": "0766902338",
  "householdSize": "2-3"  // Only for residents
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "resident"
  }
}
```

### 3. Frontend - Signup Component (`frontend/src/pages/Signup.tsx`)
Updated `handleSubmit` function to:
- Include all form fields in the registration payload
- Send phone number for all roles
- Conditionally include role-specific fields:
  - **Residents**: householdSize
  - **Staff**: staffId
  - **Admins**: department

### 4. Backend - CORS Configuration (`backend/app.js`)
Fixed CORS error by configuring explicit origins:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## How It Works

### Step 1: User Fills Form (3 Steps)
1. **Step 1**: Account details (name, email, password)
2. **Step 2**: Profile details (phone, address, role-specific fields)
3. **Step 3**: Review & agree to terms

### Step 2: Click "Create Account"
- Form validates all required fields
- Creates payload with user information
- Calls `register()` function from AuthContext

### Step 3: AuthContext Sends to Backend
```typescript
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
```

### Step 4: Backend Processes Request
1. Checks if email already exists
2. Hashes password using bcrypt
3. Creates new user in MongoDB with all fields
4. Generates JWT token
5. Returns token and user data

### Step 5: Frontend Stores Auth Data
- Token saved to localStorage
- User object saved to localStorage
- User redirected to dashboard (role-based)

## Data Saved to MongoDB

### For Residents:
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  password: "hashed-password",
  role: "resident",
  address: "123 Main St",
  phone: "0766902338",
  householdSize: "2-3",
  createdAt: "2025-10-17T...",
  updatedAt: "2025-10-17T..."
}
```

### For Staff:
```javascript
{
  name: "Jane Smith",
  email: "jane@example.com",
  password: "hashed-password",
  role: "staff",
  address: "456 Oak Ave",
  phone: "0777123456",
  staffId: "1010",
  createdAt: "2025-10-17T...",
  updatedAt: "2025-10-17T..."
}
```

### For Admins:
```javascript
{
  name: "Admin User",
  email: "admin@example.com",
  password: "hashed-password",
  role: "admin",
  address: "789 Pine Rd",
  phone: "0788999888",
  department: "operations",
  createdAt: "2025-10-17T...",
  updatedAt: "2025-10-17T..."
}
```

## Testing the Signup

### 1. Start Backend
```bash
cd backend
npm start
```
Expected: `Backend dev server listening on http://localhost:5000`

### 2. Start Frontend
```bash
cd frontend
npm run dev
```
Expected: `Local: http://localhost:5173/`

### 3. Navigate to Signup
Open browser: `http://localhost:5173/signup`

### 4. Fill the Form
**Step 1:**
- First Name: Gavindu
- Last Name: Rushela
- Email: sanjulakalpani1212@gmail.com
- Password: test123
- Confirm Password: test123

**Step 2:**
- Phone: 0766902338
- Address: qqqq
- For Staff: Staff ID: 1010

**Step 3:**
- ✅ Check "I agree to the Terms of Service and Privacy Policy"
- Click **"Create Account"**

### 5. Verify in MongoDB
```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/waste_management

# Check users collection
db.users.find().pretty()
```

You should see your new user with all the data!

## Success Indicators

### ✅ Frontend
- Success message appears
- User is redirected to dashboard
- No console errors

### ✅ Backend
- No CORS errors
- User created in database
- JWT token generated
- Status 201 response

### ✅ MongoDB
- New document in `users` collection
- Password is hashed (not plain text)
- All fields saved correctly
- Timestamps added automatically

## Troubleshooting

### CORS Error (Fixed ✅)
**Error:** `Access-Control-Allow-Origin header is present`
**Solution:** Updated `backend/app.js` with explicit CORS configuration

### "Email already registered"
**Cause:** Trying to signup with existing email
**Solution:** Use a different email or delete the existing user from MongoDB

### "Password must be at least 6 characters"
**Cause:** Password too short
**Solution:** Use password with 6+ characters

### "Passwords do not match"
**Cause:** Password and Confirm Password don't match
**Solution:** Make sure both password fields are identical

## Database Schema

The User model now supports these fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Full name |
| email | String | Yes | Unique email |
| password | String | Yes | Hashed password |
| role | String | Yes | resident/staff/admin |
| address | String | No | Physical address |
| phone | String | No | Contact number |
| householdSize | String | No | For residents only |
| staffId | String | No | For staff only |
| department | String | No | For admins only |
| createdAt | Date | Auto | Account creation time |
| updatedAt | Date | Auto | Last update time |

## Next Steps (Optional)

### Email Verification
Add email verification flow:
1. Send verification email on signup
2. User clicks link to verify
3. Update user status to "verified"

### Profile Photos
Add profile picture upload:
1. Add file upload field
2. Store in cloud storage (AWS S3, Cloudinary)
3. Save URL to user document

### Phone Verification
Add SMS verification:
1. Send OTP to phone number
2. User enters code
3. Verify phone number

### Social Login
Add Google/Facebook login:
1. Integrate OAuth providers
2. Create user from social profile
3. Link social accounts

---

**Your signup is now fully functional with MongoDB integration!** 🎉

All user data from the signup form (including phone, household size, staff ID, and department) will be saved to MongoDB when the "Create Account" button is clicked.
