'use strict';

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../public/uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

/**
 * Sanitize a filename:
 * - Replace spaces with underscores
 * - Strip any character that is not alphanumeric, underscore, hyphen, or dot
 */
const sanitizeFilename = (filename) => {
  return filename
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '');
};

// Disk storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const sanitized = sanitizeFilename(file.originalname);
    const uniqueFilename = `${Date.now()}-${sanitized}`;
    cb(null, uniqueFilename);
  },
});

// File filter: allow only images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError('LIMIT_UNEXPECTED_FILE', `Only image files are allowed (jpeg, png, webp, gif). Received: ${file.mimetype}`),
      false
    );
  }
};

// Multer instance: single image upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
});

module.exports = { upload };
