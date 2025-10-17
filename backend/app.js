const express = require('express');
const cors = require('cors');

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());

// Public Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/collections', require('./routes/collections'));
app.use('/api/bins', require('./routes/bins'));
app.use('/api/residents', require('./routes/residents'));

// Worker Routes (require authentication)
app.use('/api/worker/dashboard', require('./routes/worker/workerDashboard'));
app.use('/api/worker/bins', require('./routes/worker/workerBins'));
app.use('/api/worker/collections', require('./routes/worker/workerCollections'));
app.use('/api/worker/history', require('./routes/worker/workerHistory'));
app.use('/api/worker/manual', require('./routes/worker/workerManual'));
app.use('/api/worker/summary', require('./routes/worker/workerSummary'));

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Error handler (keep last)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

module.exports = app;
