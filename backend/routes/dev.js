const router = require('express').Router();
const User = require('../models/User');

// Dev helper: create or return a seed resident user
router.post('/dev/seed-user', async (req, res) => {
  const email = req.body.email || process.env.SEED_USER_EMAIL || 'resident1@example.com';
  let u = await User.findOne({ email });
  if (!u) {
    u = await User.create({ name: 'Resident', email, password: 'password', role: 'resident' });
  }
  res.json({ ok: true, user: { _id: u._id, email: u.email, role: u.role } });
});

module.exports = router;
