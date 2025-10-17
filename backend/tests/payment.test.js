const request = require('supertest');
const mongoose = require('mongoose');

// Mock auth/role
jest.mock('../middleware/auth', () => (req, res, next) => { req.user = { id: '000000000000000000000001', role: 'admin', city: 'TestCity' }; next(); });
jest.mock('../middleware/role', () => () => (req, res, next) => next());

// Mock models to avoid real DB
jest.mock('../models/PricingModel', () => ({
  findOne: jest.fn(async (q) => ({ city: 'TestCity', modelType: 'weight_based', ratePerKg: 2, flatFeeAmount: 30, recyclablePaybackRates: { plastic: 0.2 } }))
}));
jest.mock('../models/PaymentRecord', () => ({
  create: jest.fn(async (doc) => ({ _id: 'recid', ...doc })),
  aggregate: jest.fn(async () => []),
  find: jest.fn(async () => []),
  countDocuments: jest.fn(async () => 0),
  findByIdAndUpdate: jest.fn(async () => ({})),
  findByIdAndDelete: jest.fn(async () => ({ ok: true })),
  findById: jest.fn(async () => ({ _id: 'recid' }))
}));
jest.mock('../models/User', () => ({
  findByIdAndUpdate: jest.fn(async () => ({}))
}));

const app = require('../app');

describe('Payments', () => {
  test('calculate charge (weight_based)', async () => {
    const res = await request(app)
      .post('/api/payments/calc')
      .set('x-user-id', new mongoose.Types.ObjectId().toString())
      .send({ city: 'TestCity', modelType: 'weight_based', weight: 10 });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(20);
  });

  test('calculate payback', async () => {
    const res = await request(app)
      .post('/api/payments/payback')
      .set('x-user-id', new mongoose.Types.ObjectId().toString())
      .send({ city: 'TestCity', items: [{ name: 'plastic', weight: 10 }] });
    expect(res.status).toBe(201);
    expect(res.body.amount).toBe(2);
  });
});
