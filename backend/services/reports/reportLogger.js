const ReportLog = require('../../models/ReportLog');

async function logReportGeneration({ userId, endpoint, params = {} }) {
  if (!endpoint) {
    throw new Error('endpoint is required to log report generation');
  }

  return ReportLog.create({
    userId,
    endpoint,
    params
  });
}

module.exports = { logReportGeneration };
