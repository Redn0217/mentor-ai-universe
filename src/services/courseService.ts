
import { supabase } from '@/lib/supabase';
import type {
  Course,
  Module,
  Lesson,
  Exercise,
  Resource,
  CourseListItem,
  DatabaseCourse,
  DatabaseModule,
  DatabaseLesson,
  DatabaseExercise,
  DatabaseResource
} from '@/types/database';

// Legacy types for backward compatibility
export type { Course, Module, Lesson, Exercise, Resource };

// Function to get all courses (updated for new structure)
export const getCourses = async (): Promise<CourseListItem[]> => {
  try {
    // Try new relational structure first
    const { data, error } = await supabase
      .from('courses')
      .select(`
        id,
        slug,
        title,
        description,
        short_description,
        color,
        difficulty_level,
        estimated_duration_hours,
        tags,
        is_featured,
        tutor_name,
        tutor_avatar,
        updated_at
      `)
      .eq('is_published', true)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses from Supabase (new structure):', error);

      // Try old structure as fallback
      const { data: oldData, error: oldError } = await supabase
        .from('courses')
        .select('id, slug, title, description, color, last_updated');

      if (oldError) {
        console.error('Error fetching courses from old structure:', error);
        console.warn('No courses available');
        return [];
      }

      // Convert old structure to new format
      return oldData.map(course => ({
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        short_description: course.description?.substring(0, 150),
        color: course.color,
        difficulty_level: 'beginner' as const,
        estimated_duration_hours: 10,
        tags: [],
        is_featured: false,
        tutor: {
          name: 'Course Instructor',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor'
        },
        modules_count: 0,
        lessons_count: 0,
        exercises_count: 0,
        updated_at: course.last_updated || new Date().toISOString()
      }));
    }

    // Get counts for each course
    const coursesWithCounts = await Promise.all(
      data.map(async (course) => {
        const counts = await getCourseCounts(course.id);
        return {
          id: course.id,
          slug: course.slug,
          title: course.title,
          description: course.description,
          short_description: course.short_description,
          color: course.color,
          difficulty_level: course.difficulty_level,
          estimated_duration_hours: course.estimated_duration_hours,
          tags: course.tags || [],
          is_featured: course.is_featured,
          tutor: {
            name: course.tutor_name || 'Course Instructor',
            avatar: course.tutor_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor'
          },
          ...counts,
          updated_at: course.updated_at
        };
      })
    );

    return coursesWithCounts;
  } catch (error) {
    console.error('Error in getCourses:', error);
    console.warn('No courses available');
    return [];
  }
};

// Helper function to get course counts
const getCourseCounts = async (courseId: string) => {
  try {
    // First, get module IDs for this course
    const { data: modules } = await supabase
      .from('modules')
      .select('id')
      .eq('course_id', courseId)
      .eq('is_published', true);

    const moduleIds = modules?.map(m => m.id) || [];

    // Then get lesson IDs for these modules
    let lessonIds: string[] = [];
    if (moduleIds.length > 0) {
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id')
        .in('module_id', moduleIds)
        .eq('is_published', true);

      lessonIds = lessons?.map(l => l.id) || [];
    }

    // Now count everything
    const [modulesResult, lessonsResult, exercisesResult] = await Promise.all([
      supabase
        .from('modules')
        .select('id', { count: 'exact' })
        .eq('course_id', courseId)
        .eq('is_published', true),

      supabase
        .from('lessons')
        .select('id', { count: 'exact' })
        .in('module_id', moduleIds.length > 0 ? moduleIds : [''])
        .eq('is_published', true),

      // Count exercises that belong to either modules or lessons in this course
      moduleIds.length > 0 || lessonIds.length > 0
        ? supabase
            .from('exercises')
            .select('id', { count: 'exact' })
            .or(`module_id.in.(${moduleIds.join(',')}),lesson_id.in.(${lessonIds.join(',')})`)
            .eq('is_published', true)
        : Promise.resolve({ count: 0 })
    ]);

    return {
      modules_count: modulesResult.count || 0,
      lessons_count: lessonsResult.count || 0,
      exercises_count: exercisesResult.count || 0
    };
  } catch (error) {
    console.error('Error fetching course counts:', error);
    return {
      modules_count: 0,
      lessons_count: 0,
      exercises_count: 0
    };
  }
};

