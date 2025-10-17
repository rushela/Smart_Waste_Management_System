# User ID Configuration for Testing

## Quick User Switch

To test with different user accounts, update this line in `frontend/src/services/api.ts`:

```typescript
const DEV_USER_ID = 'USER_ID_HERE';
```

## Available Test Users

### Alice (Resident) - Default
```typescript
const DEV_USER_ID = '68f1f6dc4621b8535c48f216';
```
- **Email**: alice@resident.com
- **Role**: resident
- **Use for**: Testing payment and payback features
- **Has**: Existing payment history

### Bob (Staff)
```typescript
const DEV_USER_ID = '68f1f6dd4621b8535c48f219';
```
- **Email**: bob@staff.com
- **Role**: staff
- **Use for**: Testing staff-level features

### Admin User
```typescript
const DEV_USER_ID = '68f1f6dd4621b8535c48f21c';
```
- **Email**: admin@admin.com
- **Role**: admin
- **Use for**: Testing admin pricing management

## How to Switch Users

1. Open `frontend/src/services/api.ts`
2. Find the `DEV_USER_ID` constant (around line 5)
3. Replace with desired user ID from above
4. Save file - Vite will auto-reload
5. Refresh browser

## Get Fresh User IDs

If you re-seed the database, user IDs will change. Run this to get new IDs:

```bash
cd backend
node seed/get-users.js
```

Output will show:
```
=== Available Users ===
RESIDENT: alice@resident.com - ID: 68f1f6dc4621b8535c48f216
STAFF: bob@staff.com - ID: 68f1f6dd4621b8535c48f219
ADMIN: admin@admin.com - ID: 68f1f6dd4621b8535c48f21c
```

## Testing Scenarios

### Test Payment Flow (Use Alice)
1. Set `DEV_USER_ID = '68f1f6dc4621b8535c48f216'`
2. Navigate to `/payments`
3. Click "Pay Now"
4. Fill card details and submit
5. Verify payment appears in history

### Test Payback Flow (Use Alice)
1. Set `DEV_USER_ID = '68f1f6dc4621b8535c48f216'`
2. Navigate to `/paybacks`
3. Add multiple recyclable items
4. Submit batch
5. Check account balance increases

### Test Admin Pricing (Use Admin)
1. Set `DEV_USER_ID = '68f1f6dd4621b8535c48f21c'`
2. Navigate to `/admin/pricing`
3. Create/edit/delete pricing models
4. Verify CRUD operations work

## Production Note

In production, the `x-user-id` header would come from:
- JWT token payload after login
- Session authentication
- OAuth provider

For now, we hardcode it for dev/testing purposes.
