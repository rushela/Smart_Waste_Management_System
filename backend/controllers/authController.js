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