// Fallback courses data removed - all courses should come from database

// Function to get a specific course by slug (updated for new structure)
export const getCourse = async (slug: string): Promise<Course | null> => {
  try {
    // Try new relational structure first
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (courseError) {
      console.error(`Error fetching course with slug ${slug} from new structure:`, courseError);

      // Try old structure as fallback
      const { data: oldCourse, error: oldError } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .single();

      if (oldError) {
        console.error(`Error fetching course with slug ${slug} from old structure:`, oldError);
        console.warn('Falling back to local data');
        return getFallbackCourse(slug);
      }

      // Convert old structure to new format
      return convertOldCourseFormat(oldCourse);
    }

    // Get modules with lessons and exercises for new structure
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select(`
        *,
        lessons:lessons(
          *,
          exercises:exercises(*)
        ),
        exercises:exercises(*)
      `)
      .eq('course_id', course.id)
      .eq('is_published', true)
      .order('order_index');

    if (modulesError) {
      console.error('Error fetching modules:', modulesError);
      return getFallbackCourse(slug);
    }

    // Get course-level resources
    const { data: courseResources, error: resourcesError } = await supabase
      .from('resources')
      .select('*')
      .eq('course_id', course.id)
      .order('created_at');

    if (resourcesError) {
      console.error('Error fetching course resources:', resourcesError);
    }

    // Transform the data structure
    const transformedCourse: Course = {
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      short_description: course.short_description,
      icon: course.icon,
      color: course.color,
      difficulty_level: course.difficulty_level,
      estimated_duration_hours: course.estimated_duration_hours,
      prerequisites: course.prerequisites || [],
      learning_objectives: course.learning_objectives || [],
      tags: course.tags || [],
      is_published: course.is_published,
      is_featured: course.is_featured,
      tutor: {
        name: course.tutor_name || 'Course Instructor',
        avatar: course.tutor_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
        bio: course.tutor_bio
      },
      modules: (modules || []).map(module => ({
        id: module.id,
        title: module.title,
        description: module.description,
        slug: module.slug,
        order_index: module.order_index,
        estimated_duration_minutes: module.estimated_duration_minutes,
        difficulty_level: module.difficulty_level,
        learning_objectives: module.learning_objectives || [],
        prerequisites: module.prerequisites || [],
        is_published: module.is_published,
        lessons: (module.lessons || [])
          .filter((lesson: any) => lesson.is_published)
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((lesson: any) => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            slug: lesson.slug,
            order_index: lesson.order_index,
            content: lesson.content,
            content_type: lesson.content_type,
            estimated_duration_minutes: lesson.estimated_duration_minutes,
            difficulty_level: lesson.difficulty_level,
            learning_objectives: lesson.learning_objectives || [],
            key_concepts: lesson.key_concepts || [],
            code_examples: lesson.code_examples || [],
            video_url: lesson.video_url,
            video_duration_seconds: lesson.video_duration_seconds,
            is_published: lesson.is_published,
            exercises: (lesson.exercises || [])
              .filter((exercise: any) => exercise.is_published)
              .sort((a: any, b: any) => a.order_index - b.order_index),
            created_at: lesson.created_at,
            updated_at: lesson.updated_at
          })),
        exercises: (module.exercises || [])
          .filter((exercise: any) => exercise.is_published)
          .sort((a: any, b: any) => a.order_index - b.order_index),
        resources: [],
        created_at: module.created_at,
        updated_at: module.updated_at
      })),
      created_at: course.created_at,
      updated_at: course.updated_at
    };

    return transformedCourse;
  } catch (error) {
    console.error(`Error in getCourse for slug ${slug}:`, error);
    console.warn('Falling back to local data');
    return getFallbackCourse(slug);
  }
};

