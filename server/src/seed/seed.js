require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

(async () => {
  await connectDB();

  const existingAdmin = await User.findOne({ email: 'admin@example.com' });
  if (!existingAdmin) {
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: '123456',
      role: 'Admin',
    });
  }

  const existingMember = await User.findOne({ email: 'member@example.com' });
  if (!existingMember) {
    await User.create({
      name: 'Member User',
      email: 'member@example.com',
      password: '123456',
      role: 'Member',
    });
  }

  console.log('Seed data complete');
  await mongoose.disconnect();
})();
