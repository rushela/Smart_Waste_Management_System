const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
// Uncomment if you want to add authentication middleware
// const auth = require('../middleware/auth');

/**
 * Collection Routes
 * Base path: /api/collections
 */

/**
 * @route   GET /api/collections
 * @desc    Get all collections with optional filters
 * @query   binID, resident, wasteType, status, startDate, endDate
 * @access  Private (uncomment auth middleware when ready)
 */
router.get('/', collectionController.getCollections);

/**
 * @route   GET /api/collections/:id
 * @desc    Get a single collection by ID
 * @access  Private
 */
router.get('/:id', collectionController.getCollectionById);

/**
 * @route   POST /api/collections
 * @desc    Create a new waste collection record
 * @body    { binID, dateCollected, wasteType, weight, notes, workerId, status }
 * @access  Private (worker authentication recommended)
 */
router.post('/', collectionController.createCollection);

/**
 * @route   PUT /api/collections/:id
 * @desc    Update an existing collection record
 * @body    { status, wasteType, weight, notes }
 * @access  Private (worker authentication recommended)
 */
router.put('/:id', collectionController.updateCollection);

/**
 * @route   DELETE /api/collections/:id
 * @desc    Delete a collection record (if recorded by mistake)
 * @access  Private (admin/supervisor only recommended)
 */
router.delete('/:id', collectionController.deleteCollection);

module.exports = router;
