const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// CORS configuration - Allow frontend origins
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const PORT = process.env.PORT || 4000;

// Optional MongoDB connection with retry logic
if (process.env.MONGO_URI) {
  const connectWithRetry = async () => {
    console.log('🔄 Attempting to connect to MongoDB...');
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000, // Increased timeout to 10s
        socketTimeoutMS: 45000,
      });
      console.log('✅ Connected to MongoDB successfully!');
      console.log('📦 Database:', mongoose.connection.name);
    } catch (err) {
      console.error('❌ MongoDB connection failed:', err.message);
      console.log('\n💡 Troubleshooting steps:');
      console.log('   1. ✓ IP whitelist (0.0.0.0/0 is active)');
      console.log('   2. Check database user exists in Atlas → Database Access');
      console.log('   3. Verify password is correct (no special chars issues)');
      console.log('   4. Wait 1-2 minutes after making Atlas changes');
      console.log('   5. Check cluster name matches: cluster0.df6enii');
      console.log('\n⚙️  Running in offline mode (in-memory storage)...\n');
    }
  };
  
  connectWithRetry();
} else {
  console.log('MONGO_URI not set — running without DB (dev mode)');
}

// Register authentication routes (using proper auth controller)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Simple in-memory users store for dev if no DB (fallback only)
const users = [];

// Helper to find user (by email)
function findUser(email) {
  return users.find(u => u.email === email);
}

// Simple user listing (dev only)
app.get('/api/users', (req, res) => {
  return res.json(users.map(u => ({ id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, role: u.role })));
});

// ========== WORKER MODULE ROUTES ==========
// Register worker-specific routes (only if MongoDB is connected)
if (mongoose.connection.readyState === 1 || process.env.MONGO_URI) {
  const workerDashboardRoutes = require('./routes/worker/workerDashboard');
  const workerBinsRoutes = require('./routes/worker/workerBins');
  const workerCollectionsRoutes = require('./routes/worker/workerCollections');
  const workerHistoryRoutes = require('./routes/worker/workerHistory');
  const workerManualRoutes = require('./routes/worker/workerManual');
  const workerSummaryRoutes = require('./routes/worker/workerSummary');

  app.use('/api/worker/dashboard', workerDashboardRoutes);
  app.use('/api/worker/bins', workerBinsRoutes);
  app.use('/api/worker/collections', workerCollectionsRoutes);
  app.use('/api/worker/history', workerHistoryRoutes);
  app.use('/api/worker/manual', workerManualRoutes);
  app.use('/api/worker/summary', workerSummaryRoutes);

  console.log('✅ Worker module routes registered');
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => console.log(`Backend dev server listening on http://localhost:${PORT}`));