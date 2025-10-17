const ResidentCredit = require('../models/ResidentCredit');

exports.getMyCredit = async (req, res) => {
  const row = await ResidentCredit.findOne({ userId: req.user._id });
  res.json({ balance: row?.balance || 0 });
};
