require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/pricing', require('./routes/pricing'));
app.use('/api/payments', require('./routes/payments'));

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Error handler (keep last)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

module.exports = app;
