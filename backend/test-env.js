// Test script to verify .env is loaded correctly
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

console.log('\n🔍 Testing .env file loading...\n');

// Check if .env file exists
const envPath = path.resolve(__dirname, '.env');
console.log('📁 Looking for .env at:', envPath);
console.log('📄 .env file exists:', fs.existsSync(envPath) ? '✅ Yes' : '❌ No');

if (fs.existsSync(envPath)) {
  console.log('\n📝 .env file contents:');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  lines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key] = line.split('=');
      console.log(`   ${key}=...`);
    }
  });
}

console.log('\n🔧 Loading .env file...');
dotenv.config({ path: envPath });

console.log('\n✅ Environment variables loaded:');
console.log('   PORT:', process.env.PORT || '❌ Not set');
console.log('   NODE_ENV:', process.env.NODE_ENV || '❌ Not set');
console.log('   SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Not set');
console.log('   SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');
console.log('   SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Not set');
console.log('   NVIDIA_API_KEY:', process.env.NVIDIA_API_KEY ? '✅ Set' : '❌ Not set');

console.log('\n');

if (!process.env.SUPABASE_URL) {
  console.log('❌ ERROR: SUPABASE_URL is not loaded!');
  console.log('\n💡 Troubleshooting:');
  console.log('   1. Make sure backend/.env file exists');
  console.log('   2. Make sure it contains: SUPABASE_URL=https://...');
  console.log('   3. Make sure there are no extra spaces or quotes');
  console.log('   4. Try running: cd backend && node test-env.js');
} else {
  console.log('✅ SUCCESS: All required environment variables are loaded!');
}

console.log('\n');

