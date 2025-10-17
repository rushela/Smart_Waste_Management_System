const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['resident', 'staff', 'admin'], default: 'resident' },
  address: String,
  phone: String, // Phone number for contact
  area: { type: String, index: true }, // area/zone user belongs to
  userType: { type: String, enum: ['resident', 'business'], default: 'resident' },
  accountInfo: {
    accountNumber: String,
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  // Resident-specific fields
  householdSize: String,
  wasteBinId: String,
  wasteTypePreference: String,
  paymentInfo: String,
  // Staff-specific fields
  staffId: String,
  assignedRoutes: [String], // for staff
  collectionStatus: String, // for staff
  // Admin-specific fields
  department: String,
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
