import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH ?? "/",
  resolve: {
    alias: {
      "@content": path.resolve(__dirname, ".."),
    },
  },
  server: {
    fs: { allow: [path.resolve(__dirname, "..")] },
  },
});
