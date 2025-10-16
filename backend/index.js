const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
app.use(cors());
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

// Simple in-memory users store for dev if no DB
const users = [];

// Helper to find user (by email)
function findUser(email) {
  return users.find(u => u.email === email);
}

// Signup endpoint
app.post('/api/auth/signup', (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  if (findUser(email)) return res.status(409).json({ message: 'User already exists' });
  const user = { id: users.length + 1, email, password, firstName, lastName, role };
  users.push(user);
  return res.status(201).json({ message: 'User created', user: { id: user.id, email: user.email } });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = findUser(email);
  if (!user || user.password !== password) return res.status(401).json({ message: 'Invalid credentials' });
  // In a real app you'd return a JWT or session
  return res.json({ message: 'OK', user: { id: user.id, email: user.email, role: user.role } });
});

// Simple user listing (dev only)
app.get('/api/users', (req, res) => {
  return res.json(users.map(u => ({ id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, role: u.role })));
});

app.listen(PORT, () => console.log(`Backend dev server listening on http://localhost:${PORT}`));