'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Resolve uploads directory safely across local and Vercel serverless environments.
 * Vercel's /var/task bundle is read-only; /tmp is the writable ephemeral directory.
 */
const getUploadsDir = () => {
  if (process.env.VERCEL === '1') {
    return path.join('/tmp', 'uploads');
  }
  return path.join(__dirname, '../../public/uploads');
};

const ensureUploadsDir = () => {
  const uploadsDir = getUploadsDir();
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

module.exports = {
  getUploadsDir,
  ensureUploadsDir,
};
