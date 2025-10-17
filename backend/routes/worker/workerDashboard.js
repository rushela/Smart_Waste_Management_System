const express = require('express');
const auth = require('../../middleware/auth');
const dashboardController = require('../../controllers/worker/workerDashboardController');

const router = express.Router();

/**
 * Worker Dashboard Routes
 * All routes require authentication
 */

// GET /api/worker/dashboard - Get worker dashboard
router.get('/', auth, dashboardController.getDashboard);

// GET /api/worker/dashboard/routes - Get worker routes
router.get('/routes', auth, dashboardController.getWorkerRoutes);

module.exports = router;
