const {
  fetchSummary,
  fetchTrends,
  fetchRouteEfficiency
} = require('../services/reports/collectionAggregationService');
const { fetchUserReport } = require('../services/reports/userReportService');
const { fetchPaymentSummary } = require('../services/reports/paymentReportService');
const {
  createReportConfig,
  listReportConfigs,
  updateReportConfig,
  deleteReportConfig
} = require('../services/reports/reportConfigService');
const { logReportGeneration } = require('../services/reports/reportLogger');
const {
  createPdfDocument,
  applyDefaultPdfContent,
  buildCsvContent
} = require('../services/reports/reportExporter');
const { NotFoundError } = require('../utils/errors');

// GET /api/reports/summary
exports.getSummary = async (req, res, next) => {
  try {
    const result = await fetchSummary(req.query);
  await logReportGeneration({ userId: req.user?._id, endpoint: 'summary', params: req.query });
    res.json({ data: result });
  } catch (err) { next(err); }
};

// GET /api/reports/trends
exports.getTrends = async (req, res, next) => {
  try {
    const result = await fetchTrends(req.query);
  await logReportGeneration({ userId: req.user?._id, endpoint: 'trends', params: req.query });
    res.json({ data: result });
  } catch (err) { next(err); }
};

// GET /api/reports/route-efficiency
exports.getRouteEfficiency = async (req, res, next) => {
  try {
    const result = await fetchRouteEfficiency(req.query);
  await logReportGeneration({ userId: req.user?._id, endpoint: 'route-efficiency', params: req.query });
    res.json({ data: result });
  } catch (err) { next(err); }
};

// GET /api/reports/user/:id
exports.getUserReport = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
  const data = await fetchUserReport({ userId: targetUserId, ...req.query });
    await logReportGeneration({
      userId: req.user?._id,
      endpoint: 'user',
      params: { ...req.query, targetUserId }
    });
    res.json({ data });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(err.status).json({ message: err.message });
    }
    next(err);
  }
};

// GET /api/reports/payments
exports.getPaymentReports = async (req, res, next) => {
  try {
  const summary = await fetchPaymentSummary(req.query);
  await logReportGeneration({ userId: req.user?._id, endpoint: 'payments', params: req.query });
    res.json({ data: summary });
  } catch (err) { next(err); }
};

// Custom Report Config CRUD
exports.createConfig = async (req, res, next) => {
  try {
  const config = await createReportConfig({ payload: req.body });
    res.status(201).json({ data: config });
  } catch (err) { next(err); }
};

exports.listConfigs = async (req, res, next) => {
  try {
  const configs = await listReportConfigs();
    res.json({ data: configs });
  } catch (err) { next(err); }
};

exports.updateConfig = async (req, res, next) => {
  try {
    const config = await updateReportConfig({
      configId: req.params.id,
      updates: req.body
    });
    res.json({ data: config });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(err.status).json({ message: err.message });
    }
    next(err);
  }
};

exports.deleteConfig = async (req, res, next) => {
  try {
  await deleteReportConfig({ configId: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(err.status).json({ message: err.message });
    }
    next(err);
  }
};

// Export: PDF and Excel (CSV)
exports.exportPdf = async (req, res, next) => {
  try {
    const doc = createPdfDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
    doc.pipe(res);
    applyDefaultPdfContent(doc);
    doc.end();
  } catch (err) { next(err); }
};

exports.exportExcel = async (req, res, next) => {
  try {
    const rows = [ { header: 'Example', value: 1 } ];
    const csv = buildCsvContent(rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="report.csv"');
    res.send(csv);
  } catch (err) { next(err); }
};

// Auto-update hook example: when a collection record is created, could trigger processing
// For demo, we'll export a function to be called elsewhere if needed
exports.onNewCollectionRecord = async (record) => {
  // placeholder for cache invalidation or async analytics update
  return true;
};
