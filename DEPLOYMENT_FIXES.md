# Deployment Fixes for Hostinger + Render Setup

## Issues Found

### 1. ❌ CORS Errors from Supabase
**Error:**
```
Access to fetch at 'https://iucimtwcakmouafdnrwj.supabase.co/rest/v1/...' from origin 'https://internsify.in' 
has been blocked by CORS policy
```

**Root Cause:** Your Hostinger domain `https://internsify.in` is not in Supabase's allowed origins list.

### 2. ❌ Backend Looking for Non-existent dist/index.html
**Error:**
```
Error: ENOENT: no such file or directory, stat '/opt/render/project/src/dist/index.html'
```

**Root Cause:** The `server.ts` file had code to serve static files in production, but your frontend is on Hostinger, not Render.

---

## ✅ Fixes Applied

### Fix 1: Updated Backend Server Configuration
**File:** `backend/src/server.ts`

**Changes:**
- ✅ Removed static file serving code (lines 29-38)
- ✅ Added health check endpoint
- ✅ Backend now only serves API endpoints

The backend will no longer try to serve the frontend - it's purely an API server now.

### Fix 2: Supabase CORS Configuration (Manual Step Required)

**You need to configure Supabase to allow your domain:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `iucimtwcakmouafdnrwj`
3. Navigate to: **Settings** → **API**
4. Find **"Site URL"** or **"CORS Configuration"**
5. Add your domain: `https://internsify.in`
6. Also add: `https://www.internsify.in` (if using www)
7. Click **Save**

**Alternative: Using Authentication Settings**
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://internsify.in`
3. Add to **Redirect URLs**: `https://internsify.in/**`

---

## 🚀 Deployment Steps

### Step 1: Rebuild and Deploy Backend to Render

The backend code has been fixed. Now you need to deploy it:

```bash
# Commit the changes
git add backend/src/server.ts
git commit -m "fix: Remove static file serving from backend"
git push origin main
```

Render will automatically detect the push and redeploy your backend.

### Step 2: Configure Supabase CORS

Follow the manual steps above to add your Hostinger domain to Supabase's allowed origins.

### Step 3: Rebuild Frontend for Hostinger

```bash
cd mentor-ai-universe
npm run build:hostinger
```

This will create a fresh build in the `dist` directory with:
- Optimized production code
- `.htaccess` file for Apache
- `404.html` for error handling

### Step 4: Upload to Hostinger

1. **Compress the dist folder:**
   - Right-click on `dist` folder
   - Create a ZIP file

2. **Upload to Hostinger:**
   - Log in to Hostinger control panel
   - Go to File Manager
   - Navigate to `public_html` (or your domain's root)
   - **Delete all existing files** in public_html
   - Upload and extract the ZIP file
   - Make sure all files from `dist` are in `public_html` root

3. **Verify file structure:**
   ```
   public_html/
   ├── .htaccess
   ├── index.html
   ├── 404.html
   ├── assets/
   │   ├── index-*.js
   │   └── index-*.css
   ├── favicon.ico
   └── other static files
   ```

### Step 5: Test the Deployment

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. Visit `https://internsify.in`
3. Open browser console (F12)
4. Check for errors:
   - ✅ No CORS errors
   - ✅ API calls to Render backend working
   - ✅ Supabase queries working

---

## 🔍 Verification Checklist

After deployment, verify:

- [ ] Website loads at `https://internsify.in`
- [ ] No CORS errors in browser console
- [ ] Backend API responding at `https://internsify-backend-2.onrender.com/health`
- [ ] Supabase queries working (check courses loading)
- [ ] AI chat functionality working
- [ ] All routes working (test navigation)

---

## 🐛 Troubleshooting

### Still Getting CORS Errors?
1. Wait 5 minutes for Supabase changes to propagate
2. Clear browser cache completely
3. Try incognito/private browsing mode
4. Verify you added the correct domain with `https://`

### Backend Not Responding?
1. Check Render dashboard for deployment status
2. View logs in Render dashboard
3. Test health endpoint: `https://internsify-backend-2.onrender.com/health`

### Frontend Not Loading?
1. Check `.htaccess` file is in public_html
2. Verify all files extracted correctly
3. Check file permissions (should be 644 for files, 755 for directories)

---

## 📝 Environment Variables

Make sure these are set in Render:
- `NODE_ENV=production`
- `PORT=8080`
- `NVIDIA_API_KEY=<your-key>`
- `SUPABASE_URL=https://iucimtwcakmouafdnrwj.supabase.co`
- `SUPABASE_ANON_KEY=<your-anon-key>`

---

## 🔗 Useful Links

- **Frontend:** https://internsify.in
- **Backend:** https://internsify-backend-2.onrender.com
- **Backend Health:** https://internsify-backend-2.onrender.com/health
- **Supabase Dashboard:** https://supabase.com/dashboard/project/iucimtwcakmouafdnrwj
- **Render Dashboard:** https://dashboard.render.com

