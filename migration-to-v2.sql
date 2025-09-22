-- Migration Script: From JSONB Structure to Relational Structure
-- This script migrates data from the old courses table to the new hierarchical structure

-- Step 1: Backup existing data
CREATE TABLE IF NOT EXISTS public.courses_backup AS 
SELECT * FROM public.courses;

-- Step 2: Create migration function
CREATE OR REPLACE FUNCTION migrate_courses_to_v2()
RETURNS void AS $$
DECLARE
    course_record RECORD;
    new_course_id UUID;
    module_record JSONB;
    new_module_id UUID;
    lesson_record JSONB;
    new_lesson_id UUID;
    exercise_record JSONB;
    resource_record JSONB;
    module_order INTEGER;
    lesson_order INTEGER;
    exercise_order INTEGER;
BEGIN
    -- Loop through existing courses
    FOR course_record IN SELECT * FROM public.courses LOOP
        -- Insert course into new structure
        INSERT INTO public.courses_v2 (
            slug,
            title,
            description,
            short_description,
            icon,
            color,
            difficulty_level,
            tutor_name,
            tutor_avatar,
            is_published,
            created_at,
            updated_at
        ) VALUES (
            course_record.slug,
            course_record.title,
            course_record.description,
            LEFT(course_record.description, 150),
            COALESCE(course_record.icon, 'code'),
            COALESCE(course_record.color, '#3776AB'),
            'beginner',
            COALESCE(course_record.tutor->>'name', 'Course Instructor'),
            COALESCE(course_record.tutor->>'avatar', 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor'),
            true,
            COALESCE(course_record.created_at, NOW()),
            COALESCE(course_record.updated_at, NOW())
        ) RETURNING id INTO new_course_id;
        
        -- Process modules if they exist
        IF course_record.modules IS NOT NULL THEN
            module_order := 1;
            
            FOR module_record IN SELECT * FROM jsonb_array_elements(course_record.modules) LOOP
                -- Insert module
                INSERT INTO public.modules (
                    course_id,
                    title,
                    description,
                    slug,
                    order_index,
                    estimated_duration_minutes,
                    is_published
                ) VALUES (
                    new_course_id,
                    module_record->>'title',
                    module_record->>'description',
                    LOWER(REPLACE(module_record->>'title', ' ', '-')),
                    module_order,
                    COALESCE((module_record->>'estimated_duration')::INTEGER, 60),
                    true
                ) RETURNING id INTO new_module_id;
                
                -- Process lessons in this module
                IF module_record->'lessons' IS NOT NULL THEN
                    lesson_order := 1;
                    
                    FOR lesson_record IN SELECT * FROM jsonb_array_elements(module_record->'lessons') LOOP
                        INSERT INTO public.lessons (
                            module_id,
                            title,
                            description,
                            slug,
                            order_index,
                            content,
                            estimated_duration_minutes,
                            is_published
                        ) VALUES (
                            new_module_id,
                            lesson_record->>'title',
                            COALESCE(lesson_record->>'description', 'Lesson content'),
                            LOWER(REPLACE(lesson_record->>'title', ' ', '-')),
                            lesson_order,
                            COALESCE(lesson_record->>'content', 'Lesson content will be added here.'),
                            COALESCE((lesson_record->>'duration')::INTEGER, 15),
                            true
                        ) RETURNING id INTO new_lesson_id;
                        
                        lesson_order := lesson_order + 1;
                    END LOOP;
                END IF;
                
                -- Process exercises in this module
                IF module_record->'exercises' IS NOT NULL THEN
                    exercise_order := 1;
                    
                    FOR exercise_record IN SELECT * FROM jsonb_array_elements(module_record->'exercises') LOOP
                        INSERT INTO public.exercises (
                            module_id,
                            title,
                            description,
                            slug,
                            order_index,
                            exercise_type,
                            difficulty_level,
                            estimated_time_minutes,
                            instructions,
                            is_published
                        ) VALUES (
                            new_module_id,
                            exercise_record->>'title',
                            exercise_record->>'description',
                            LOWER(REPLACE(exercise_record->>'title', ' ', '-')),
                            exercise_order,
                            'coding',
                            COALESCE(exercise_record->>'difficulty', 'beginner'),
                            COALESCE((exercise_record->>'estimatedTime')::INTEGER, 30),
                            COALESCE(exercise_record->>'description', 'Complete this exercise.'),
                            true
                        );
                        
                        exercise_order := exercise_order + 1;
                    END LOOP;
                END IF;
                
                -- Process resources in this module
                IF module_record->'resources' IS NOT NULL THEN
                    FOR resource_record IN SELECT * FROM jsonb_array_elements(module_record->'resources') LOOP
                        INSERT INTO public.resources (
                            module_id,
                            title,
                            description,
                            resource_type,
                            url,
                            is_external
                        ) VALUES (
                            new_module_id,
                            resource_record->>'title',
                            COALESCE(resource_record->>'description', ''),
                            COALESCE(resource_record->>'type', 'article'),
                            resource_record->>'url',
                            true
                        );
                    END LOOP;
                END IF;
                
                module_order := module_order + 1;
            END LOOP;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Migration completed successfully';
END;
$$ LANGUAGE plpgsql;

-- Step 3: Execute migration (uncomment when ready)
-- SELECT migrate_courses_to_v2();

-- Step 4: Verification queries (run after migration)
/*
-- Check migrated courses
SELECT 
    c.title,
    COUNT(DISTINCT m.id) as modules_count,
    COUNT(DISTINCT l.id) as lessons_count,
    COUNT(DISTINCT e.id) as exercises_count,
    COUNT(DISTINCT r.id) as resources_count
FROM public.courses_v2 c
LEFT JOIN public.modules m ON c.id = m.course_id
LEFT JOIN public.lessons l ON m.id = l.module_id
LEFT JOIN public.exercises e ON (e.module_id = m.id OR e.lesson_id = l.id)
LEFT JOIN public.resources r ON (r.course_id = c.id OR r.module_id = m.id OR r.lesson_id = l.id)
GROUP BY c.id, c.title
ORDER BY c.title;
*/

-- Step 5: Cleanup function (run only after verifying migration success)
CREATE OR REPLACE FUNCTION cleanup_old_courses_table()
RETURNS void AS $$
BEGIN
    -- Rename old table instead of dropping (safer)
    ALTER TABLE public.courses RENAME TO courses_old_deprecated;
    
    -- Rename new table to replace old one
    ALTER TABLE public.courses_v2 RENAME TO courses;
    
    RAISE NOTICE 'Table cleanup completed. Old table renamed to courses_old_deprecated';
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION migrate_courses_to_v2() TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_courses_table() TO authenticated;
