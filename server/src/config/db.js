'use strict';

const mongoose = require('mongoose');

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 5000;

let retryCount = 0;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('[DB] MONGO_URI is not defined in environment variables.');
    process.exit(1);
  }

  const options = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  };

  const attemptConnection = async () => {
    try {
      const conn = await mongoose.connect(mongoUri, options);
      console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
      retryCount = 0; // reset on successful connection
    } catch (err) {
      retryCount += 1;
      console.error(`[DB] Connection attempt ${retryCount} failed: ${err.message}`);

      if (retryCount < MAX_RETRIES) {
        console.log(`[DB] Retrying in ${RETRY_INTERVAL_MS / 1000}s...`);
        setTimeout(attemptConnection, RETRY_INTERVAL_MS);
      } else {
        console.error('[DB] Max retries reached. Exiting.');
        process.exit(1);
      }
    }
  };

  mongoose.connection.on('disconnected', () => {
    console.warn('[DB] MongoDB disconnected. Attempting to reconnect...');
    if (retryCount < MAX_RETRIES) {
      setTimeout(attemptConnection, RETRY_INTERVAL_MS);
    }
  });

  mongoose.connection.on('error', (err) => {
    console.error(`[DB] MongoDB connection error: ${err.message}`);
  });

  await attemptConnection();
};

module.exports = connectDB;
