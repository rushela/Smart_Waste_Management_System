# Quick Start Guide

## Running the Application

### Start Backend
```bash
cd backend
npm start
```

The backend will start on: http://localhost:5000

You should see:
```
Backend dev server listening on http://localhost:5000
Connected to MongoDB
```

### Start Frontend
```bash
cd frontend
npm run dev
```

The frontend will start on: http://localhost:5173

You should see:
```
VITE v5.4.20 ready in XXXms
Local: http://localhost:5173/
```

## That's It! 🚀

Open your browser and navigate to: http://localhost:5173

---

## Available Commands

### Backend
```bash
npm start     # Start the server
npm run dev   # Start with nodemon (auto-restart on changes)
npm test      # Run tests
```

### Frontend
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

---

## Troubleshooting

### Port Already in Use
If you see "Port 5000 is already in use":
```bash
# Stop all node processes
taskkill /F /IM node.exe

# Then restart
cd backend
npm start
```

### MongoDB Connection Warning
You might see a MongoDB connection warning. This is normal if the database hostname is unreachable. The app will still work for development.

---

## Project Structure

```
Smart_Waste_Management_System/
├── backend/
│   ├── controllers/       # Business logic
│   ├── models/           # Database models
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth, validation
│   ├── services/         # External services
│   ├── index.js          # Main entry point
│   └── package.json      # Dependencies & scripts
│
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── pages/        # Page components
    │   ├── services/     # API client
    │   └── App.tsx       # Main app component
    └── package.json      # Dependencies & scripts
```

---

## Notes

✅ Seed files have been removed - data is now managed through the app UI
✅ Backend runs with simple `npm start` command
✅ All API routes are properly configured
✅ Professional payment UI with card validation
✅ Toast notifications for user feedback
✅ Complete CRUD operations for all features

---

**Last Updated:** October 17, 2025
