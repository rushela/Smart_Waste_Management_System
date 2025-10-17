const express = require('express');
const auth = require('../../middleware/auth');
const binController = require('../../controllers/worker/workerBinController');

const router = express.Router();

/**
 * Worker Bin Routes
 * All routes require authentication
 */

// GET /api/worker/bins - Get all bins
router.get('/', auth, binController.getAllBins);

// GET /api/worker/bins/search/:code - Search bin by code
router.get('/search/:code', auth, binController.searchBinByCode);

// GET /api/worker/bins/:binId - Get bin by ID
router.get('/:binId', auth, binController.getBinById);

// PUT /api/worker/bins/:binId/status - Update bin status
router.put('/:binId/status', auth, binController.updateBinStatus);

module.exports = router;
