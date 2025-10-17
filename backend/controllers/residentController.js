const Resident = require('../models/Resident');
const Bin = require('../models/Bin');
const CollectionHistory = require('../models/CollectionHistory');
const { AppError } = require('../utils/errors');

/**
 * GET /api/residents
 * Get all residents with optional filters
 */
exports.getResidents = async (req, res, next) => {
  try {
    const { email, phone } = req.query;

    // Build query
    const query = {};
    if (email) query.email = email.toLowerCase();
    if (phone) query.phone = phone;

    const residents = await Resident.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: residents.length,
      data: residents
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/residents/:id
 * Get resident details by ID with bins and collection history
 */
exports.getResidentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const resident = await Resident.findById(id);
    if (!resident) {
      throw new AppError('Resident not found', 404);
    }

    // Get bins assigned to this resident
    const bins = await Bin.find({ resident: id });

    // Get recent collection history
    const recentCollections = await CollectionHistory.find({ resident: id })
      .sort({ dateCollected: -1 })
      .limit(20)
      .select('binID dateCollected wasteType weight status starPointsAwarded payment');

    res.json({
      success: true,
      data: {
        resident,
        bins,
        recentCollections,
        statistics: {
          totalBins: bins.length,
          totalCollections: await CollectionHistory.countDocuments({ resident: id }),
          recyclableCollections: await CollectionHistory.countDocuments({ 
            resident: id, 
            wasteType: 'recyclable' 
          })
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/residents
 * Create a new resident
 */
exports.createResident = async (req, res, next) => {
  try {
    const { name, address, email, phone } = req.body;

    // Validation
    if (!name) {
      throw new AppError('Name is required', 400);
    }
    if (!address) {
      throw new AppError('Address is required', 400);
    }
    if (!email) {
      throw new AppError('Email is required', 400);
    }
    if (!phone) {
      throw new AppError('Phone is required', 400);
    }

    // Check if email already exists
    const existingResident = await Resident.findOne({ email: email.toLowerCase() });
    if (existingResident) {
      throw new AppError('Resident with this email already exists', 400);
    }

    // Create resident
    const resident = await Resident.create({
      name,
      address,
      email,
      phone,
      starPoints: 0,
      outstandingBalance: 0
    });

    res.status(201).json({
      success: true,
      message: 'Resident created successfully',
      data: resident
    });

  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/residents/:id
 * Update resident details
 */
exports.updateResident = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, address, email, phone } = req.body;

    const resident = await Resident.findById(id);
    if (!resident) {
      throw new AppError('Resident not found', 404);
    }

    // Update fields
    if (name) resident.name = name;
    if (address) resident.address = address;
    if (email) {
      // Check if new email is already in use
      const existingResident = await Resident.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: id }
      });
      if (existingResident) {
        throw new AppError('Email already in use', 400);
      }
      resident.email = email;
    }
    if (phone) resident.phone = phone;

    await resident.save();

    res.json({
      success: true,
      message: 'Resident updated successfully',
      data: resident
    });

  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/residents/:id
 * Delete a resident
 */
exports.deleteResident = async (req, res, next) => {
  try {
    const { id } = req.params;

    const resident = await Resident.findById(id);
    if (!resident) {
      throw new AppError('Resident not found', 404);
    }

    // Check if resident has bins
    const binCount = await Bin.countDocuments({ resident: id });
    if (binCount > 0) {
      throw new AppError(
        `Cannot delete resident. ${binCount} bin(s) are assigned to this resident.`,
        400
      );
    }

    // Check if resident has collection history
    const collectionCount = await CollectionHistory.countDocuments({ resident: id });
    if (collectionCount > 0) {
      throw new AppError(
        `Cannot delete resident. ${collectionCount} collection record(s) exist for this resident.`,
        400
      );
    }

    await resident.deleteOne();

    res.json({
      success: true,
      message: 'Resident deleted successfully',
      data: { deletedResidentId: id }
    });

  } catch (error) {
    next(error);
  }
};
