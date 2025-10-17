# Worker Module - Smart Waste Management System

This module provides the worker interface for waste collection personnel to scan bins, record collections, and manage their daily routes.

## Features

- **Worker Authentication**: Secure login system for workers
- **Dashboard**: Overview of assigned routes, pending bins, and daily statistics
- **Bin Scanning**: Scan QR codes on bins to record collections
- **Manual Entry**: Manually enter collection data when scanning isn't possible
- **Collection History**: View past collections and edit records
- **Route Management**: View assigned routes and bin locations
- **Shift Summary**: Generate end-of-shift reports

## File Structure

```
worker/
├── components/           # Reusable UI components
│   ├── ActionButton.tsx
│   ├── Header.tsx
│   ├── InfoCard.tsx
│   ├── ResidentProfileModal.tsx
│   └── RouteList.tsx
├── context/             # React context providers
│   └── AuthContext.tsx  # Worker authentication state
├── data/                # Mock data (replace with API calls)
│   └── mockData.tsx
├── config/              # Configuration files
│   └── api.ts          # API endpoints and helpers
├── Dashboard.tsx        # Main worker dashboard
├── Login.tsx           # Worker login page
├── ScanPage.tsx        # Bin scanning interface
├── History.tsx         # Collection history
├── ManualEntry.tsx     # Manual data entry
└── Summary.tsx         # Shift summary/reports
```

## Routes

All worker routes are namespaced under `/worker`:

- `/worker/login` - Worker login page
- `/worker/dashboard` - Main dashboard (protected)
- `/worker/scan` - Scan bin QR codes (protected)
- `/worker/history` - View collection history (protected)
- `/worker/manual` - Manual entry form (protected)
- `/worker/summary` - Shift summary (protected)

## Backend Integration

The worker module connects to the backend API at `http://localhost:5000/api` by default.

### Authentication

Workers can log in using their email and password. The login system:
1. First attempts to authenticate via backend API (`/api/auth/login`)
2. Falls back to mock authentication if backend is unavailable
3. Stores worker session in localStorage

### API Endpoints Used

- `POST /api/auth/login` - Worker login
- `GET /api/collections` - Fetch collection records
- `POST /api/collections` - Create new collection record
- `PUT /api/collections/:id` - Update collection record
- `DELETE /api/collections/:id` - Delete collection record

## Mock Data

For development without a backend, the module includes mock data:

**Mock Worker Accounts:**
- Email: `john@ecowaste.com` / Password: `password123`
- Email: `sarah@ecowaste.com` / Password: `password123`

## Configuration

Update the API URL in `worker/config/api.ts`:

```typescript
export const API_BASE_URL = 'http://localhost:5000';
```

Or set via environment variable:
```env
VITE_API_URL=http://localhost:5000
```

## Usage

### 1. Login as Worker

Navigate to `/worker/login` and use one of the mock credentials or create a worker account via the backend.

### 2. View Dashboard

After login, you'll see:
- Pending bins count
- Completed collections
- Total weight collected
- Assigned routes

### 3. Scan a Bin

Click "Scan Bin" button or navigate to `/worker/scan`:
- Enter or scan bin ID
- System loads bin and resident information
- Fill in collection details (waste type, fill level, weight)
- Submit collection record

### 4. View History

Navigate to `/worker/history`:
- View all past collections
- Search by bin ID or notes
- Edit or delete records
- View detailed collection information

## Customization

### Adding New Routes

Edit `AppRouter.tsx`:

```tsx
<Route path="/worker" element={<WorkerLayout />}>
  <Route path="new-page" element={<NewPage />} />
</Route>
```

### Adding New API Endpoints

Edit `worker/config/api.ts`:

```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints
  newEndpoint: {
    list: `${API_BASE_URL}/api/new-endpoint`,
  },
};
```

## Integration with Backend

To connect your worker module to the backend:

1. **Ensure backend is running** at `http://localhost:5000`
2. **Create worker accounts** in the database with role `worker` or `staff`
3. **Update API endpoints** in `worker/config/api.ts` if needed
4. **Remove mock data** once backend is fully integrated

## Protected Routes

All worker routes (except login) should be protected. The `WorkerAuthProvider` wraps all worker routes and provides authentication state.

## Future Enhancements

- [ ] Real-time notifications for new route assignments
- [ ] Offline mode with local data sync
- [ ] GPS tracking for route optimization
- [ ] Photo capture for contamination evidence
- [ ] Multi-language support
- [ ] Push notifications for urgent collections
- [ ] Integration with mobile camera for QR scanning
- [ ] Export reports as PDF

## Troubleshooting

### Login Not Working
- Check backend is running on port 5000
- Verify worker has correct role in database
- Check browser console for API errors
- Try mock credentials if backend is down

### Routes Not Loading
- Verify route paths in `AppRouter.tsx`
- Check that worker is authenticated
- Clear localStorage and login again

### API Errors
- Check CORS settings in backend
- Verify API endpoints are correct
- Check network tab in browser DevTools
- Ensure backend MongoDB is connected

## Development

```bash
# Run frontend development server
cd frontend
npm run dev

# Run backend server
cd backend
npm start
```

## Notes

- This module is designed to work both with and without backend connection
- Mock data is used as fallback when backend is unavailable
- All routes are protected except the login page
- Worker session persists in localStorage
