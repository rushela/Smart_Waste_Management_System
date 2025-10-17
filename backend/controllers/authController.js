const User = require('../models/User');
const jwt = require('jsonwebtoken');

function createAuthPayload(user) {
  return {
    token: jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' }),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, address, wasteBinId, wasteTypePreference, paymentInfo } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      address,
      wasteBinId,
      wasteTypePreference,
      paymentInfo
    });

    const payload = createAuthPayload(user);
    res.status(201).json(payload);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = createAuthPayload(user);
    res.json(payload);
  } catch (err) {
    next(err);
  }
};

// Get profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id || req.user.id).select('-password');
    res.json({ user });
  } catch (err) { next(err); }
};

// Update profile
exports.updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    const fields = ['name', 'address', 'area', 'userType', 'paymentInfo'];
    for (const f of fields) if (req.body[f] !== undefined) updates[f] = req.body[f];
    const user = await User.findByIdAndUpdate(req.user._id || req.user.id, updates, { new: true }).select('-password');
    res.json({ user });
  } catch (err) { next(err); }
};

// Admin delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.json({ success: true });
  } catch (err) { next(err); }
};
