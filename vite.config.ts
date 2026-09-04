import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "src/web",
  build: {
    outDir: "../dist/web",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "src/web/main.ts"),
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/ws": {
        target: "ws://localhost:3000",
        ws: true,
      },
    },
  },
});
