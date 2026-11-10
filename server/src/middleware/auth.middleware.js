'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

/**
 * protect middleware
 * Reads JWT from HTTP-only cookie named `token` OR Authorization Bearer header.
 * Verifies the token and attaches the user document to req.user.
 */
const protect = async (req, res, next) => {
  try {
    let token = null;

    // 1. Try to get token from HTTP-only cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 2. Fall back to Authorization Bearer header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Please log in to access this resource.',
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
      }
      return res.status(401).json({ success: false, message: 'Invalid token. Please log in again.' });
    }

    // Find user and exclude password
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * requireRole factory
 * Returns middleware that checks whether req.user.role is in the allowed roles array.
 * Must be used after protect middleware.
 *
 * @param {...string} roles - Allowed role(s)
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roles.join(', ')}.`,
      });
    }
    next();
  };
};

module.exports = { protect, requireRole };
