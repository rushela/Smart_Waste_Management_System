const request = require('supertest');
const app = require('..');

describe('Auth', () => {
  it('registers and logs in a user', async () => {
    const email = `user${Date.now()}@test.com`;
    const res1 = await request(app).post('/api/auth/register').send({ name: 'Test', email, password: 'secret123' });
    expect(res1.status).toBe(201);
    expect(res1.body.token).toBeDefined();

    const res2 = await request(app).post('/api/auth/login').send({ email, password: 'secret123' });
    expect(res2.status).toBe(200);
    expect(res2.body.token).toBeDefined();
  });
});
