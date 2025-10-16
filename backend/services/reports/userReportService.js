const User = require('../../models/User');
const CollectionRecord = require('../../models/CollectionRecord');
const PaymentRecord = require('../../models/PaymentRecord');
const { buildDateFilter } = require('./dateFilterService');
const { NotFoundError } = require('../../utils/errors');

async function fetchUserReport({ userId, from, to }) {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError('User not found', { userId });
  }

  const dateFilter = buildDateFilter({ from, to });

  const waste = await CollectionRecord.aggregate([
    { $match: { ...dateFilter, binId: user.wasteBinId } },
    {
      $group: {
        _id: '$wasteType',
        areaWasteTotal: { $sum: '$weight' },
        count: { $sum: 1 }
      }
    },
    { $project: { _id: 0, wasteType: '$_id', areaWasteTotal: 1, count: 1 } }
  ]);

  const payments = await PaymentRecord.aggregate([
    { $match: { ...dateFilter, userId: user._id } },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' }
      }
    },
    { $project: { _id: 0, type: '$_id', total: 1 } }
  ]);

  return { waste, payments };
}

module.exports = { fetchUserReport };
