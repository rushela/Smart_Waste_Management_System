const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Bin = require('../models/worker/Bin');
const Route = require('../models/worker/Route');
const CollectionRecord = require('../models/CollectionRecord');
const Session = require('../models/worker/Session');

/**
 * Seed Script for Worker Module
 * Creates test data: workers, residents, bins, routes, and sample collections
 */

async function seedWorkerData() {
  try {
    console.log('🌱 Starting worker module seed...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing worker-related data (optional - comment out to preserve existing data)
    console.log('🗑️  Clearing existing worker data...');
    await CollectionRecord.deleteMany({});
    await Session.deleteMany({});
    await Route.deleteMany({});
    await Bin.deleteMany({});
    await User.deleteMany({ role: { $in: ['worker', 'resident'] } });
    console.log('✅ Cleared existing data');

    // Create Workers
    console.log('👷 Creating workers...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const workers = await User.create([
      {
        name: 'John Smith',
        email: 'john@ecowaste.com',
        password: hashedPassword,
        role: 'worker',
        employeeId: 'W001',
        truckId: 'TR-101',
        area: 'North District',
        phone: '+1234567890'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@ecowaste.com',
        password: hashedPassword,
        role: 'worker',
        employeeId: 'W002',
        truckId: 'TR-102',
        area: 'South District',
        phone: '+1234567891'
      },
      {
        name: 'Mike Chen',
        email: 'mike@ecowaste.com',
        password: hashedPassword,
        role: 'worker',
        employeeId: 'W003',
        truckId: 'TR-103',
        area: 'East District',
        phone: '+1234567892'
      }
    ]);
    console.log(`✅ Created ${workers.length} workers`);

    // Create Residents
    console.log('🏠 Creating residents...');
    const residents = await User.create([
      {
        name: 'Alice Williams',
        email: 'alice@example.com',
        password: hashedPassword,
        role: 'resident',
        address: '123 Oak Street, North District',
        area: 'North District',
        phone: '+1234560001',
        starPoints: 150,
        outstandingBalance: 25.50,
        totalRecycled: 45.2
      },
      {
        name: 'Bob Martinez',
        email: 'bob@example.com',
        password: hashedPassword,
        role: 'resident',
        address: '456 Pine Avenue, North District',
        area: 'North District',
        phone: '+1234560002',
        starPoints: 200,
        outstandingBalance: 30.00,
        totalRecycled: 60.5
      },
      {
        name: 'Carol Davis',
        email: 'carol@example.com',
        password: hashedPassword,
        role: 'resident',
        address: '789 Elm Road, South District',
        area: 'South District',
        phone: '+1234560003',
        starPoints: 100,
        outstandingBalance: 15.75,
        totalRecycled: 30.0
      },
      {
        name: 'David Brown',
        email: 'david@example.com',
        password: hashedPassword,
        role: 'resident',
        address: '321 Maple Drive, South District',
        area: 'South District',
        phone: '+1234560004',
        starPoints: 175,
        outstandingBalance: 28.25,
        totalRecycled: 52.8
      },
      {
        name: 'Emma Wilson',
        email: 'emma@example.com',
        password: hashedPassword,
        role: 'resident',
        address: '654 Birch Lane, East District',
        area: 'East District',
        phone: '+1234560005',
        starPoints: 225,
        outstandingBalance: 35.50,
        totalRecycled: 71.0
      }
    ]);
    console.log(`✅ Created ${residents.length} residents`);

    // Create Bins
    console.log('🗑️  Creating bins...');
    const bins = await Bin.create([
      {
        binId: 'BIN-001',
        residentId: residents[0]._id,
        type: 'recyclable',
        status: 'pending',
        location: {
          address: residents[0].address,
          coordinates: { lat: 40.7128, lng: -74.0060 }
        },
        capacity: 120,
        fillLevel: 75,
        qrCode: 'QR-BIN-001',
        isActive: true
      },
      {
        binId: 'BIN-002',
        residentId: residents[0]._id,
        type: 'organic',
        status: 'pending',
        location: {
          address: residents[0].address,
          coordinates: { lat: 40.7128, lng: -74.0060 }
        },
        capacity: 100,
        fillLevel: 60,
        qrCode: 'QR-BIN-002',
        isActive: true
      },
      {
        binId: 'BIN-003',
        residentId: residents[1]._id,
        type: 'recyclable',
        status: 'pending',
        location: {
          address: residents[1].address,
          coordinates: { lat: 40.7130, lng: -74.0062 }
        },
        capacity: 120,
        fillLevel: 85,
        qrCode: 'QR-BIN-003',
        isActive: true
      },
      {
        binId: 'BIN-004',
        residentId: residents[2]._id,
        type: 'general',
        status: 'pending',
        location: {
          address: residents[2].address,
          coordinates: { lat: 40.7100, lng: -74.0055 }
        },
        capacity: 100,
        fillLevel: 50,
        qrCode: 'QR-BIN-004',
        isActive: true
      },
      {
        binId: 'BIN-005',
        residentId: residents[3]._id,
        type: 'recyclable',
        status: 'pending',
        location: {
          address: residents[3].address,
          coordinates: { lat: 40.7102, lng: -74.0057 }
        },
        capacity: 120,
        fillLevel: 90,
        qrCode: 'QR-BIN-005',
        isActive: true
      },
      {
        binId: 'BIN-006',
        residentId: residents[4]._id,
        type: 'organic',
        status: 'pending',
        location: {
          address: residents[4].address,
          coordinates: { lat: 40.7150, lng: -74.0070 }
        },
        capacity: 100,
        fillLevel: 70,
        qrCode: 'QR-BIN-006',
        isActive: true
      }
    ]);
    console.log(`✅ Created ${bins.length} bins`);

    // Update residents with their bin references
    await User.findByIdAndUpdate(residents[0]._id, { 
      bins: [bins[0]._id, bins[1]._id] 
    });
    await User.findByIdAndUpdate(residents[1]._id, { bins: [bins[2]._id] });
    await User.findByIdAndUpdate(residents[2]._id, { bins: [bins[3]._id] });
    await User.findByIdAndUpdate(residents[3]._id, { bins: [bins[4]._id] });
    await User.findByIdAndUpdate(residents[4]._id, { bins: [bins[5]._id] });

    // Create Routes
    console.log('🗺️  Creating routes...');
    const today = new Date();
    const routes = await Route.create([
      {
        routeId: 'ROUTE-001',
        name: 'North District Morning',
        workerId: workers[0]._id,
        binIds: [bins[0]._id, bins[1]._id, bins[2]._id],
        date: today,
        status: 'in-progress',
        area: 'North District',
        estimatedDuration: 120,
        distanceKm: 8.5,
        truckId: 'TR-101',
        totalBins: 3,
        collectedBins: 0,
        pendingBins: 3
      },
      {
        routeId: 'ROUTE-002',
        name: 'South District Morning',
        workerId: workers[1]._id,
        binIds: [bins[3]._id, bins[4]._id],
        date: today,
        status: 'pending',
        area: 'South District',
        estimatedDuration: 90,
        distanceKm: 6.2,
        truckId: 'TR-102',
        totalBins: 2,
        collectedBins: 0,
        pendingBins: 2
      },
      {
        routeId: 'ROUTE-003',
        name: 'East District Morning',
        workerId: workers[2]._id,
        binIds: [bins[5]._id],
        date: today,
        status: 'pending',
        area: 'East District',
        estimatedDuration: 60,
        distanceKm: 4.0,
        truckId: 'TR-103',
        totalBins: 1,
        collectedBins: 0,
        pendingBins: 1
      }
    ]);
    console.log(`✅ Created ${routes.length} routes`);

    // Update workers with assigned routes
    await User.findByIdAndUpdate(workers[0]._id, { assignedRoutes: [routes[0]._id] });
    await User.findByIdAndUpdate(workers[1]._id, { assignedRoutes: [routes[1]._id] });
    await User.findByIdAndUpdate(workers[2]._id, { assignedRoutes: [routes[2]._id] });

    // Create Active Sessions
    console.log('📊 Creating active sessions...');
    const sessions = await Session.create([
      {
        workerId: workers[0]._id,
        sessionDate: today,
        startTime: new Date(today.setHours(8, 0, 0, 0)),
        status: 'active',
        routeIds: [routes[0]._id],
        totalBins: 3,
        binsCollected: 0,
        binsPending: 3,
        truckId: 'TR-101'
      },
      {
        workerId: workers[1]._id,
        sessionDate: today,
        startTime: new Date(today.setHours(8, 30, 0, 0)),
        status: 'active',
        routeIds: [routes[1]._id],
        totalBins: 2,
        binsCollected: 0,
        binsPending: 2,
        truckId: 'TR-102'
      }
    ]);
    console.log(`✅ Created ${sessions.length} active sessions`);

    // Create Sample Collection Records (past collections)
    console.log('📝 Creating sample collection records...');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const collections = await CollectionRecord.create([
      {
        binId: bins[0]._id,
        binCode: 'BIN-001',
        workerId: workers[0]._id,
        wasteType: 'recyclable',
        weight: 8.5,
        fillLevel: 80,
        date: yesterday,
        area: 'North District',
        residentId: residents[0]._id,
        residentName: residents[0].name,
        residentAddress: residents[0].address,
        starPointsAwarded: 85,
        paymentAmount: 4.25,
        status: 'collected',
        notes: 'Good quality recyclables'
      },
      {
        binId: bins[1]._id,
        binCode: 'BIN-002',
        workerId: workers[0]._id,
        wasteType: 'organic',
        weight: 5.2,
        fillLevel: 60,
        date: yesterday,
        area: 'North District',
        residentId: residents[0]._id,
        residentName: residents[0].name,
        residentAddress: residents[0].address,
        starPointsAwarded: 26,
        paymentAmount: 1.04,
        status: 'collected',
        notes: 'Composable waste'
      }
    ]);
    console.log(`✅ Created ${collections.length} sample collection records`);

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Workers: ${workers.length}`);
    console.log(`   Residents: ${residents.length}`);
    console.log(`   Bins: ${bins.length}`);
    console.log(`   Routes: ${routes.length}`);
    console.log(`   Sessions: ${sessions.length}`);
    console.log(`   Collections: ${collections.length}`);
    
    console.log('\n🔑 Test Credentials:');
    console.log('   Worker Login:');
    console.log('   - Email: john@ecowaste.com');
    console.log('   - Password: password123');
    console.log('\n   - Email: sarah@ecowaste.com');
    console.log('   - Password: password123');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

// Run seed if called directly
if (require.main === module) {
  seedWorkerData()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedWorkerData;
