import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (id.includes("framer-motion")) {
            return "motion";
          }

          if (id.includes("lucide-react")) {
            return "icons";
          }

          if (id.includes("@react-three/fiber") || id.includes("/three/")) {
            return "three-vendor";
          }

          if (id.includes("/gsap/")) {
            return "gsap";
          }

          if (id.includes("/lenis/")) {
            return "lenis";
          }

          if (
            id.includes("react") ||
            id.includes("react-dom") ||
            id.includes("react-router-dom")
          ) {
            return "react-vendor";
          }

          if (
            id.includes("@tanstack/react-query") ||
            id.includes("axios") ||
            id.includes("socket.io-client") ||
            id.includes("zustand")
          ) {
            return "app-vendor";
          }

          return "vendor";
        },
      },
    },
  },
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
});
