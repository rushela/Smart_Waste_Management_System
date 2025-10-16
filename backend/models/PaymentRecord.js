const mongoose = require('mongoose');

const PaymentRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true, index: true },
  method: { type: String, enum: ['cash', 'card', 'online', 'bank'], default: 'online' },
  type: { type: String, enum: ['payment', 'payback'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' }
}, { timestamps: true });

module.exports = mongoose.model('PaymentRecord', PaymentRecordSchema);
