import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

// Create a Supabase client with service role key for backend operations
// This bypasses Row Level Security (RLS) policies
const supabase = createClient(
  config.supabaseUrl,
  config.supabaseServiceRoleKey || config.supabaseAnonKey, // Use service role key if available
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

console.log('🔑 Supabase client initialized with:', config.supabaseServiceRoleKey ? 'SERVICE_ROLE_KEY (bypasses RLS)' : 'ANON_KEY (RLS enabled)');

// Function to check if Supabase is connected
const checkSupabaseConnection = async () => {
  try {
    // Test connection by querying the courses table
    const { data, error } = await supabase
      .from('courses')
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ Supabase connection error:', error.message);
      return false;
    }

    console.log('✅ Supabase connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Exception connecting to Supabase:', error.message);
    return false;
  }
};

// Export the Supabase client and helper functions
export { supabase, checkSupabaseConnection };
