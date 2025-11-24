# 🔧 Troubleshooting Guide

## Error: "supabaseUrl is required"

This is the most common error when setting up the project. Here's how to fix it:

### Step 1: Verify .env File Exists

**Windows (PowerShell):**
```powershell
Test-Path backend\.env
```

**Mac/Linux:**
```bash
ls -la backend/.env
```

If it returns `False` or "No such file", create it:
```powershell
# Windows
Copy-Item backend\.env.example backend\.env

# Mac/Linux
cp backend/.env.example backend/.env
```

### Step 2: Verify .env File Contents

**Windows:**
```powershell
type backend\.env
```

**Mac/Linux:**
```bash
cat backend/.env
```

You should see something like:
```
PORT=3003
NODE_ENV=development
SUPABASE_URL=https://iucimtwcakmouafdnrwj.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

**Common Issues:**
- ❌ `SUPABASE_URL=your-supabase-project-url` (placeholder not replaced)
- ❌ `SUPABASE_URL = https://...` (extra spaces around `=`)
- ❌ `SUPABASE_URL="https://..."` (quotes around value - remove them)
- ✅ `SUPABASE_URL=https://...` (correct format)

### Step 3: Test Environment Loading

Run the test script:
```bash
cd backend
node test-env.js
```

This will show you:
- ✅ If the .env file is found
- ✅ What variables are loaded
- ❌ What's missing

### Step 4: Check File Encoding

The .env file must be in **UTF-8** encoding without BOM.

**In VS Code:**
1. Open `backend/.env`
2. Look at the bottom right corner
3. It should say "UTF-8"
4. If it says "UTF-8 with BOM", click it and select "UTF-8"

**In Notepad:**
1. Open `backend/.env`
2. File → Save As
3. Encoding: Select "UTF-8" (not "UTF-8 with BOM")
4. Save

### Step 5: Restart Everything

After making changes:
```bash
# Stop the server (Ctrl+C)
# Clear the terminal
# Run again
npm run dev:all
```

---

## Error: "Port already in use"

### Frontend (Port 8080)

**Solution:** Vite will automatically try port 8081, 8082, etc. This is normal!

### Backend (Port 3003)

**Find what's using the port:**

**Windows:**
```powershell
netstat -ano | findstr :3003
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :3003
kill -9 <PID>
```

**Or change the port:**
Edit `backend/.env`:
```
PORT=3004
```

---

## Error: "Cannot find module"

### Solution 1: Reinstall Dependencies

```bash
# Delete node_modules
rm -rf node_modules backend/node_modules

# Delete lock files
rm package-lock.json backend/package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

### Solution 2: Check Node Version

```bash
node --version
```

Must be **v18.0.0 or higher**. If not, update Node.js.

---

## Error: "CORS" or "Network Error"

### Check Backend is Running

The backend should be running on `http://localhost:3003`

Open in browser: http://localhost:3003/health

You should see:
```json
{"status":"ok","environment":"development"}
```

### Check API URL

If the frontend can't connect to the backend, check the API URL configuration.

---

## Environment Variables Not Loading

### Debug Steps:

1. **Check current directory:**
   ```bash
   pwd  # Mac/Linux
   cd   # Windows
   ```
   Should be in the project root.

2. **Check .env file location:**
   ```bash
   ls backend/.env  # Mac/Linux
   dir backend\.env  # Windows
   ```

3. **Check .env file permissions:**
   ```bash
   # Mac/Linux
   chmod 644 backend/.env
   ```

4. **Check for hidden characters:**
   Open `backend/.env` in a text editor and make sure:
   - No extra spaces before/after variable names
   - No quotes around values (unless the value itself contains spaces)
   - Each variable is on its own line
   - File ends with a newline

5. **Try absolute path test:**
   ```bash
   cd backend
   node -e "require('dotenv').config(); console.log(process.env.SUPABASE_URL)"
   ```
   Should print your Supabase URL.

---

## Still Not Working?

### Create a Minimal Test

Create `backend/test-simple.js`:
```javascript
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');
console.log('Looking for:', envPath);
console.log('Exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  console.log('Content length:', content.length);
  console.log('First 100 chars:', content.substring(0, 100));
}
```

Run it:
```bash
cd backend
node test-simple.js
```

This will help identify if the file is readable.

---

## Get Help

If none of these solutions work:

1. Run the test script: `cd backend && node test-env.js`
2. Copy the output
3. Share it with the project maintainer

Include:
- Your operating system (Windows/Mac/Linux)
- Node.js version (`node --version`)
- npm version (`npm --version`)
- Output of `cd backend && node test-env.js`
- Output of `type backend\.env` (Windows) or `cat backend/.env` (Mac/Linux)

