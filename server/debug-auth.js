process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '30d';

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./src/app');
const request = require('supertest');

(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  console.log('db connected');

  const res = await request(app).post('/api/auth/register').send({
    name: 'Admin User',
    email: 'admin@example.com',
    password: '123456',
    role: 'Admin',
  });

  console.log('status', res.status);
  console.log(res.body);

  await mongoose.disconnect();
  await mongoServer.stop();
})();
