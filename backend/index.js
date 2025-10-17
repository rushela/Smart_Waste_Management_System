// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // MUST be before routes

const { PORT = 5000, MONGO_URI } = process.env;

// DB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => { console.error('MongoDB connection error:', err); process.exit(1); });

/// ---- top of file (after app = express and app.use(express.json())) ----
app.get('/health', (_req, res) => res.json({ ok: true }));  // OPEN route

// (optional but helpful while debugging)
app.use((req, _res, next) => {
  console.log(req.method, req.path, 'x-user-email:', req.header('x-user-email'));
  next();
});

// If you want to test mock charge without auth, mount it BEFORE the guard:
app.use('/api', require('./routes/mockGateway')); // POST /api/mock-gateway/charge
app.use('/dev', require('./routes/dev'));

// ---- header/user guard comes AFTER the open routes ----
const User = require('./models/User');
app.use(async (req, res, next) => {
  // BYPASS LIST (keep /health here!)
  if (
    req.path === '/health' ||
    req.path === '/api/mock-gateway/charge' ||
    req.path === '/dev/seed-user'
  ) return next();

  try {
    const email = req.header('x-user-email');
    if (!email) return res.status(400).json({ message: 'x-user-email header required' });
    const u = await User.findOne({ email }).select('_id email role');
    if (!u) return res.status(404).json({ message: `User not found: ${email}` });
    req.user = { _id: u._id, email: u.email, role: u.role };
    next();
  } catch (e) { next(e); }
});

// Protected routes below
app.use('/api', require('./routes/invoice'));
app.use('/api', require('./routes/credit'));
app.use('/api', require('./routes/payment'));
