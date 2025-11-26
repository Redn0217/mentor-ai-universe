// Course Service for New Relational Database Structure
const { supabase } = require('../lib/supabase');

class CourseService {
  // Get all courses with counts
  async getAllCourses() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          id,
          slug,
          title,
          description,
          short_description,
          icon,
          color,
          difficulty_level,
          estimated_duration_hours,
          prerequisites,
          learning_objectives,
          tags,
          is_published,
          is_featured,
          tutor_name,
          tutor_avatar,
          tutor_bio,
          created_at,
          updated_at
        `)
        .eq('is_published', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Get counts for each course
      const coursesWithCounts = await Promise.all(
        data.map(async (course) => {
          const counts = await this.getCourseCounts(course.id);
          return {
            ...course,
            tutor: {
              name: course.tutor_name || 'Course Instructor',
              avatar: course.tutor_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
              bio: course.tutor_bio
            },
            ...counts
          };
        })
      );

      return coursesWithCounts;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  // Get course counts (modules, lessons, exercises)
  async getCourseCounts(courseId) {
    try {
      // First, get module IDs for this course
      const { data: modules, error: modulesError } = await supabase
        .from('modules')
        .select('id')
        .eq('course_id', courseId)
        .eq('is_published', true);

      if (modulesError) {
        console.error('Error fetching modules for counts:', modulesError);
      }

      const moduleIds = modules?.map(m => m.id) || [];
      console.log(`📊 Course ${courseId}: Found ${moduleIds.length} modules`);

      // Then get lesson IDs for these modules
      let lessonIds = [];
      if (moduleIds.length > 0) {
        const { data: lessons, error: lessonsError } = await supabase
          .from('lessons')
          .select('id')
          .in('module_id', moduleIds)
          .eq('is_published', true);

        if (lessonsError) {
          console.error('Error fetching lessons for counts:', lessonsError);
        }

        lessonIds = lessons?.map(l => l.id) || [];
        console.log(`📊 Course ${courseId}: Found ${lessonIds.length} lessons`);
      }

      // Count exercises - check both module_id and lesson_id
      let exercisesCount = 0;
      if (moduleIds.length > 0 || lessonIds.length > 0) {
        // Build the OR filter properly
        const filters = [];
        if (moduleIds.length > 0) {
          filters.push(`module_id.in.(${moduleIds.join(',')})`);
        }
        if (lessonIds.length > 0) {
          filters.push(`lesson_id.in.(${lessonIds.join(',')})`);
        }

        const { count, error: exercisesError, data: exercisesData } = await supabase
          .from('exercises')
          .select('*', { count: 'exact' })
          .or(filters.join(','))
          .eq('is_published', true);

        if (exercisesError) {
          console.error('Error fetching exercises for counts:', exercisesError);
        } else {
          exercisesCount = count || 0;
          console.log(`📊 Course ${courseId}: Found ${exercisesCount} exercises`);
          if (exercisesData && exercisesData.length > 0) {
            console.log(`📊 Sample exercises:`, exercisesData.slice(0, 2).map(e => ({ id: e.id, title: e.title, module_id: e.module_id, lesson_id: e.lesson_id })));
          }
        }
      }

      // Now count everything
      const [modulesResult, lessonsResult] = await Promise.all([
        supabase
          .from('modules')
          .select('id', { count: 'exact' })
          .eq('course_id', courseId)
          .eq('is_published', true),

        supabase
          .from('lessons')
          .select('id', { count: 'exact' })
          .in('module_id', moduleIds.length > 0 ? moduleIds : [''])
          .eq('is_published', true)
      ]);

      const result = {
        modules_count: modulesResult.count || 0,
        lessons_count: lessonsResult.count || 0,
        exercises_count: exercisesCount
      };

      console.log(`📊 Final counts for course ${courseId}:`, result);

      return result;
    } catch (error) {
      console.error('Error fetching course counts:', error);
      return {
        modules_count: 0,
        lessons_count: 0,
        exercises_count: 0
      };
    }
  }

  // Get single course with full hierarchy
  async getCourseBySlug(slug) {
    try {
      // Get course basic info
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (courseError) throw courseError;

      // Get modules with lessons and exercises
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

      if (modulesError) throw modulesError;

      // Get course-level resources
      const { data: courseResources, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .eq('course_id', course.id)
        .order('created_at');

      if (resourcesError) throw resourcesError;

      // Transform the data structure
      const transformedCourse = {
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
        modules: modules.map(module => ({
          id: module.id,
          title: module.title,
          description: module.description,
          slug: module.slug,
          order_index: module.order_index,
          estimated_duration_minutes: module.estimated_duration_minutes,
          difficulty_level: module.difficulty_level,
          learning_objectives: module.learning_objectives || [],
          prerequisites: module.prerequisites || [],
          lessons: (module.lessons || [])
            .filter(lesson => lesson.is_published)
            .sort((a, b) => a.order_index - b.order_index)
            .map(lesson => ({
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
              exercises: (lesson.exercises || [])
                .filter(exercise => exercise.is_published)
                .sort((a, b) => a.order_index - b.order_index)
            })),
          exercises: (module.exercises || [])
            .filter(exercise => exercise.is_published)
            .sort((a, b) => a.order_index - b.order_index),
          resources: []
        })),
        resources: courseResources || [],
        created_at: course.created_at,
        updated_at: course.updated_at,
        // Backward compatibility
        lastUpdated: course.updated_at?.split('T')[0] || new Date().toISOString().split('T')[0]
      };

      return transformedCourse;
    } catch (error) {
      console.error('Error fetching course by slug:', error);
      throw error;
    }
  }

  // Create new course
  async createCourse(courseData) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([{
          slug: courseData.slug,
          title: courseData.title,
          description: courseData.description,
          short_description: courseData.short_description,
          icon: courseData.icon || 'code',
          color: courseData.color || '#3776AB',
          difficulty_level: courseData.difficulty_level || 'beginner',
          estimated_duration_hours: courseData.estimated_duration_hours || 0,
          prerequisites: courseData.prerequisites || [],
          learning_objectives: courseData.learning_objectives || [],
          tags: courseData.tags || [],
          is_published: courseData.is_published || false,
          is_featured: courseData.is_featured || false,
          tutor_name: courseData.tutor?.name || 'Course Instructor',
          tutor_avatar: courseData.tutor?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
          tutor_bio: courseData.tutor?.bio
        }])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  // Update course
  async updateCourse(slug, courseData) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update({
          title: courseData.title,
          description: courseData.description,
          short_description: courseData.short_description,
          icon: courseData.icon,
          color: courseData.color,
          difficulty_level: courseData.difficulty_level,
          estimated_duration_hours: courseData.estimated_duration_hours,
          prerequisites: courseData.prerequisites,
          learning_objectives: courseData.learning_objectives,
          tags: courseData.tags,
          is_published: courseData.is_published,
          is_featured: courseData.is_featured,
          tutor_name: courseData.tutor?.name,
          tutor_avatar: courseData.tutor?.avatar,
          tutor_bio: courseData.tutor?.bio,
          updated_at: new Date().toISOString()
        })
        .eq('slug', slug)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  // Delete course
  async deleteCourse(slug) {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('slug', slug);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  // Get user progress for a course
  async getUserCourseProgress(userId, courseId) {
    try {
      const { data, error } = await supabase.rpc('get_user_course_progress', {
        user_uuid: userId,
        course_uuid: courseId
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching user course progress:', error);
      return {
        total_lessons: 0,
        completed_lessons: 0,
        total_exercises: 0,
        completed_exercises: 0,
        progress_percentage: 0
      };
    }
  }
}

module.exports = new CourseService();
