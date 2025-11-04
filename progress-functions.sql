-- Progress tracking functions for the course platform

-- Function to get user's course progress summary
CREATE OR REPLACE FUNCTION get_user_course_progress(user_uuid UUID, course_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
    total_lessons INTEGER;
    completed_lessons INTEGER;
    total_exercises INTEGER;
    completed_exercises INTEGER;
    total_modules INTEGER;
    completed_modules INTEGER;
    total_time INTEGER;
    last_access TIMESTAMP;
BEGIN
    -- Get total counts
    SELECT 
        COUNT(DISTINCT m.id),
        COUNT(DISTINCT l.id),
        COUNT(DISTINCT e.id)
    INTO total_modules, total_lessons, total_exercises
    FROM courses c
    LEFT JOIN modules m ON c.id = m.course_id AND m.is_published = true
    LEFT JOIN lessons l ON m.id = l.module_id AND l.is_published = true
    LEFT JOIN exercises e ON (l.id = e.lesson_id OR m.id = e.module_id) AND e.is_published = true
    WHERE c.id = course_uuid;

    -- Get completed counts
    SELECT 
        COUNT(DISTINCT CASE WHEN up.progress_type = 'lesson_completed' AND up.completion_percentage = 100 THEN up.lesson_id END),
        COUNT(DISTINCT CASE WHEN up.progress_type = 'exercise_completed' AND up.completion_percentage = 100 THEN up.exercise_id END),
        COALESCE(SUM(up.time_spent_minutes), 0),
        MAX(up.last_accessed_at)
    INTO completed_lessons, completed_exercises, total_time, last_access
    FROM user_progress up
    WHERE up.user_id = user_uuid AND up.course_id = course_uuid;

    -- Calculate completed modules (modules where all lessons and exercises are completed)
    SELECT COUNT(*)
    INTO completed_modules
    FROM modules m
    WHERE m.course_id = course_uuid 
    AND m.is_published = true
    AND NOT EXISTS (
        SELECT 1 FROM lessons l 
        WHERE l.module_id = m.id 
        AND l.is_published = true
        AND NOT EXISTS (
            SELECT 1 FROM user_progress up 
            WHERE up.lesson_id = l.id 
            AND up.user_id = user_uuid 
            AND up.progress_type = 'lesson_completed' 
            AND up.completion_percentage = 100
        )
    )
    AND NOT EXISTS (
        SELECT 1 FROM exercises e 
        WHERE (e.module_id = m.id OR e.lesson_id IN (SELECT id FROM lessons WHERE module_id = m.id))
        AND e.is_published = true
        AND NOT EXISTS (
            SELECT 1 FROM user_progress up 
            WHERE up.exercise_id = e.id 
            AND up.user_id = user_uuid 
            AND up.progress_type = 'exercise_completed' 
            AND up.completion_percentage = 100
        )
    );

    -- Build result JSON
    result := json_build_object(
        'course_id', course_uuid,
        'total_modules', COALESCE(total_modules, 0),
        'completed_modules', COALESCE(completed_modules, 0),
        'total_lessons', COALESCE(total_lessons, 0),
        'completed_lessons', COALESCE(completed_lessons, 0),
        'total_exercises', COALESCE(total_exercises, 0),
        'completed_exercises', COALESCE(completed_exercises, 0),
        'progress_percentage', CASE 
            WHEN (COALESCE(total_lessons, 0) + COALESCE(total_exercises, 0)) > 0 
            THEN ROUND(((COALESCE(completed_lessons, 0) + COALESCE(completed_exercises, 0))::DECIMAL / (COALESCE(total_lessons, 0) + COALESCE(total_exercises, 0))) * 100, 2)
            ELSE 0 
        END,
        'time_spent_minutes', COALESCE(total_time, 0),
        'last_accessed_at', COALESCE(last_access, NOW())
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get module progress for a user
CREATE OR REPLACE FUNCTION get_user_module_progress(user_uuid UUID, course_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
    module_record RECORD;
    module_progress JSON;
    all_modules JSON := '{}';
BEGIN
    -- Loop through all modules in the course
    FOR module_record IN 
        SELECT m.id, m.title, m.slug
        FROM modules m
        WHERE m.course_id = course_uuid AND m.is_published = true
        ORDER BY m.order_index
    LOOP
        -- Get progress for this module
        SELECT json_build_object(
            'module_id', module_record.id,
            'is_started', EXISTS(
                SELECT 1 FROM user_progress up 
                WHERE up.user_id = user_uuid 
                AND up.module_id = module_record.id 
                AND up.progress_type = 'module_started'
            ),
            'is_completed', NOT EXISTS(
                SELECT 1 FROM lessons l 
                WHERE l.module_id = module_record.id 
                AND l.is_published = true
                AND NOT EXISTS (
                    SELECT 1 FROM user_progress up 
                    WHERE up.lesson_id = l.id 
                    AND up.user_id = user_uuid 
                    AND up.progress_type = 'lesson_completed' 
                    AND up.completion_percentage = 100
                )
            ) AND NOT EXISTS(
                SELECT 1 FROM exercises e 
                WHERE (e.module_id = module_record.id OR e.lesson_id IN (SELECT id FROM lessons WHERE module_id = module_record.id))
                AND e.is_published = true
                AND NOT EXISTS (
                    SELECT 1 FROM user_progress up 
                    WHERE up.exercise_id = e.id 
                    AND up.user_id = user_uuid 
                    AND up.progress_type = 'exercise_completed' 
                    AND up.completion_percentage = 100
                )
            ),
            'completed_lessons', (
                SELECT COUNT(*)
                FROM lessons l
                WHERE l.module_id = module_record.id 
                AND l.is_published = true
                AND EXISTS (
                    SELECT 1 FROM user_progress up 
                    WHERE up.lesson_id = l.id 
                    AND up.user_id = user_uuid 
                    AND up.progress_type = 'lesson_completed' 
                    AND up.completion_percentage = 100
                )
            ),
            'total_lessons', (
                SELECT COUNT(*)
                FROM lessons l
                WHERE l.module_id = module_record.id AND l.is_published = true
            ),
            'completed_exercises', (
                SELECT COUNT(*)
                FROM exercises e
                WHERE (e.module_id = module_record.id OR e.lesson_id IN (SELECT id FROM lessons WHERE module_id = module_record.id))
                AND e.is_published = true
                AND EXISTS (
                    SELECT 1 FROM user_progress up 
                    WHERE up.exercise_id = e.id 
                    AND up.user_id = user_uuid 
                    AND up.progress_type = 'exercise_completed' 
                    AND up.completion_percentage = 100
                )
            ),
            'total_exercises', (
                SELECT COUNT(*)
                FROM exercises e
                WHERE (e.module_id = module_record.id OR e.lesson_id IN (SELECT id FROM lessons WHERE module_id = module_record.id))
                AND e.is_published = true
            ),
            'time_spent_minutes', COALESCE((
                SELECT SUM(up.time_spent_minutes)
                FROM user_progress up
                WHERE up.user_id = user_uuid AND up.module_id = module_record.id
            ), 0),
            'last_accessed_at', (
                SELECT MAX(up.last_accessed_at)
                FROM user_progress up
                WHERE up.user_id = user_uuid AND up.module_id = module_record.id
            )
        ) INTO module_progress;

        -- Add to result object
        all_modules := all_modules || json_build_object(module_record.id::text, module_progress);
    END LOOP;

    RETURN all_modules;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has completed a lesson
CREATE OR REPLACE FUNCTION is_lesson_completed(user_uuid UUID, lesson_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1 FROM user_progress 
        WHERE user_id = user_uuid 
        AND lesson_id = lesson_uuid 
        AND progress_type = 'lesson_completed' 
        AND completion_percentage = 100
    );
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has completed an exercise
CREATE OR REPLACE FUNCTION is_exercise_completed(user_uuid UUID, exercise_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1 FROM user_progress 
        WHERE user_id = user_uuid 
        AND exercise_id = exercise_uuid 
        AND progress_type = 'exercise_completed' 
        AND completion_percentage = 100
    );
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_user_course_progress(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_module_progress(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_lesson_completed(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_exercise_completed(UUID, UUID) TO authenticated;
