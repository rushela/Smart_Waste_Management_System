const mongoose = require('mongoose');

const RecyclableRatesSchema = new mongoose.Schema(
  {
    plastic: { type: Number, default: 0 },
    eWaste: { type: Number, default: 0 },
    metal: { type: Number, default: 0 },
    paper: { type: Number, default: 0 },
    glass: { type: Number, default: 0 }
  },
  { _id: false }
);

const PricingModelSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, index: true, unique: true },
    modelType: { type: String, enum: ['weight_based', 'flat_fee'], required: true },
    ratePerKg: { type: Number, default: 0 },
    flatFeeAmount: { type: Number, default: 0 },
    recyclablePaybackRates: { type: RecyclableRatesSchema, default: () => ({}) },
    lastUpdated: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PricingModel', PricingModelSchema);
