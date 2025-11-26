import { supabase } from '@/lib/supabase';

export interface EnrolledCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  short_description?: string;
  color: string;
  icon?: string;
  difficulty_level?: string;
  estimated_duration_hours?: number;
  tutor_name?: string;
  tutor_avatar?: string;
  enrolled_at: string;
  last_accessed_at: string;
  completion_percentage: number;
}

class EnrollmentService {
  /**
   * Enroll a user in a course
   */
  async enrollInCourse(userId: string, courseId: string): Promise<boolean> {
    try {
      // Check if already enrolled
      const { data: existing, error: checkError } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('progress_type', 'course_enrolled')
        .single();

      if (existing) {
        console.log('User already enrolled in this course');
        return true; // Already enrolled
      }

      // Enroll the user
      const { data, error } = await supabase
        .from('user_progress')
        .insert([{
          user_id: userId,
          course_id: courseId,
          progress_type: 'course_enrolled',
          completion_percentage: 0,
          time_spent_minutes: 0,
          last_accessed_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error enrolling in course:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in enrollInCourse:', error);
      throw error;
    }
  }

  /**
   * Check if a user is enrolled in a course
   */
  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('progress_type', 'course_enrolled')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Error checking enrollment:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in isEnrolled:', error);
      return false;
    }
  }

  /**
   * Get all courses a user is enrolled in
   */
  async getEnrolledCourses(userId: string): Promise<EnrolledCourse[]> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select(`
          id,
          course_id,
          completion_percentage,
          last_accessed_at,
          created_at,
          courses:course_id (
            id,
            slug,
            title,
            description,
            short_description,
            color,
            icon,
            difficulty_level,
            estimated_duration_hours,
            tutor_name,
            tutor_avatar
          )
        `)
        .eq('user_id', userId)
        .eq('progress_type', 'course_enrolled')
        .order('last_accessed_at', { ascending: false });

      if (error) {
        console.error('Error fetching enrolled courses:', error);
        throw error;
      }

      // Transform the data and calculate real progress
      const enrolledCourses: EnrolledCourse[] = await Promise.all((data || []).map(async (item: any) => {
        // Calculate real progress based on completed lessons
        const realProgress = await this.calculateCourseProgress(userId, item.courses.id);

        return {
          id: item.courses.id,
          slug: item.courses.slug,
          title: item.courses.title,
          description: item.courses.description,
          short_description: item.courses.short_description,
          color: item.courses.color,
          icon: item.courses.icon,
          difficulty_level: item.courses.difficulty_level,
          estimated_duration_hours: item.courses.estimated_duration_hours,
          tutor_name: item.courses.tutor_name,
          tutor_avatar: item.courses.tutor_avatar,
          enrolled_at: item.created_at,
          last_accessed_at: item.last_accessed_at,
          completion_percentage: realProgress
        };
      }));

      return enrolledCourses;
    } catch (error) {
      console.error('Error in getEnrolledCourses:', error);
      return [];
    }
  }

  /**
   * Calculate real course progress based on completed lessons
   * This uses the same logic as the course page for consistency
   */
  private async calculateCourseProgress(userId: string, courseId: string): Promise<number> {
    try {
      console.log('🔍 Calculating progress for course:', courseId, 'user:', userId);

      // Get all modules with their lessons
      const { data: modules, error: modulesError } = await supabase
        .from('modules')
        .select(`
          id,
          lessons:lessons(id)
        `)
        .eq('course_id', courseId)
        .eq('is_published', true);

      console.log('📚 Modules found:', modules?.length, 'Error:', modulesError);

      if (modulesError || !modules || modules.length === 0) {
        console.log('❌ No modules found, returning 0');
        return 0;
      }

      // Count total lessons across all modules
      let totalLessons = 0;
      modules.forEach(module => {
        totalLessons += (module.lessons?.length || 0);
      });

      console.log('📖 Total lessons:', totalLessons);

      if (totalLessons === 0) {
        console.log('❌ No lessons found, returning 0');
        return 0;
      }

      // Get unique completed lesson IDs (to avoid counting duplicates)
      const { data: completedData, error: completedError } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('progress_type', 'lesson_completed')
        .eq('completion_percentage', 100);

      console.log('✅ Completed lessons data:', completedData?.length, 'Error:', completedError);

      if (completedError) {
        console.error('Error fetching completed lessons:', completedError);
        return 0;
      }

      // Count unique completed lessons
      const uniqueCompletedLessons = new Set(completedData?.map(d => d.lesson_id) || []);
      const completedLessons = uniqueCompletedLessons.size;

      // Calculate percentage
      const progress = Math.round((completedLessons / totalLessons) * 100);
      console.log('📊 Progress calculated:', progress, '%', `(${completedLessons}/${totalLessons})`);
      return progress;
    } catch (error) {
      console.error('Error calculating course progress:', error);
      return 0;
    }
  }

  /**
   * Unenroll from a course
   */
  async unenrollFromCourse(userId: string, courseId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('progress_type', 'course_enrolled');

      if (error) {
        console.error('Error unenrolling from course:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in unenrollFromCourse:', error);
      throw error;
    }
  }
}

export const enrollmentService = new EnrollmentService();

