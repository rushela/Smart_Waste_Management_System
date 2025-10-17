const Bin = require('../models/Bin');
const Resident = require('../models/Resident');
const CollectionHistory = require('../models/CollectionHistory');
const { AppError } = require('../utils/errors');

/**
 * GET /api/bins/:id
 * Get bin details with linked resident profile
 */
exports.getBinById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find bin by binID or MongoDB _id
    let bin;
    
    // Try to find by binID first (more likely for QR/barcode scanning)
    bin = await Bin.findOne({ binID: id.toUpperCase() })
      .populate('resident', 'name email address phone starPoints outstandingBalance');
    
    // If not found, try by MongoDB _id
    if (!bin) {
      bin = await Bin.findById(id)
        .populate('resident', 'name email address phone starPoints outstandingBalance');
    }

    if (!bin) {
      throw new AppError(`Bin with ID ${id} not found`, 404);
    }

    // Get recent collection history for this bin (last 10 collections)
    const recentCollections = await CollectionHistory.find({ binID: bin.binID })
      .sort({ dateCollected: -1 })
      .limit(10)
      .select('dateCollected wasteType weight status starPointsAwarded payment');

    res.json({
      success: true,
      data: {
        bin: {
          _id: bin._id,
          binID: bin.binID,
          status: bin.status,
          lastCollection: bin.lastCollection,
          createdAt: bin.createdAt,
          updatedAt: bin.updatedAt
        },
        resident: bin.resident,
        recentCollections
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bins
 * Get all bins with optional filters
 */
exports.getBins = async (req, res, next) => {
  try {
    const { status, resident } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (resident) query.resident = resident;

    const bins = await Bin.find(query)
      .populate('resident', 'name email address phone starPoints outstandingBalance')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: bins.length,
      data: bins
    });

  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/bins
 * Create a new bin
 */
exports.createBin = async (req, res, next) => {
  try {
    const { binID, resident } = req.body;

    // Validation
    if (!binID) {
      throw new AppError('Bin ID is required', 400);
    }
    if (!resident) {
      throw new AppError('Resident ID is required', 400);
    }

    // Check if resident exists
    const residentDoc = await Resident.findById(resident);
    if (!residentDoc) {
      throw new AppError('Resident not found', 404);
    }

    // Check if bin ID already exists
    const existingBin = await Bin.findOne({ binID: binID.toUpperCase() });
    if (existingBin) {
      throw new AppError(`Bin with ID ${binID} already exists`, 400);
    }

    // Create new bin
    const bin = await Bin.create({
      binID: binID.toUpperCase(),
      resident,
      status: 'pending'
    });

    const populatedBin = await Bin.findById(bin._id)
      .populate('resident', 'name email address phone');

    res.status(201).json({
      success: true,
      message: 'Bin created successfully',
      data: populatedBin
    });

  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/bins/:id
 * Update bin details
 */
exports.updateBin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, resident } = req.body;

    // Find bin
    const bin = await Bin.findById(id);
    if (!bin) {
      throw new AppError('Bin not found', 404);
    }

    // Update fields
    if (status) {
      const validStatuses = ['emptied', 'pending', 'partial', 'not_collected'];
      if (!validStatuses.includes(status)) {
        throw new AppError('Invalid bin status', 400);
      }
      bin.updateStatus(status);
    }

    if (resident) {
      const residentDoc = await Resident.findById(resident);
      if (!residentDoc) {
        throw new AppError('Resident not found', 404);
      }
      bin.resident = resident;
    }

    await bin.save();

    const updatedBin = await Bin.findById(bin._id)
      .populate('resident', 'name email address phone');

    res.json({
      success: true,
      message: 'Bin updated successfully',
      data: updatedBin
    });

  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/bins/:id
 * Delete a bin
 */
exports.deleteBin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const bin = await Bin.findById(id);
    if (!bin) {
      throw new AppError('Bin not found', 404);
    }

    // Check if there are any collection records for this bin
    const collectionCount = await CollectionHistory.countDocuments({ binID: bin.binID });
    if (collectionCount > 0) {
      throw new AppError(
        `Cannot delete bin. ${collectionCount} collection record(s) exist for this bin.`,
        400
      );
    }

    await bin.deleteOne();

    res.json({
      success: true,
      message: 'Bin deleted successfully',
      data: { deletedBinId: id }
    });

  } catch (error) {
    next(error);
  }
};
