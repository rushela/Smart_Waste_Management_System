const Bin = require('../models/Bin');
const Resident = require('../models/Resident');
const CollectionHistory = require('../models/CollectionHistory');
const { AppError } = require('../utils/errors');

/**
 * Configuration for star points and payment calculations
 */
const REWARDS_CONFIG = {
  // Star points per kg of recyclable waste
  STAR_POINTS_PER_KG: 10,
  
  // Payment per kg of non-recyclable waste
  PAYMENT_PER_KG: 5,
  
  // Minimum weight to process (in kg)
  MIN_WEIGHT: 0
};

/**
 * Calculate star points for recyclable waste
 * @param {Number} weight - Weight in kg
 * @returns {Number} Star points awarded
 */
const calculateStarPoints = (weight) => {
  if (!weight || weight <= 0) return 0;
  return Math.round(weight * REWARDS_CONFIG.STAR_POINTS_PER_KG);
};

/**
 * Calculate payment for non-recyclable waste
 * @param {Number} weight - Weight in kg
 * @returns {Number} Payment amount
 */
const calculatePayment = (weight) => {
  if (!weight || weight <= 0) return 0;
  return Math.round(weight * REWARDS_CONFIG.PAYMENT_PER_KG * 100) / 100; // Round to 2 decimal places
};

/**
 * POST /api/collections
 * Create a new waste collection record
 */
