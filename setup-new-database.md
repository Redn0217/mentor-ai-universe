# Database Migration Setup Guide

This guide will help you migrate from the old JSONB-based course structure to the new relational database structure.

## Overview

The new database structure provides:
- **Proper relational tables** for courses, modules, lessons, exercises, and resources
- **Better performance** with indexed queries
- **Scalable architecture** for complex course hierarchies
- **User progress tracking** with detailed analytics
- **Backward compatibility** with existing data

## Migration Steps

### 1. Backup Current Data

Before starting the migration, create a backup of your current data:

```sql
-- This will be done automatically by the migration script
SELECT create_migration_backup();
```

### 2. Check Current Status

```sql
SELECT check_migration_status();
```

### 3. Deploy New Schema

Run the new database schema:

```sql
-- Execute the contents of database-schema-v2.sql
\i database-schema-v2.sql
```

### 4. Execute Migration

```sql
-- Run the complete migration
SELECT execute_complete_migration();
```

### 5. Populate Python Course

```sql
-- Add the comprehensive Python course
SELECT populate_python_course();
```

### 6. Verify Migration

```sql
-- Check that everything migrated correctly
SELECT * FROM verify_migration();
```

### 7. Test the New Structure

```sql
-- Test the hierarchical query function
SELECT get_course_with_hierarchy('python');

-- Test user progress function (replace with actual user UUID)
SELECT get_user_course_progress('user-uuid-here', 'course-uuid-here');
```

### 8. Cleanup (Optional)

Once you've verified everything works correctly:

```sql
-- This renames old tables and makes the new structure primary
SELECT cleanup_after_migration();
```

## Rollback (If Needed)

If something goes wrong, you can rollback:

```sql
SELECT rollback_migration();
```

## New Database Structure

### Tables Created

1. **courses** - Main course information
2. **modules** - Course modules/chapters
3. **lessons** - Individual lessons within modules
4. **exercises** - Coding exercises and assignments
5. **resources** - Additional learning resources
6. **user_progress** - Track user learning progress
7. **exercise_submissions** - Store user exercise attempts

### Key Features

- **Row Level Security (RLS)** - Proper access control
- **Hierarchical Queries** - Efficient course structure retrieval
- **Progress Tracking** - Detailed user progress analytics
- **Flexible Content** - Support for different content types
- **Scalable Design** - Easy to add new features

## Frontend Integration

The frontend services have been updated to work with both old and new structures:

- `courseService.ts` - Updated with new types and functions
- `apiService.ts` - Backward compatible API calls
- `database.ts` - New TypeScript interfaces

## Testing Checklist

- [ ] Migration completes without errors
- [ ] Python course data is properly populated
- [ ] Course list displays correctly
- [ ] Individual course pages load with full hierarchy
- [ ] AI tutor 3D carousel works with new data
- [ ] User progress tracking functions
- [ ] Exercise submission system works
- [ ] Fallback to old structure works if needed

## Troubleshooting

### Common Issues

1. **Migration fails**: Check Supabase permissions and RLS policies
2. **Data not showing**: Verify `is_published` flags are set to true
3. **Frontend errors**: Check TypeScript interfaces match database structure
4. **Performance issues**: Ensure indexes are created properly

### Debug Queries

```sql
-- Check course counts
SELECT 
  'courses' as table_name, 
  COUNT(*) as count 
FROM courses
UNION ALL
SELECT 
  'modules' as table_name, 
  COUNT(*) as count 
FROM modules
UNION ALL
SELECT 
  'lessons' as table_name, 
  COUNT(*) as count 
FROM lessons
UNION ALL
SELECT 
  'exercises' as table_name, 
  COUNT(*) as count 
FROM exercises;

-- Check a specific course structure
SELECT 
  c.title as course_title,
  COUNT(DISTINCT m.id) as modules_count,
  COUNT(DISTINCT l.id) as lessons_count,
  COUNT(DISTINCT e.id) as exercises_count
FROM courses c
LEFT JOIN modules m ON c.id = m.course_id
LEFT JOIN lessons l ON m.id = l.module_id
LEFT JOIN exercises e ON (e.module_id = m.id OR e.lesson_id = l.id)
WHERE c.slug = 'python'
GROUP BY c.id, c.title;
```

## Performance Considerations

The new structure includes several optimizations:

- **Indexes** on frequently queried columns
- **Efficient joins** for hierarchical data
- **Cached counts** for course statistics
- **Optimized RLS policies** for security

## Next Steps

After successful migration:

1. **Monitor performance** - Check query execution times
2. **Add more courses** - Use the Python course as a template
3. **Implement user features** - Progress tracking, bookmarks, etc.
4. **Enhance content** - Add videos, interactive exercises
5. **Analytics** - Track user engagement and learning outcomes

## Support

If you encounter issues during migration:

1. Check the migration logs for specific errors
2. Verify Supabase connection and permissions
3. Test with a small dataset first
4. Use the rollback function if needed
5. Contact support with specific error messages

## Files Modified

- `database-schema-v2.sql` - New database schema
- `migration-to-v2.sql` - Migration functions
- `complete-migration.sql` - Complete migration script
- `populate-python-course.sql` - Python course data
- `src/types/database.ts` - TypeScript interfaces
- `src/services/courseService.ts` - Updated service functions
- `src/services/apiService.ts` - Updated API functions
- `backend/src/services/courseService.js` - New backend service
- `backend/src/routes/course.js` - Updated route handlers
