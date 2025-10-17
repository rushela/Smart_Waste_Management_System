const express = require('express');
const { query, body } = require('express-validator');
const validate = require('../middleware/validate');
const c = require('../controllers/reportController');

const router = express.Router();

// Auth removed: routes are public

// Waste Reports
router.get('/summary', [
  query('from').optional().isISO8601(),
  query('to').optional().isISO8601(),
  query('area').optional().isString(),
  query('wasteType').optional().isString()
], validate, c.getSummary);

router.get('/trends', [
  query('from').optional().isISO8601(),
  query('to').optional().isISO8601(),
  query('granularity').optional().isIn(['daily', 'weekly', 'monthly'])
], validate, c.getTrends);

router.get('/route-efficiency', [
  query('from').optional().isISO8601(),
  query('to').optional().isISO8601(),
  query('routeId').optional().isString()
], validate, c.getRouteEfficiency);

// User Report
router.get('/user/:id', [
  query('from').optional().isISO8601(),
  query('to').optional().isISO8601(),
], validate, c.getUserReport);

// Payment Reports
router.get('/payments', [
  query('from').optional().isISO8601(),
  query('to').optional().isISO8601(),
], validate, c.getPaymentReports);

// Custom Reports CRUD
router.post('/config', [
  body('name').notEmpty(),
  body('filters').optional().isObject(),
  body('dateRange').optional().isObject()
], validate, c.createConfig);

router.get('/config', c.listConfigs);
router.put('/config/:id', [
  body('name').optional().isString(),
  body('filters').optional().isObject(),
  body('dateRange').optional().isObject()
], validate, c.updateConfig);
router.delete('/config/:id', c.deleteConfig);

// Export
router.get('/export/pdf', c.exportPdf);
router.get('/export/excel', c.exportExcel);

module.exports = router;
