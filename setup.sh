#!/bin/bash

# Setup script for Mentor AI Universe
# This script will help you set up the project quickly

echo "🚀 Setting up Mentor AI Universe..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check if backend/.env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found"
    echo "📝 Creating backend/.env from backend/.env.example..."
    
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo "✅ Created backend/.env"
        echo ""
        echo "⚠️  IMPORTANT: Please edit backend/.env and add your actual credentials:"
        echo "   - SUPABASE_URL"
        echo "   - SUPABASE_ANON_KEY"
        echo "   - SUPABASE_SERVICE_ROLE_KEY"
        echo "   - NVIDIA_API_KEY (optional)"
        echo "   - OPENAI_API_KEY (optional)"
        echo ""
    else
        echo "❌ backend/.env.example not found"
        exit 1
    fi
else
    echo "✅ backend/.env already exists"
    echo ""
fi

echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your actual credentials"
echo "2. Run 'npm run dev:all' to start the development server"
echo ""
echo "For more information, see SETUP_GUIDE.md"

