const mongoose = require('mongoose');

/**
 * Resident Schema
 * Represents a resident who owns waste bins and accumulates star points
 */
const residentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Resident name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9+\-\s()]+$/, 'Please provide a valid phone number']
    },
    starPoints: {
      type: Number,
      default: 0,
      min: [0, 'Star points cannot be negative']
    },
    outstandingBalance: {
      type: Number,
      default: 0,
      min: [0, 'Outstanding balance cannot be negative']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for faster email lookups with unique constraint
residentSchema.index({ email: 1 }, { unique: true });

// Virtual for bins owned by this resident
residentSchema.virtual('bins', {
  ref: 'Bin',
  localField: '_id',
  foreignField: 'resident'
});

module.exports = mongoose.model('Resident', residentSchema);
