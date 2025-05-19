
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
    // This function needs to be called with appropriate RLS policies in Supabase
    const { error } = await supabase.rpc('setup_database');
    
    if (error && !error.message.includes('function does not exist')) {
      console.error('Error setting up database:', error);
    }
  } catch (error) {
    console.error('Failed to setup database:', error);
    // Silently continue - the app can still function with API fallback
  }
};

// Initialize Supabase
setupSupabase().catch(console.error);
