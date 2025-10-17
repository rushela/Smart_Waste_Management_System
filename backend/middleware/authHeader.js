// middleware/authHeader.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function authHeader(req, res, next) {
  // First, try to authenticate with JWT token
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Fetch user from database
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = {
          id: user._id.toString(),
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          city: user.city
        };
        return next();
      }
    } catch (err) {
      // Token invalid, fall through to x-user-id check
      console.log('JWT verification failed, trying x-user-id');
    }
  }
  
  // Fallback to x-user-id header for dev mode
  if (req.header('x-user-id')) {
    const raw = String(req.header('x-user-id')).trim();
    req.user = { id: raw };
    return next();
  }
  
  // No authentication provided
  return res.status(401).json({ message: 'Unauthorized (provide token or x-user-id)' });
};
