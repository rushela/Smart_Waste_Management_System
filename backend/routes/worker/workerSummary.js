const express = require('express');
const auth = require('../../middleware/auth');
const summaryController = require('../../controllers/worker/workerSummaryController');

const router = express.Router();

/**
 * Worker Summary Routes
 * All routes require authentication
 */

// GET /api/worker/summary - Get current session summary
router.get('/', auth, summaryController.getCurrentSummary);

// POST /api/worker/summary/end-session - End current session
router.post('/end-session', auth, summaryController.endSession);

// GET /api/worker/summary/history - Get past sessions
router.get('/history', auth, summaryController.getSessionHistory);

// GET /api/worker/summary/:sessionId - Get specific session
router.get('/:sessionId', auth, summaryController.getSessionById);

module.exports = router;
