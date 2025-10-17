const ReportConfig = require('../../models/ReportConfig');
const { NotFoundError } = require('../../utils/errors');

async function createReportConfig({ payload }) {
  return ReportConfig.create({ ...payload });
}

async function listReportConfigs() {
  return ReportConfig.find({});
}

async function updateReportConfig({ configId, updates }) {
  const config = await ReportConfig.findOneAndUpdate(
    { _id: configId },
    updates,
    { new: true }
  );

  if (!config) {
    throw new NotFoundError('Config not found', { configId });
  }

  return config;
}

async function deleteReportConfig({ configId }) {
  const result = await ReportConfig.deleteOne({ _id: configId });

  if (result.deletedCount === 0) {
    throw new NotFoundError('Config not found', { configId });
  }

  return true;
}

module.exports = {
  createReportConfig,
  listReportConfigs,
  updateReportConfig,
  deleteReportConfig
};
