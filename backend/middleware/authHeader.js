// middleware/authHeader.js
const { Types } = require('mongoose');

module.exports = function authHeader(req, res, next) {
  if (!req.user && req.header('x-user-id')) {
    const raw = String(req.header('x-user-id')).trim();
    // For dev mode, just pass through the ID even if it's not in the database
    // The controller will handle creating the user if needed
    req.user = { id: raw };
  }
  if (!req.user) return res.status(401).json({ message: 'Unauthorized (provide token or x-user-id)' });
  next();
};
