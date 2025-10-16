// Run: node seed/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect(process.env.MONGO_URI);

const seedUsers = [
  { name: 'Alice Resident', email: 'alice@resident.com', password: 'password123', role: 'resident', address: '123 Main St', wasteBinId: 'BIN001', wasteTypePreference: 'recyclable', paymentInfo: 'Paid' },
  { name: 'Bob Staff', email: 'bob@staff.com', password: 'password123', role: 'staff', assignedRoutes: ['RouteA'], collectionStatus: 'pending' },
  { name: 'Admin User', email: 'admin@admin.com', password: 'admin123', role: 'admin' },
];

(async () => {
  await User.deleteMany();
  for (const user of seedUsers) {
    await new User(user).save();
  }
  console.log('Seeded users');
  mongoose.disconnect();
})();
