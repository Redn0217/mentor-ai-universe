# 🔑 How to Get Your Supabase Service Role Key

## Problem Identified

The error you're seeing:
```
"new row violates row-level security policy for table \"courses\""
```

This means **Row-Level Security (RLS)** is enabled on your Supabase `courses` table, and the backend is using the **anon key** which doesn't have permission to insert data.

## Solution

Use the **Service Role Key** instead of the **Anon Key** for backend operations. The service role key bypasses RLS policies.

---

## Steps to Get Service Role Key

### 1. Go to Supabase Dashboard
Open: https://iucimtwcakmouafdnrwj.supabase.co

### 2. Navigate to Project Settings
- Click on the **Settings** icon (⚙️) in the left sidebar
- Click on **API** under Project Settings

### 3. Find Your Service Role Key
You'll see two keys:

**anon / public key** (Currently using this ❌)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1Y2ltdHdjYWttb3VhZmRucndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMDAxMzQsImV4cCI6MjA2Mjc3NjEzNH0.-_RIvC_Sb5FjF5iPbzKiQMLg7id3pjb2oHoX9kvsQlc
```
- ❌ This key respects RLS policies
- ❌ Cannot insert/update/delete if RLS blocks it

**service_role / secret key** (Need this one ✅)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1Y2ltdHdjYWttb3VhZmRucndqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzIwMDEzNCwiZXhwIjoyMDYyNzc2MTM0fQ.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
- ✅ This key bypasses RLS policies
- ✅ Full admin access to database
- ⚠️ **KEEP THIS SECRET!** Never expose in frontend code

### 4. Copy the Service Role Key
- Click the **"Reveal"** button next to `service_role` key
- Click the **"Copy"** button to copy the full key

### 5. Update Your .env File

Open `backend/.env` and replace the placeholder:

**Before:**
```env
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
```

**After:**
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1Y2ltdHdjYWttb3VhZmRucndqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzIwMDEzNCwiZXhwIjoyMDYyNzc2MTM0fQ.YOUR_ACTUAL_KEY_HERE
```

### 6. Restart the Backend Server

Kill the current backend process and restart:
```bash
# The backend will automatically use the service role key
npm run dev
```

You should see:
```
🔑 Supabase client initialized with: SERVICE_ROLE_KEY (bypasses RLS)
```

---

## Alternative Solution: Disable RLS (Not Recommended)

If you don't want to use the service role key, you can disable RLS on the courses table:

### Option A: Disable RLS Completely (Quick but less secure)

1. Go to Supabase Dashboard
2. Click **Table Editor** → **courses** table
3. Click the **RLS** toggle to disable it

⚠️ **Warning**: This makes your table publicly writable!

### Option B: Add RLS Policy for Backend (Better)

Add a policy that allows authenticated users to insert:

```sql
-- Go to Supabase SQL Editor and run:

-- Allow authenticated users to insert courses
CREATE POLICY "Allow authenticated users to insert courses"
ON courses
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update courses
CREATE POLICY "Allow authenticated users to update courses"
ON courses
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete courses
CREATE POLICY "Allow authenticated users to delete courses"
ON courses
FOR DELETE
TO authenticated
USING (true);
```

But this still requires authentication, which is why **using the service role key is the best solution for backend operations**.

---

## Why This Happened

1. **RLS is enabled** on your `courses` table (good for security!)
2. **Backend was using anon key** which has limited permissions
3. **Anon key respects RLS policies** and was blocked from inserting

## What We Fixed

1. ✅ Added `SUPABASE_SERVICE_ROLE_KEY` to `.env`
2. ✅ Updated `backend/src/config/env.js` to read the service role key
3. ✅ Updated `backend/src/lib/supabase.js` to use service role key
4. ✅ Backend now bypasses RLS and can insert/update/delete courses

---

## Security Notes

⚠️ **IMPORTANT**: 
- **NEVER** use the service role key in frontend code
- **NEVER** commit the service role key to Git
- **ONLY** use it in backend/server code
- The service role key has **full admin access** to your database

✅ **Safe to use**:
- Backend API routes (what we're doing)
- Server-side functions
- Admin scripts

❌ **Never use**:
- Frontend React code
- Client-side JavaScript
- Public repositories

---

## Quick Checklist

- [ ] Go to Supabase Dashboard → Settings → API
- [ ] Copy the **service_role** key (not the anon key)
- [ ] Paste it in `backend/.env` as `SUPABASE_SERVICE_ROLE_KEY=...`
- [ ] Restart backend server
- [ ] Look for: `🔑 Supabase client initialized with: SERVICE_ROLE_KEY`
- [ ] Try creating a course again
- [ ] Should work! ✅

---

## After You Add the Key

Once you've added the service role key and restarted the backend:

1. **Refresh the test page**: http://localhost:8080/admin/login
2. **Click "Run Complete Test"** on the test page
3. **You should see**:
   ```
   ✅ Course created: Test Course 1234567890 (test-course-1234567890)
   ✅ Course found in database!
   ✅ All tests passed!
   ```

4. **Check Supabase Dashboard**:
   - Table Editor → `courses` table
   - Your new course should be there!

---

## Need Help?

If you're still having issues after adding the service role key:

1. Check backend logs for errors
2. Verify the key is correct (starts with `eyJhbGci...`)
3. Make sure there are no extra spaces in the `.env` file
4. Restart the backend server completely

The service role key should look like:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1Y2ltdHdjYWttb3VhZmRucndqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzIwMDEzNCwiZXhwIjoyMDYyNzc2MTM0fQ.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Notice it has `"cm9sZSI6InNlcnZpY2Vfcm9sZSI` in the middle (base64 for `"role":"service_role"`).

---

**Once you add the service role key, courses will save to the database!** 🎉

