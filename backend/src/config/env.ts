import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  nvidiaApiKey: process.env.VITE_NVIDIA_API_KEY || '',
  openaiApiKey: process.env.VITE_OPENAI_API_KEY || '',
  supabaseUrl: process.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || '',
};
