const mongoose = require('mongoose');

/**
 * CollectionHistory Schema
 * Records each waste collection event for tracking and analytics
 */
const collectionHistorySchema = new mongoose.Schema(
  {
    binID: {
      type: String,
      required: [true, 'Bin ID is required'],
      trim: true,
      uppercase: true
    },
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resident',
      required: [true, 'Resident is required']
    },
    dateCollected: {
      type: Date,
      required: [true, 'Collection date is required'],
      default: Date.now
    },
    wasteType: {
      type: String,
      enum: {
        values: ['recyclable', 'non_recyclable'],
        message: '{VALUE} is not a valid waste type'
      },
      required: [true, 'Waste type is required']
    },
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
      default: 0
    },
    starPointsAwarded: {
      type: Number,
      default: 0,
      min: [0, 'Star points cannot be negative']
    },
    payment: {
      type: Number,
      default: 0,
      min: [0, 'Payment cannot be negative']
    },
    status: {
      type: String,
      enum: {
        values: ['collected', 'partial', 'not_collected'],
        message: '{VALUE} is not a valid collection status'
      },
      required: [true, 'Collection status is required'],
      default: 'collected'
    },
    workerId: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for faster queries
collectionHistorySchema.index({ binID: 1 });
collectionHistorySchema.index({ resident: 1 });
collectionHistorySchema.index({ dateCollected: -1 });
collectionHistorySchema.index({ wasteType: 1 });

/**
 * Pre-save hook to validate business logic
 */
collectionHistorySchema.pre('save', function(next) {
  // Only award star points for recyclable waste that was collected
  if (this.wasteType !== 'recyclable' || this.status === 'not_collected') {
    this.starPointsAwarded = 0;
  }
  
  // Only charge payment for non-recyclable waste that was collected or partially collected
  if (this.wasteType === 'recyclable' || this.status === 'not_collected') {
    this.payment = 0;
  }
  
  next();
});

module.exports = mongoose.model('CollectionHistory', collectionHistorySchema);
