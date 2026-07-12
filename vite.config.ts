/*
  CONTENT SECURITY POLICY (CSP) COMPLIANCE NOTE
  EcoBazar employs a strict Content Security Policy (configured in index.html and vercel.json)
  to permanently prevent unauthorized third-party script injection or advertising iframe overlays.
  - No external scripts are allowed except for validated assets (cdn.jsdelivr.net) and email delivery channels (formsubmit.co, emailjs.com).
  - External iframes, embeds, and object files are strictly banned ('frame-src none', 'object-src none').
  - Ensure any new scripts, APIs, or assets added to the dev/production builds adhere to these restrictions
    and are declared in the Content-Security-Policy rules.
*/

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              if (id.includes('motion') || id.includes('lucide-react')) {
                return 'ui';
              }
              return 'vendor';
            }
          }
        }
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
