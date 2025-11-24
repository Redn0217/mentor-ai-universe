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

      // Transform the data
      const enrolledCourses: EnrolledCourse[] = (data || []).map((item: any) => ({
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
        completion_percentage: item.completion_percentage || 0
      }));

      return enrolledCourses;
    } catch (error) {
      console.error('Error in getEnrolledCourses:', error);
      return [];
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

