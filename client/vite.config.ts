import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("reactflow") || id.includes("@xyflow")) return "vendor-reactflow";
            if (id.includes("react") || id.includes("react-dom") || id.includes("scheduler") || id.includes("loose-envify") || id.includes("js-tokens") || id.includes("@phosphor-icons")) return "vendor-react";
            if (id.includes("markdown") || id.includes("monaco")) return "vendor-editor";
            return "vendor";
          }
          if (id.includes("/src/components/authoring/") || id.includes("/src/components/editor/")) return "authoring-editor";
          return undefined;
        },
      },
    },
  },
});
