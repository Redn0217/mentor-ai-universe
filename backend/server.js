// CommonJS version of the server for compatibility
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
// Configure CORS to allow requests from your Hostinger domain
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://internsify.com', 'https://www.internsify.com', 'https://*.hostinger.com'] // Add your actual Hostinger domain
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// API proxy for NVIDIA API
app.post('/api/chat', async (req, res) => {
  // Get API key from environment or from request headers
  let apiKey = process.env.VITE_NVIDIA_API_KEY;

  // Check if Authorization header is provided in the request
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`- Local: http://localhost:${PORT}`);
});
