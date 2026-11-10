'use strict';

const mongoose = require('mongoose');

/**
 * Generates a unique product number: PRD-<timestamp>-<4 random digits>
 */
const generateProductNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `PRD-${timestamp}-${random}`;
};

const CATEGORIES = ['Men', 'Women', 'Kids', 'Unisex'];

const SUB_CATEGORIES = [
  'Shirt',
  'Pant',
  'Jacket',
  'Dress',
  'Skirt',
  'Shorts',
  'Hoodie',
  'Blazer',
  'Kurta',
  'Saree',
  'Lehenga',
  'T-Shirt',
  'Jeans',
  'Suit',
  'Leggings',
  'Sweatshirt',
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

const productSchema = new mongoose.Schema(
  {
    product_number: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    product_name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name must not exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description must not exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: `Category must be one of: ${CATEGORIES.join(', ')}`,
      },
    },
    sub_category: {
      type: String,
      required: [true, 'Sub-category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    sizes_available: {
      type: [
        {
          type: String,
          enum: {
            values: SIZES,
            message: `Size must be one of: ${SIZES.join(', ')}`,
          },
        },
      ],
      default: [],
    },
    fabric: {
      type: String,
      required: [true, 'Fabric is required'],
      trim: true,
    },
    image_path: {
      type: String,
      required: [true, 'Image is required'],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate product_number if not provided
productSchema.pre('save', function (next) {
  if (!this.product_number) {
    this.product_number = generateProductNumber();
  }
  next();
});

// Indexes for query performance
productSchema.index({ category: 1 });
productSchema.index({ sub_category: 1 });
productSchema.index({ product_name: 'text' });
productSchema.index({ is_active: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
