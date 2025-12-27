<<<<<<< HEAD
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, 'dist');
const outputPath = path.join(__dirname, 'hostinger-deploy.zip');

console.log('📦 Preparing Hostinger deployment package...');

// Check if dist folder exists
if (!fs.existsSync(distPath)) {
  console.error('❌ Error: dist folder not found. Run "npm run build" first.');
  process.exit(1);
}

// Create a write stream for the zip file
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

// Listen for archive events
output.on('close', () => {
  const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`✅ Deployment package created: hostinger-deploy.zip (${sizeInMB} MB)`);
  console.log('\n📋 Next steps:');
  console.log('1. Go to Hostinger File Manager');
  console.log('2. Navigate to public_html/');
  console.log('3. Delete old files (index.html, assets/, etc.)');
  console.log('4. Upload hostinger-deploy.zip');
  console.log('5. Extract the zip file');
  console.log('6. Make sure .htaccess is present');
  console.log('\n🚀 Your site will be live at https://internsify.in');
});

archive.on('error', (err) => {
  console.error('❌ Error creating zip:', err);
  process.exit(1);
});

// Pipe archive data to the file
archive.pipe(output);

// Add all files from dist folder
archive.directory(distPath, false);

// Finalize the archive
archive.finalize();

=======
import { copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('📦 Preparing build for Hostinger deployment...\n');

// Files to copy to dist folder
const filesToCopy = [
  { src: '.htaccess', dest: 'dist/.htaccess', description: 'Apache configuration' },
  { src: '404.html', dest: 'dist/404.html', description: 'Error page' }
];

let successCount = 0;
let errorCount = 0;

// Copy each file
filesToCopy.forEach(({ src, dest, description }) => {
  const srcPath = join(__dirname, src);
  const destPath = join(__dirname, dest);
  
  try {
    if (!existsSync(srcPath)) {
      console.log(`⚠️  Warning: ${src} not found, skipping...`);
      errorCount++;
      return;
    }
    
    copyFileSync(srcPath, destPath);
    console.log(`✅ Copied ${description}: ${src} → ${dest}`);
    successCount++;
  } catch (error) {
    console.error(`❌ Error copying ${src}:`, error.message);
    errorCount++;
  }
});

console.log('\n' + '='.repeat(50));
console.log(`✨ Preparation complete!`);
console.log(`   ✅ ${successCount} file(s) copied successfully`);
if (errorCount > 0) {
  console.log(`   ❌ ${errorCount} file(s) failed`);
}
console.log('='.repeat(50));

console.log('\n📋 Next steps:');
console.log('1. Compress the dist/ folder into a ZIP file');
console.log('2. Upload to Hostinger File Manager');
console.log('3. Extract in public_html folder');
console.log('4. Verify .htaccess is present in public_html\n');

// Exit with error code if any files failed
if (errorCount > 0) {
  process.exit(1);
}

>>>>>>> 83585c9 (Many fixes and bot)
