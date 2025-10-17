const mongoose = require('mongoose');
const ResidentCreditSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  balance: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('ResidentCredit', ResidentCreditSchema);
