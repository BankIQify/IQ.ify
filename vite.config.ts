import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
<<<<<<< HEAD
export default defineConfig({
=======
export default defineConfig(({ mode }) => ({
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
<<<<<<< HEAD
    process.env.NODE_ENV === 'development' &&
=======
    mode === 'development' &&
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
<<<<<<< HEAD
  }
});
=======
  },
}));
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
