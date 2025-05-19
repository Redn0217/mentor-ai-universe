
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iucimtwcakmouafdnrwj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1Y2ltdHdjYWttb3VhZmRucndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMDAxMzQsImV4cCI6MjA2Mjc3NjEzNH0.-_RIvC_Sb5FjF5iPbzKiQMLg7id3pjb2oHoX9kvsQlc';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key must be defined in environment variables');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
