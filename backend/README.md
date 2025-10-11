# SmartWaste Backend (dev)

Minimal Express backend to integrate with the frontend for local development.

Endpoints
- POST /api/auth/signup  -> { email, password, firstName, lastName, role }
- POST /api/auth/login   -> { email, password }
- GET  /api/users        -> list of created users (dev only)

Run

1. Copy `.env.example` to `.env` and set `MONGO_URI` if you want DB persistence.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```

This server uses an in-memory user store when `MONGO_URI` is not set — suitable for frontend integration during development.
