/**
 * Basic tests for Worker Waste Collection Module
 * Run with: npm test (after configuring Jest) or node backend/tests/collection.test.js
 */

const mongoose = require('mongoose');
const Resident = require('../models/Resident');
const Bin = require('../models/Bin');
const CollectionHistory = require('../models/CollectionHistory');

// Simple test runner
const tests = [];
let passedTests = 0;
let failedTests = 0;

const test = (description, fn) => {
  tests.push({ description, fn });
};

const expect = (actual) => ({
  toBe: (expected) => {
    if (actual !== expected) {
      throw new Error(`Expected ${expected}, got ${actual}`);
    }
  },
  toBeGreaterThan: (expected) => {
    if (actual <= expected) {
      throw new Error(`Expected ${actual} to be greater than ${expected}`);
    }
  },
  toBeDefined: () => {
    if (actual === undefined) {
      throw new Error(`Expected value to be defined`);
    }
  },
  toEqual: (expected) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
  }
});

// Test Suite
test('Resident model should validate required fields', async () => {
  const resident = new Resident({
    name: 'Test User',
    address: '123 Test St',
    email: 'test@test.com',
    phone: '+1234567890'
  });
  
  const error = resident.validateSync();
  expect(error).toBe(undefined);
});

test('Resident should default star points and balance to 0', async () => {
  const resident = new Resident({
    name: 'Test User',
    address: '123 Test St',
    email: 'test2@test.com',
    phone: '+1234567890'
  });
  
  expect(resident.starPoints).toBe(0);
  expect(resident.outstandingBalance).toBe(0);
});

test('Bin should validate status enum', async () => {
  const resident = await Resident.create({
    name: 'Test User',
    address: '123 Test St',
    email: 'test3@test.com',
    phone: '+1234567890'
  });

  const bin = new Bin({
    binID: 'TEST-001',
    resident: resident._id,
    status: 'emptied'
  });
  
  const error = bin.validateSync();
  expect(error).toBe(undefined);
});

test('Bin should convert binID to uppercase', async () => {
  const resident = await Resident.create({
    name: 'Test User',
    address: '123 Test St',
    email: 'test4@test.com',
    phone: '+1234567890'
  });

  const bin = new Bin({
    binID: 'test-002',
    resident: resident._id
  });
  
  expect(bin.binID).toBe('TEST-002');
});

test('CollectionHistory should validate waste type enum', async () => {
  const resident = await Resident.create({
    name: 'Test User',
    address: '123 Test St',
    email: 'test5@test.com',
    phone: '+1234567890'
  });

  const collection = new CollectionHistory({
    binID: 'TEST-003',
    resident: resident._id,
    wasteType: 'recyclable',
    status: 'collected'
  });
  
  const error = collection.validateSync();
  expect(error).toBe(undefined);
});

test('CollectionHistory should set starPoints to 0 for non-recyclable', async () => {
  const resident = await Resident.create({
    name: 'Test User',
    address: '123 Test St',
    email: 'test6@test.com',
    phone: '+1234567890'
  });

  const collection = new CollectionHistory({
    binID: 'TEST-004',
    resident: resident._id,
    wasteType: 'non_recyclable',
    status: 'collected',
    weight: 5,
    starPointsAwarded: 50 // Should be overridden to 0 by pre-save hook
  });
  
  await collection.save();
  expect(collection.starPointsAwarded).toBe(0);
});

test('CollectionHistory should set payment to 0 for recyclable', async () => {
  const resident = await Resident.create({
    name: 'Test User',
    address: '123 Test St',
    email: 'test7@test.com',
    phone: '+1234567890'
  });

  const collection = new CollectionHistory({
    binID: 'TEST-005',
    resident: resident._id,
    wasteType: 'recyclable',
    status: 'collected',
    weight: 5,
    payment: 25 // Should be overridden to 0 by pre-save hook
  });
  
  await collection.save();
  expect(collection.payment).toBe(0);
});

test('Star points calculation: 5.5 kg recyclable = 55 points', () => {
  const weight = 5.5;
  const starPoints = Math.round(weight * 10);
  expect(starPoints).toBe(55);
});

test('Payment calculation: 3.2 kg non-recyclable = 16.00', () => {
  const weight = 3.2;
  const payment = Math.round(weight * 5 * 100) / 100;
  expect(payment).toBe(16.00);
});

test('Bin updateStatus method should update status and lastCollection', async () => {
  const resident = await Resident.create({
    name: 'Test User',
    address: '123 Test St',
    email: 'test8@test.com',
    phone: '+1234567890'
  });

  const bin = await Bin.create({
    binID: 'TEST-006',
    resident: resident._id,
    status: 'pending'
  });
  
  bin.updateStatus('emptied');
  expect(bin.status).toBe('emptied');
  expect(bin.lastCollection).toBeDefined();
});

// Test Runner
async function runTests() {
  console.log('🧪 Running Worker Waste Collection Module Tests\n');
  console.log('='.repeat(60));
  
  try {
    // Connect to test database
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/waste_management_test';
    await mongoose.connect(mongoURI);
    console.log('✓ Connected to test database\n');

    // Clear test data
    await Resident.deleteMany({ email: /test.*@test\.com/ });
    await Bin.deleteMany({ binID: /TEST-.*/ });
    await CollectionHistory.deleteMany({ binID: /TEST-.*/ });

    // Run all tests
    for (const { description, fn } of tests) {
      try {
        await fn();
        console.log(`✓ ${description}`);
        passedTests++;
      } catch (error) {
        console.log(`✗ ${description}`);
        console.log(`  Error: ${error.message}`);
        failedTests++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\nTests completed: ${passedTests} passed, ${failedTests} failed`);
    
    if (failedTests === 0) {
      console.log('✅ All tests passed!\n');
    } else {
      console.log('❌ Some tests failed\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Test suite error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✓ Disconnected from database\n');
  }
}

// Run if executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