exports.createCollection = async (req, res, next) => {
  try {
    const { binID, dateCollected, wasteType, weight, notes, workerId, status } = req.body;

    // Validation
    if (!binID) {
      throw new AppError('Bin ID is required', 400);
    }
    if (!wasteType || !['recyclable', 'non_recyclable'].includes(wasteType)) {
      throw new AppError('Valid waste type is required (recyclable or non_recyclable)', 400);
    }
    if (weight !== undefined && weight < 0) {
      throw new AppError('Weight cannot be negative', 400);
    }

    // Lookup bin
    const bin = await Bin.findOne({ binID: binID.toUpperCase() }).populate('resident');
    if (!bin) {
      throw new AppError(`Bin with ID ${binID} not found`, 404);
    }

    // Lookup resident
    const resident = await Resident.findById(bin.resident._id);
    if (!resident) {
      throw new AppError('Resident not found for this bin', 404);
    }

    // Determine collection status (default to 'collected' if not provided)
    const collectionStatus = status || 'collected';
    if (!['collected', 'partial', 'not_collected'].includes(collectionStatus)) {
      throw new AppError('Invalid collection status', 400);
    }

    // Calculate rewards and payments based on waste type and status
    let starPointsAwarded = 0;
    let payment = 0;

    if (collectionStatus !== 'not_collected') {
      if (wasteType === 'recyclable') {
        // Award star points for recyclable waste
        starPointsAwarded = calculateStarPoints(weight || 0);
        resident.starPoints += starPointsAwarded;
      } else if (wasteType === 'non_recyclable') {
        // Charge for non-recyclable waste
        payment = calculatePayment(weight || 0);
        resident.outstandingBalance += payment;
      }
    }

    // Create collection history record
    const collection = await CollectionHistory.create({
      binID: binID.toUpperCase(),
      resident: resident._id,
      dateCollected: dateCollected || new Date(),
      wasteType,
      weight: weight || 0,
      starPointsAwarded,
      payment,
      status: collectionStatus,
      workerId,
      notes
    });

    // Update bin status based on collection status
    const binStatusMap = {
      'collected': 'emptied',
      'partial': 'partial',
      'not_collected': 'not_collected'
    };
    bin.updateStatus(binStatusMap[collectionStatus]);
    await bin.save();

    // Save updated resident
    await resident.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Collection recorded successfully',
      data: {
        collection: await collection.populate('resident'),
        bin: {
          binID: bin.binID,
          status: bin.status,
          lastCollection: bin.lastCollection
        },
        resident: {
          _id: resident._id,
          name: resident.name,
          starPoints: resident.starPoints,
          outstandingBalance: resident.outstandingBalance
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/collections/:id
 * Update an existing collection record
 */
exports.updateCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, wasteType, weight, notes } = req.body;

    // Find the existing collection
    const collection = await CollectionHistory.findById(id).populate('resident');
    if (!collection) {
      throw new AppError('Collection record not found', 404);
    }

    // Get the resident
    const resident = await Resident.findById(collection.resident._id);
    if (!resident) {
      throw new AppError('Resident not found', 404);
    }

    // Get the bin
    const bin = await Bin.findOne({ binID: collection.binID });
    if (!bin) {
      throw new AppError('Bin not found', 404);
    }

    // Reverse previous rewards/payments
    resident.starPoints -= collection.starPointsAwarded;
    resident.outstandingBalance -= collection.payment;

    // Update collection fields
    if (status) {
      if (!['collected', 'partial', 'not_collected'].includes(status)) {
        throw new AppError('Invalid collection status', 400);
      }
      collection.status = status;
    }

    if (wasteType) {
      if (!['recyclable', 'non_recyclable'].includes(wasteType)) {
        throw new AppError('Invalid waste type', 400);
      }
      collection.wasteType = wasteType;
    }

    if (weight !== undefined) {
      if (weight < 0) {
        throw new AppError('Weight cannot be negative', 400);
      }
      collection.weight = weight;
    }

    if (notes !== undefined) {
      collection.notes = notes;
    }

    // Recalculate rewards and payments
    let starPointsAwarded = 0;
    let payment = 0;

    if (collection.status !== 'not_collected') {
      if (collection.wasteType === 'recyclable') {
        starPointsAwarded = calculateStarPoints(collection.weight);
        resident.starPoints += starPointsAwarded;
      } else if (collection.wasteType === 'non_recyclable') {
        payment = calculatePayment(collection.weight);
        resident.outstandingBalance += payment;
      }
    }

    collection.starPointsAwarded = starPointsAwarded;
    collection.payment = payment;

    // Update bin status
    const binStatusMap = {
      'collected': 'emptied',
      'partial': 'partial',
      'not_collected': 'not_collected'
    };
    bin.updateStatus(binStatusMap[collection.status]);
    await bin.save();

    // Save updates
    await collection.save();
    await resident.save();

    res.json({
      success: true,
      message: 'Collection updated successfully',
      data: {
        collection: await collection.populate('resident'),
        bin: {
          binID: bin.binID,
          status: bin.status,
          lastCollection: bin.lastCollection
        },
        resident: {
          _id: resident._id,
          name: resident.name,
          starPoints: resident.starPoints,
          outstandingBalance: resident.outstandingBalance
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/collections/:id
 * Delete a collection record (if recorded by mistake)
 */
exports.deleteCollection = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the collection
    const collection = await CollectionHistory.findById(id);
    if (!collection) {
      throw new AppError('Collection record not found', 404);
    }

    // Get the resident
    const resident = await Resident.findById(collection.resident);
    if (!resident) {
      throw new AppError('Resident not found', 404);
    }

    // Get the bin
    const bin = await Bin.findOne({ binID: collection.binID });

    // Reverse the rewards/payments
    resident.starPoints -= collection.starPointsAwarded;
    resident.outstandingBalance -= collection.payment;

    // Ensure values don't go negative
    if (resident.starPoints < 0) resident.starPoints = 0;
    if (resident.outstandingBalance < 0) resident.outstandingBalance = 0;

    await resident.save();

    // Update bin status to pending if it exists
    if (bin) {
      bin.status = 'pending';
      await bin.save();
    }

    // Delete the collection record
    await collection.deleteOne();

    res.json({
      success: true,
      message: 'Collection record deleted successfully',
      data: {
        deletedCollectionId: id,
        resident: {
          _id: resident._id,
          name: resident.name,
          starPoints: resident.starPoints,
          outstandingBalance: resident.outstandingBalance
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/collections
 * Get all collections with optional filters
 */
exports.getCollections = async (req, res, next) => {
  try {
    const { binID, resident, wasteType, status, startDate, endDate } = req.query;

    // Build query
    const query = {};
    if (binID) query.binID = binID.toUpperCase();
    if (resident) query.resident = resident;
    if (wasteType) query.wasteType = wasteType;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.dateCollected = {};
      if (startDate) query.dateCollected.$gte = new Date(startDate);
      if (endDate) query.dateCollected.$lte = new Date(endDate);
    }

    const collections = await CollectionHistory.find(query)
      .populate('resident', 'name email address phone')
      .sort({ dateCollected: -1 })
      .limit(100);

    res.json({
      success: true,
      count: collections.length,
      data: collections
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/collections/:id
 * Get a single collection by ID
 */
exports.getCollectionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const collection = await CollectionHistory.findById(id)
      .populate('resident', 'name email address phone starPoints outstandingBalance');

    if (!collection) {
      throw new AppError('Collection record not found', 404);
    }

    res.json({
      success: true,
      data: collection
    });

  } catch (error) {
    next(error);
  }
};
