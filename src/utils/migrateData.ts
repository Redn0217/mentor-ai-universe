
import { supabase } from '@/lib/supabase';
import { migrateCoursesToSupabase } from '@/services/courseService';

// Import the courses JSON data
const importCourses = async () => {
  try {
    // Dynamically import the JSON data 
    const response = await fetch('/api/courses');
    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status}`);
    }
    const coursesData = await response.json();
    return coursesData;
  } catch (error) {
    console.error('Error importing courses data:', error);
    throw error;
  }
};

// Main migration function
export const migrateDataToSupabase = async (): Promise<void> => {
  try {
    console.log('Starting data migration to Supabase...');
    
    // First check if Supabase is connected
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Supabase connection error:', error);
      throw new Error('Failed to connect to Supabase');
    }
    
    // Import and migrate courses
    const coursesData = await importCourses();
    await migrateCoursesToSupabase(coursesData);
    
    console.log('Data migration completed successfully');
  } catch (error) {
    console.error('Data migration failed:', error);
    throw error;
  }
};

// Check if we need to create Supabase tables
export const checkAndCreateTables = async (): Promise<void> => {
  try {
    // Check if courses table exists by querying it
    const { error } = await supabase
      .from('courses')
      .select('count(*)', { count: 'exact', head: true });
      
    // If no error, table exists
    if (!error) {
      console.log('Courses table already exists');
      return;
    }
    
    // If error is not "relation does not exist", rethrow
    if (!error.message.includes('relation "courses" does not exist')) {
      console.error('Error checking courses table:', error);
      throw error;
    }
    
    console.log('Creating courses table...');
    
    // Execute SQL to create the table - note this requires create table permissions
    const { error: createError } = await supabase.rpc('create_courses_table');
    
    if (createError) {
      console.error('Error creating courses table:', createError);
      throw createError;
    }
    
    console.log('Courses table created successfully');
  } catch (error) {
    console.error('Failed to check/create tables:', error);
    throw error;
  }
};
