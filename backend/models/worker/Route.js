const mongoose = require('mongoose');

/**
 * Route Model - Represents collection routes assigned to workers
 * Contains list of bins to be collected in a specific order
 */
const RouteSchema = new mongoose.Schema({
  routeId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  workerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true 
  },
  binIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bin' 
  }],
  date: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed', 'cancelled'], 
    default: 'pending',
    index: true
  },
  area: { 
    type: String,
    index: true 
  },
  estimatedDuration: Number, // in minutes
  actualDuration: Number, // in minutes
  distanceKm: Number,
  truckId: String,
  startTime: Date,
  endTime: Date,
  notes: String,
  
  // Progress tracking
  totalBins: { type: Number, default: 0 },
  collectedBins: { type: Number, default: 0 },
  pendingBins: { type: Number, default: 0 }
}, { timestamps: true });

// Compound indexes for common queries
RouteSchema.index({ workerId: 1, date: -1, status: 1 });
RouteSchema.index({ status: 1, date: 1 });

// Update progress counters
RouteSchema.methods.updateProgress = function() {
  this.totalBins = this.binIds.length;
  // This will be updated when collections are recorded
  return this.save();
};

module.exports = mongoose.model('Route', RouteSchema);
