import { defineConfig } from "vite";

export default defineConfig({
  appType: "spa",

  server: {
    historyApiFallback: true
  },

  optimizeDeps: {
    exclude: ["@supabase/supabase-js"]
  },

  build: {
    rollupOptions: {
      external: [
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
      ]
    }
  },

  // ==========================
  //        VITEST
  // ==========================
  test: {
    environment: "jsdom",
    globals: true
  }
});
