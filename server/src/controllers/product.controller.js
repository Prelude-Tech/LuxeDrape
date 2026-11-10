'use strict';

const fs = require('fs');
const path = require('path');
const Product = require('../models/Product.model');
const { getUploadsDir } = require('../utils/uploadsPath');

/**
 * Helper: resolve the absolute path of an image given its stored image_path value.
 * image_path is stored as `/uploads/<filename>`
 */
const resolveImagePath = (imagePath) => {
  if (!imagePath) return null;
  const filename = path.basename(imagePath);
  return path.join(getUploadsDir(), filename);
};

/**
 * Helper: delete an image file from disk safely (no error thrown if file not found).
 */
const deleteImageFromDisk = (imagePath) => {
  if (!imagePath) return;
  const absPath = resolveImagePath(imagePath);
  fs.unlink(absPath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error(`[Product] Failed to delete image: ${absPath}`, err.message);
    }
  });
};

/**
 * GET /api/products
 * Public. Returns paginated products with optional filters.
 * Query params: category, sub_category, search, page, limit, is_active
 */
const getAllProducts = async (req, res, next) => {
  try {
    const { category, sub_category, search, page = 1, limit = 20, is_active } = req.query;

    const filter = {};

    if (category) {
      filter.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    if (sub_category) {
      const trimmed = sub_category.trim();
      let base = trimmed;
      if (base.toLowerCase().endsWith('es') && base.length > 3) {
        base = base.slice(0, -2);
      } else if (base.toLowerCase().endsWith('s') && !base.toLowerCase().endsWith('ss') && base.length > 2) {
        base = base.slice(0, -1);
      }
      filter.sub_category = { $regex: new RegExp(`^${base}(es|s)?$`, 'i') };
    }

    if (search) {
      filter.product_name = { $regex: search, $options: 'i' };
    }

    // By default show active products on public route
    if (is_active !== undefined) {
      filter.is_active = is_active === 'true';
    } else {
      filter.is_active = true;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/products/:id
 * Public. Returns a single product by its MongoDB ID.
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/products
 * Protected – master_admin only.
 * Creates a new product. Image file is uploaded via multer (req.file).
 */
const createProduct = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Product image is required.' });
    }

    const { product_number, product_name, description, category, sub_category, price, sizes_available, fabric, is_active } = req.body;

    // Parse sizes_available (may come as JSON string or comma-separated values)
    let parsedSizes = [];
    if (sizes_available) {
      if (Array.isArray(sizes_available)) {
        parsedSizes = sizes_available;
      } else {
        try {
          parsedSizes = JSON.parse(sizes_available);
        } catch {
          parsedSizes = sizes_available.split(',').map((s) => s.trim()).filter(Boolean);
        }
      }
    }

    const product = new Product({
      product_number: product_number || undefined,
      product_name,
      description,
      category,
      sub_category,
      price: parseFloat(price),
      sizes_available: parsedSizes,
      fabric,
      image_path: `/uploads/${req.file.filename}`,
      is_active: is_active !== undefined ? is_active === 'true' || is_active === true : true,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: product,
    });
  } catch (err) {
    // Clean up uploaded file if product save failed
    if (req.file) {
      deleteImageFromDisk(`/uploads/${req.file.filename}`);
    }
    next(err);
  }
};

/**
 * PUT /api/products/:id
 * Protected – master_admin only.
 * Partially updates a product. If a new image is uploaded, the old image is deleted.
 */
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      // Clean up newly uploaded file (if any) since we won't use it
      if (req.file) deleteImageFromDisk(`/uploads/${req.file.filename}`);
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const { product_number, product_name, description, category, sub_category, price, sizes_available, fabric, is_active } = req.body;

    // Apply updates only for provided fields
    if (product_number !== undefined) product.product_number = product_number;
    if (product_name !== undefined) product.product_name = product_name;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (sub_category !== undefined) product.sub_category = sub_category;
    if (price !== undefined) product.price = parseFloat(price);
    if (fabric !== undefined) product.fabric = fabric;
    if (is_active !== undefined) product.is_active = is_active === 'true' || is_active === true;

    if (sizes_available !== undefined) {
      let parsedSizes = [];
      if (Array.isArray(sizes_available)) {
        parsedSizes = sizes_available;
      } else {
        try {
          parsedSizes = JSON.parse(sizes_available);
        } catch {
          parsedSizes = sizes_available.split(',').map((s) => s.trim()).filter(Boolean);
        }
      }
      product.sizes_available = parsedSizes;
    }

    // Handle image replacement
    if (req.file) {
      const oldImagePath = product.image_path;
      product.image_path = `/uploads/${req.file.filename}`;
      deleteImageFromDisk(oldImagePath);
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: product,
    });
  } catch (err) {
    if (req.file) deleteImageFromDisk(`/uploads/${req.file.filename}`);
    next(err);
  }
};

/**
 * DELETE /api/products/:id
 * Protected – master_admin or secondary_admin.
 * Deletes a product and its associated image file from disk.
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const imagePath = product.image_path;
    await Product.findByIdAndDelete(req.params.id);
    deleteImageFromDisk(imagePath);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/products/stats
 * Protected – master_admin or secondary_admin.
 * Returns aggregated statistics for the admin dashboard.
 */
const getStats = async (req, res, next) => {
  try {
    const [categoryStats, totalProducts, activeProducts, inactiveProducts] = await Promise.all([
      Product.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            activeCount: { $sum: { $cond: ['$is_active', 1, 0] } },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Product.countDocuments(),
      Product.countDocuments({ is_active: true }),
      Product.countDocuments({ is_active: false }),
    ]);

    const subCategoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$sub_category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5).select('product_name category price createdAt image_path');

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          total: totalProducts,
          active: activeProducts,
          inactive: inactiveProducts,
        },
        byCategory: categoryStats,
        bySubCategory: subCategoryStats,
        recentProducts,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getStats,
};
