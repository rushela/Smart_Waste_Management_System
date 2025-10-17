// Run: node seed/seed.js
require('dotenv').config();
const mongoose = require('mongoose');

// Models (match your folders)
const User = require('../models/User');
const CollectionRecord = require('../models/CollectionRecord');
const PaymentRecord = require('../models/PaymentRecord');
const Invoice = require('../models/Invoice');
const ResidentCredit = require('../models/ResidentCredit');

// ----- CONFIG -----
const {
  MONGO_URI = 'mongodb://127.0.0.1:27017/waste_payments',
  BILLING_MODE = 'flat',                 // 'flat' | 'weight'
} = process.env;

// Sample users
const seedUsers = [
  {
    name: 'Alice Resident',
    email: 'alice@resident.com',
    password: 'password123',
    role: 'resident',
    address: '123 Main St',
    wasteBinId: 'BIN001',
    wasteTypePreference: 'recyclable',
    paymentInfo: 'Paid'
  },
  {
    name: 'Bob Staff',
    email: 'bob@staff.com',
    password: 'password123',
    role: 'staff',
    assignedRoutes: ['RouteA'],
    collectionStatus: 'pending'
  },
  {
    name: 'Admin User',
    email: 'admin@admin.com',
    password: 'admin123',
    role: 'admin'
  },
];

async function main() {
  console.log(`Connecting to MongoDB: ${MONGO_URI}`);
  await mongoose.connect(MONGO_URI);

  console.log('Clearing existing data…');
  await Promise.all([
    User.deleteMany({}),
    CollectionRecord.deleteMany({}),
    PaymentRecord.deleteMany({}),
    Invoice.deleteMany({}),
    ResidentCredit.deleteMany({}),
  ]);

  console.log('Seeding users…');
  const savedUsers = [];
  for (const user of seedUsers) {
    savedUsers.push(await new User(user).save());
  }
  const resident = savedUsers.find(u => u.role === 'resident');
  const staff = savedUsers.find(u => u.role === 'staff');

  // ---- Seed Collection Records (7 days x 2 areas x 3 waste types) ----
  console.log('Seeding collection records…');
  const now = new Date();
  const days = [0,1,2,3,4,5,6].map(d => new Date(now.getTime() - d*24*60*60*1000));
  const areas = ['North', 'South'];
  const wasteTypes = ['recyclable', 'organic', 'general'];

  const collectionDocs = [];
  for (const day of days) {
    for (const area of areas) {
      for (const wt of wasteTypes) {
        collectionDocs.push({
          binId: `BIN-${area}-${wt}`,
          area,
          date: day,
          weight: Math.floor(Math.random() * 50) + 10, // 10..59 kg
          wasteType: wt,
          collectedBy: staff?._id,
          truckId: 'TRK-1',
          routeId: 'R1',
          distanceKm: +(Math.random() * 10).toFixed(2),
          stops: Math.floor(Math.random() * 10) + 1
        });
      }
    }
  }
  await CollectionRecord.insertMany(collectionDocs);

  // ---- Seed PaymentRecord (historic sample: payments & paybacks) ----
  console.log('Seeding payment records (historic)…');
  const payDocs = [
    { userId: resident._id, amount: 50, date: days[0], method: 'online', type: 'payment', status: 'completed' },
    { userId: resident._id, amount: 20, date: days[2], method: 'card',   type: 'payback', status: 'completed' }
  ];
  await PaymentRecord.insertMany(payDocs);

  // ---- Seed Invoices (supports flat vs weight) ----
  console.log(`Seeding invoices (mode=${BILLING_MODE.toLowerCase()})…`);
  const mode = BILLING_MODE.toLowerCase(); // 'flat' | 'weight'
  const ratePerKg = 120; // example regional rate; change per country
  const invoices = [];
  for (let i = 0; i < 5; i++) {
    if (mode === 'weight') {
      const kg = 10 + i * 4;                        // fake monthly weights
      const total = +(kg * ratePerKg).toFixed(2);   // currency
      invoices.push({
        userId: resident._id,
        code: `INV-WGT-${i + 1}`,
        total,
        balance: total,
        status: 'OPEN',
        mode: 'weight',
        dueOn: days[i % days.length].toISOString().slice(0, 10)
      });
    } else {
      // flat
      const total = 1500 + i * 100; // increase per month to vary totals
      invoices.push({
        userId: resident._id,
        code: `INV-FLAT-${i + 1}`,
        total,
        balance: total,
        status: 'OPEN',
        mode: 'flat',
        dueOn: days[i % days.length].toISOString().slice(0, 10)
      });
    }
  }
  await Invoice.insertMany(invoices);

  // ---- Seed ResidentCredit (recyclable paybacks / leftover credits) ----
  console.log('Seeding resident credit (recyclable paybacks)…');
  await new ResidentCredit({
    userId: resident._id,
    balance: 500  // e.g., LKR 500 credit from e-waste paybacks
  }).save();

  // ---- Summary ----
  const [invCount, creditRow] = await Promise.all([
    Invoice.countDocuments({ userId: resident._id }),
    ResidentCredit.findOne({ userId: resident._id })
  ]);

  console.log('--- Seed complete ---');
  console.log(`Users: ${savedUsers.length}`);
  console.log(`CollectionRecords: ${collectionDocs.length}`);
  console.log(`PaymentRecords: ${payDocs.length}`);
  console.log(`Invoices (resident): ${invCount} (mode=${mode})`);
  console.log(`ResidentCredit (resident): ${creditRow?.balance ?? 0}`);
} catchBlock: {
}

main()
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error('Seed failed:', err);
    mongoose.disconnect().finally(() => process.exit(1));
  });
