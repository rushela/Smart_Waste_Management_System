// models/Payment.js
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'LKR'},
    status: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'CANCELLED'], default: 'PENDING', index: true },
    gateway: { type: String, default: 'MOCK'},
    gatewayRef: { type: String, unique: true, sparse: true, comment: 'Unique transaction ID returned from the payment gateway'},
    serviceType: { type: String, default: 'WASTE_COLLECTION'},
    period: { type: String, comment: 'e.g. "2025-10" to represent billing month'},
    paidAt: { type: Date, comment: 'Timestamp when payment is confirmed'},
    receiptUrl: { type: String, comment: 'Path or URL to generated digital receipt' },
    emailSent: { type: Boolean, default: false, comment: 'Whether payment confirmation email was sent' },
    remarks: { type: String, maxlength: 255, comment: 'Optional field for error messages or notes'}
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);
