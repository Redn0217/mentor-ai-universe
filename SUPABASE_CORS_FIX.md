# Fix Supabase CORS Errors for Hostinger Deployment

## Problem
Your frontend deployed on `https://internsify.in` is getting CORS errors when trying to access Supabase:
```
Access to fetch at 'https://iucimtwcakmouafdnrwj.supabase.co/rest/v1/...' from origin 'https://internsify.in' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Solution: Add Your Domain to Supabase Allowed Origins

### Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: `iucimtwcakmouafdnrwj`

### Step 2: Configure CORS Settings
1. In the left sidebar, click on **Settings** (gear icon at bottom)
2. Click on **API** in the settings menu
3. Scroll down to find **"CORS Configuration"** or **"Site URL"** section

### Step 3: Add Your Domain
You need to add your Hostinger domain to the allowed origins:

**Option A: Using Site URL (Recommended)**
- Find the **"Site URL"** field
- Change it from the default to: `https://internsify.in`
- Click **Save**

**Option B: Using Additional Redirect URLs**
- Find **"Redirect URLs"** section
- Add: `https://internsify.in/*`
- Add: `https://www.internsify.in/*` (if you use www subdomain)
- Click **Save**

### Step 4: Verify Configuration
After saving, wait 1-2 minutes for changes to propagate, then:
1. Clear your browser cache
2. Reload your website at `https://internsify.in`
3. Check the browser console - CORS errors should be gone

## Additional Configuration (If Needed)

### If you're using Supabase Auth:
In **Authentication** → **URL Configuration**:
- **Site URL**: `https://internsify.in`
- **Redirect URLs**: Add `https://internsify.in/**`

### If you're using custom domains:
Make sure to add all variations:
- `https://internsify.in`
- `https://www.internsify.in`
- `http://internsify.in` (if you support HTTP)

## Testing
After configuration, test these endpoints from your browser console on `https://internsify.in`:

```javascript
// Test 1: Check if Supabase client initializes
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

// Test 2: Try a simple query
const { data, error } = await supabase.from('courses').select('count');
console.log('Query result:', data, error);
```

## Common Issues

### Issue: Still getting CORS errors after configuration
**Solution**: 
- Clear browser cache completely
- Try in incognito/private browsing mode
- Wait 5 minutes for DNS/CDN propagation
- Check if you added the correct domain (with https://)

### Issue: Works on localhost but not on Hostinger
**Solution**: 
- Make sure you're using environment variables correctly
- Verify `.env` variables are set in your build
- Check that VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct

## Environment Variables Check
Make sure your frontend has these environment variables set correctly:

```env
VITE_SUPABASE_URL=https://iucimtwcakmouafdnrwj.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

These should be in your `.env` file and included in your build process.