// Helper function to convert old course format
const convertOldCourseFormat = (oldCourse: any): Course => {
  return {
    id: oldCourse.id,
    slug: oldCourse.slug,
    title: oldCourse.title,
    description: oldCourse.description,
    short_description: oldCourse.description?.substring(0, 150),
    icon: oldCourse.icon || 'code',
    color: oldCourse.color,
    difficulty_level: 'beginner',
    estimated_duration_hours: 10,
    prerequisites: [],
    learning_objectives: [],
    tags: [],
    is_published: true,
    is_featured: false,
    tutor: oldCourse.tutor || {
      name: 'Course Instructor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor'
    },
    modules: Array.isArray(oldCourse.modules) ? oldCourse.modules.map((module: any, index: number) => ({
      id: module.id || `module-${index}`,
      title: module.title,
      description: module.description,
      slug: module.title?.toLowerCase().replace(/\s+/g, '-') || `module-${index}`,
      order_index: index + 1,
      estimated_duration_minutes: 60,
      difficulty_level: 'beginner',
      learning_objectives: [],
      prerequisites: [],
      is_published: true,
      lessons: Array.isArray(module.lessons) ? module.lessons.map((lesson: any, lessonIndex: number) => ({
        id: lesson.id || `lesson-${lessonIndex}`,
        title: lesson.title,
        description: lesson.description || '',
        slug: lesson.title?.toLowerCase().replace(/\s+/g, '-') || `lesson-${lessonIndex}`,
        order_index: lessonIndex + 1,
        content: lesson.content || '',
        content_type: 'markdown',
        estimated_duration_minutes: lesson.duration || 15,
        difficulty_level: 'beginner',
        learning_objectives: [],
        key_concepts: [],
        code_examples: [],
        is_published: true,
        exercises: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })) : [],
      exercises: Array.isArray(module.exercises) ? module.exercises : [],
      resources: Array.isArray(module.resources) ? module.resources : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })) : [],
    created_at: oldCourse.created_at || new Date().toISOString(),
    updated_at: oldCourse.updated_at || new Date().toISOString()
  };
};

