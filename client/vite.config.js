import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173, // You can specify any port you prefer
    proxy: {
      // Proxy API requests starting with /api to your backend server
      "/api": {
        target: "http://localhost:8800", // Replace with your backend server URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
