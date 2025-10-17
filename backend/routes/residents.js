const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
// Uncomment if you want to add authentication middleware
// const auth = require('../middleware/auth');

/**
 * Resident Routes
 * Base path: /api/residents
 */

/**
 * @route   GET /api/residents
 * @desc    Get all residents with optional filters
 * @query   email, phone
 * @access  Private
 */
router.get('/', residentController.getResidents);

/**
 * @route   GET /api/residents/:id
 * @desc    Get resident details by ID with bins and collection history
 * @access  Private
 */
router.get('/:id', residentController.getResidentById);

/**
 * @route   POST /api/residents
 * @desc    Create a new resident
 * @body    { name, address, email, phone }
 * @access  Private (admin only recommended)
 */
router.post('/', residentController.createResident);

/**
 * @route   PUT /api/residents/:id
 * @desc    Update resident details
 * @body    { name, address, email, phone }
 * @access  Private (admin only recommended)
 */
router.put('/:id', residentController.updateResident);

/**
 * @route   DELETE /api/residents/:id
 * @desc    Delete a resident (only if no bins or collections exist)
 * @access  Private (admin only recommended)
 */
router.delete('/:id', residentController.deleteResident);

module.exports = router;