// Helper function to get fallback course
const getFallbackCourse = (slug: string): Course | null => {
  const fallbackCourses: { [key: string]: Course } = {
    python: {
      id: "python",
      slug: "python",
      title: "Python Programming",
      description: "Learn Python programming from basics to advanced concepts with practical exercises.",
      short_description: "Complete Python programming course from beginner to advanced level",
      icon: "code",
      color: "#3776AB",
      difficulty_level: "beginner",
      estimated_duration_hours: 40,
      prerequisites: [],
      learning_objectives: [
        "Understand Python syntax and basic programming concepts",
        "Work with Python data types and structures",
        "Implement control flow and functions"
      ],
      tags: ["python", "programming", "beginner"],
      is_published: true,
      is_featured: true,
      tutor: {
        name: "Dr. Ana Python",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
        bio: "Senior Python Developer with 10+ years of experience"
      },
      modules: [
        {
          id: "module1",
          title: "Python Fundamentals",
          description: "Get started with Python programming basics",
          slug: "python-fundamentals",
          order_index: 1,
          estimated_duration_minutes: 180,
          difficulty_level: "beginner",
          learning_objectives: ["Set up Python development environment"],
          prerequisites: [],
          is_published: true,
          lessons: [
            {
              id: "lesson1",
              title: "Python Introduction",
              description: "What is Python and why use it?",
              slug: "python-introduction",
              order_index: 1,
              content: "# Python Introduction\n\nPython is a popular programming language...",
              content_type: "markdown",
              estimated_duration_minutes: 15,
              difficulty_level: "beginner",
              learning_objectives: [],
              key_concepts: ["Python history", "Use cases"],
              code_examples: [],
              is_published: true,
              exercises: [],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ],
          exercises: [],
          resources: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };

  return fallbackCourses[slug] || null;
};

// Function to create a new course (updated for new structure)
export const createCourse = async (course: Partial<Course>): Promise<Course> => {
  try {
    const courseData = {
      slug: course.slug,
      title: course.title,
      description: course.description,
      short_description: course.short_description,
      icon: course.icon || 'code',
      color: course.color || '#3776AB',
      difficulty_level: course.difficulty_level || 'beginner',
      estimated_duration_hours: course.estimated_duration_hours || 0,
      prerequisites: course.prerequisites || [],
      learning_objectives: course.learning_objectives || [],
      tags: course.tags || [],
      is_published: course.is_published || false,
      is_featured: course.is_featured || false,
      tutor_name: course.tutor?.name || 'Course Instructor',
      tutor_avatar: course.tutor?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
      tutor_bio: course.tutor?.bio
    };

    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select()
      .single();

    if (error) {
      console.error('Error creating course:', error);
      throw error;
    }

    // Convert back to our app format
    return {
      ...data,
      tutor: {
        name: data.tutor_name,
        avatar: data.tutor_avatar,
        bio: data.tutor_bio
      },
      modules: []
    };
  } catch (error) {
    console.error('Error in createCourse:', error);
    throw error;
  }
};

// Function to update an existing course (updated for new structure)
export const updateCourse = async (slug: string, course: Partial<Course>): Promise<Course> => {
  try {
    const courseData = {
      title: course.title,
      description: course.description,
      short_description: course.short_description,
      icon: course.icon,
      color: course.color,
      difficulty_level: course.difficulty_level,
      estimated_duration_hours: course.estimated_duration_hours,
      prerequisites: course.prerequisites,
      learning_objectives: course.learning_objectives,
      tags: course.tags,
      is_published: course.is_published,
      is_featured: course.is_featured,
      tutor_name: course.tutor?.name,
      tutor_avatar: course.tutor?.avatar,
      tutor_bio: course.tutor?.bio,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      console.error('Error updating course:', error);
      throw error;
    }

    // Convert back to our app format
    return {
      ...data,
      tutor: {
        name: data.tutor_name,
        avatar: data.tutor_avatar,
        bio: data.tutor_bio
      },
      modules: [] // Modules would need to be fetched separately
    };
  } catch (error) {
    console.error('Error in updateCourse:', error);
    throw error;
  }
};

// Function to delete a course (updated for new structure)
export const deleteCourse = async (slug: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('slug', slug);

    if (error) {
      console.error('Error deleting course:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteCourse:', error);
    throw error;
  }
};

// Function to get user progress for a course
export const getUserCourseProgress = async (userId: string, courseId: string) => {
  try {
    const { data, error } = await supabase.rpc('get_user_course_progress', {
      user_uuid: userId,
      course_uuid: courseId
    });

    if (error) {
      console.error('Error fetching user course progress:', error);
      return {
        total_lessons: 0,
        completed_lessons: 0,
        total_exercises: 0,
        completed_exercises: 0,
        progress_percentage: 0
      };
    }

    return data;
  } catch (error) {
    console.error('Error in getUserCourseProgress:', error);
    return {
      total_lessons: 0,
      completed_lessons: 0,
      total_exercises: 0,
      completed_exercises: 0,
      progress_percentage: 0
    };
  }
};

// Function to track user progress
export const trackUserProgress = async (
  userId: string,
  progressData: {
    course_id?: string;
    module_id?: string;
    lesson_id?: string;
    exercise_id?: string;
    progress_type: string;
    completion_percentage?: number;
    time_spent_minutes?: number;
  }
) => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert([{
        user_id: userId,
        ...progressData,
        last_accessed_at: new Date().toISOString(),
        completed_at: progressData.completion_percentage === 100 ? new Date().toISOString() : null
      }])
      .select()
      .single();

    if (error) {
      console.error('Error tracking user progress:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in trackUserProgress:', error);
    throw error;
  }
};
