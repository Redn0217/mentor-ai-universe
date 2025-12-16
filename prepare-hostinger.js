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

