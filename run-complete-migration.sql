-- COMPLETE MIGRATION SCRIPT - RUN THIS SINGLE FILE
-- This script contains all necessary functions and executes the complete migration

-- ============================================================================
-- STEP 1: CREATE MIGRATION UTILITY FUNCTIONS
-- ============================================================================

-- Create backup function
CREATE OR REPLACE FUNCTION create_migration_backup()
RETURNS void AS $$
BEGIN
    -- Create backup table with timestamp
    EXECUTE format('CREATE TABLE IF NOT EXISTS courses_backup_%s AS SELECT * FROM public.courses', 
                   to_char(now(), 'YYYY_MM_DD_HH24_MI_SS'));
    
    RAISE NOTICE 'Backup created successfully';
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'No existing courses table to backup';
END;
$$ LANGUAGE plpgsql;

-- Check migration status function
CREATE OR REPLACE FUNCTION check_migration_status()
RETURNS TEXT AS $$
DECLARE
    old_table_exists BOOLEAN;
    new_table_exists BOOLEAN;
    old_count INTEGER;
    new_count INTEGER;
BEGIN
    -- Check if old courses table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'courses'
    ) INTO old_table_exists;
    
    -- Check if new courses_v2 table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'courses_v2'
    ) INTO new_table_exists;
    
    IF old_table_exists THEN
        SELECT COUNT(*) FROM public.courses INTO old_count;
    ELSE
        old_count := 0;
    END IF;
    
    IF new_table_exists THEN
        SELECT COUNT(*) FROM public.courses_v2 INTO new_count;
    ELSE
        new_count := 0;
    END IF;
    
    RETURN format('Old table exists: %s (records: %s), New table exists: %s (records: %s)', 
                  old_table_exists, old_count, new_table_exists, new_count);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 2: CREATE MIGRATION FUNCTION
-- ============================================================================

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
    -- Check if old courses table exists
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') THEN
        RAISE NOTICE 'No old courses table found to migrate';
        RETURN;
    END IF;

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

        -- Migrate modules if they exist
        IF course_record.modules IS NOT NULL AND jsonb_array_length(course_record.modules) > 0 THEN
            module_order := 1;
            
            FOR module_record IN SELECT * FROM jsonb_array_elements(course_record.modules) LOOP
                -- Insert module
                INSERT INTO public.modules (
                    course_id,
                    title,
                    description,
                    slug,
                    order_index,
                    is_published,
                    created_at,
                    updated_at
                ) VALUES (
                    new_course_id,
                    module_record->>'title',
                    COALESCE(module_record->>'description', ''),
                    LOWER(REPLACE(module_record->>'title', ' ', '-')),
                    module_order,
                    true,
                    NOW(),
                    NOW()
                ) RETURNING id INTO new_module_id;

                -- Migrate lessons if they exist
                IF module_record->'lessons' IS NOT NULL AND jsonb_array_length(module_record->'lessons') > 0 THEN
                    lesson_order := 1;
                    
                    FOR lesson_record IN SELECT * FROM jsonb_array_elements(module_record->'lessons') LOOP
                        -- Insert lesson
                        INSERT INTO public.lessons (
                            module_id,
                            title,
                            description,
                            slug,
                            content,
                            order_index,
                            estimated_duration_minutes,
                            is_published,
                            created_at,
                            updated_at
                        ) VALUES (
                            new_module_id,
                            lesson_record->>'title',
                            COALESCE(lesson_record->>'description', ''),
                            LOWER(REPLACE(lesson_record->>'title', ' ', '-')),
                            COALESCE(lesson_record->>'content', ''),
                            lesson_order,
                            COALESCE((lesson_record->>'duration')::INTEGER, 15),
                            true,
                            NOW(),
                            NOW()
                        ) RETURNING id INTO new_lesson_id;

                        lesson_order := lesson_order + 1;
                    END LOOP;
                END IF;

                -- Migrate exercises if they exist
                IF module_record->'exercises' IS NOT NULL AND jsonb_array_length(module_record->'exercises') > 0 THEN
                    exercise_order := 1;
                    
                    FOR exercise_record IN SELECT * FROM jsonb_array_elements(module_record->'exercises') LOOP
                        -- Insert exercise
                        INSERT INTO public.exercises (
                            module_id,
                            title,
                            description,
                            exercise_type,
                            difficulty_level,
                            order_index,
                            estimated_duration_minutes,
                            is_published,
                            created_at,
                            updated_at
                        ) VALUES (
                            new_module_id,
                            exercise_record->>'title',
                            COALESCE(exercise_record->>'description', ''),
                            'coding',
                            COALESCE(exercise_record->>'difficulty', 'beginner'),
                            exercise_order,
                            COALESCE((exercise_record->>'estimatedTime')::INTEGER, 30),
                            true,
                            NOW(),
                            NOW()
                        );

                        exercise_order := exercise_order + 1;
                    END LOOP;
                END IF;

                module_order := module_order + 1;
            END LOOP;
        END IF;
    END LOOP;

    RAISE NOTICE 'Migration completed successfully';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 3: CREATE PYTHON COURSE POPULATION FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION populate_python_course()
