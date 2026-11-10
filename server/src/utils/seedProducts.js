'use strict';

/**
 * Seed Script — populates initial sample products matching the PRD.
 * Usage: node src/utils/seedProducts.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const Product = require('../models/Product.model');

const SAMPLE_PRODUCTS = [
  {
    product_number: 'PRD-WOM-SAR-001',
    product_name: 'Mulberry Banarasi Brocade Saree',
    description: 'Woven with pure gold and silver zari on fine mulberry silk, featuring ornate floral motifs and an opulent pallu designed for ceremonial occasions.',
    category: 'Women',
    sub_category: 'Saree',
    price: 24999,
    sizes_available: ['Free Size'],
    fabric: 'Pure Mulberry Katan Silk',
    image_path: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    is_active: true,
  },
  {
    product_number: 'PRD-WOM-LEH-002',
    product_name: 'Champagne Gold Zardozi Bridal Lehenga',
    description: 'Intricately hand-embroidered with micro-pearls and zardozi threadwork over raw silk, paired with a sheer scalloped organza dupatta.',
    category: 'Women',
    sub_category: 'Lehenga',
    price: 78500,
    sizes_available: ['S', 'M', 'L'],
    fabric: 'Raw Silk & Hand-dyed Organza',
    image_path: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    is_active: true,
  },
  {
    product_number: 'PRD-MEN-SHT-003',
    product_name: 'Bandh-Collar Tailored Linen Shirt',
    description: 'Crisp hand-loomed flax linen shirt with mother-of-pearl buttons and a refined mandarin bandh collar designed for summer evenings.',
    category: 'Men',
    sub_category: 'Shirt',
    price: 6499,
    sizes_available: ['M', 'L', 'XL'],
    fabric: '100% Belgian Flax Linen',
    image_path: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    is_active: true,
  },
  {
    product_number: 'PRD-MEN-KTA-004',
    product_name: 'Chanderi Silk Pintuck Festive Kurta',
    description: 'Fluid Chanderi silk kurta with delicate tone-on-tone pintuck tailoring along the placket, complemented with churidar styling.',
    category: 'Men',
    sub_category: 'Kurta',
    price: 11999,
    sizes_available: ['S', 'M', 'L', 'XL', 'XXL'],
    fabric: 'Pure Chanderi Silk Blend',
    image_path: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
    is_active: true,
  },
  {
    product_number: 'PRD-KID-DRS-005',
    product_name: 'Miniature Cotton Silk Festive Angrakha Set',
    description: 'Soft hypoallergenic cotton-silk angrakha with hand-blocked gold bootis and breathable organic lining tailored for celebration with ease.',
    category: 'Kids',
    sub_category: 'Dress',
    price: 4999,
    sizes_available: ['S', 'M', 'L'],
    fabric: 'Organic Cotton Silk',
    image_path: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80',
    is_active: true,
  },
];

const seedProducts = async () => {
  try {
    console.log('🌱  Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅  Connected to MongoDB');

    for (const prod of SAMPLE_PRODUCTS) {
      const existing = await Product.findOne({ product_name: prod.product_name });
      if (existing) {
        console.log(`⚠️   Product "${prod.product_name}" already exists — skipping.`);
        continue;
      }
      const newProd = new Product(prod);
      await newProd.save();
      console.log(`✅  Indexed: ${prod.product_name} (${prod.category} -> ${prod.sub_category})`);
    }

    console.log('\n🎉  Sample catalog seeding completed successfully!');
  } catch (err) {
    console.error('❌  Product seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedProducts();
