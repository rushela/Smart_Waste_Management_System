const express = require('express');
const router = express.Router();
const binController = require('../controllers/binController');
// Uncomment if you want to add authentication middleware
// const auth = require('../middleware/auth');

/**
 * Bin Routes
 * Base path: /api/bins
 */

/**
 * @route   GET /api/bins
 * @desc    Get all bins with optional filters
 * @query   status, resident
 * @access  Private
 */
router.get('/', binController.getBins);

/**
 * @route   GET /api/bins/:id
 * @desc    Get bin details by ID (binID or MongoDB _id) with linked resident profile
 * @access  Private (worker can scan QR code)
 */
router.get('/:id', binController.getBinById);

/**
 * @route   POST /api/bins
 * @desc    Create a new bin
 * @body    { binID, resident }
 * @access  Private (admin only recommended)
 */
router.post('/', binController.createBin);

/**
 * @route   PUT /api/bins/:id
 * @desc    Update bin details
 * @body    { status, resident }
 * @access  Private (admin only recommended)
 */
router.put('/:id', binController.updateBin);

/**
 * @route   DELETE /api/bins/:id
 * @desc    Delete a bin (only if no collection records exist)
 * @access  Private (admin only recommended)
 */
router.delete('/:id', binController.deleteBin);

module.exports = router;
