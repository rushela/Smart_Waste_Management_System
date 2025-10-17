const mongoose = require('mongoose');
const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  amount: Number,
  method: { type: String, enum: ['MockCard','Cash','Bank'], default: 'MockCard' },
  status: { type: String, enum: ['Draft','Posted','Failed','Voided'], default: 'Draft' },
  allocations: [{ invoiceId: mongoose.Schema.Types.ObjectId, amount: Number }],
  receiptNo: String,
  createdAt: { type: Date, default: Date.now }
}, { minimize: false });
module.exports = mongoose.model('Payment', PaymentSchema);
