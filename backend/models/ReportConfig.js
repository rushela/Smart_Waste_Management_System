const mongoose = require('mongoose');

const ReportConfigSchema = new mongoose.Schema({
  name: { type: String, required: true },
  filters: { type: Object, default: {} }, // dynamic filter object
  dateRange: {
    from: { type: Date },
    to: { type: Date }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null }
}, { timestamps: true });

module.exports = mongoose.model('ReportConfig', ReportConfigSchema);
