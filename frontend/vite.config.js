import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: mode === "development"
        ? { "/api": "http://localhost:5000" }
        : undefined,
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
  };
});