RETURNS void AS $$
DECLARE
    course_id UUID;
    module1_id UUID;
    module2_id UUID;
    lesson_id UUID;
    exercise_id UUID;
BEGIN
    -- Check if Python course already exists
    IF EXISTS (SELECT 1 FROM public.courses_v2 WHERE slug = 'python') THEN
        RAISE NOTICE 'Python course already exists, skipping population';
        RETURN;
    END IF;

    -- Insert Python course
    INSERT INTO public.courses_v2 (
        slug, title, description, short_description, icon, color,
        difficulty_level, estimated_duration_hours, prerequisites,
        learning_objectives, tags, is_published, is_featured,
        tutor_name, tutor_avatar, tutor_bio
    ) VALUES (
        'python',
        'Python Programming',
        'Learn Python programming from basics to advanced concepts with practical exercises and real-world projects.',
        'Complete Python programming course from beginner to advanced level',
        'code',
        '#3776AB',
        'beginner',
        40,
        '[]'::jsonb,
        '["Understand Python syntax and basic programming concepts", "Work with Python data types and structures", "Implement control flow and functions", "Handle errors and exceptions", "Work with files and modules"]'::jsonb,
        '["python", "programming", "beginner", "coding"]'::jsonb,
        true,
        true,
        'Dr. Ana Python',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
        'Senior Python Developer with 10+ years of experience in teaching and software development'
    ) RETURNING id INTO course_id;

    -- Insert Module 1: Python Fundamentals
    INSERT INTO public.modules (
        course_id, title, description, slug, order_index,
        estimated_duration_minutes, difficulty_level, learning_objectives,
        prerequisites, is_published
    ) VALUES (
        course_id,
        'Python Fundamentals',
        'Get started with Python programming basics, syntax, and core concepts',
        'python-fundamentals',
        1,
        180,
        'beginner',
        '["Set up Python development environment", "Understand Python syntax", "Work with variables and basic data types"]'::jsonb,
        '[]'::jsonb,
        true
    ) RETURNING id INTO module1_id;

    -- Insert Module 2: Python Data Types
    INSERT INTO public.modules (
        course_id, title, description, slug, order_index,
        estimated_duration_minutes, difficulty_level, learning_objectives,
        prerequisites, is_published
    ) VALUES (
        course_id,
        'Python Data Types',
        'Deep dive into Python data types, structures, and their operations',
        'python-data-types',
        2,
        240,
        'beginner',
        '["Master Python data types", "Work with collections", "Understand type conversion"]'::jsonb,
        '["python-fundamentals"]'::jsonb,
        true
    ) RETURNING id INTO module2_id;

    -- Insert lessons for Module 1
    INSERT INTO public.lessons (
        module_id, title, description, slug, content, order_index,
        estimated_duration_minutes, difficulty_level, learning_objectives,
        key_concepts, is_published
    ) VALUES
    (module1_id, 'Python Introduction', 'What is Python and why use it?', 'python-introduction',
     '# Python Introduction\n\nPython is a popular programming language. It was created by Guido van Rossum, and released in 1991.\n\n## What can Python do?\n- Web development (server-side)\n- Software development\n- Mathematics\n- System scripting\n\n## Why Python?\n- Works on different platforms\n- Simple syntax similar to English\n- Allows developers to write programs with fewer lines\n- Runs on an interpreter system',
     1, 15, 'beginner', '["Understand what Python is", "Learn Python applications"]'::jsonb,
     '["Python history", "Use cases", "Advantages"]'::jsonb, true),

    (module1_id, 'Python Syntax', 'Learn Python syntax and indentation', 'python-syntax',
     '# Python Syntax\n\nPython syntax can be executed by writing directly in the Command Line or by creating a python file.\n\n## Python Indentation\nIndentation refers to the spaces at the beginning of a code line.\n\n```python\nif 5 > 2:\n    print("Five is greater than two!")\n```\n\nPython uses indentation to indicate a block of code.',
     2, 20, 'beginner', '["Understand Python syntax rules", "Learn about indentation"]'::jsonb,
     '["Indentation", "Code blocks", "Syntax rules"]'::jsonb, true),

    (module1_id, 'Python Variables', 'Working with variables in Python', 'python-variables',
     '# Python Variables\n\nVariables are containers for storing data values.\n\n## Creating Variables\nPython has no command for declaring a variable. A variable is created the moment you first assign a value to it.\n\n```python\nx = 5\ny = "John"\nprint(x)\nprint(y)\n```\n\n## Variable Names\n- Must start with a letter or underscore\n- Cannot start with a number\n- Can only contain alpha-numeric characters and underscores',
     3, 25, 'beginner', '["Create and use variables", "Understand variable naming rules"]'::jsonb,
     '["Variable creation", "Naming conventions", "Assignment"]'::jsonb, true);

    -- Insert lessons for Module 2
    INSERT INTO public.lessons (
        module_id, title, description, slug, content, order_index,
        estimated_duration_minutes, difficulty_level, learning_objectives,
        key_concepts, is_published
    ) VALUES
    (module2_id, 'Python Numbers', 'Working with numeric data types', 'python-numbers',
     '# Python Numbers\n\nThere are three numeric types in Python:\n- int\n- float\n- complex\n\n```python\nx = 1    # int\ny = 2.8  # float\nz = 1j   # complex\n```\n\n## Type Conversion\nYou can convert from one type to another:\n\n```python\nx = 1\ny = float(x)\nprint(y)  # 1.0\n```',
     1, 30, 'beginner', '["Work with different number types", "Convert between types"]'::jsonb,
     '["int", "float", "complex", "type conversion"]'::jsonb, true),

    (module2_id, 'Python Strings', 'Working with text data', 'python-strings',
     '# Python Strings\n\nStrings in python are surrounded by either single or double quotation marks.\n\n```python\nprint("Hello")\nprint(''Hello'')\n```\n\n## Multiline Strings\nYou can assign a multiline string to a variable by using three quotes:\n\n```python\na = """Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua."""\n```',
     2, 35, 'beginner', '["Create and manipulate strings", "Use string methods"]'::jsonb,
     '["String creation", "Multiline strings", "String methods"]'::jsonb, true),

    (module2_id, 'Python Lists', 'Working with lists and collections', 'python-lists',
     '# Python Lists\n\nLists are used to store multiple items in a single variable.\n\n```python\nmylist = ["apple", "banana", "cherry"]\nprint(mylist)\n```\n\n## List Characteristics\n- Ordered\n- Changeable\n- Allow duplicate values\n\n## Accessing Items\n```python\nprint(mylist[1])  # banana\n```',
     3, 40, 'beginner', '["Create and use lists", "Access list items", "Modify lists"]'::jsonb,
     '["List creation", "Indexing", "List methods"]'::jsonb, true);

    -- Insert exercises
    INSERT INTO public.exercises (
        module_id, title, description, exercise_type, difficulty_level,
        order_index, estimated_duration_minutes, starter_code, solution_code,
        test_cases, hints, is_published
    ) VALUES
    (module1_id, 'Hello World', 'Create your first Python program', 'coding', 'beginner',
     1, 10, '# Write a program that prints "Hello, World!"\n\n# Your code here:\n',
     'print("Hello, World!")',
     '[{"input": "", "expected_output": "Hello, World!", "description": "Should print Hello, World!"}]'::jsonb,
     '["Use the print() function", "Remember to use quotes around text"]'::jsonb, true),

    (module2_id, 'Variable Assignment', 'Practice creating and using variables', 'coding', 'beginner',
     1, 15, '# Create variables and print them\n# Create a variable called name with your name\n# Create a variable called age with your age\n# Print both variables\n\n# Your code here:\n',
     'name = "John"\nage = 25\nprint(name)\nprint(age)',
     '[{"input": "", "expected_output": "John\\n25", "description": "Should print name and age on separate lines"}]'::jsonb,
     '["Use quotes for text values", "Numbers don''t need quotes", "Use print() to display values"]'::jsonb, true),

    (module2_id, 'List Operations', 'Work with Python lists', 'coding', 'beginner',
     1, 20, '# Create a list of fruits and perform operations\n# Create a list with at least 3 fruits\n# Print the first fruit\n# Add a new fruit to the list\n# Print the entire list\n\n# Your code here:\n',
     'fruits = ["apple", "banana", "cherry"]\nprint(fruits[0])\nfruits.append("orange")\nprint(fruits)',
     '[{"input": "", "expected_output": "apple\\n[''apple'', ''banana'', ''cherry'', ''orange'']", "description": "Should print first fruit and then the complete list"}]'::jsonb,
     '["Use square brackets for lists", "Use index 0 for first item", "Use append() to add items"]'::jsonb, true);

    -- Insert resources
    INSERT INTO public.resources (
        course_id, title, description, resource_type, url, is_published
    ) VALUES
    (course_id, 'Python Official Documentation', 'Official Python documentation and tutorials', 'documentation',
     'https://docs.python.org/3/', true),
    (course_id, 'Python Cheat Sheet', 'Quick reference for Python syntax and functions', 'reference',
     'https://www.pythoncheatsheet.org/', true);

    RAISE NOTICE 'Python course with modules, lessons, exercises, and resources created successfully';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 4: CREATE MAIN MIGRATION EXECUTION FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION execute_complete_migration()
