const Invoice = require('../models/Invoice');

exports.listOpen = async (req, res) => {
  const rows = await Invoice.find({
    userId: req.user._id,
    status: { $in: ['OPEN', 'PARTIAL'] }
  }).sort({ createdAt: 1 }).select('_id code total balance status dueOn mode');
  res.json(rows);
};
