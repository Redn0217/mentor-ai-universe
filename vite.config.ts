import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Create base configuration
  const config: UserConfig = {
    define: {
      // Define environment variables for the frontend
      'import.meta.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY || ''),
      'import.meta.env.NVIDIA_API_KEY': JSON.stringify(process.env.NVIDIA_API_KEY || ''),
    },
    server: {
      host: "::",
      port: 3000, // Changed to 3000 to avoid conflict with backend on 8080
      // No proxy needed as we're using the Render backend URL directly
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };

  return config;
});
