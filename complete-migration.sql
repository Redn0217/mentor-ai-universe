-- Complete Migration Script for Mentor AI Universe Database
-- This script handles the complete migration from old JSONB structure to new relational structure

-- Step 1: Create backup and safety checks
CREATE OR REPLACE FUNCTION create_migration_backup()
RETURNS void AS $$
BEGIN
    -- Create backup table with timestamp
    EXECUTE format('CREATE TABLE IF NOT EXISTS courses_backup_%s AS SELECT * FROM public.courses', 
                   to_char(now(), 'YYYY_MM_DD_HH24_MI_SS'));
    
    RAISE NOTICE 'Backup created successfully';
END;
$$ LANGUAGE plpgsql;

-- Step 2: Check if migration is needed
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

-- Step 3: Complete migration function
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
    
    -- Create new schema if it doesn't exist
    RAISE NOTICE 'Creating new database schema...';
    
    -- Check if courses_v2 exists, if not create the new schema
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses_v2') THEN
        -- Execute the schema creation (this would be the content from database-schema-v2.sql)
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

-- Step 4: Rollback function (safety measure)
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

-- Step 5: Verification function
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

-- Step 6: Clean up old tables (run only after successful verification)
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION create_migration_backup() TO authenticated;
GRANT EXECUTE ON FUNCTION check_migration_status() TO authenticated;
GRANT EXECUTE ON FUNCTION execute_complete_migration() TO authenticated;
GRANT EXECUTE ON FUNCTION rollback_migration() TO authenticated;
GRANT EXECUTE ON FUNCTION verify_migration() TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_after_migration() TO authenticated;

-- Usage Instructions:
-- 1. First run: SELECT check_migration_status();
-- 2. Create new schema: Run database-schema-v2.sql
-- 3. Execute migration: SELECT execute_complete_migration();
-- 4. Verify results: SELECT * FROM verify_migration();
-- 5. If satisfied, cleanup: SELECT cleanup_after_migration();
-- 6. If issues, rollback: SELECT rollback_migration();
