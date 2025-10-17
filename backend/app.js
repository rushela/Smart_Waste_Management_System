const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(morgan('dev'));

const { PORT = 4000, MONGO_URI } = process.env;

// --- DB ---
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('MONGO_URI not set — running without DB (dev mode)');
}

app.use((req, _res, next) => {
  req.user = req.user || {
    _id: '663333333333333333333333',
    email: process.env.SEED_USER_EMAIL || 'resident1@example.com',
    role: 'resident'
  };
  next();
});

// --- routes (mount your existing and new ones) ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reports', require('./routes/reports'));

app.use('/api', require('./routes/invoice'));       // GET /api/invoices/open
app.use('/api', require('./routes/credit'));        // GET /api/credit
app.use('/api', require('./routes/mockGateway'));   // POST /api/mock-gateway/charge
app.use('/api', require('./routes/payment'));       // GET /api/payments, GET /api/payments/:id

// health
app.get('/health', (req, res) => res.json({ ok: true }));

// error handler (last)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
}

module.exports = app;
