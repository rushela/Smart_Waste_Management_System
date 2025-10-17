const Session = require('../../models/worker/Session');
const CollectionRecord = require('../../models/CollectionRecord');
const Route = require('../../models/worker/Route');
const { calculateEfficiency } = require('../../utils/calculation');

/**
 * Summary Controller - Handle worker session summaries
 */

/**
 * GET /api/worker/summary
 * Get current session summary for the logged-in worker
 */
exports.getCurrentSummary = async (req, res, next) => {
  try {
    const workerId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get or create active session
    let session = await Session.findOne({
      workerId,
      status: 'active',
      sessionDate: { $gte: today, $lt: tomorrow }
    }).populate('routeIds').lean();

    if (!session) {
      // No active session, return empty summary
      return res.json({
        success: true,
        message: 'No active session found',
        data: null
      });
    }

    // Get all collections for this session
    const collections = await CollectionRecord.find({
      workerId,
      date: { $gte: today, $lt: tomorrow }
    })
      .populate('binId', 'binId type location')
      .populate('residentId', 'name address')
      .lean();

    // Calculate detailed statistics
    const stats = {
      // Collection counts
      totalCollections: collections.length,
      successfulCollections: collections.filter(c => c.status === 'collected').length,
      partialCollections: collections.filter(c => c.status === 'partial').length,
      failedCollections: collections.filter(c => c.status === 'not-collected').length,
      manualEntries: collections.filter(c => c.isManualEntry).length,
      contaminations: collections.filter(c => c.contamination).length,

      // Weight by type
      totalWeight: collections.reduce((sum, c) => sum + (c.weight || 0), 0),
      recyclableWeight: collections
        .filter(c => c.wasteType === 'recyclable')
        .reduce((sum, c) => sum + (c.weight || 0), 0),
      organicWeight: collections
        .filter(c => c.wasteType === 'organic')
        .reduce((sum, c) => sum + (c.weight || 0), 0),
      generalWeight: collections
        .filter(c => c.wasteType === 'general')
        .reduce((sum, c) => sum + (c.weight || 0), 0),

      // Financial
      totalStarPoints: collections.reduce((sum, c) => sum + (c.starPointsAwarded || 0), 0),
      totalPayments: collections.reduce((sum, c) => sum + (c.paymentAmount || 0), 0),

      // Routes
      totalRoutes: session.routeIds.length,
      completedRoutes: session.routeIds.filter(r => r.status === 'completed').length
    };

    // Calculate efficiency
    const efficiency = calculateEfficiency(
      session.totalBins,
      session.binsCollected,
      session.errors
    );

    // Calculate session duration
    const duration = session.endTime
      ? Math.round((new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60))
      : Math.round((new Date() - new Date(session.startTime)) / (1000 * 60));

    res.json({
      success: true,
      data: {
        session: {
          ...session,
          duration,
          efficiency
        },
        stats,
        collections,
        timestamp: new Date()
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/worker/summary/end-session
 * End the current work session
 */
exports.endSession = async (req, res, next) => {
  try {
    const workerId = req.user._id;
    const { notes } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const session = await Session.findOne({
      workerId,
      status: 'active',
      sessionDate: { $gte: today }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'No active session found'
      });
    }

    // Update session
    session.endTime = new Date();
    session.status = 'completed';
    if (notes) session.notes = notes;

    // Calculate final statistics from collections
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const collections = await CollectionRecord.find({
      workerId,
      date: { $gte: today, $lt: tomorrow }
    });

    session.binsCollected = collections.length;
    session.totalWeight = collections.reduce((sum, c) => sum + c.weight, 0);
    session.totalStarPoints = collections.reduce((sum, c) => sum + c.starPointsAwarded, 0);
    session.totalPayments = collections.reduce((sum, c) => sum + c.paymentAmount, 0);
    session.recyclableWeight = collections
      .filter(c => c.wasteType === 'recyclable')
      .reduce((sum, c) => sum + c.weight, 0);
    session.organicWeight = collections
      .filter(c => c.wasteType === 'organic')
      .reduce((sum, c) => sum + c.weight, 0);
    session.generalWeight = collections
      .filter(c => c.wasteType === 'general')
      .reduce((sum, c) => sum + c.weight, 0);
    session.contaminations = collections.filter(c => c.contamination).length;
    session.manualEntries = collections.filter(c => c.isManualEntry).length;

    await session.save();

    // Update route statuses
    await Route.updateMany(
      { workerId, date: { $gte: today, $lt: tomorrow } },
      { status: 'completed' }
    );

    res.json({
      success: true,
      message: 'Session ended successfully',
      data: session
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/worker/summary/history
 * Get past session summaries
 */
exports.getSessionHistory = async (req, res, next) => {
  try {
    const workerId = req.user._id;
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    const query = {
      workerId,
      status: 'completed'
    };

    if (startDate || endDate) {
      query.sessionDate = {};
      if (startDate) query.sessionDate.$gte = new Date(startDate);
      if (endDate) query.sessionDate.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sessions = await Session.find(query)
      .populate('routeIds')
      .sort({ sessionDate: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    // Add efficiency calculation to each session
    const sessionsWithMetrics = sessions.map(session => ({
      ...session,
      duration: session.getDuration ? session.getDuration() : null,
      efficiency: calculateEfficiency(session.totalBins, session.binsCollected, session.errors)
    }));

    const total = await Session.countDocuments(query);

    res.json({
      success: true,
      data: sessionsWithMetrics,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/worker/summary/:sessionId
 * Get a specific session summary by ID
 */
exports.getSessionById = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const workerId = req.user._id;

    const session = await Session.findOne({
      _id: sessionId,
      workerId
    })
      .populate('routeIds')
      .lean();

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Get collections for this session
    const sessionStart = new Date(session.sessionDate);
    sessionStart.setHours(0, 0, 0, 0);
    const sessionEnd = new Date(sessionStart);
    sessionEnd.setDate(sessionEnd.getDate() + 1);

    const collections = await CollectionRecord.find({
      workerId,
      date: { $gte: sessionStart, $lt: sessionEnd }
    })
      .populate('binId', 'binId type location')
      .populate('residentId', 'name address')
      .lean();

    res.json({
      success: true,
      data: {
        session: {
          ...session,
          efficiency: calculateEfficiency(session.totalBins, session.binsCollected, session.errors)
        },
        collections
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = exports;
