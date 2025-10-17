const Route = require('../../models/worker/Route');
const Bin = require('../../models/worker/Bin');
const CollectionRecord = require('../../models/CollectionRecord');
const Session = require('../../models/worker/Session');

/**
 * Worker Dashboard Controller
 * Provides dashboard data for logged-in workers
 */

/**
 * GET /api/worker/dashboard
 * Get worker dashboard with assigned routes and bins
 */
exports.getDashboard = async (req, res, next) => {
  try {
    const workerId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's routes for this worker
    const routes = await Route.find({
      workerId,
      date: { $gte: today, $lt: tomorrow }
    })
      .populate('binIds')
      .sort({ createdAt: -1 })
      .lean();

    // Get active session for this worker
    let session = await Session.findOne({
      workerId,
      status: 'active',
      sessionDate: { $gte: today, $lt: tomorrow }
    }).lean();

    // If no active session, create one
    if (!session) {
      session = await Session.create({
        workerId,
        sessionDate: today,
        startTime: new Date(),
        status: 'active'
      });
    }

    // Calculate today's statistics
    const todayCollections = await CollectionRecord.find({
      workerId,
      date: { $gte: today, $lt: tomorrow }
    }).lean();

    const stats = {
      totalBins: 0,
      completedBins: todayCollections.filter(c => c.status === 'collected').length,
      pendingBins: 0,
      totalWeight: todayCollections.reduce((sum, c) => sum + (c.weight || 0), 0),
      totalStarPoints: todayCollections.reduce((sum, c) => sum + (c.starPointsAwarded || 0), 0),
      totalPayments: todayCollections.reduce((sum, c) => sum + (c.paymentAmount || 0), 0)
    };

    // Calculate total and pending bins
    routes.forEach(route => {
      stats.totalBins += route.binIds.length;
    });
    stats.pendingBins = stats.totalBins - stats.completedBins;

    res.json({
      success: true,
      data: {
        worker: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          employeeId: req.user.employeeId
        },
        routes,
        session,
        stats,
        today: today.toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/worker/dashboard/routes
 * Get all routes assigned to worker
 */
exports.getWorkerRoutes = async (req, res, next) => {
  try {
    const workerId = req.user._id;
    const { date, status } = req.query;

    const query = { workerId };
    
    if (date) {
      const queryDate = new Date(date);
      query.date = {
        $gte: new Date(queryDate.setHours(0, 0, 0, 0)),
        $lt: new Date(queryDate.setHours(23, 59, 59, 999))
      };
    }
    
    if (status) {
      query.status = status;
    }

    const routes = await Route.find(query)
      .populate('binIds')
      .sort({ date: -1 })
      .lean();

    res.json({
      success: true,
      data: routes
    });
  } catch (err) {
    next(err);
  }
};

module.exports = exports;
