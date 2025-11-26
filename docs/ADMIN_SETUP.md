# Admin Setup Guide

## Overview

Admin authentication is database-driven. Admins are stored in the `admins` table in Supabase.

## How to Add a New Admin

### Method 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** → **admins** table
3. Click **Insert** → **Insert row**
4. Fill in the following fields:
   - **user_id**: The UUID of the user from `auth.users` table
   - **email**: The user's email address
   - **role**: `admin` (default)
5. Click **Save**

### Method 2: Using SQL Query

Run this SQL query in the Supabase SQL Editor:

```sql
-- Add a new admin by email
INSERT INTO admins (user_id, email, role)
SELECT 
  id,
  email,
  'admin'
FROM auth.users
WHERE email = 'newemail@example.com'
ON CONFLICT (email) DO NOTHING;
```

Replace `'newemail@example.com'` with the actual email address.

### Method 3: Using Supabase API

You can also add admins programmatically using the Supabase Management API.

## How to Remove an Admin

### Using Supabase Dashboard

1. Go to **Table Editor** → **admins** table
2. Find the admin record you want to remove
3. Click the **Delete** button (trash icon)
4. Confirm deletion

### Using SQL Query

```sql
-- Remove admin by email
DELETE FROM admins
WHERE email = 'email@example.com';
```

## Current Admins

The initial admin is:
- **hadaa914@gmail.com**

## How Admin Authentication Works

1. When a user logs in, the system checks if their `user_id` exists in the `admins` table
2. If found, their `user_metadata.role` is set to `'admin'`
3. The UI checks `user_metadata.role` to show/hide admin features
4. Admin routes are protected and only accessible to users with admin role

## Database Schema

```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Security

- Row Level Security (RLS) is enabled on the `admins` table
- Users can only check their own admin status
- Admins can view all admin records
- Only database administrators can insert/update/delete admin records directly

## Notes

- Users must sign up first before being added as admins
- The user's email in the `admins` table must match their email in `auth.users`
- Admin status is synced to user metadata on login
- No UI is provided for admin management - all changes must be done via database

