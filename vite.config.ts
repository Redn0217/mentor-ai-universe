import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Create base configuration
  const config: UserConfig = {
    server: {
      host: "::",
      port: 3000, // Changed to 3000 to avoid conflict with backend on 8080
      proxy: {
        '/api': {
          target: 'http://localhost:8080', // Backend server
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path
        }
      }
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
