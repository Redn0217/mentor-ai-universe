# Deploying Internsify Backend to Render

This guide will walk you through deploying the Internsify backend to Render and connecting it to your frontend on Hostinger.

## Prerequisites

- A Render account (https://render.com)
- Your code pushed to a GitHub repository
- Your frontend already deployed on Hostinger

## Step 1: Prepare Your Backend

The backend code has already been prepared for deployment with:
- A proper server.js file
- CORS configuration to allow requests from your Hostinger domain
- Environment variable handling
- Health check endpoint

## Step 2: Deploy to Render

### Option 1: Manual Deployment

1. Log in to your Render account
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: internsify-backend (or your preferred name)
   - **Root Directory**: backend
   - **Runtime**: Node
   - **Build Command**: `chmod +x build.sh && ./build.sh`
   - **Start Command**: `./start.sh`
   - **Plan**: Free (or select a paid plan for better performance)
5. Add environment variables:
   - `NODE_ENV`: production
   - `PORT`: 8080
   - `NVIDIA_API_KEY`: [Your NVIDIA API Key]
   - `OPENAI_API_KEY`: [Your OpenAI API Key]
6. Click "Create Web Service"

### Option 2: Using render.yaml (Blueprint)

1. Log in to your Render account
2. Click "New" and select "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the render.yaml file and configure the service
5. You'll need to manually set the secret environment variables (API keys)
6. Click "Apply"

## Step 3: Update Your Frontend

After your backend is deployed, you'll need to update your frontend to use the Render backend URL:

1. Get your Render service URL (e.g., https://internsify-backend.onrender.com)
2. Update the API_BASE_URL in src/services/openaiService.ts:
   ```typescript
   const API_BASE_URL = import.meta.env.PROD
     ? 'https://internsify-backend.onrender.com' // Replace with your actual Render URL
     : '';
   ```
3. Rebuild and redeploy your frontend to Hostinger

## Step 4: Test the Connection

1. Visit your frontend on Hostinger
2. Try using the chat feature
3. Check the browser console for any errors
4. Check the Render logs for any backend issues

## Troubleshooting

- **CORS Issues**: Make sure your backend CORS configuration includes your Hostinger domain
- **API Key Issues**: Verify that your environment variables are set correctly in Render
- **Connection Issues**: Check that your frontend is using the correct Render URL

## Monitoring and Scaling

- Render provides logs and metrics for your service
- You can upgrade your plan for better performance
- Consider setting up alerts for high usage or errors

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Express.js Deployment Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [CORS Configuration Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
