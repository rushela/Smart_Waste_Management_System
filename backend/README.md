# Smart Waste Management System - Backend

Express.js backend with MongoDB for waste management operations.

## Quick Start

```bash
npm install
npm start
```

Server runs on: http://localhost:5000

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start with nodemon (auto-restart)
- `npm test` - Run Jest tests

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Payments
- `GET /api/payments/history/me` - User payment history
- `POST /api/payments` - Create payment
- `POST /api/payments/payback` - Record payback
- `GET /api/payments/summary` - Payment statistics

### Pricing
- `GET /api/pricing` - List pricing models
- `POST /api/pricing` - Create pricing model
- `PUT /api/pricing/:id` - Update pricing model
- `DELETE /api/pricing/:id` - Delete pricing model

### Reports
- `GET /api/reports/summary` - Waste collection summary
- `GET /api/reports/trends` - Waste trends
- `GET /api/reports/payments` - Payment reports
- `GET /api/reports/export/pdf` - Export as PDF
- `GET /api/reports/export/excel` - Export as Excel

### Users
- `GET /api/users` - List users (admin)
- `GET /api/users/me` - Current user profile
- `PUT /api/users/me` - Update profile

## Environment Variables

Create a `.env` file in the backend directory:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

## Database

The application uses MongoDB. Make sure your `.env` file has the correct `MONGO_URI` configured.

## Development

For development with auto-restart on file changes:

```bash
npm run dev
```
