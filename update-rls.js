// Script to update RLS policies using the Supabase JavaScript client
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a Supabase client
const supabase = createClient(
  'https://iucimtwcakmouafdnrwj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1Y2ltdHdjYWttb3VhZmRucndqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMDAxMzQsImV4cCI6MjA2Mjc3NjEzNH0.-_RIvC_Sb5FjF5iPbzKiQMLg7id3pjb2oHoX9kvsQlc'
);

// Read the SQL file
const sqlFilePath = path.join(__dirname, 'update-rls.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

async function updateRLS() {
  try {
    console.log('Updating RLS policies...');

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      console.error('Error updating RLS policies:', error);
    } else {
      console.log('RLS policies updated successfully');
    }
  } catch (error) {
    console.error('Exception updating RLS policies:', error);
  }
}

updateRLS();
