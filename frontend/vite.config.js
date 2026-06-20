import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": "https://app.growthsstore.com",
      "/auth/": "https://app.growthsstore.com",
      "/uploads/": "https://app.growthsstore.com",
    },
  },
});
