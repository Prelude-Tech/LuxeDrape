'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/User.model');
const { protect, requireRole } = require('../middleware/auth.middleware');

// GET /api/admin/users  — master_admin only: list all admin accounts (no passwords)
router.get('/users', protect, requireRole('master_admin'), async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

