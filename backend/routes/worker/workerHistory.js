const express = require('express');
const auth = require('../../middleware/auth');
const historyController = require('../../controllers/worker/workerHistoryController');

const router = express.Router();

/**
 * Worker History Routes
 * All routes require authentication
 */

// GET /api/worker/history - Get collection history
router.get('/', auth, historyController.getHistory);

// GET /api/worker/history/stats - Get history statistics
router.get('/stats', auth, historyController.getHistoryStats);

module.exports = router;
