const mongoose = require('mongoose');
const InvoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  code: String,
  total: Number,
  balance: Number,
  status: { type: String, enum: ['OPEN','PARTIAL','PAID'], default: 'OPEN' },
  dueOn: String,
  mode: { type: String, enum: ['flat','weight'], default: 'flat' }
}, { timestamps: true });
module.exports = mongoose.model('Invoice', InvoiceSchema);
