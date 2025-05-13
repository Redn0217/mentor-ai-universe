import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

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
