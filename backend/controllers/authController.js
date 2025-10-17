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
    const { 
      name, 
      email, 
      password, 
      role, 
      address, 
      phone,
      householdSize,
      staffId,
      department,
      wasteBinId, 
      wasteTypePreference, 
      paymentInfo 
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Build user object with common fields
    const userData = {
      name,
      email,
      password,
      role: role || 'resident',
      address,
      phone
    };

    // Add role-specific fields
    if (householdSize) userData.householdSize = householdSize;
    if (staffId) userData.staffId = staffId;
    if (department) userData.department = department;
    if (wasteBinId) userData.wasteBinId = wasteBinId;
    if (wasteTypePreference) userData.wasteTypePreference = wasteTypePreference;
    if (paymentInfo) userData.paymentInfo = paymentInfo;

    const user = await User.create(userData);

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
