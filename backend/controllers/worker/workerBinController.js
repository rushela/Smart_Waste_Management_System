const Bin = require('../../models/worker/Bin');
const User = require('../../models/User');
const CollectionRecord = require('../../models/CollectionRecord');

/**
 * Bin Controller - Handle bin-related operations for workers
 */

/**
 * GET /api/worker/bins/:binId
 * Get bin details and linked resident information
 */
exports.getBinById = async (req, res, next) => {
  try {
    const { binId } = req.params;

    // Find bin by ID or binId code
    let bin = await Bin.findById(binId).populate('residentId').lean();
    
    if (!bin) {
      bin = await Bin.findOne({ binId }).populate('residentId').lean();
    }

    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found'
      });
    }

    // Get collection history for this bin
    const collectionHistory = await CollectionRecord.find({ binId: bin._id })
      .sort({ date: -1 })
      .limit(10)
      .lean();

    // Get resident details
    let resident = null;
    if (bin.residentId) {
      resident = await User.findById(bin.residentId)
        .select('-password')
        .lean();
    }

    res.json({
      success: true,
      data: {
        bin,
        resident,
        collectionHistory
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/worker/bins
 * Get all bins (with optional filters)
 */
exports.getAllBins = async (req, res, next) => {
  try {
    const { status, area, residentId } = req.query;
    const query = { isActive: true };

    if (status) query.status = status;
    if (area) query['location.address'] = new RegExp(area, 'i');
    if (residentId) query.residentId = residentId;

    const bins = await Bin.find(query)
      .populate('residentId', 'name email phone address')
      .sort({ lastCollectionDate: 1 })
      .lean();

    res.json({
      success: true,
      count: bins.length,
      data: bins
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/worker/bins/:binId/status
 * Update bin status after collection
 */
exports.updateBinStatus = async (req, res, next) => {
  try {
    const { binId } = req.params;
    const { status, fillLevel } = req.body;

    const bin = await Bin.findByIdAndUpdate(
      binId,
      {
        status,
        fillLevel: fillLevel || 0,
        lastCollectionDate: status === 'collected' ? new Date() : undefined
      },
      { new: true, runValidators: true }
    );

    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found'
      });
    }

    res.json({
      success: true,
      data: bin
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/worker/bins/search/:code
 * Search bin by QR code or bin code
 */
exports.searchBinByCode = async (req, res, next) => {
  try {
    const { code } = req.params;

    const bin = await Bin.findOne({
      $or: [
        { binId: code },
        { qrCode: code }
      ]
    })
      .populate('residentId', 'name email phone address starPoints')
      .lean();

    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found with code: ' + code
      });
    }

    res.json({
      success: true,
      data: bin
    });
  } catch (err) {
    next(err);
  }
};

module.exports = exports;
