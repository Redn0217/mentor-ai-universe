/**
 * This script updates the API URL in the apiService.ts file
 * Run this script after deploying your backend to Render
 * 
 * Usage: node update-api-url.js <RENDER_BACKEND_URL>
 * Example: node update-api-url.js https://internsify-backend.onrender.com
 */

import fs from 'fs';
import path from 'path';

const renderBackendUrl = process.argv[2];

if (!renderBackendUrl) {
  console.error('Please provide the Render backend URL');
  console.error('Usage: node update-api-url.js <RENDER_BACKEND_URL>');
  process.exit(1);
}

// Update the apiService.ts file
const apiServicePath = path.join('src', 'services', 'apiService.ts');
let apiServiceContent = fs.readFileSync(apiServicePath, 'utf8');

// Replace the API_BASE_URL
apiServiceContent = apiServiceContent.replace(
  /const API_BASE_URL = '.*';/,
  `const API_BASE_URL = '${renderBackendUrl}'; // Your Render backend URL`
);

fs.writeFileSync(apiServicePath, apiServiceContent);
console.log(`Updated ${apiServicePath} to use Render backend URL: ${renderBackendUrl}`);

// Update the openaiService.ts file
const openaiServicePath = path.join('src', 'services', 'openaiService.ts');
let openaiServiceContent = fs.readFileSync(openaiServicePath, 'utf8');

// Replace the API_BASE_URL
openaiServiceContent = openaiServiceContent.replace(
  /const API_BASE_URL = '.*';/,
  `const API_BASE_URL = '${renderBackendUrl}'; // Your Render backend URL`
);

fs.writeFileSync(openaiServicePath, openaiServiceContent);
console.log(`Updated ${openaiServicePath} to use Render backend URL: ${renderBackendUrl}`);

console.log('Frontend API URLs updated successfully!');
