#!/bin/bash

# Install dependencies
npm install

# Try to build TypeScript
echo "Attempting to build TypeScript..."
npm run build || echo "TypeScript build failed, will use server.js instead"

# Check if dist/server.js exists
if [ -f "dist/server.js" ]; then
  echo "TypeScript build successful, will use dist/server.js"
else
  echo "Using server.js as fallback"
fi

echo "Build completed"
