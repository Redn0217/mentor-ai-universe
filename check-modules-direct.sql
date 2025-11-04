-- Direct check of what's in the database
SELECT 'Python course ID:' as info;
SELECT id, title, slug FROM courses WHERE slug = 'python';

SELECT 'All modules in database:' as info;
SELECT id, title, course_id, slug, order_index FROM modules ORDER BY created_at DESC;

SELECT 'Modules for Python course:' as info;
SELECT m.id, m.title, m.course_id, m.slug, m.order_index, c.title as course_title
FROM modules m 
JOIN courses c ON m.course_id = c.id 
WHERE c.slug = 'python';

SELECT 'All lessons in database:' as info;
SELECT l.id, l.title, l.module_id, m.title as module_title
FROM lessons l
JOIN modules m ON l.module_id = m.id
ORDER BY l.created_at DESC;

SELECT 'Count check:' as info;
SELECT 
    c.title as course,
    COUNT(DISTINCT m.id) as modules,
    COUNT(DISTINCT l.id) as lessons
FROM courses c
LEFT JOIN modules m ON c.id = m.course_id
LEFT JOIN lessons l ON m.id = l.module_id
WHERE c.slug = 'python'
GROUP BY c.id, c.title;
