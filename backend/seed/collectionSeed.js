/**
 * Seed script for Worker Waste Collection Module
 * 
 * This script populates the database with sample residents, bins, and collection history
 * Run with: node backend/seed/collectionSeed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Resident = require('../models/Resident');
const Bin = require('../models/Bin');
const CollectionHistory = require('../models/CollectionHistory');

// Sample data
const sampleResidents = [
  {
    name: 'John Doe',
    address: '123 Main Street, Springfield',
    email: 'john.doe@email.com',
    phone: '+1-555-0101',
    starPoints: 0,
    outstandingBalance: 0
  },
  {
    name: 'Jane Smith',
    address: '456 Oak Avenue, Springfield',
    email: 'jane.smith@email.com',
    phone: '+1-555-0102',
    starPoints: 0,
    outstandingBalance: 0
  },
  {
    name: 'Bob Johnson',
    address: '789 Pine Road, Springfield',
    email: 'bob.johnson@email.com',
    phone: '+1-555-0103',
    starPoints: 0,
    outstandingBalance: 0
  },
  {
    name: 'Alice Williams',
    address: '321 Elm Street, Springfield',
    email: 'alice.williams@email.com',
    phone: '+1-555-0104',
    starPoints: 0,
    outstandingBalance: 0
  },
  {
    name: 'Charlie Brown',
    address: '654 Maple Drive, Springfield',
    email: 'charlie.brown@email.com',
    phone: '+1-555-0105',
    starPoints: 0,
    outstandingBalance: 0
  }
];

const generateBins = (residents) => {
  const bins = [];
  residents.forEach((resident, index) => {
    // Each resident gets 2 bins (one for recyclable, one for general)
    bins.push({
      binID: `BIN-R${String(index + 1).padStart(3, '0')}`,
      resident: resident._id,
      status: 'pending'
    });
    bins.push({
      binID: `BIN-G${String(index + 1).padStart(3, '0')}`,
      resident: resident._id,
      status: 'pending'
    });
  });
  return bins;
};

const generateCollections = (residents, bins) => {
  const collections = [];
  const wasteTypes = ['recyclable', 'non_recyclable'];
  const statuses = ['collected', 'partial', 'not_collected'];
  const workers = ['WORKER-001', 'WORKER-002', 'WORKER-003'];

  // Generate 3 collections per bin (varied history)
  bins.forEach((bin, binIndex) => {
    const residentId = bin.resident;
    
    for (let i = 0; i < 3; i++) {
      const daysAgo = (3 - i) * 7; // Weekly collections
      const dateCollected = new Date();
      dateCollected.setDate(dateCollected.getDate() - daysAgo);

      const wasteType = bin.binID.includes('-R') ? 'recyclable' : 'non_recyclable';
      const status = i === 2 ? statuses[Math.floor(Math.random() * 3)] : 'collected';
      const weight = Math.random() * 10 + 1; // Random weight between 1-11 kg
      
      let starPointsAwarded = 0;
      let payment = 0;

      if (status !== 'not_collected') {
        if (wasteType === 'recyclable') {
          starPointsAwarded = Math.round(weight * 10);
        } else {
          payment = Math.round(weight * 5 * 100) / 100;
        }
      }

      collections.push({
        binID: bin.binID,
        resident: residentId,
        dateCollected,
        wasteType,
        weight: Math.round(weight * 100) / 100,
        starPointsAwarded,
        payment,
        status,
        workerId: workers[Math.floor(Math.random() * workers.length)],
        notes: status === 'partial' ? 'Overflow - partial collection' : 
               status === 'not_collected' ? 'Bin blocked by vehicle' : 
               'Regular collection'
      });
    }
  });

  return collections;
};

const updateResidentsWithRewards = async (collections) => {
  // Aggregate rewards by resident
  const rewardsByResident = {};

  collections.forEach(collection => {
    const residentId = collection.resident.toString();
    if (!rewardsByResident[residentId]) {
      rewardsByResident[residentId] = {
        starPoints: 0,
        outstandingBalance: 0
      };
    }
    rewardsByResident[residentId].starPoints += collection.starPointsAwarded;
    rewardsByResident[residentId].outstandingBalance += collection.payment;
  });

  // Update each resident
  for (const [residentId, rewards] of Object.entries(rewardsByResident)) {
    await Resident.findByIdAndUpdate(residentId, {
      starPoints: rewards.starPoints,
      outstandingBalance: rewards.outstandingBalance
    });
  }
};

const updateBinsWithLastCollection = async (collections) => {
  // Find the most recent collection for each bin
  const lastCollectionByBin = {};

  collections.forEach(collection => {
    const binID = collection.binID;
    if (!lastCollectionByBin[binID] || 
        collection.dateCollected > lastCollectionByBin[binID].dateCollected) {
      lastCollectionByBin[binID] = collection;
    }
  });

  // Update each bin
  for (const [binID, collection] of Object.entries(lastCollectionByBin)) {
    const statusMap = {
      'collected': 'emptied',
      'partial': 'partial',
      'not_collected': 'not_collected'
    };

    await Bin.findOneAndUpdate(
      { binID },
      {
        status: statusMap[collection.status],
        lastCollection: collection.dateCollected
      }
    );
  }
};

async function seed() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/waste_management';
    await mongoose.connect(mongoURI);
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    console.log('\n🗑️  Clearing existing collection data...');
    await CollectionHistory.deleteMany({});
    await Bin.deleteMany({});
    await Resident.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create residents
    console.log('\n👥 Creating residents...');
    const residents = await Resident.insertMany(sampleResidents);
    console.log(`✓ Created ${residents.length} residents`);

    // Create bins
    console.log('\n🗑️  Creating bins...');
    const binsData = generateBins(residents);
    const bins = await Bin.insertMany(binsData);
    console.log(`✓ Created ${bins.length} bins`);

    // Create collection history
    console.log('\n📋 Creating collection history...');
    const collectionsData = generateCollections(residents, bins);
    const collections = await CollectionHistory.insertMany(collectionsData);
    console.log(`✓ Created ${collections.length} collection records`);

    // Update residents with accumulated rewards
    console.log('\n⭐ Updating resident rewards...');
    await updateResidentsWithRewards(collections);
    console.log('✓ Updated resident star points and balances');

    // Update bins with last collection info
    console.log('\n🔄 Updating bin statuses...');
    await updateBinsWithLastCollection(collections);
    console.log('✓ Updated bin statuses and last collection dates');

    // Display summary
    console.log('\n' + '='.repeat(50));
    console.log('SEED SUMMARY');
    console.log('='.repeat(50));
    
    const updatedResidents = await Resident.find();
    console.log('\nResidents:');
    updatedResidents.forEach(r => {
      console.log(`  - ${r.name}: ${r.starPoints} ⭐ | $${r.outstandingBalance.toFixed(2)} balance`);
    });

    const binsByStatus = await Bin.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    console.log('\nBins by Status:');
    binsByStatus.forEach(b => {
      console.log(`  - ${b._id}: ${b.count}`);
    });

    const collectionsByType = await CollectionHistory.aggregate([
      { $group: { _id: '$wasteType', count: { $sum: 1 } } }
    ]);
    console.log('\nCollections by Type:');
    collectionsByType.forEach(c => {
      console.log(`  - ${c._id}: ${c.count}`);
    });

    console.log('\n✅ Seed completed successfully!\n');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB\n');
  }
}

// Run seed
seed();
