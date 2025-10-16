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
    ,
    // Optional allocations attached to this payment (keeps minimal invoice referencing)
    allocations: [
      {
        invoiceId: { type: String },
        invoiceNumber: { type: String },
        amount: { type: Number, min: 0 },
      }
    ],
    // Voiding support
    voided: { type: Boolean, default: false, index: true },
    voidedAt: { type: Date },
    voidReason: { type: String, maxlength: 255 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);
