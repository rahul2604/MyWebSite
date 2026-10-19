import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Cloudflare Pages Functions (functions/) don't run under Vite. During `npm run dev` and
  // `npm run preview`, forward /api/* to `npm run preview:pages` on :8788 when it is running.
  // Host is kept as-is so the function's same-site Origin check still passes.
  server: { proxy: { '/api': { target: 'http://127.0.0.1:8788' } } },
  preview: { proxy: { '/api': { target: 'http://127.0.0.1:8788' } } },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
});
