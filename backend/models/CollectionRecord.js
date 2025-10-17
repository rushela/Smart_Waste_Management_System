const mongoose = require('mongoose');

const CollectionRecordSchema = new mongoose.Schema({
  // Bin and location information
  binId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bin', required: true, index: true },
  binCode: { type: String, index: true }, // QR code or bin identifier
  area: { type: String, required: true, index: true },
  
  // Collection details
  date: { type: Date, required: true, index: true },
  time: { type: String }, // HH:mm if needed
  weight: { type: Number, required: true },
  wasteType: { type: String, enum: ['recyclable', 'organic', 'general', 'hazardous', 'mixed', 'other'], required: true },
  fillLevel: { type: Number, min: 0, max: 100 }, // percentage
  
  // Worker and route information
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Legacy field for compatibility
  truckId: { type: String },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', index: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  
  // Resident information
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  residentName: String,
  residentAddress: String,
  
  // Rewards and payment
  starPointsAwarded: { type: Number, default: 0 },
  paymentAmount: { type: Number, default: 0 },
  
  // Status and quality
  status: { 
    type: String, 
    enum: ['collected', 'partial', 'not-collected', 'contaminated', 'manual-entry'], 
    default: 'collected',
    index: true
  },
  contamination: { type: Boolean, default: false },
  contaminationDetails: String,
  
  // Additional information
  notes: String,
  photos: [String], // URLs to photos
  distanceKm: { type: Number, default: 0 },
  stops: { type: Number, default: 0 },
  
  // Manual entry flag
  isManualEntry: { type: Boolean, default: false },
  manualEntryReason: String
}, { timestamps: true });

// Compound indexes for efficient queries
CollectionRecordSchema.index({ workerId: 1, date: -1 });
CollectionRecordSchema.index({ residentId: 1, date: -1 });
CollectionRecordSchema.index({ routeId: 1, status: 1 });
CollectionRecordSchema.index({ status: 1, date: -1 });

// Auto-update hook: could invalidate caches or trigger async analytics updates
CollectionRecordSchema.post('save', function(doc) {
  // For demo we just log; a job/queue could be triggered here
  // console.log('New CollectionRecord saved', doc._id);
});

module.exports = mongoose.model('CollectionRecord', CollectionRecordSchema);
