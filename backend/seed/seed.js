// Run: node seed/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const CollectionRecord = require('../models/CollectionRecord');
const PaymentRecord = require('../models/PaymentRecord');

mongoose.connect(process.env.MONGO_URI);

const seedUsers = [
  { name: 'Alice Resident', email: 'alice@resident.com', password: 'password123', role: 'resident', address: '123 Main St', wasteBinId: 'BIN001', wasteTypePreference: 'recyclable', paymentInfo: 'Paid' },
  { name: 'Bob Staff', email: 'bob@staff.com', password: 'password123', role: 'staff', assignedRoutes: ['RouteA'], collectionStatus: 'pending' },
  { name: 'Admin User', email: 'admin@admin.com', password: 'admin123', role: 'admin' },
];

(async () => {
  await User.deleteMany();
  await CollectionRecord.deleteMany();
  await PaymentRecord.deleteMany();

  const savedUsers = [];
  for (const user of seedUsers) {
    savedUsers.push(await new User(user).save());
  }

  const now = new Date();
  const days = [0,1,2,3,4,5,6].map(d => new Date(now.getTime() - d*24*60*60*1000));
  // Seed collection records across areas and waste types
  const areas = ['North', 'South'];
  const wasteTypes = ['recyclable', 'organic', 'general'];
  const docs = [];
  for (const day of days) {
    for (const area of areas) {
      for (const wt of wasteTypes) {
        docs.push({ binId: `BIN-${area}-${wt}`, area, date: day, weight: Math.floor(Math.random()*50)+10, wasteType: wt, collectedBy: savedUsers[1]._id, truckId: 'TRK-1', routeId: 'R1', distanceKm: Math.random()*10, stops: Math.floor(Math.random()*10)+1 });
      }
    }
  }
  await CollectionRecord.insertMany(docs);

  // Seed payments for resident and business
  const payDocs = [
    { userId: savedUsers[0]._id, amount: 50, date: days[0], method: 'online', type: 'payment', status: 'completed' },
    { userId: savedUsers[0]._id, amount: 20, date: days[2], method: 'card', type: 'payback', status: 'completed' }
  ];
  await PaymentRecord.insertMany(payDocs);

  console.log('Seeded users, collections, and payments');
  mongoose.disconnect();
})();
