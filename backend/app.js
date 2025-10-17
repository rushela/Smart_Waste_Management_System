const express = require('express');
const cors = require('cors');

const app = express();

// Core middleware - Configure CORS to allow frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/collections', require('./routes/collections'));
app.use('/api/bins', require('./routes/bins'));
app.use('/api/residents', require('./routes/residents'));

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Error handler (keep last)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

module.exports = app;
