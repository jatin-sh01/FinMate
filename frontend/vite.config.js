import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import removeConsole from "vite-plugin-remove-console";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), mode === "production" && removeConsole()].filter(
      Boolean,
    ),
    server: {
      host: true,
      strictPort: true,
      port: 8080,
      proxy: {
        "/api/v1": {
          target: env.VITE_DEV_API_TARGET || "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
  };
});