RETURNS void AS $$
DECLARE
    migration_status TEXT;
BEGIN
    -- Check current status
    SELECT check_migration_status() INTO migration_status;
    RAISE NOTICE 'Migration status: %', migration_status;

    -- Create backup
    PERFORM create_migration_backup();

    -- Check if courses_v2 exists, if not create the new schema
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses_v2') THEN
        RAISE NOTICE 'New schema needs to be created. Please run database-schema-v2.sql first.';
        RETURN;
    END IF;

    -- Migrate existing data if old table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') THEN
        RAISE NOTICE 'Migrating existing course data...';
        PERFORM migrate_courses_to_v2();
    END IF;

    -- Populate Python course
    RAISE NOTICE 'Populating Python course...';
    PERFORM populate_python_course();

    RAISE NOTICE 'Migration completed successfully!';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 5: CREATE VERIFICATION AND UTILITY FUNCTIONS
-- ============================================================================

-- Verification function
CREATE OR REPLACE FUNCTION verify_migration()
RETURNS TABLE(
    table_name TEXT,
    record_count BIGINT,
    sample_data TEXT
) AS $$
BEGIN
    -- Check courses_v2
    RETURN QUERY
    SELECT
        'courses_v2'::TEXT,
        COUNT(*)::BIGINT,
        string_agg(title, ', ')::TEXT
    FROM public.courses_v2
    LIMIT 5;

    -- Check modules
    RETURN QUERY
    SELECT
        'modules'::TEXT,
        COUNT(*)::BIGINT,
        string_agg(title, ', ')::TEXT
    FROM public.modules
    LIMIT 5;

    -- Check lessons
    RETURN QUERY
    SELECT
        'lessons'::TEXT,
        COUNT(*)::BIGINT,
        string_agg(title, ', ')::TEXT
    FROM public.lessons
    LIMIT 5;

    -- Check exercises
    RETURN QUERY
    SELECT
        'exercises'::TEXT,
        COUNT(*)::BIGINT,
        string_agg(title, ', ')::TEXT
    FROM public.exercises
    LIMIT 5;

    -- Check resources
    RETURN QUERY
    SELECT
        'resources'::TEXT,
        COUNT(*)::BIGINT,
        string_agg(title, ', ')::TEXT
    FROM public.resources
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- Rollback function
CREATE OR REPLACE FUNCTION rollback_migration()
RETURNS void AS $$
DECLARE
    backup_table_name TEXT;
