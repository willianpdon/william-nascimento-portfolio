import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Static build tailored for S3 + CloudFront hosting:
// - relative base so assets resolve under any distribution path
// - hashed filenames for long-lived cache headers
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
  },
  server: {
    port: 5173,
  },
});
