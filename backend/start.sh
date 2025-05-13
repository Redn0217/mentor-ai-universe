#!/bin/bash

# Set environment variables
export NODE_ENV=production

# Check if dist/server.js exists
if [ -f "dist/server.js" ]; then
  echo "Starting TypeScript build (dist/server.js)"
  node dist/server.js
else
  echo "Starting CommonJS fallback (server.js)"
  node server.js
fi
