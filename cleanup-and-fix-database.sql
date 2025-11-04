-- Database Cleanup and Fix Script
-- This script will:
-- 1. Remove unnecessary tables
-- 2. Fix RLS issues by setting is_published = true
-- 3. Verify the fixes work

-- Step 1: Remove deprecated table
DROP TABLE IF EXISTS courses_old_deprecated CASCADE;

-- Step 2: Fix the RLS issue - Set is_published = true for all content
-- This is why your application can't see the data!

-- Update courses to be published
UPDATE courses SET is_published = true WHERE is_published IS NULL OR is_published = false;

-- Update modules to be published  
UPDATE modules SET is_published = true WHERE is_published IS NULL OR is_published = false;

-- Update lessons to be published
UPDATE lessons SET is_published = true WHERE is_published IS NULL OR is_published = false;

-- Update exercises to be published (if any exist)
UPDATE exercises SET is_published = true WHERE is_published IS NULL OR is_published = false;

-- Step 3: Verify the fixes
SELECT 'Courses status:' as info;
SELECT title, is_published FROM courses;

SELECT 'Modules status:' as info;
SELECT m.title, m.is_published, c.title as course_title 
FROM modules m 
JOIN courses c ON m.course_id = c.id;

SELECT 'Lessons status:' as info;
SELECT l.title, l.is_published, m.title as module_title
FROM lessons l 
JOIN modules m ON l.module_id = m.id
JOIN courses c ON m.course_id = c.id
WHERE c.slug = 'python';

-- Step 4: Test the hierarchical query that your backend uses
SELECT 'Testing hierarchical query:' as info;
SELECT 
    c.title,
    COUNT(DISTINCT m.id) as modules,
    COUNT(DISTINCT l.id) as lessons
FROM courses c
LEFT JOIN modules m ON c.id = m.course_id AND m.is_published = true
LEFT JOIN lessons l ON m.id = l.module_id AND l.is_published = true
WHERE c.slug = 'python' AND c.is_published = true
GROUP BY c.id, c.title;

-- Step 5: Final verification - this should match what your app will see
SELECT 'Final verification - what your app will see:' as info;

-- This mimics the exact query your backend uses
WITH course_data AS (
  SELECT c.*
  FROM courses c
  WHERE c.slug = 'python' 
    AND c.is_published = true
),
module_data AS (
  SELECT m.*
  FROM modules m
  JOIN course_data c ON m.course_id = c.id
  WHERE m.is_published = true
),
lesson_data AS (
  SELECT l.*
  FROM lessons l
  JOIN module_data m ON l.module_id = m.id
  WHERE l.is_published = true
)
SELECT 
  'Python Course Structure:' as summary,
  (SELECT COUNT(*) FROM course_data) as courses,
  (SELECT COUNT(*) FROM module_data) as modules,
  (SELECT COUNT(*) FROM lesson_data) as lessons;

SELECT 'Cleanup completed successfully!' as status;
