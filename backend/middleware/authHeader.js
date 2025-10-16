// middleware/authHeader.js
const { Types } = require('mongoose');

module.exports = function authHeader(req, res, next) {
  if (!req.user && req.header('x-user-id')) {
    const raw = String(req.header('x-user-id'));
    if (!Types.ObjectId.isValid(raw)) {
      return res.status(400).json({ message: 'x-user-id must be a valid Mongo ObjectId' });
    }
    req.user = { id: raw };
  }
  if (!req.user) return res.status(401).json({ message: 'Unauthorized (provide token or x-user-id)' });
  next();
};
