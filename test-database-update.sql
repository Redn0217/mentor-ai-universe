-- Test Database Update Script
-- Simple test to see if we can modify the Python course

-- First, let's check what we have
SELECT 'Current Python course:' as info;
SELECT id, title, description, tutor_name FROM courses WHERE slug = 'python';

-- Update the Python course description as a test
UPDATE courses 
SET 
    description = 'UPDATED: Learn Python programming from basics to advanced concepts with practical exercises and real-world projects.',
    tutor_name = 'Dr. Ana Python (Updated)',
    updated_at = NOW()
WHERE slug = 'python';

-- Check if the update worked
SELECT 'After update:' as info;
SELECT id, title, description, tutor_name FROM courses WHERE slug = 'python';

-- Try to add a simple module
INSERT INTO modules (
    course_id,
    title,
    description,
    slug,
    order_index,
    estimated_duration_minutes
) 
SELECT 
    id,
    'Test Module',
    'This is a test module to verify database writes work',
    'test-module',
    99,
    30
FROM courses 
WHERE slug = 'python';

-- Check modules
SELECT 'Modules after insert:' as info;
SELECT m.title, m.description, c.title as course_title 
FROM modules m 
JOIN courses c ON m.course_id = c.id 
WHERE c.slug = 'python';
