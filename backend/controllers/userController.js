const User = require('../models/User');

// Residents: view/update profile
exports.getProfile = async (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  Object.assign(req.user, req.body);
  await req.user.save();
  res.json(req.user);
};

// Staff: view assigned routes, update collection status
exports.getStaffInfo = async (req, res) => {
  res.json({ assignedRoutes: req.user.assignedRoutes, collectionStatus: req.user.collectionStatus });
};

exports.updateCollectionStatus = async (req, res) => {
  req.user.collectionStatus = req.body.collectionStatus;
  await req.user.save();
  res.json({ collectionStatus: req.user.collectionStatus });
};

// Admin: CRUD users, pagination, search
exports.listUsers = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const query = search ? { name: { $regex: search, $options: 'i' } } : {};
  const users = await User.find(query).skip((page - 1) * limit).limit(Number(limit));
  const total = await User.countDocuments(query);
  res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
};

exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};
