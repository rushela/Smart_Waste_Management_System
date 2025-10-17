const mongoose = require('mongoose');

const PaymentRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  // Positive for payments, negative for paybacks
  amount: { type: Number, required: true },
  date: { type: Date, required: true, index: true },
  // payment method used
  method: { type: String, enum: ['cash', 'card', 'online', 'bank', 'mobile', 'mock_gateway'], default: 'online' },
  // legacy type kept; aligns with spec via paymentType
  type: { type: String, enum: ['payment', 'payback'], required: true },
  // status per transaction lifecycle
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed', index: true },
  // spec fields
  paymentType: { type: String, enum: ['collection_fee', 'recyclable_payback', 'other'], default: 'collection_fee' },
  billingModel: { type: String, enum: ['weight_based', 'flat_fee', null], default: null },
  city: { type: String, index: true },
  transactionId: { type: String, index: true },
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('PaymentRecord', PaymentRecordSchema);
