const request = require('supertest');
const app = require('..');

async function registerAndLogin(role = 'resident') {
  const email = `${role}${Date.now()}@test.com`;
  await request(app).post('/api/auth/register').send({ name: role, email, password: 'secret123', role });
  const login = await request(app).post('/api/auth/login').send({ email, password: 'secret123' });
  return { token: login.body.token, user: login.body.user };
}

describe('Issues', () => {
  it('resident can create issue; staff can update; admin can delete', async () => {
    const resident = await registerAndLogin('resident');
    const staff = await registerAndLogin('staff');
    const admin = await registerAndLogin('admin');

    // resident creates
    const create = await request(app)
      .post('/api/issues')
      .set('Authorization', `Bearer ${resident.token}`)
      .send({ category: 'collection', description: 'Missed collection', location: { city: 'Colombo' } });
    expect(create.status).toBe(201);
    const issueId = create.body.issue._id;

    // staff updates
    const upd = await request(app)
      .put(`/api/issues/${issueId}`)
      .set('Authorization', `Bearer ${staff.token}`)
      .send({ status: 'In Progress', assignedTo: staff.user.id });
    expect(upd.status).toBe(200);

    // admin delete
    const del = await request(app)
      .delete(`/api/issues/${issueId}`)
      .set('Authorization', `Bearer ${admin.token}`);
    expect(del.status).toBe(200);
  });
});
