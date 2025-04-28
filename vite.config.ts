import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  publicDir: "public",
  plugins: [
    react(),
    {
      name: 'font-filter',
      generateBundle(_, bundle) {
        // List of fonts we actually use
        const usedFonts = [
          'Raleway',
          'Quicksand',
          'Caveat',
          'Architects Daughter'
        ];

        // Filter out unused font files
        Object.keys(bundle).forEach(key => {
          const chunk = bundle[key];
          if (chunk.type === 'asset' && chunk.fileName.endsWith('.woff2')) {
            const fontName = chunk.fileName.split('-')[0];
            if (!usedFonts.some(font => font.toLowerCase().includes(fontName.toLowerCase()))) {
              delete bundle[key];
            }
          }
        });
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: ['es2015', 'safari11'],
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            '@supabase/supabase-js',
            '@tanstack/react-query',
            'framer-motion',
            'date-fns'
          ],
          ui: [
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-select',
            '@radix-ui/react-slider',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
            'class-variance-authority',
            'clsx',
            'tailwind-merge'
          ],
          charts: [
            'recharts'
          ],
          auth: [
            '@supabase/ssr',
            'next-themes'
          ],
          admin: [
            './src/pages/Admin.tsx',
            './src/components/admin/*',
            './src/pages/ManageUsers.tsx',
            './src/pages/ManageContent.tsx',
            './src/pages/ManageSettings.tsx'
          ],
          subscription: [
            './src/pages/subscription/*',
            './src/pages/ManageSubscription.tsx'
          ],
          games: [
            './src/components/games/*',
            './src/components/puzzles/*'
          ]
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        minifyInternalExports: true,
        compact: true,
        exports: 'named',
        interop: 'auto'
      },
      external: ['@supabase/*']
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      },
      mangle: true,
      format: {
        comments: false
      }
    },
    sourcemap: false,
    chunkSizeWarningLimit: 500
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2015',
      define: {
        'process.env.NODE_ENV': JSON.stringify('production')
      }
    }
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
})
