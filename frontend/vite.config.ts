import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load env variables from .env or .env.production
  const env = loadEnv(mode, process.cwd(), "");

  console.log("Building for mode:", mode);
  console.log("VITE_BASE_URL:", env.VITE_BASE_URL);

  return {
    plugins: [react()],
    server: {
      hmr: {
        host: 'localhost',
        port: 5174,
      },
    },
    define: {
      // ✅ Hard-inject the env variable into build
      "import.meta.env.VITE_BASE_URL": JSON.stringify(
        env.VITE_BASE_URL || "https://api.vgllab.com"
      ),
    },
    build: {
      outDir: "dist",
    },
  };
});
