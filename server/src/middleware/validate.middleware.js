'use strict';

const fs = require('fs');
const { body, validationResult } = require('express-validator');

/**
 * Validation rules for login
 */
const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Validation rules for creating/updating a product
 */
const validateProduct = [
  body('product_name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 100 })
    .withMessage('Product name must not exceed 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),

  body('category')
    .isIn(['Men', 'Women', 'Kids', 'Unisex'])
    .withMessage('Category must be one of: Men, Women, Kids, Unisex'),

  body('sub_category')
    .trim()
    .notEmpty()
    .withMessage('Sub-category is required'),

  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),

  body('fabric')
    .trim()
    .notEmpty()
    .withMessage('Fabric is required'),

  body('sizes_available')
    .optional()
    .customSanitizer((val) => {
      if (!val) return [];
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return val.split(',').map((s) => s.trim()).filter(Boolean);
        }
      }
      return Array.isArray(val) ? val : [val];
    })
    .isArray()
    .withMessage('sizes_available must be an array'),

  body('sizes_available.*')
    .optional()
    .isIn(['S', 'M', 'L', 'XL', 'XXL', 'Free Size'])
    .withMessage('Each size must be one of: S, M, L, XL, XXL, Free Size'),
];

/**
 * Middleware to check validation results and return 422 if errors exist
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Clean up uploaded file if validation failed
    if (req.file && req.file.path) {
      try {
        fs.unlink(req.file.path, () => {});
      } catch {
        // ignore deletion error
      }
    }

    const errorDetails = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    const message = errorDetails.map((e) => e.message).join('. ');

    return res.status(422).json({
      success: false,
      message: message || 'Validation failed',
      errors: errorDetails,
    });
  }
  next();
};

module.exports = { validateLogin, validateProduct, handleValidationErrors };
