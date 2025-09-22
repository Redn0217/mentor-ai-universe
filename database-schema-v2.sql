-- Enhanced Database Schema for Mentor AI Universe Platform
-- Version 2.0 - Hierarchical Course Structure
-- This schema replaces the JSONB-based structure with proper relational tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.exercise_submissions CASCADE;
DROP TABLE IF EXISTS public.resources CASCADE;
DROP TABLE IF EXISTS public.exercises CASCADE;
DROP TABLE IF EXISTS public.lessons CASCADE;
DROP TABLE IF EXISTS public.modules CASCADE;
DROP TABLE IF EXISTS public.courses_v2 CASCADE;

-- 1. COURSES TABLE (Enhanced)
CREATE TABLE public.courses_v2 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    icon TEXT DEFAULT 'code',
    color TEXT DEFAULT '#3776AB',
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    estimated_duration_hours INTEGER DEFAULT 0,
    prerequisites TEXT[],
    learning_objectives TEXT[],
    tags TEXT[],
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    tutor_name TEXT,
    tutor_avatar TEXT,
    tutor_bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- 2. MODULES TABLE
CREATE TABLE public.modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses_v2(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    estimated_duration_minutes INTEGER DEFAULT 0,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    learning_objectives TEXT[],
    prerequisites TEXT[],
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, slug),
    UNIQUE(course_id, order_index)
);

-- 3. LESSONS TABLE
CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    content_type TEXT CHECK (content_type IN ('text', 'markdown', 'html', 'video', 'interactive')) DEFAULT 'markdown',
    estimated_duration_minutes INTEGER DEFAULT 15,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    learning_objectives TEXT[],
    key_concepts TEXT[],
    code_examples JSONB DEFAULT '[]'::jsonb,
    video_url TEXT,
    video_duration_seconds INTEGER,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(module_id, slug),
    UNIQUE(module_id, order_index)
);

-- 4. EXERCISES TABLE
CREATE TABLE public.exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    slug TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    exercise_type TEXT CHECK (exercise_type IN ('coding', 'quiz', 'project', 'assignment', 'practice')) DEFAULT 'coding',
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    estimated_time_minutes INTEGER DEFAULT 30,
    instructions TEXT NOT NULL,
    starter_code TEXT,
    solution_code TEXT,
    test_cases JSONB DEFAULT '[]'::jsonb,
    hints TEXT[],
    tags TEXT[],
    points INTEGER DEFAULT 10,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT exercise_parent_check CHECK (
        (lesson_id IS NOT NULL AND module_id IS NULL) OR 
        (lesson_id IS NULL AND module_id IS NOT NULL)
    )
);

-- 5. RESOURCES TABLE
CREATE TABLE public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses_v2(id) ON DELETE CASCADE,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    resource_type TEXT CHECK (resource_type IN ('article', 'video', 'book', 'documentation', 'tutorial', 'tool', 'cheatsheet', 'reference')) NOT NULL,
    url TEXT NOT NULL,
    is_external BOOLEAN DEFAULT true,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    estimated_time_minutes INTEGER,
    tags TEXT[],
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT resource_parent_check CHECK (
        (course_id IS NOT NULL AND module_id IS NULL AND lesson_id IS NULL) OR
        (course_id IS NULL AND module_id IS NOT NULL AND lesson_id IS NULL) OR
        (course_id IS NULL AND module_id IS NULL AND lesson_id IS NOT NULL)
    )
);

-- 6. USER PROGRESS TABLE
CREATE TABLE public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses_v2(id) ON DELETE CASCADE,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE,
    progress_type TEXT CHECK (progress_type IN ('course_enrolled', 'course_completed', 'module_started', 'module_completed', 'lesson_viewed', 'lesson_completed', 'exercise_attempted', 'exercise_completed')) NOT NULL,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    time_spent_minutes INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id, module_id, lesson_id, exercise_id, progress_type)
);

-- 7. EXERCISE SUBMISSIONS TABLE
CREATE TABLE public.exercise_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    submission_code TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    score INTEGER DEFAULT 0,
    feedback TEXT,
    execution_time_ms INTEGER,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CREATE INDEXES FOR PERFORMANCE
