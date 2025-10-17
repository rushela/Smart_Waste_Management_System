const express = require('express');
const { body } = require('express-validator');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const collectionController = require('../../controllers/worker/workerCollectionController');

const router = express.Router();

/**
 * Worker Collection Routes
 * All routes require authentication
 */

// POST /api/worker/collections - Create new collection
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
    body('fillLevel')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Fill level must be between 0 and 100')
  ],
  validate,
  collectionController.createCollection
);

// GET /api/worker/collections/:id - Get collection by ID
router.get('/:id', auth, collectionController.getCollectionById);

// PUT /api/worker/collections/:id - Update collection (error correction)
router.put(
  '/:id',
  auth,
  [
    body('wasteType')
      .optional()
      .isIn(['recyclable', 'organic', 'general', 'hazardous', 'mixed', 'other']),
    body('weight')
      .optional()
      .isFloat({ min: 0.1 }),
    body('fillLevel')
      .optional()
      .isInt({ min: 0, max: 100 })
  ],
  validate,
  collectionController.updateCollection
);

// DELETE /api/worker/collections/:id - Delete collection
router.delete('/:id', auth, collectionController.deleteCollection);

module.exports = router;
