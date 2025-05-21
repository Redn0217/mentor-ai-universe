/**
 * This script prepares the build files for Hostinger deployment
 * It copies the .htaccess and 404.html files to the dist directory
 * 
 * Usage: node prepare-hostinger.js
 */

import fs from 'fs';
import path from 'path';

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  console.error('Error: dist directory not found. Run npm run build first.');
  process.exit(1);
}

// Copy .htaccess to dist
try {
  fs.copyFileSync('.htaccess', 'dist/.htaccess');
  console.log('Copied .htaccess to dist directory');
} catch (error) {
  console.error('Error copying .htaccess:', error);
  process.exit(1);
}

// Copy 404.html to dist
try {
  fs.copyFileSync('404.html', 'dist/404.html');
  console.log('Copied 404.html to dist directory');
} catch (error) {
  console.error('Error copying 404.html:', error);
  process.exit(1);
}

console.log('Files prepared for Hostinger deployment!');
console.log('Upload the contents of the dist directory to your Hostinger hosting.');