CREATE INDEX idx_courses_v2_slug ON public.courses_v2(slug);
CREATE INDEX idx_courses_v2_published ON public.courses_v2(is_published);
CREATE INDEX idx_courses_v2_featured ON public.courses_v2(is_featured);
CREATE INDEX idx_modules_course_id ON public.modules(course_id);
CREATE INDEX idx_modules_order ON public.modules(course_id, order_index);
CREATE INDEX idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX idx_lessons_order ON public.lessons(module_id, order_index);
CREATE INDEX idx_exercises_lesson_id ON public.exercises(lesson_id);
CREATE INDEX idx_exercises_module_id ON public.exercises(module_id);
CREATE INDEX idx_resources_course_id ON public.resources(course_id);
CREATE INDEX idx_resources_module_id ON public.resources(module_id);
CREATE INDEX idx_resources_lesson_id ON public.resources(lesson_id);
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_course_id ON public.user_progress(course_id);
CREATE INDEX idx_exercise_submissions_user_id ON public.exercise_submissions(user_id);
CREATE INDEX idx_exercise_submissions_exercise_id ON public.exercise_submissions(exercise_id);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.courses_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_submissions ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR COURSES_V2
CREATE POLICY "Allow public read access to published courses" ON public.courses_v2
    FOR SELECT USING (is_published = true);

CREATE POLICY "Allow authenticated users to read all courses" ON public.courses_v2
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow course creators to manage their courses" ON public.courses_v2
    FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Allow admins to manage all courses" ON public.courses_v2
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- RLS POLICIES FOR MODULES
CREATE POLICY "Allow public read access to published modules" ON public.modules
    FOR SELECT USING (
        is_published = true AND
        EXISTS (SELECT 1 FROM public.courses_v2 WHERE id = course_id AND is_published = true)
    );

CREATE POLICY "Allow authenticated users to read all modules" ON public.modules
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow course creators to manage modules" ON public.modules
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.courses_v2 WHERE id = course_id AND created_by = auth.uid())
    );

-- RLS POLICIES FOR LESSONS
CREATE POLICY "Allow public read access to published lessons" ON public.lessons
    FOR SELECT USING (
        is_published = true AND
        EXISTS (
            SELECT 1 FROM public.modules m
            JOIN public.courses_v2 c ON m.course_id = c.id
            WHERE m.id = module_id AND m.is_published = true AND c.is_published = true
        )
    );

CREATE POLICY "Allow authenticated users to read all lessons" ON public.lessons
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow course creators to manage lessons" ON public.lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.modules m
            JOIN public.courses_v2 c ON m.course_id = c.id
            WHERE m.id = module_id AND c.created_by = auth.uid()
        )
    );

-- RLS POLICIES FOR EXERCISES
CREATE POLICY "Allow public read access to published exercises" ON public.exercises
    FOR SELECT USING (
        is_published = true AND (
            (lesson_id IS NOT NULL AND EXISTS (
                SELECT 1 FROM public.lessons l
                JOIN public.modules m ON l.module_id = m.id
                JOIN public.courses_v2 c ON m.course_id = c.id
                WHERE l.id = lesson_id AND l.is_published = true AND m.is_published = true AND c.is_published = true
            )) OR
            (module_id IS NOT NULL AND EXISTS (
                SELECT 1 FROM public.modules m
                JOIN public.courses_v2 c ON m.course_id = c.id
                WHERE m.id = exercises.module_id AND m.is_published = true AND c.is_published = true
            ))
        )
    );

CREATE POLICY "Allow authenticated users to read all exercises" ON public.exercises
    FOR SELECT USING (auth.role() = 'authenticated');

-- RLS POLICIES FOR RESOURCES
CREATE POLICY "Allow public read access to resources" ON public.resources
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to manage resources" ON public.resources
    FOR ALL USING (auth.role() = 'authenticated');

-- RLS POLICIES FOR USER PROGRESS
CREATE POLICY "Allow users to manage their own progress" ON public.user_progress
    FOR ALL USING (auth.uid() = user_id);

-- RLS POLICIES FOR EXERCISE SUBMISSIONS
CREATE POLICY "Allow users to manage their own submissions" ON public.exercise_submissions
    FOR ALL USING (auth.uid() = user_id);

