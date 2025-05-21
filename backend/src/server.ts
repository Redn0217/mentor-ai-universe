import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from './config/env.js';

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
import courseRoutes from './routes/course.js';

// Use routes
app.use('/api/chat', chatRoutes);
app.use('/api/courses', courseRoutes);

// Serve static files from the React app build directory in production
if (config.nodeEnv === 'production') {
  // Go up two directories from current file (src/server.ts -> backend/src -> backend -> root)
  const rootDir = path.resolve(__dirname, '../../');
  app.use(express.static(path.join(rootDir, 'dist')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(rootDir, 'dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
  console.log(`- Local: http://localhost:${PORT}`);
});

export default app;
