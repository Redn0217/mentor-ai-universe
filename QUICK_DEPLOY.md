# 🚀 Quick Deploy Guide - 3 Steps

## Step 1: Fix Supabase CORS (2 minutes) 🔴 CRITICAL

1. Go to: https://supabase.com/dashboard
2. Select your project
3. **Settings** → **API** → **Site URL**
4. Change to: `https://internsify.in`
5. Click **Save**

**Why?** Without this, you'll get CORS errors and the site won't work!

---

## Step 2: Upload to Hostinger (5 minutes)

### Quick Upload:
1. Go to folder: `mentor-ai-universe/dist`
2. Select ALL files (Ctrl+A)
3. Create ZIP file
4. Upload to Hostinger File Manager
5. Extract in `public_html` folder
6. Delete old files first!

### Must-Have Files in public_html:
```
✓ .htaccess
✓ index.html
✓ 404.html
✓ assets/ folder
```

---

## Step 3: Test (1 minute)

1. Visit: https://internsify.in
2. Press F12 (open console)
3. Look for errors:
   - ❌ CORS errors? → Go back to Step 1
   - ✅ No errors? → You're done! 🎉

---

## Backend Status

✅ Backend is auto-deploying to Render (no action needed)
✅ Check status: https://internsify-backend-2.onrender.com/health

---

## Need Help?

- Full guide: `DEPLOYMENT_FIXES.md`
- CORS help: `SUPABASE_CORS_FIX.md`
- Issues: `TROUBLESHOOTING.md`

---

## Build Info

**Your build is ready in:** `dist/` folder
**Build date:** 2025-11-24
**Build size:** 2.94 MB (932 KB gzipped)

---

## ⚡ One-Line Commands

```bash
# Rebuild if needed
npm run build:hostinger

# Check git status
git status

# Push to both repos
git push origin main && git push aditya-origin main
```

