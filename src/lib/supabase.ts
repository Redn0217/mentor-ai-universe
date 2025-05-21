
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iucimtwcakmouafdnrwj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1Y2ltdHdjYWttb3VhZmRucndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMDAxMzQsImV4cCI6MjA2Mjc3NjEzNH0.-_RIvC_Sb5FjF5iPbzKiQMLg7id3pjb2oHoX9kvsQlc';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key must be defined in environment variables');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Function to create the courses table in Supabase if it doesn't exist
export const setupSupabase = async () => {
  try {
    console.log('Setting up Supabase database...');

    // First, check if we can connect to Supabase
    const { error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('Error connecting to Supabase:', authError);
      return;
    }

    console.log('Successfully connected to Supabase');

    // Try to call the setup_database function
    console.log('Attempting to call setup_database function...');
    const { error } = await supabase.rpc('setup_database');

    if (error) {
      if (error.message.includes('function does not exist')) {
        console.log('setup_database function does not exist, will try alternative setup methods');
      } else {
        console.error('Error setting up database:', error);
      }

      // Try to check if the courses table exists
      console.log('Checking if courses table exists...');
      const { error: tableError } = await supabase
        .from('courses')
        .select('count(*)', { count: 'exact', head: true });

      if (tableError) {
        if (tableError.message.includes('relation "courses" does not exist')) {
          console.log('Courses table does not exist, will be created during migration');
        } else {
          console.error('Error checking courses table:', tableError);
        }
      } else {
        console.log('Courses table already exists');
      }
    } else {
      console.log('Database setup completed successfully');
    }
  } catch (error) {
    console.error('Failed to setup database:', error);
    // Silently continue - the app can still function with API fallback
  }
};

// Initialize Supabase
setupSupabase().catch(console.error);
