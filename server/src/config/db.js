'use strict';

const mongoose = require('mongoose');

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 5000;

let retryCount = 0;
let listenersAttached = false;

const attachListeners = (attemptConnection) => {
  if (listenersAttached) return;
  listenersAttached = true;

  mongoose.connection.on('disconnected', () => {
    console.warn('[DB] MongoDB disconnected.');
    if (process.env.VERCEL !== '1' && retryCount < MAX_RETRIES) {
      setTimeout(attemptConnection, RETRY_INTERVAL_MS);
    }
  });

  mongoose.connection.on('error', (err) => {
    console.error(`[DB] MongoDB connection error: ${err.message}`);
  });
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (global._luxeDrapeMongoosePromise) {
    return global._luxeDrapeMongoosePromise;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    const err = new Error('MONGO_URI is not defined in environment variables.');
    console.error(`[DB] ${err.message}`);
    if (process.env.VERCEL === '1') {
      throw err;
    }
    process.exit(1);
  }

  const options = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  };

  if (process.env.VERCEL === '1') {
    global._luxeDrapeMongoosePromise = mongoose
      .connect(mongoUri, options)
      .then((conn) => {
        console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
        return conn.connection;
      })
      .catch((err) => {
        global._luxeDrapeMongoosePromise = null;
        throw err;
      });

    return global._luxeDrapeMongoosePromise;
  }

  const attemptConnection = async () => {
    try {
      const conn = await mongoose.connect(mongoUri, options);
      console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
      retryCount = 0; // reset on successful connection
      return conn.connection;
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

  attachListeners(attemptConnection);
  await attemptConnection();
  return mongoose.connection;
};

module.exports = connectDB;
