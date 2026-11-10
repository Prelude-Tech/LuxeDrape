'use strict';

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const { login, logout, me } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateLogin, handleValidationErrors } = require('../middleware/validate.middleware');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 15 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' },
});

// POST /api/auth/login
router.post('/login', loginLimiter, validateLogin, handleValidationErrors, login);

// POST /api/auth/logout  (protected — must be logged in to log out)
router.post('/logout', protect, logout);

// GET /api/auth/me
router.get('/me', protect, me);

module.exports = router;

