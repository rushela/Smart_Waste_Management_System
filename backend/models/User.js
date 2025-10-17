const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['resident', 'staff', 'admin', 'worker'], default: 'resident' },
  address: String,
  area: { type: String, index: true }, // area/zone user belongs to
  userType: { type: String, enum: ['resident', 'business'], default: 'resident' },
  accountInfo: {
    accountNumber: String,
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  wasteBinId: String,
  wasteTypePreference: String,
  paymentInfo: String,
  
  // For workers/staff
  assignedRoutes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Route' }],
  collectionStatus: String,
  employeeId: String,
  truckId: String,
  
  // For residents - rewards and payments
  starPoints: { type: Number, default: 0 },
  outstandingBalance: { type: Number, default: 0 },
  totalRecycled: { type: Number, default: 0 }, // total recyclable weight in kg
  
  // Contact information
  phone: String,
  emergencyContact: String,
  
  // Bin references
  bins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bin' }]
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);
