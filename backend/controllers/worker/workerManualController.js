const CollectionRecord = require('../../models/CollectionRecord');
const Bin = require('../../models/worker/Bin');
const User = require('../../models/User');
const Session = require('../../models/worker/Session');
const { calculateRewards } = require('../../utils/calculation');

/**
 * Manual Entry Controller - Handle manual collection entries
 * Used when scanning fails or for unregistered bins
 */

/**
 * POST /api/worker/manual
 * Create a manual collection entry
 */
exports.createManualEntry = async (req, res, next) => {
  try {
    const workerId = req.user._id;
    const {
      binCode,
      wasteType,
      weight,
      fillLevel,
      notes,
      contamination,
      contaminationDetails,
      routeId,
      manualEntryReason,
      // For unregistered bins
      residentName,
      residentAddress,
      location
    } = req.body;

    // Validate required fields
    if (!wasteType || !weight) {
      return res.status(400).json({
        success: false,
        message: 'Waste type and weight are required'
      });
    }

    if (!binCode && !residentAddress) {
      return res.status(400).json({
        success: false,
        message: 'Bin code or resident address is required for manual entry'
      });
    }

    // Try to find existing bin
    let bin = null;
    let resident = null;

    if (binCode) {
      bin = await Bin.findOne({ binId: binCode });
      if (bin && bin.residentId) {
        resident = await User.findById(bin.residentId);
      }
    }

    // Calculate rewards
    const rewards = calculateRewards(wasteType, weight, contamination);

    // Create manual collection record
    const collection = await CollectionRecord.create({
      binId: bin?._id,
      binCode: binCode || 'MANUAL-' + Date.now(),
      workerId,
      wasteType,
      weight,
      fillLevel: fillLevel || 50,
      date: new Date(),
      area: location || residentAddress || 'Unknown',
      routeId,
      residentId: resident?._id,
      residentName: residentName || resident?.name || 'Unregistered',
      residentAddress: residentAddress || resident?.address || '',
      starPointsAwarded: rewards.starPoints,
      paymentAmount: rewards.payment,
      contamination: contamination || false,
      contaminationDetails: contaminationDetails || '',
      notes: notes || '',
      status: 'manual-entry',
      isManualEntry: true,
      manualEntryReason: manualEntryReason || 'QR code not scannable'
    });

    // Update bin if found
    if (bin) {
      await Bin.findByIdAndUpdate(bin._id, {
        status: 'collected',
        lastCollectionDate: new Date(),
        fillLevel: 0
      });
    }

    // Update resident rewards if registered
    if (resident && (rewards.starPoints > 0 || rewards.payment > 0)) {
      await User.findByIdAndUpdate(resident._id, {
        $inc: {
          starPoints: rewards.starPoints,
          totalRecycled: wasteType === 'recyclable' ? weight : 0,
          outstandingBalance: rewards.payment
        }
      });
    }

    // Update session statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const session = await Session.findOne({
      workerId,
      status: 'active',
      sessionDate: { $gte: today }
    });

    if (session) {
      session.binsCollected += 1;
      session.manualEntries += 1;
      session.totalWeight += weight;
      session.totalStarPoints += rewards.starPoints;
      session.totalPayments += rewards.payment;
      
      if (wasteType === 'recyclable') session.recyclableWeight += weight;
      if (wasteType === 'organic') session.organicWeight += weight;
      if (wasteType === 'general') session.generalWeight += weight;
      if (contamination) session.contaminations += 1;
      
      await session.save();
    }

    // Populate and return
    const populatedCollection = await CollectionRecord.findById(collection._id)
      .populate('binId')
      .populate('residentId', 'name email phone starPoints')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Manual collection entry recorded successfully',
      data: populatedCollection,
      warning: !bin ? 'Bin not found in system - created as manual entry' : null
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/worker/manual
 * Get all manual entries for the worker
 */
exports.getManualEntries = async (req, res, next) => {
  try {
    const workerId = req.user._id;
    const { page = 1, limit = 20, startDate, endDate } = req.query;

    const query = {
      workerId,
      isManualEntry: true
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const entries = await CollectionRecord.find(query)
      .populate('binId', 'binId location type')
      .populate('residentId', 'name email phone')
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await CollectionRecord.countDocuments(query);

    res.json({
      success: true,
      data: entries,
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

module.exports = exports;
