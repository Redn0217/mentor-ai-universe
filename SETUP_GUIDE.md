# 🚀 Setup Guide for Mentor AI Universe

This guide will help you set up the project on your local machine after cloning the repository.

## Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (comes with Node.js)
- **Git**

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mentor-ai-universe
```

### 2. Install All Dependencies (One Command!)

```bash
npm install
```

This will automatically install:
- ✅ Frontend dependencies
- ✅ Backend dependencies (via postinstall script)

### 3. Set Up Environment Variables

The repository includes example environment files, but you need to create the actual `.env` files:

#### **Backend Environment Setup**

```bash
# Navigate to backend folder
cd backend

# Copy the example file
cp .env.example .env
```

**For Windows (PowerShell):**
```powershell
cd backend
Copy-Item .env.example .env
```

#### **Edit the `.env` file**

Open `backend/.env` and replace the placeholder values with actual credentials:

```env
PORT=3003
NODE_ENV=development

# API Keys
OPENAI_API_KEY=your-openai-api-key-here
NVIDIA_API_KEY=your-nvidia-api-key-here

# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

**Where to get these values:**
- **Supabase credentials**: Create a free account at [supabase.com](https://supabase.com) and create a new project
  - `SUPABASE_URL`: Found in Project Settings → API
  - `SUPABASE_ANON_KEY`: Found in Project Settings → API
  - `SUPABASE_SERVICE_ROLE_KEY`: Found in Project Settings → API (keep this secret!)
- **NVIDIA API Key**: Get from [NVIDIA API Catalog](https://build.nvidia.com/)
- **OpenAI API Key**: Get from [OpenAI Platform](https://platform.openai.com/)

### 4. Run the Development Server

```bash
# Make sure you're in the root directory
cd ..

# Run both frontend and backend
npm run dev:all
```

This will start:
- **Frontend**: http://localhost:8080 (or 8081 if 8080 is busy)
- **Backend**: http://localhost:3003

## Available Scripts

### Root Directory

```bash
# Run frontend only
npm run dev

# Run backend only
npm run dev:backend

# Run both frontend and backend
npm run dev:all

# Build for production
npm run build:all
```

### Backend Directory

```bash
cd backend

# Run backend in development mode
npm run dev

# Build backend
npm run build

# Run backend in production mode
npm start
```

## Troubleshooting

### Error: "supabaseUrl is required"

**Problem**: The `.env` file is missing or not configured properly.

**Solution**: 
1. Make sure `backend/.env` exists
2. Verify it contains valid `SUPABASE_URL` and `SUPABASE_ANON_KEY`
3. Restart the development server

### Port Already in Use

**Problem**: Port 8080 or 3003 is already in use.

**Solution**: 
- Vite will automatically try another port (like 8081)
- For backend, change `PORT` in `backend/.env`

### Dependencies Not Installing

**Problem**: `npm install` fails.

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json backend/node_modules backend/package-lock.json

# Reinstall
npm install
```

## Security Notes

⚠️ **Important**:
- Never commit `.env` files to Git
- Keep your `SUPABASE_SERVICE_ROLE_KEY` secret
- Don't share API keys publicly
- The `.env` files are already in `.gitignore`

## Need Help?

If you encounter any issues:
1. Check that all environment variables are set correctly
2. Make sure you're using Node.js v18 or higher
3. Try clearing node_modules and reinstalling dependencies
4. Check the console for specific error messages

Happy coding! 🎉

