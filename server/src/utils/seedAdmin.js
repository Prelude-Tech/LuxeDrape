'use strict';

/**
 * Seed Script — run once to create initial admin users.
 * Usage: node src/utils/seedAdmin.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const User = require('../models/User.model');

const ADMINS = [
  {
    username: 'master_admin',
    password: 'Admin@1234',
    role: 'master_admin',
  },
  {
    username: 'secondary_admin',
    password: 'Admin@5678',
    role: 'secondary_admin',
  },
];

const seed = async () => {
  try {
    console.log('🌱  Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅  Connected to MongoDB');

    for (const adminData of ADMINS) {
      const existing = await User.findOne({ username: adminData.username });
      if (existing) {
        console.log(`⚠️   User "${adminData.username}" already exists — skipping.`);
        continue;
      }

      const user = new User(adminData);
      await user.save(); // password is hashed by the pre-save hook
      console.log(`✅  Created ${adminData.role}: ${adminData.username}`);
    }

    console.log('\n🎉  Seed complete!');
    console.log('──────────────────────────────────────────');
    console.log('  Master Admin   → master_admin / Admin@1234');
    console.log('  Secondary Admin → secondary_admin / Admin@5678');
    console.log('──────────────────────────────────────────');
    console.log('  ⚠️  Change these passwords in production!');
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();

