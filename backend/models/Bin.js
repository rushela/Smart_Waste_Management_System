const mongoose = require('mongoose');

/**
 * Bin Schema
 * Represents a waste bin assigned to a resident
 */
const binSchema = new mongoose.Schema(
  {
    binID: {
      type: String,
      required: [true, 'Bin ID is required'],
      trim: true,
      uppercase: true,
      match: [/^[A-Z0-9-]+$/, 'Bin ID must contain only uppercase letters, numbers, and hyphens']
    },
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resident',
      required: [true, 'Resident is required']
    },
    status: {
      type: String,
      enum: {
        values: ['emptied', 'pending', 'partial', 'not_collected'],
        message: '{VALUE} is not a valid status'
      },
      default: 'pending'
    },
    lastCollection: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for faster binID lookups with unique constraint
binSchema.index({ binID: 1 }, { unique: true });
// Index for resident lookups
binSchema.index({ resident: 1 });

// Virtual for collection history
binSchema.virtual('collectionHistory', {
  ref: 'CollectionHistory',
  localField: 'binID',
  foreignField: 'binID'
});

/**
 * Method to update bin status after collection
 * @param {String} newStatus - New status to set
 */
binSchema.methods.updateStatus = function(newStatus) {
  const validStatuses = ['emptied', 'pending', 'partial', 'not_collected'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }
  this.status = newStatus;
  if (newStatus === 'emptied' || newStatus === 'partial') {
    this.lastCollection = new Date();
  }
};

module.exports = mongoose.model('Bin', binSchema);
