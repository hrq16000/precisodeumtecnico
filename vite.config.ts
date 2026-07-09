import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    // Sem manualChunks: split manual anterior causava
    // "Cannot read properties of undefined (reading 'createContext')"
    // em produção quando vendor-radix/router carregava antes de vendor-react.
    // Deixamos o Rollup auto-chunkar por dep graph (seguro).
  },
}));
