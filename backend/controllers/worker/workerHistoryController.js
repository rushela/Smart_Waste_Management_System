const CollectionRecord = require('../../models/CollectionRecord');

/**
 * History Controller - Handle collection history operations
 */

/**
 * GET /api/worker/history
 * Get collection history for the logged-in worker
 */
exports.getHistory = async (req, res, next) => {
  try {
    const workerId = req.user._id;
    const {
      page = 1,
      limit = 20,
      sortBy = 'date',
      order = 'desc',
      status,
      wasteType,
      startDate,
      endDate,
      binId,
      search
    } = req.query;

    // Build query
    const query = { workerId };

    if (status) query.status = status;
    if (wasteType) query.wasteType = wasteType;
    if (binId) query.binCode = binId;

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Search by notes or resident name
    if (search) {
      query.$or = [
        { notes: new RegExp(search, 'i') },
        { residentName: new RegExp(search, 'i') },
        { binCode: new RegExp(search, 'i') }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    // Execute query
    const collections = await CollectionRecord.find(query)
      .populate('binId', 'binId location type')
      .populate('residentId', 'name email phone address starPoints')
      .sort({ [sortBy]: sortOrder })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    // Get total count
    const total = await CollectionRecord.countDocuments(query);

    // Calculate summary statistics
    const stats = await CollectionRecord.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalCollections: { $sum: 1 },
          totalWeight: { $sum: '$weight' },
          totalStarPoints: { $sum: '$starPointsAwarded' },
          totalPayments: { $sum: '$paymentAmount' },
          contaminations: {
            $sum: { $cond: ['$contamination', 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: collections,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      stats: stats[0] || {
        totalCollections: 0,
        totalWeight: 0,
        totalStarPoints: 0,
        totalPayments: 0,
        contaminations: 0
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/worker/history/stats
 * Get aggregated statistics for collection history
 */
exports.getHistoryStats = async (req, res, next) => {
  try {
    const workerId = req.user._id;
    const { startDate, endDate } = req.query;

    const query = { workerId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Aggregate by waste type
    const byWasteType = await CollectionRecord.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$wasteType',
          count: { $sum: 1 },
          totalWeight: { $sum: '$weight' },
          totalStarPoints: { $sum: '$starPointsAwarded' },
          totalPayments: { $sum: '$paymentAmount' }
        }
      },
      { $sort: { totalWeight: -1 } }
    ]);

    // Aggregate by status
    const byStatus = await CollectionRecord.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Daily trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyTrends = await CollectionRecord.aggregate([
      { 
        $match: { 
          workerId: workerId,
          date: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          collections: { $sum: 1 },
          weight: { $sum: '$weight' },
          starPoints: { $sum: '$starPointsAwarded' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        byWasteType,
        byStatus,
        dailyTrends
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = exports;
