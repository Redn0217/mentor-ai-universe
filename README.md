# Mentor AI Universe

A comprehensive Learning Management System (LMS) with AI-powered course generation capabilities.

## Project info

**URL**: https://lovable.dev/projects/194a79aa-432e-4031-8cc2-34ae696e3544

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/194a79aa-432e-4031-8cc2-34ae696e3544) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies for frontend.
npm i

# Step 4: Install backend dependencies.
cd backend
npm i
cd ..

# Step 5: Set up environment variables.
# Copy the example files and fill in your actual values
cp .env.example .env
cp backend/.env.example backend/.env

# Edit .env files with your actual API keys and Supabase credentials
# - NVIDIA_API_KEY: Get from https://build.nvidia.com/
# - SUPABASE_URL: Your Supabase project URL
# - SUPABASE_ANON_KEY: Your Supabase anon key
# - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key

# Step 6: Start the backend server (in one terminal).
cd backend
npm run dev

# Step 7: Start the frontend development server (in another terminal).
npm run dev
```

## Environment Variables

This project requires environment variables to be set up. **Never commit `.env` files to git!**

### Frontend (.env)
```
OPENAI_API_KEY=your-openai-api-key-here
NVIDIA_API_KEY=your-nvidia-api-key-here
```

### Backend (backend/.env)
```
PORT=3003
NODE_ENV=development
OPENAI_API_KEY=your-openai-api-key-here
NVIDIA_API_KEY=your-nvidia-api-key-here
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Getting API Keys

1. **NVIDIA API Key**: Sign up at [NVIDIA Build](https://build.nvidia.com/) and get your API key
2. **Supabase Credentials**:
   - Create a project at [Supabase](https://supabase.com/)
   - Get your project URL and keys from Project Settings > API

## Admin Access

Admin emails are configured in the backend. Default admin emails:
- `hadaa914@gmail.com`
- `admin@internsify.com`

Register with one of these emails to get admin access.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/194a79aa-432e-4031-8cc2-34ae696e3544) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
