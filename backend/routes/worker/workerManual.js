const express = require('express');
const { body } = require('express-validator');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const manualController = require('../../controllers/worker/workerManualController');

const router = express.Router();

/**
 * Worker Manual Entry Routes
 * All routes require authentication
 */

// POST /api/worker/manual - Create manual entry
router.post(
  '/',
  auth,
  [
    body('wasteType')
      .isIn(['recyclable', 'organic', 'general', 'hazardous', 'mixed', 'other'])
      .withMessage('Invalid waste type'),
    body('weight')
      .isFloat({ min: 0.1 })
      .withMessage('Weight must be greater than 0'),
    body('manualEntryReason')
      .optional()
      .isString()
      .withMessage('Manual entry reason must be a string')
  ],
  validate,
  manualController.createManualEntry
);

// GET /api/worker/manual - Get all manual entries
router.get('/', auth, manualController.getManualEntries);

module.exports = router;
