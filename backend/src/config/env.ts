import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from backend/.env
// Resolve path relative to this file: backend/src/config/env.ts -> backend/.env
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

console.log('🔧 Loading .env from:', envPath);
console.log('🔧 SUPABASE_URL loaded:', process.env.SUPABASE_URL ? '✅ Yes' : '❌ No');

export const config = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  nvidiaApiKey: process.env.NVIDIA_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
};
