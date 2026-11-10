'use strict';

const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getStats,
} = require('../controllers/product.controller');

const { protect, requireRole } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');
const { validateProduct, handleValidationErrors } = require('../middleware/validate.middleware');

// GET /api/products/stats  — must be before /:id to avoid "stats" being treated as an ID
router.get('/stats', protect, requireRole('master_admin', 'secondary_admin'), getStats);

// GET /api/products  — public
router.get('/', getAllProducts);

// GET /api/products/:id  — public
router.get('/:id', getProductById);

// POST /api/products  — master_admin only, multipart/form-data
router.post(
  '/',
  protect,
  requireRole('master_admin'),
  upload.single('image'),
  validateProduct,
  handleValidationErrors,
  createProduct
);

// PUT /api/products/:id  — master_admin only, optional new image
router.put(
  '/:id',
  protect,
  requireRole('master_admin'),
  upload.single('image'),
  updateProduct
);

// DELETE /api/products/:id  — master_admin or secondary_admin
router.delete('/:id', protect, requireRole('master_admin', 'secondary_admin'), deleteProduct);

module.exports = router;

