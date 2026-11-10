'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * POST /api/auth/login
 * Authenticates a user and sets an HTTP-only JWT cookie.
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user by username, explicitly select password (it's excluded by default)
    const user = await User.findOne({ username: username.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    // Sign JWT
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    // Set HTTP-only cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE_MS,
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 * Clears the JWT cookie.
 */
const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

/**
 * GET /api/auth/me
 * Returns the currently authenticated user (from protect middleware).
 */
const me = (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  });
};

module.exports = { login, logout, me };
