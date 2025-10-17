const CollectionRecord = require('../../models/CollectionRecord');
const Bin = require('../../models/worker/Bin');
const User = require('../../models/User');
const Session = require('../../models/worker/Session');
const { calculateRewards } = require('../../utils/calculation');

/**
 * Collection Controller - Handle waste collection operations
 */

/**
 * POST /api/worker/collections
 * Create a new collection record
 */
exports.createCollection = async (req, res, next) => {
  try {
    const workerId = req.user._id;
    const {
      binId,
      binCode,
      wasteType,
      weight,
      fillLevel,
      notes,
      contamination,
      contaminationDetails,
      routeId,
      residentId
    } = req.body;

    // Validate required fields
    if (!binId && !binCode) {
      return res.status(400).json({
        success: false,
        message: 'Bin ID or bin code is required'
      });
    }

    if (!wasteType || !weight) {
      return res.status(400).json({
        success: false,
        message: 'Waste type and weight are required'
      });
    }

    // Find the bin
    let bin;
    if (binId) {
      bin = await Bin.findById(binId);
    } else {
      bin = await Bin.findOne({ binId: binCode });
    }

    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found'
      });
    }

    // Get resident information
    const resident = bin.residentId ? await User.findById(bin.residentId) : null;

    // Calculate star points and payment
    const rewards = calculateRewards(wasteType, weight, contamination);

    // Create collection record
    const collection = await CollectionRecord.create({
      binId: bin._id,
      binCode: bin.binId,
      workerId,
      wasteType,
      weight,
      fillLevel: fillLevel || 0,
      date: new Date(),
      area: bin.location?.address || 'Unknown',
      routeId,
      residentId: resident?._id,
      residentName: resident?.name,
      residentAddress: resident?.address,
      starPointsAwarded: rewards.starPoints,
      paymentAmount: rewards.payment,
      contamination: contamination || false,
      contaminationDetails: contaminationDetails || '',
      notes: notes || '',
      status: 'collected'
    });

    // Update bin status
    await Bin.findByIdAndUpdate(bin._id, {
      status: 'collected',
      lastCollectionDate: new Date(),
      fillLevel: 0
    });

    // Update resident rewards (if applicable)
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
      message: 'Collection recorded successfully',
      data: populatedCollection
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/worker/collections/:id
 * Get a specific collection record
 */
exports.getCollectionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const collection = await CollectionRecord.findById(id)
      .populate('binId')
      .populate('residentId', 'name email phone address starPoints')
      .populate('workerId', 'name email employeeId')
      .lean();

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection record not found'
      });
    }

    res.json({
      success: true,
      data: collection
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/worker/collections/:id
 * Update a collection record (error correction)
 */
exports.updateCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      wasteType,
      weight,
      fillLevel,
      notes,
      contamination,
      contaminationDetails,
      status
    } = req.body;

    const collection = await CollectionRecord.findById(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection record not found'
      });
    }

    // Store old values for reversal
    const oldRewards = {
      starPoints: collection.starPointsAwarded,
      payment: collection.paymentAmount
    };

    // Calculate new rewards if weight or waste type changed
    let newRewards = oldRewards;
    if (wasteType || weight !== undefined) {
      newRewards = calculateRewards(
        wasteType || collection.wasteType,
        weight !== undefined ? weight : collection.weight,
        contamination !== undefined ? contamination : collection.contamination
      );
    }

    // Update collection record
    if (wasteType) collection.wasteType = wasteType;
    if (weight !== undefined) collection.weight = weight;
    if (fillLevel !== undefined) collection.fillLevel = fillLevel;
    if (notes) collection.notes = notes;
    if (contamination !== undefined) collection.contamination = contamination;
    if (contaminationDetails) collection.contaminationDetails = contaminationDetails;
    if (status) collection.status = status;
    
    collection.starPointsAwarded = newRewards.starPoints;
    collection.paymentAmount = newRewards.payment;

    await collection.save();

    // Update resident rewards (adjust difference)
    if (collection.residentId) {
      const pointsDiff = newRewards.starPoints - oldRewards.starPoints;
      const paymentDiff = newRewards.payment - oldRewards.payment;

      if (pointsDiff !== 0 || paymentDiff !== 0) {
        await User.findByIdAndUpdate(collection.residentId, {
          $inc: {
            starPoints: pointsDiff,
            outstandingBalance: paymentDiff
          }
        });
      }
    }

    const updatedCollection = await CollectionRecord.findById(id)
      .populate('binId')
      .populate('residentId', 'name email phone starPoints')
      .lean();

    res.json({
      success: true,
      message: 'Collection record updated successfully',
      data: updatedCollection
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/worker/collections/:id
 * Delete a collection record
 */
exports.deleteCollection = async (req, res, next) => {
  try {
    const { id } = req.params;

    const collection = await CollectionRecord.findById(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection record not found'
      });
    }

    // Reverse resident rewards
    if (collection.residentId && (collection.starPointsAwarded > 0 || collection.paymentAmount > 0)) {
      await User.findByIdAndUpdate(collection.residentId, {
        $inc: {
          starPoints: -collection.starPointsAwarded,
          outstandingBalance: -collection.paymentAmount,
          totalRecycled: collection.wasteType === 'recyclable' ? -collection.weight : 0
        }
      });
    }

    // Update bin status back to pending
    await Bin.findByIdAndUpdate(collection.binId, {
      status: 'pending'
    });

    await collection.deleteOne();

    res.json({
      success: true,
      message: 'Collection record deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = exports;
