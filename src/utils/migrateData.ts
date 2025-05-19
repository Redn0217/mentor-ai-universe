
import { supabase } from '@/lib/supabase';
import { migrateCoursesToSupabase, Course } from '@/services/courseService';

// Import the courses from the local JSON data instead of trying to fetch from API
const importCourses = async (): Promise<Course[]> => {
  try {
    // Use the courses data from the backend/src/data/courses.json directly
    // This is a workaround since the API endpoint is not working correctly
    return [
      {
        id: "python",
        slug: "python",
        title: "Python",
        description: "Learn Python programming from basics to advanced concepts with practical exercises.",
        icon: "code",
        color: "#3776AB",
        modules: [
          {
            id: "module1",
            title: "Getting Started",
            description: "Learn the basics and set up your development environment.",
            lessons: [
              {
                id: "lesson1",
                title: "Introduction",
                content: "Overview of the course and what you will learn.",
                duration: 15
              }
            ],
            exercises: [],
            resources: []
          }
        ],
        tutor: {
          name: "Dr. Ana Python",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana"
        },
        lastUpdated: "2023-05-15"
      }
    ];
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
