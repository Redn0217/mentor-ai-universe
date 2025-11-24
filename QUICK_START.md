# ⚡ Quick Start Guide

Get up and running in 3 simple steps!

## 🎯 For Your Friend (After Cloning)

### Option 1: Automated Setup (Recommended)

**On Windows (PowerShell):**
```powershell
.\setup.ps1
```

**On Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

This will:
- ✅ Install all dependencies (frontend + backend)
- ✅ Create `backend/.env` from the example file
- ✅ Guide you on what credentials to add

### Option 2: Manual Setup

```bash
# 1. Install dependencies
npm install

# 2. Create backend environment file
cd backend
cp .env.example .env    # Mac/Linux
# OR
Copy-Item .env.example .env    # Windows PowerShell

# 3. Edit backend/.env and add your credentials
# (See below for where to get them)
```

## 🔑 Getting Your Credentials

### Supabase (Required)

1. Go to [supabase.com](https://supabase.com)
2. Create a free account
3. Create a new project
4. Go to **Project Settings** → **API**
5. Copy these values to `backend/.env`:
   - `SUPABASE_URL` → Project URL
   - `SUPABASE_ANON_KEY` → anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` → service_role key (⚠️ keep secret!)

### NVIDIA API (Optional - for AI features)

1. Go to [build.nvidia.com](https://build.nvidia.com/)
2. Sign up and get your API key
3. Add to `backend/.env` as `NVIDIA_API_KEY`

### OpenAI API (Optional - for AI features)

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Create an account and get your API key
3. Add to `backend/.env` as `OPENAI_API_KEY`

## 🚀 Run the Project

```bash
# Make sure you're in the root directory
npm run dev:all
```

This starts:
- **Frontend**: http://localhost:8080 (or 8081)
- **Backend**: http://localhost:3003

## ✅ Verify It's Working

You should see:
```
[0] VITE v5.4.10  ready in XXXms
[0] ➜  Local:   http://localhost:8080/
[1] Server running on port 3003
[1] ✅ Supabase connected successfully
```

## ❌ Common Issues

### "supabaseUrl is required"

**Problem**: Missing or incorrect `.env` file

**Fix**:
```bash
# Make sure backend/.env exists and has valid values
cat backend/.env    # Mac/Linux
type backend\.env   # Windows

# Should show:
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=eyJ...
```

### "Port already in use"

**Fix**: Vite will auto-switch to port 8081. For backend, change `PORT` in `backend/.env`

### Dependencies won't install

**Fix**:
```bash
# Clear everything and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json backend/node_modules backend/package-lock.json
npm install
```

## 📚 More Help

- See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions
- Check [README.md](./README.md) for project documentation

---

**Need help?** Make sure:
1. ✅ Node.js v18+ is installed (`node --version`)
2. ✅ `backend/.env` exists with valid credentials
3. ✅ All dependencies are installed (`npm install`)
4. ✅ No other apps are using ports 8080 or 3003

