const request = require('supertest');
const express = require('express');

// Minimal app to mount router for unit test of route wiring
const reportsRouter = require('../routes/reports');
const app = express();
app.use(express.json());

// Mock auth middleware to bypass JWT for unit test
jest.mock('../middleware/auth', () => (req, res, next) => { req.user = { _id: '000000000000000000000000', role: 'admin' }; next(); });
jest.mock('../middleware/role', () => () => (req, res, next) => next());

app.use('/api/reports', reportsRouter);

describe('Reports Router', () => {
  test('GET /api/reports/trends validates query', async () => {
    const res = await request(app).get('/api/reports/trends?granularity=yearly');
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeTruthy();
  });
});