-- UTILITY FUNCTIONS

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_courses_v2_updated_at BEFORE UPDATE ON public.courses_v2 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON public.exercises FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get course hierarchy
CREATE OR REPLACE FUNCTION get_course_with_hierarchy(course_slug TEXT)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'course', row_to_json(c.*),
        'modules', COALESCE(modules_array, '[]'::json)
    ) INTO result
    FROM public.courses_v2 c
    LEFT JOIN (
        SELECT
            m.course_id,
            json_agg(
                json_build_object(
                    'module', row_to_json(m.*),
                    'lessons', COALESCE(lessons_array, '[]'::json),
                    'exercises', COALESCE(module_exercises_array, '[]'::json)
                ) ORDER BY m.order_index
            ) as modules_array
        FROM public.modules m
        LEFT JOIN (
            SELECT
                l.module_id,
                json_agg(
                    json_build_object(
                        'lesson', row_to_json(l.*),
                        'exercises', COALESCE(lesson_exercises_array, '[]'::json)
                    ) ORDER BY l.order_index
                ) as lessons_array
            FROM public.lessons l
            LEFT JOIN (
                SELECT
                    e.lesson_id,
                    json_agg(row_to_json(e.*) ORDER BY e.order_index) as lesson_exercises_array
                FROM public.exercises e
                WHERE e.lesson_id IS NOT NULL
                GROUP BY e.lesson_id
            ) le ON l.id = le.lesson_id
            GROUP BY l.module_id
        ) ml ON m.id = ml.module_id
        LEFT JOIN (
            SELECT
                e.module_id,
                json_agg(row_to_json(e.*) ORDER BY e.order_index) as module_exercises_array
            FROM public.exercises e
            WHERE e.module_id IS NOT NULL
            GROUP BY e.module_id
        ) me ON m.id = me.module_id
        GROUP BY m.course_id
    ) cm ON c.id = cm.course_id
    WHERE c.slug = course_slug;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate course progress for a user
CREATE OR REPLACE FUNCTION get_user_course_progress(user_uuid UUID, course_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
    total_lessons INTEGER;
    completed_lessons INTEGER;
    total_exercises INTEGER;
    completed_exercises INTEGER;
    progress_percentage INTEGER;
BEGIN
    -- Count total lessons in course
    SELECT COUNT(*) INTO total_lessons
    FROM public.lessons l
    JOIN public.modules m ON l.module_id = m.id
    WHERE m.course_id = course_uuid AND l.is_published = true;

    -- Count completed lessons
    SELECT COUNT(*) INTO completed_lessons
    FROM public.user_progress up
    JOIN public.lessons l ON up.lesson_id = l.id
    JOIN public.modules m ON l.module_id = m.id
    WHERE up.user_id = user_uuid
    AND m.course_id = course_uuid
    AND up.progress_type = 'lesson_completed';

    -- Count total exercises in course
    SELECT COUNT(*) INTO total_exercises
    FROM public.exercises e
    LEFT JOIN public.lessons l ON e.lesson_id = l.id
    LEFT JOIN public.modules m ON COALESCE(e.module_id, l.module_id) = m.id
    WHERE m.course_id = course_uuid AND e.is_published = true;

    -- Count completed exercises
    SELECT COUNT(*) INTO completed_exercises
    FROM public.user_progress up
    JOIN public.exercises e ON up.exercise_id = e.id
    LEFT JOIN public.lessons l ON e.lesson_id = l.id
    LEFT JOIN public.modules m ON COALESCE(e.module_id, l.module_id) = m.id
    WHERE up.user_id = user_uuid
    AND m.course_id = course_uuid
    AND up.progress_type = 'exercise_completed';

    -- Calculate overall progress percentage
    IF (total_lessons + total_exercises) > 0 THEN
        progress_percentage := ROUND(((completed_lessons + completed_exercises) * 100.0) / (total_lessons + total_exercises));
    ELSE
        progress_percentage := 0;
    END IF;

    SELECT json_build_object(
        'total_lessons', total_lessons,
        'completed_lessons', completed_lessons,
        'total_exercises', total_exercises,
        'completed_exercises', completed_exercises,
        'progress_percentage', progress_percentage
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
