const PaymentRecord = require('../../models/PaymentRecord');
const { buildDateFilter } = require('./dateFilterService');

async function fetchPaymentSummary({ from, to }) {
  const match = buildDateFilter({ from, to });

  const totals = await PaymentRecord.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' }
      }
    },
    { $project: { _id: 0, type: '$_id', total: 1 } }
  ]);

  const outstanding = await PaymentRecord.aggregate([
    { $match: { ...match, status: 'pending' } },
    {
      $group: {
        _id: null,
        totalOutstanding: { $sum: '$amount' }
      }
    },
    { $project: { _id: 0, totalOutstanding: 1 } }
  ]);

  return {
    totals,
    outstanding: outstanding[0]?.totalOutstanding || 0
  };
}

module.exports = { fetchPaymentSummary };
