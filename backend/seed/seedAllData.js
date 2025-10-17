require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Resident = require('../models/Resident');
const Bin = require('../models/Bin');
const CollectionHistory = require('../models/CollectionHistory');

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Clear existing data
async function clearData() {
  console.log('\n🗑️  Clearing existing data...');
  await User.deleteMany({});
  await Resident.deleteMany({});
  await Bin.deleteMany({});
  await CollectionHistory.deleteMany({});
  console.log('✅ Data cleared');
}

// Seed Users
async function seedUsers() {
  console.log('\n👥 Seeding users...');
  
  const users = [
    {
      name: 'Admin User',
      email: 'admin@smartwaste.lk',
      password: 'admin123',
      role: 'admin',
      address: 'Smart Waste HQ, Colombo',
      phone: '0112345678',
      department: 'operations'
    },
    {
      name: 'John Worker',
      email: 'worker@smartwaste.lk',
      password: 'worker123',
      role: 'staff',
      address: '45 Worker Lane, Kandy',
      phone: '0771234567',
      staffId: 'WRK001'
    },
    {
      name: 'Jane Resident',
      email: 'resident@smartwaste.lk',
      password: 'resident123',
      role: 'resident',
      address: '123 Green Street, Galle',
      phone: '0761234567',
      householdSize: '4-5'
    },
    {
      name: 'Gavindu Rushela',
      email: 'sanjulakalpani1212@gmail.com',
      password: 'test123',
      role: 'staff',
      address: 'qqqq',
      phone: '0766902338',
      staffId: '1010'
    }
  ];

  const createdUsers = await User.create(users);
  console.log(`✅ Created ${createdUsers.length} users`);
  
  return createdUsers;
}

// Seed Residents
async function seedResidents() {
  console.log('\n🏠 Seeding residents...');
  
  const residents = [
    {
      name: 'Alice Johnson',
      address: '10 Main Road, Colombo 03',
      email: 'alice@example.com',
      phone: '0771111111',
      starPoints: 150,
      outstandingBalance: 0
    },
    {
      name: 'Bob Smith',
      address: '25 Park Avenue, Kandy',
      email: 'bob@example.com',
      phone: '0772222222',
      starPoints: 200,
      outstandingBalance: 15.50
    },
    {
      name: 'Carol White',
      address: '88 Beach Road, Galle',
      email: 'carol@example.com',
      phone: '0773333333',
      starPoints: 75,
      outstandingBalance: 0
    },
    {
      name: 'David Brown',
      address: '12 Hill Street, Nuwara Eliya',
      email: 'david@example.com',
      phone: '0774444444',
      starPoints: 300,
      outstandingBalance: 25.00
    },
    {
      name: 'Emma Davis',
      address: '67 Lake View, Negombo',
      email: 'emma@example.com',
      phone: '0775555555',
      starPoints: 125,
      outstandingBalance: 10.00
    }
  ];

  const createdResidents = await Resident.create(residents);
  console.log(`✅ Created ${createdResidents.length} residents`);
  
  return createdResidents;
}

// Seed Bins
async function seedBins(residents) {
  console.log('\n🗑️  Seeding bins...');
  
  const bins = [];
  const statuses = ['pending', 'emptied', 'partial'];
  
  residents.forEach((resident, index) => {
    // Create 2 bins per resident
    for (let i = 1; i <= 2; i++) {
      const binNumber = (index * 2 + i).toString().padStart(3, '0');
      bins.push({
        binID: `BIN${binNumber}`,
        resident: resident._id,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        lastCollection: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
    }
  });

  const createdBins = await Bin.create(bins);
  console.log(`✅ Created ${createdBins.length} bins`);
  
  return createdBins;
}

// Seed Collection History
async function seedCollectionHistory(bins, residents) {
  console.log('\n📊 Seeding collection history...');
  
  const collections = [];
  const wasteTypes = ['recyclable', 'non_recyclable'];
  const statuses = ['collected', 'partial', 'not_collected'];
  
  // Create 3-5 collection records per bin
  for (const bin of bins) {
    const numCollections = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numCollections; i++) {
      const wasteType = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const weight = (Math.random() * 10 + 1).toFixed(2); // 1-11 kg
      
      // Calculate rewards based on waste type and status
      let starPointsAwarded = 0;
      let payment = 0;
      
      if (status === 'collected') {
        if (wasteType === 'recyclable') {
          starPointsAwarded = Math.round(weight * 10);
        } else {
          payment = (weight * 5).toFixed(2);
        }
      }
      
      collections.push({
        binID: bin.binID,
        resident: bin.resident,
        dateCollected: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        wasteType,
        weight: parseFloat(weight),
        starPointsAwarded,
        payment: parseFloat(payment),
        status,
        workerId: `WRK${Math.floor(Math.random() * 5 + 1).toString().padStart(3, '0')}`,
        notes: status === 'not_collected' ? 'No one home' : `${wasteType} waste collected`
      });
    }
  }

  const createdCollections = await CollectionHistory.create(collections);
  console.log(`✅ Created ${createdCollections.length} collection records`);
  
  return createdCollections;
}

// Main seed function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    await connectDB();
    await clearData();
    
    const users = await seedUsers();
    const residents = await seedResidents();
    const bins = await seedBins(residents);
    const collections = await seedCollectionHistory(bins, residents);
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Residents: ${residents.length}`);
    console.log(`   - Bins: ${bins.length}`);
    console.log(`   - Collections: ${collections.length}`);
    
    console.log('\n🔐 Test Login Credentials:');
    console.log('   Admin:    admin@smartwaste.lk / admin123');
    console.log('   Worker:   worker@smartwaste.lk / worker123');
    console.log('   Resident: resident@smartwaste.lk / resident123');
    console.log('   Your Account: sanjulakalpani1212@gmail.com / test123');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeder
seedDatabase();
