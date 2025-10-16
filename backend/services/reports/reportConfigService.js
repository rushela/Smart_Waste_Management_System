const ReportConfig = require('../../models/ReportConfig');
const { NotFoundError } = require('../../utils/errors');

async function createReportConfig({ payload, userId }) {
  return ReportConfig.create({ ...payload, createdBy: userId });
}

async function listReportConfigs({ userId }) {
  return ReportConfig.find({ createdBy: userId });
}

async function updateReportConfig({ configId, userId, updates }) {
  const config = await ReportConfig.findOneAndUpdate(
    { _id: configId, createdBy: userId },
    updates,
    { new: true }
  );

  if (!config) {
    throw new NotFoundError('Config not found', { configId });
  }

  return config;
}

async function deleteReportConfig({ configId, userId }) {
  const result = await ReportConfig.deleteOne({ _id: configId, createdBy: userId });

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
