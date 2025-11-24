# Database Connection Test

## How to Verify Courses Are Saving to Database

### Method 1: Use the Debug Endpoint

I've created a special endpoint to check the database status:

**URL**: http://localhost:3003/api/courses/db-status

**What it shows**:
- ✅ Database connection status (Supabase or Local File)
- ✅ Number of courses in the database
- ✅ List of all courses with their IDs, slugs, and titles

### Method 2: Check Supabase Dashboard

1. Go to your Supabase dashboard: https://iucimtwcakmouafdnrwj.supabase.co
2. Navigate to **Table Editor**
3. Select the **`courses`** table
4. You should see all courses that have been created

### Method 3: Check Backend Logs

When you create/update/delete a course, the backend logs will show:
- ✅ `Successfully connected to Supabase` - Connection is working
- ✅ `Reading courses from Supabase (new structure)...` - Fetching from database
- ✅ `Found X courses in new structure` - Courses found in database

### Method 4: Test Course Creation

1. **Go to Admin Panel**: http://localhost:8080/admin/login
2. **Login** with admin credentials
3. **Create a Test Course**:
   - Click "Create New Course"
   - Fill in:
     - Title: "Test Course"
     - Description: "This is a test course"
     - Color: "#FF5733"
   - Click "Save Course"

4. **Verify in Multiple Places**:
   - Check `/admin/courses` - Should appear in list
   - Check http://localhost:3003/api/courses/db-status - Should show in database
   - Check Supabase dashboard - Should see the course in `courses` table
   - Check http://localhost:8080/course/test-course - Should be accessible

## Current Database Configuration

**Supabase URL**: https://iucimtwcakmouafdnrwj.supabase.co
**Connection**: Configured in `backend/.env`

### Tables Being Used:

1. **`courses`** - Main course data
   - Stores: title, description, color, difficulty, etc.
   
2. **`modules`** - Course modules
   - Linked to courses via `course_id`
   
3. **`lessons`** - Module lessons
   - Linked to modules via `module_id`
   
4. **`exercises`** - Practice exercises
   - Linked to modules or lessons

## How the System Works

### When You CREATE a Course:

```
Admin Panel (Frontend)
    ↓
POST /api/courses
    ↓
Backend checks Supabase connection
    ↓
✅ If connected: Saves to Supabase `courses` table
❌ If not connected: Saves to local JSON file
    ↓
Returns course data to frontend
    ↓
Course appears in admin list
```

### When You VIEW Courses:

```
Admin Panel or Main Website
    ↓
GET /api/courses
    ↓
Backend checks Supabase connection
    ↓
✅ If connected: Fetches from Supabase
❌ If not connected: Reads from local JSON file
    ↓
Returns course list
    ↓
Courses display on page
```

### When You UPDATE a Course:

```
Admin Panel
    ↓
PUT /api/courses/:slug
    ↓
Backend checks Supabase connection
    ↓
✅ If connected: Updates in Supabase
❌ If not connected: Updates local JSON file
    ↓
Returns updated course
    ↓
Changes reflect immediately
```

## Troubleshooting

### Issue: "Courses not appearing in database"

**Check**:
1. Is Supabase connection working?
   - Visit: http://localhost:3003/api/courses/db-status
   - Should show: `"status": "connected"`

2. Are environment variables set?
   - Check `backend/.env` has:
     - `SUPABASE_URL=https://iucimtwcakmouafdnrwj.supabase.co`
     - `SUPABASE_ANON_KEY=eyJhbGci...` (your key)

3. Check backend logs:
   - Look for: `✅ Supabase connected successfully`
   - Or: `❌ Supabase connection error`

### Issue: "Connection error"

**Solutions**:
1. Restart backend server
2. Check internet connection
3. Verify Supabase credentials in `.env`
4. Check Supabase dashboard is accessible

### Issue: "Courses saving to local file instead of database"

**This means**:
- Supabase connection is failing
- System is using fallback (local JSON file)

**Fix**:
1. Check backend logs for connection errors
2. Verify Supabase URL and key are correct
3. Ensure Supabase project is active
4. Check if tables exist in Supabase

## Quick Test Script

Run this in your browser console on http://localhost:8080:

```javascript
// Test database status
fetch('http://localhost:3003/api/courses/db-status')
  .then(r => r.json())
  .then(data => {
    console.log('Database Status:', data.status);
    console.log('Database Type:', data.database);
    console.log('Courses Count:', data.coursesCount);
    console.log('Courses:', data.courses);
  });

// Test creating a course
fetch('http://localhost:3003/api/courses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'API Test Course',
    description: 'Created via API test',
    color: '#00FF00'
  })
})
  .then(r => r.json())
  .then(data => console.log('Created course:', data));
```

## Expected Behavior

### ✅ When Everything Works:

1. Create course in admin panel
2. Backend logs show: `✅ Supabase connected successfully`
3. Course saves to Supabase `courses` table
4. Course appears in `/admin/courses` list immediately
5. Course accessible at `/course/your-slug`
6. Database status shows: `"status": "connected", "database": "Supabase"`

### ❌ When Using Fallback:

1. Create course in admin panel
2. Backend logs show: `❌ Supabase connection error`
3. Course saves to local `courses.json` file
4. Course appears in `/admin/courses` list
5. Course accessible at `/course/your-slug`
6. Database status shows: `"status": "disconnected", "database": "Local File"`

## Summary

**YES, courses ARE saving to the database** (Supabase) when:
- ✅ Supabase connection is working
- ✅ Environment variables are set correctly
- ✅ Backend server is running

**To verify right now**:
1. Open: http://localhost:3003/api/courses/db-status
2. Check if `"status": "connected"` and `"database": "Supabase"`
3. If yes → Courses are saving to Supabase ✅
4. If no → Courses are saving to local file (fallback) ⚠️

---

**Last Updated**: 2025-11-04

