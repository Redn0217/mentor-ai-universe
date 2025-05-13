# Internsify Backend

This is the backend server for the Internsify application.

## Deployment to Render

### Manual Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: internsify-backend
   - **Root Directory**: backend
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV`: production
     - `PORT`: 8080
     - `VITE_NVIDIA_API_KEY`: [Your NVIDIA API Key]
     - `VITE_OPENAI_API_KEY`: [Your OpenAI API Key]

### Automatic Deployment with render.yaml

1. Add the render.yaml file to your repository
2. Create a new Blueprint on Render
3. Connect your GitHub repository
4. Render will automatically configure the service based on the render.yaml file
5. You'll need to manually set the secret environment variables (API keys)

## Local Development

1. Install dependencies: `npm install`
2. Create a `.env` file with the required environment variables
3. Run the development server: `npm run dev`

## API Endpoints

- `GET /health`: Health check endpoint
- `POST /api/chat`: Proxy endpoint for NVIDIA API
