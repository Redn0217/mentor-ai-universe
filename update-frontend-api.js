/**
 * This script updates the frontend API URL to point to your Render backend
 * Run this script after deploying your backend to Render
 * 
 * Usage: node update-frontend-api.js <RENDER_BACKEND_URL>
 * Example: node update-frontend-api.js https://internsify-backend.onrender.com
 */

import fs from 'fs';
import path from 'path';

const renderBackendUrl = process.argv[2];

if (!renderBackendUrl) {
  console.error('Please provide the Render backend URL');
  console.error('Usage: node update-frontend-api.js <RENDER_BACKEND_URL>');
  process.exit(1);
}

// Update the openaiService.ts file
const openaiServicePath = path.join('src', 'services', 'openaiService.ts');
let openaiServiceContent = fs.readFileSync(openaiServicePath, 'utf8');

// Replace the proxy URL
openaiServiceContent = openaiServiceContent.replace(
  "const proxyUrl = '/api/chat';",
  `const proxyUrl = process.env.NODE_ENV === 'production' ? '${renderBackendUrl}/api/chat' : '/api/chat';`
);

fs.writeFileSync(openaiServicePath, openaiServiceContent);
console.log(`Updated ${openaiServicePath} to use Render backend URL: ${renderBackendUrl}`);

console.log('Frontend API URL updated successfully!');
