# Admin Panel Implementation Guide

## Overview

A comprehensive admin panel has been implemented for the Mentor AI Universe platform, allowing authorized administrators to perform full CRUD (Create, Read, Update, Delete) operations on courses, modules, lessons, and exercises.

## 🎯 Features Implemented

### 1. **Admin Authentication System**
- ✅ Role-based authentication using admin email whitelist
- ✅ Secure admin login page at `/admin/login`
- ✅ Protected routes that redirect non-admin users
- ✅ Admin indicator in navigation bar for authorized users

### 2. **Admin Dashboard** (`/admin`)
- ✅ Overview statistics (total courses, modules, lessons, exercises)
- ✅ Quick action buttons for common tasks
- ✅ Recent courses list with edit/view options
- ✅ Beautiful, responsive UI with cards and statistics

### 3. **Course Management** (`/admin/courses`)
- ✅ View all courses in a searchable list
- ✅ Create new courses
- ✅ Edit existing courses
- ✅ Delete courses
- ✅ Search functionality

### 4. **Course Editor** (`/admin/courses/:slug`)
- ✅ Full course editing interface
- ✅ Add/edit/delete modules within courses
- ✅ Add/edit/delete lessons within modules
- ✅ Add/edit/delete exercises
- ✅ Rich text editing for content
- ✅ Real-time preview

### 5. **Backend API Routes**
- ✅ Course CRUD: `GET`, `POST`, `PUT`, `DELETE /api/courses`
- ✅ Module CRUD: `POST`, `PUT`, `DELETE /api/courses/:slug/modules`
- ✅ Lesson CRUD: `POST`, `PUT`, `DELETE /api/courses/:slug/modules/:moduleId/lessons`
- ✅ All changes persist to Supabase database

## 📁 Files Created/Modified

### New Files Created:
1. **`src/lib/adminAuth.ts`** - Admin authentication utilities
2. **`src/pages/admin/AdminDashboard.tsx`** - Main admin dashboard
3. **`src/pages/admin/AdminLogin.tsx`** - Admin login page
4. **`ADMIN_PANEL_GUIDE.md`** - This documentation file

### Modified Files:
1. **`src/App.tsx`** - Added admin routes
2. **`src/components/layout/NavBar.tsx`** - Added admin navigation link
3. **`src/pages/admin/CourseEditor.tsx`** - Updated to use new admin auth
4. **`src/pages/admin/CoursesList.tsx`** - Updated to use new admin auth
5. **`src/services/apiService.ts`** - Added module/lesson CRUD functions
6. **`backend/src/routes/course.js`** - Added module/lesson API endpoints

## 🔐 Admin Access

### Current Admin Emails:
The following emails have admin access (configured in `src/lib/adminAuth.ts`):
- `hadaa914@gmail.com`
- `admin@internsify.com`

### To Add More Admin Users:
Edit the `ADMIN_EMAILS` array in `src/lib/adminAuth.ts`:

```typescript
const ADMIN_EMAILS = [
  'hadaa914@gmail.com',
  'admin@internsify.com',
  'your-new-admin@example.com'  // Add new admin emails here
];
```

## 🚀 How to Access the Admin Panel

### Option 1: Direct Login
1. Navigate to `/admin/login`
2. Sign in with admin credentials
3. You'll be redirected to the admin dashboard

### Option 2: Via Navigation
1. Log in to the platform with an admin account
2. Click the "Admin" button in the navigation bar (visible only to admins)
3. Access the admin dashboard

## 📋 Admin Panel Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/admin/login` | Admin login page | Public |
| `/admin` | Admin dashboard | Protected |
| `/admin/courses` | Course management list | Protected |
| `/admin/courses/new` | Create new course | Protected |
| `/admin/courses/:slug` | Edit specific course | Protected |

## 🛠️ API Endpoints

### Course Endpoints
```
GET    /api/courses              - Get all courses
GET    /api/courses/:slug        - Get specific course
POST   /api/courses              - Create new course
PUT    /api/courses/:slug        - Update course
DELETE /api/courses/:slug        - Delete course
```

### Module Endpoints
```
POST   /api/courses/:slug/modules                    - Add module to course
PUT    /api/courses/:slug/modules/:moduleId          - Update module
DELETE /api/courses/:slug/modules/:moduleId          - Delete module
```

### Lesson Endpoints
```
POST   /api/courses/:slug/modules/:moduleId/lessons              - Add lesson
PUT    /api/courses/:slug/modules/:moduleId/lessons/:lessonId    - Update lesson
DELETE /api/courses/:slug/modules/:moduleId/lessons/:lessonId    - Delete lesson
```

## 💡 Usage Examples

### Creating a New Course
1. Go to `/admin` or `/admin/courses`
2. Click "Create New Course" button
3. Fill in course details (title, description, color, etc.)
4. Click "Save Course"

### Adding Modules to a Course
1. Navigate to `/admin/courses/:slug` (edit page)
2. Click "Add Module" button
3. Enter module title and description
4. Click "Save"

### Adding Lessons to a Module
1. In the course editor, select a module
2. Click "Add Lesson" button
3. Enter lesson title, content, duration
4. Optionally add video URL
5. Click "Save"

### Editing Content
1. Navigate to the course editor
2. Click on any module, lesson, or exercise
3. Edit the content in the form
4. Changes are saved automatically or on "Save" button click

## 🔄 Data Flow

```
Admin Panel (Frontend)
    ↓
API Service (src/services/apiService.ts)
    ↓
Backend API (backend/src/routes/course.js)
    ↓
Supabase Database
    ↓
Main Website (Real-time updates)
```

All changes made in the admin panel are immediately reflected on the main website after saving.

## 🎨 UI Components Used

- **shadcn/ui** components (Button, Card, Input, Textarea, etc.)
- **Lucide React** icons
- **Tailwind CSS** for styling
- **React Query** for data fetching and caching

## 🔒 Security Features

1. **Protected Routes**: All admin routes require authentication
2. **Role-Based Access**: Only users with admin role can access admin panel
3. **Automatic Redirects**: Non-admin users are redirected to home page
4. **Toast Notifications**: Users are notified of access denials

## 📱 Responsive Design

The admin panel is fully responsive and works on:
- ✅ Desktop (1920px+)
- ✅ Laptop (1024px - 1920px)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 768px)

## 🐛 Troubleshooting

### Issue: "Access Denied" when trying to access admin panel
**Solution**: Ensure your email is in the `ADMIN_EMAILS` array in `src/lib/adminAuth.ts`

### Issue: Changes not reflecting on main website
**Solution**: 
1. Check browser console for errors
2. Ensure backend server is running
3. Verify Supabase connection
4. Try refreshing the page

### Issue: Cannot create new course
**Solution**:
1. Ensure all required fields are filled
2. Check that the course slug is unique
3. Verify backend API is accessible

## 🚀 Future Enhancements

Potential improvements for the admin panel:

1. **User Management**: Add/edit/delete user accounts
2. **Analytics Dashboard**: View course engagement metrics
3. **Bulk Operations**: Import/export courses in bulk
4. **Media Library**: Upload and manage images/videos
5. **Version Control**: Track changes and rollback capabilities
6. **Role Permissions**: Granular permissions for different admin levels
7. **Activity Logs**: Track all admin actions

## 📞 Support

For issues or questions about the admin panel, please contact the development team or refer to the main project documentation.

---

**Last Updated**: 2025-11-04
**Version**: 1.0.0

