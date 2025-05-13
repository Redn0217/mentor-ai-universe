#!/bin/bash

# Install dependencies
npm install

# Install cross-env globally for production
npm install -g cross-env

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
