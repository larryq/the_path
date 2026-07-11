import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    glsl(), // enables importing .glsl files directly
    tailwindcss(),
  ],
  server: {
    watch: {
      usePolling: true,
      interval: 300,
      binaryInterval: 1000, // separate, longer interval for binary files like images/models
    },
  },
});
