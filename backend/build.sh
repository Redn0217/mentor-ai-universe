#!/bin/bash

# Install dependencies
npm install

# Install cross-env globally for production
npm install -g cross-env

# Ensure config directory exists
mkdir -p src/config

# Make sure CommonJS version of env.js exists
if [ ! -f "src/config/env.js" ]; then
  echo "Creating CommonJS version of env.js..."
  echo "// CommonJS version of env.ts for compatibility
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const config = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  nvidiaApiKey: process.env.NVIDIA_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
};

module.exports = { config };" > src/config/env.js
fi

# Try to build TypeScript
echo "Attempting to build TypeScript..."
npm run build || echo "TypeScript build failed, will use server.js instead"

# Check if dist/server.js exists
if [ -f "dist/server.js" ]; then
  echo "TypeScript build successful, will use dist/server.js"
else
  echo "Using server.js as fallback"

  # Make sure server.js is executable
  chmod +x server.js
fi

# Create a start.sh script that doesn't rely on cross-env
echo "#!/bin/bash
export NODE_ENV=production
if [ -f \"dist/server.js\" ]; then
  node dist/server.js
else
  node server.js
fi" > start.sh

# Make start.sh executable
chmod +x start.sh

echo "Build completed"
