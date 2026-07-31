const request = require('supertest');
const app = require('../src/app');

describe('Auth API', () => {

  it('should register a new user', async () => {

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Ahmed',
        email: 'ahmed@test.com',
        password: '123456'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.email).toBe('ahmed@test.com');
  });

  it('should not register duplicate email', async () => {

    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Ahmed',
        email: 'ahmed@test.com',
        password: '123456'
      });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Ahmed',
        email: 'ahmed@test.com',
        password: '123456'
      });

    expect(res.statusCode).toBe(400);
  });

  it('should login successfully', async () => {

    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Ahmed',
        email: 'ahmed@test.com',
        password: '123456'
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'ahmed@test.com',
        password: '123456'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should reject invalid password', async () => {

    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Ahmed',
        email: 'ahmed@test.com',
        password: '123456'
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'ahmed@test.com',
        password: '111111'
      });

    expect(res.statusCode).toBe(401);
  });

});