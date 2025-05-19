
import { supabase } from '@/lib/supabase';

export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  modules: Module[];
  tutor: {
    name: string;
    avatar: string;
  };
  lastUpdated: string;
};

export type Module = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  exercises: Exercise[];
  resources: Resource[];
};

export type Lesson = {
  id: string;
  title: string;
  content: string;
  duration: number;
};

export type Exercise = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: number;
};

export type Resource = {
  id: string;
  title: string;
  type: string;
  url: string;
};

// Function to get all courses (simplified for list view)
export const getCourses = async (): Promise<Partial<Course>[]> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('id, slug, title, description, color, lastUpdated');
      
    if (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
    
    return data.map(course => ({
      ...course,
      modules: course.modules_count || 0,
    }));
  } catch (error) {
    console.error('Error in getCourses:', error);
    throw error;
  }
};

// Function to get a specific course by slug
export const getCourse = async (slug: string): Promise<Course | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single();
      
    if (error) {
      console.error(`Error fetching course with slug ${slug}:`, error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in getCourse for slug ${slug}:`, error);
    return null;
  }
};

// Function to create a new course
export const createCourse = async (course: Course): Promise<Course> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .insert([course])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating course:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createCourse:', error);
    throw error;
  }
};

// Function to update an existing course
export const updateCourse = async (course: Course): Promise<Course> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .update(course)
      .eq('slug', course.slug)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating course:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateCourse:', error);
    throw error;
  }
};

// Function to delete a course
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

// Function to migrate courses data from JSON to Supabase
export const migrateCoursesToSupabase = async (coursesData: Course[]): Promise<void> => {
  try {
    // First, check if migration is needed by counting existing courses
    const { count, error: countError } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('Error checking courses count:', countError);
      throw countError;
    }
    
    // If we already have courses in the database, skip migration
    if (count && count > 0) {
      console.log('Courses already exist in Supabase, skipping migration');
      return;
    }
    
    // Insert all courses
    const { error } = await supabase
      .from('courses')
      .insert(coursesData);
      
    if (error) {
      console.error('Error migrating courses to Supabase:', error);
      throw error;
    }
    
    console.log('Successfully migrated courses to Supabase');
  } catch (error) {
    console.error('Error in migrateCoursesToSupabase:', error);
    throw error;
  }
};
