const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// Configure CORS to allow frontend requests
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

app.use(express.json());

const PORT = process.env.PORT || 4000;

// Optional MongoDB connection
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.warn('MongoDB connection error:', err));
} else {
  console.log('MONGO_URI not set — running without DB (dev mode)');
}

// Simple in-memory auth for dev mode (no DB)
const users = [];
function findUser(email) { return users.find(u => u.email === email); }

if (!process.env.MONGO_URI) {
  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

  function devPayload(user) {
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'resident',
    };
    return {
      token: jwt.sign({ id: user.id, role: safeUser.role }, JWT_SECRET, { expiresIn: '1d' }),
      user: safeUser,
    };
  }

  // Dev register at the same path the frontend expects
  app.post('/api/auth/register', (req, res) => {
    const { email, password, name, firstName, lastName, role } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    if (findUser(email)) return res.status(409).json({ message: 'Email is already registered' });
    const finalName = name || [firstName, lastName].filter(Boolean).join(' ') || (email.split('@')[0]);
    const user = {
      id: String(users.length + 1),
      email,
      password, // plaintext in dev only
      name: finalName,
      role: role && ['resident', 'staff', 'admin'].includes(role) ? role : 'resident',
    };
    users.push(user);
    const payload = devPayload(user);
    return res.status(201).json(payload);
  });

  // Alias old dev endpoint to new register route (backward-compat)
  app.post('/api/auth/signup', (req, res, next) => {
    // delegate to /register handler
    req.url = '/register';
    next();
  });

  // Dev login at the same path the frontend expects
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    const user = findUser(email);
    if (!user || user.password !== password) return res.status(401).json({ message: 'Invalid credentials' });
    const payload = devPayload(user);
    return res.json(payload);
  });
}

// Import and mount all API routes
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payments');
const pricingRoutes = require('./routes/pricing');
const reportsRoutes = require('./routes/reports');
const usersRoutes = require('./routes/users');
const issuesRoutes = require('./routes/issues');

app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/issues', issuesRoutes);

// Simple in-memory user listing (dev only - fallback)
app.get('/api/users/list', (req, res) => {
  return res.json(users.map(u => ({ id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, role: u.role })));
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Backend dev server listening on http://localhost:${PORT}`));
}

module.exports = app;