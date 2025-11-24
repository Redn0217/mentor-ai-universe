import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';
import { config } from './config/env.js';

const require = createRequire(import.meta.url);

// Create Express app
const app = express();
const PORT = config.port;

// Get current directory for serving static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
import chatRoutes from './routes/chat.js';
const courseRoutes = require('./routes/course.js');
const aiCourseRoutes = require('./routes/aiCourse.js');

// Use routes
app.use('/api/chat', chatRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/ai-courses', aiCourseRoutes);

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: config.nodeEnv });
});

// Note: Static files are served separately on Hostinger
// Backend only serves API endpoints

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
  console.log(`- Local: http://localhost:${PORT}`);
});

export default app;
