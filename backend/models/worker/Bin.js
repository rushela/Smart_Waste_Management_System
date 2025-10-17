const mongoose = require('mongoose');

/**
 * Bin Model - Represents waste bins assigned to residents
 * Used by workers to track bin status and collection history
 */
const BinSchema = new mongoose.Schema({
  binId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  residentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    index: true 
  },
  type: { 
    type: String, 
    enum: ['recyclable', 'organic', 'general', 'hazardous', 'mixed'], 
    default: 'general' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'collected', 'partial', 'not-collected', 'contaminated'], 
    default: 'pending',
    index: true
  },
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  lastCollectionDate: { 
    type: Date,
    index: true
  },
  nextScheduledDate: Date,
  capacity: { type: Number, default: 100 }, // in liters
  fillLevel: { type: Number, default: 0 }, // percentage 0-100
  qrCode: String, // QR code for scanning
  notes: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Index for efficient queries
BinSchema.index({ status: 1, lastCollectionDate: 1 });
BinSchema.index({ residentId: 1, isActive: 1 });

module.exports = mongoose.model('Bin', BinSchema);
