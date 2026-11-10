'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const errorHandler = require('./utils/errorHandler');
const { ensureUploadsDir } = require('./utils/uploadsPath');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
app.set('trust proxy', 1);

// ─── Ensure uploads directory exists ─────────────────────────────────────────
const uploadsDir = ensureUploadsDir();

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow images to be served cross-origin
  })
);

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
  : null;

app.use(
  cors({
    origin: allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true, // allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ─── Static Files (uploaded images) ──────────────────────────────────────────
app.use('/uploads', express.static(uploadsDir));

// ─── Database Connection Middleware (Serverless-safe) ────────────────────────
const ensureDbMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
};

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', ensureDbMiddleware, authRoutes);
app.use('/api/products', ensureDbMiddleware, productRoutes);
app.use('/api/admin', ensureDbMiddleware, adminRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Luxe Drape API is running.',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server (Local / Traditional Host) ─────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀  Luxe Drape API running on port ${PORT}`);
    console.log(`🌍  Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗  Health: http://localhost:${PORT}/api/health\n`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = app;

