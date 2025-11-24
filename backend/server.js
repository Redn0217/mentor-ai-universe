
// CommonJS version of the server for compatibility
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from backend/.env
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

console.log('🔧 Loading .env from:', envPath);
console.log('🔧 SUPABASE_URL loaded:', process.env.SUPABASE_URL ? '✅ Yes' : '❌ No');

// Import routes
const courseRoutes = require('./src/routes/course');
const paymentRoutes = require('./routes/payment');

// Set NODE_ENV if not already set
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Create Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
// Configure CORS to allow requests from all origins
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY'],
  credentials: false // Changed to false since we're using '*' for origin
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Add specific handling for OPTIONS requests (preflight)
app.options('*', cors(corsOptions));

// Add custom CORS headers for all responses
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-KEY');
  res.header('Access-Control-Allow-Credentials', 'false');
  next();
});

app.use(express.json());

// Health check endpoint for Render
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// API routes
app.use('/api/courses', courseRoutes);
app.use('/api/payment', paymentRoutes);

// API proxy for NVIDIA API
app.post('/api/chat', async (req, res) => {
  // Get API key from environment or from request headers
  let apiKey = process.env.NVIDIA_API_KEY;

  // Check if Authorization header is provided in the request
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix
  }

  // Also check for X-API-KEY header
  const xApiKey = req.headers['x-api-key'];
  if (xApiKey) {
    apiKey = xApiKey;
  }

  console.log('API Key available:', !!apiKey);

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error proxying to NVIDIA API:', error);
    return res.status(500).json({ error: 'Failed to fetch from NVIDIA API' });
  }
});

// Create data directory for course storage
const dataDir = path.join(__dirname, 'src', 'data');
if (!require('fs').existsSync(dataDir)) {
  require('fs').mkdirSync(dataDir, { recursive: true });
  console.log(`Created data directory: ${dataDir}`);
}

// Note: Static files are served separately on Hostinger
// Backend only serves API endpoints

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`- Local: http://localhost:${PORT}`);
});
