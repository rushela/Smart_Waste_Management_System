const Payment = require('../models/Payment');

exports.listMine = async (req, res) => {
  const rows = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(rows);
};

exports.getById = async (req, res) => {
  const p = await Payment.findOne({ _id: req.params.id, userId: req.user._id });
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json(p);
};
