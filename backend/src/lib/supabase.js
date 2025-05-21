const { createClient } = require('@supabase/supabase-js');
const { config } = require('../config/env');

// Create a Supabase client
const supabase = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey,
  {
    auth: {
      persistSession: false,
    },
  }
);

// Function to check if Supabase is connected
const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return false;
    }
    console.log('Successfully connected to Supabase');
    return true;
  } catch (error) {
    console.error('Exception connecting to Supabase:', error);
    return false;
  }
};

// Export the Supabase client and helper functions
module.exports = {
  supabase,
  checkSupabaseConnection,
};
