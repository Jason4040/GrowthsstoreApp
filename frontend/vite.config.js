import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from the current directory
  const env = loadEnv(mode, process.cwd(), "");

  // Use VITE_BACKEND_URL if set, otherwise fallback to local backend on port 5000
  const backendTarget = env.VITE_BACKEND_URL || "http://localhost:5000";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/": {
          target: backendTarget,
          changeOrigin: true,
        },
        "/auth/": {
          target: backendTarget,
          changeOrigin: true,
        },
        "/uploads/": {
          target: backendTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
