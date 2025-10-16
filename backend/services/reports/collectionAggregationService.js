const CollectionRecord = require('../../models/CollectionRecord');
const { buildDateFilter } = require('./dateFilterService');

function buildTrendGrouping(granularity) {
  switch (granularity) {
    case 'daily':
      return { y: { $year: '$date' }, m: { $month: '$date' }, d: { $dayOfMonth: '$date' } };
    case 'weekly':
      return { y: { $year: '$date' }, w: { $isoWeek: '$date' } };
    case 'monthly':
    default:
      return { y: { $year: '$date' }, m: { $month: '$date' } };
  }
}

async function fetchSummary({ from, to, area, wasteType }) {
  const match = {
    ...buildDateFilter({ from, to }),
    ...(area ? { area } : {}),
    ...(wasteType ? { wasteType } : {})
  };

  const pipeline = [
    { $match: match },
    {
      $group: {
        _id: { area: '$area', wasteType: '$wasteType' },
        areaWasteTotal: { $sum: '$weight' },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        area: '$_id.area',
        wasteType: '$_id.wasteType',
        areaWasteTotal: 1,
        count: 1
      }
    }
  ];

  return CollectionRecord.aggregate(pipeline);
}

async function fetchTrends({ from, to, granularity = 'monthly' }) {
  const match = buildDateFilter({ from, to });
  const grouping = buildTrendGrouping(granularity);

  const pipeline = [
    { $match: match },
    {
      $group: {
        _id: grouping,
        monthlyTrend: { $sum: '$weight' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1, '_id.w': 1 } }
  ];

  return CollectionRecord.aggregate(pipeline);
}

async function fetchRouteEfficiency({ from, to, routeId }) {
  const match = {
    ...buildDateFilter({ from, to }),
    ...(routeId ? { routeId } : {})
  };

  const pipeline = [
    { $match: match },
    {
      $group: {
        _id: '$routeId',
        totalDistance: { $sum: '$distanceKm' },
        totalStops: { $sum: '$stops' },
        totalWeight: { $sum: '$weight' },
        pickups: { $sum: 1 },
        startTime: { $min: '$date' },
        endTime: { $max: '$date' }
      }
    },
    {
      $project: {
        routeId: '$_id',
        totalDistance: 1,
        totalStops: 1,
        totalWeight: 1,
        pickups: 1,
        timeHours: {
          $divide: [{ $subtract: ['$endTime', '$startTime'] }, 1000 * 60 * 60]
        },
        avgStopWeight: {
          $cond: [{ $eq: ['$totalStops', 0] }, 0, { $divide: ['$totalWeight', '$totalStops'] }]
        }
      }
    }
  ];

  return CollectionRecord.aggregate(pipeline);
}

module.exports = {
  fetchSummary,
  fetchTrends,
  fetchRouteEfficiency
};