BEGIN
    -- Find the most recent backup table
    SELECT table_name INTO backup_table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name LIKE 'courses_backup_%'
    ORDER BY table_name DESC
    LIMIT 1;

    IF backup_table_name IS NOT NULL THEN
        -- Restore from backup
        EXECUTE format('DROP TABLE IF EXISTS public.courses');
        EXECUTE format('ALTER TABLE public.%I RENAME TO courses', backup_table_name);

        RAISE NOTICE 'Rollback completed. Restored from %', backup_table_name;
    ELSE
        RAISE NOTICE 'No backup table found for rollback';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Cleanup function
CREATE OR REPLACE FUNCTION cleanup_after_migration()
RETURNS void AS $$
BEGIN
    -- Rename old courses table to deprecated
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') THEN
        ALTER TABLE public.courses RENAME TO courses_old_deprecated;
        RAISE NOTICE 'Old courses table renamed to courses_old_deprecated';
    END IF;

    -- Rename courses_v2 to courses
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses_v2') THEN
        ALTER TABLE public.courses_v2 RENAME TO courses;
        RAISE NOTICE 'courses_v2 renamed to courses';
    END IF;

    RAISE NOTICE 'Cleanup completed successfully';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 6: GRANT PERMISSIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION create_migration_backup() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION check_migration_status() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION migrate_courses_to_v2() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION populate_python_course() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION execute_complete_migration() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION verify_migration() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION rollback_migration() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION cleanup_after_migration() TO authenticated, anon;

-- ============================================================================
-- STEP 7: USAGE INSTRUCTIONS
-- ============================================================================

/*
USAGE INSTRUCTIONS:

1. First, make sure you have run database-schema-v2.sql to create the new tables

2. Run this entire script in your Supabase SQL editor

3. Check migration status:
   SELECT check_migration_status();

4. Execute the complete migration:
   SELECT execute_complete_migration();

5. Verify the results:
   SELECT * FROM verify_migration();

6. If everything looks good, cleanup old tables:
   SELECT cleanup_after_migration();

7. If there are issues, rollback:
   SELECT rollback_migration();

The migration will:
- Create backups of existing data
- Migrate any existing courses from JSONB to relational structure
- Populate a comprehensive Python course with modules, lessons, and exercises
- Verify all data was migrated correctly
*/
