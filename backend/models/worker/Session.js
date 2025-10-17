const mongoose = require('mongoose');

/**
 * Session Model - Tracks worker shift/session summary
 * Aggregates all collection activities during a work shift
 */
const SessionSchema = new mongoose.Schema({
  workerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true 
  },
  sessionDate: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  startTime: { 
    type: Date, 
    required: true 
  },
  endTime: Date,
  status: { 
    type: String, 
    enum: ['active', 'completed', 'paused'], 
    default: 'active' 
  },
  
  // Route information
  routeIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Route' 
  }],
  
  // Collection statistics
  totalBins: { type: Number, default: 0 },
  binsCollected: { type: Number, default: 0 },
  binsPending: { type: Number, default: 0 },
  binsSkipped: { type: Number, default: 0 },
  
  // Waste statistics
  totalWeight: { type: Number, default: 0 }, // in kg
  recyclableWeight: { type: Number, default: 0 },
  organicWeight: { type: Number, default: 0 },
  generalWeight: { type: Number, default: 0 },
  
  // Financial data
  totalStarPoints: { type: Number, default: 0 },
  totalPayments: { type: Number, default: 0 },
  
  // Performance metrics
  distanceTraveled: { type: Number, default: 0 }, // in km
  errors: { type: Number, default: 0 },
  contaminations: { type: Number, default: 0 },
  manualEntries: { type: Number, default: 0 },
  
  // Notes and issues
  notes: String,
  issues: [String],
  
  // Truck information
  truckId: String,
  truckFuelUsed: Number
}, { timestamps: true });

// Compound indexes
SessionSchema.index({ workerId: 1, sessionDate: -1 });
SessionSchema.index({ status: 1, sessionDate: 1 });

// Method to calculate session duration
SessionSchema.methods.getDuration = function() {
  if (!this.endTime) return null;
  return Math.round((this.endTime - this.startTime) / (1000 * 60)); // in minutes
};

// Method to calculate efficiency
SessionSchema.methods.getEfficiency = function() {
  if (this.totalBins === 0) return 0;
  return Math.round((this.binsCollected / this.totalBins) * 100);
};

module.exports = mongoose.model('Session', SessionSchema);
