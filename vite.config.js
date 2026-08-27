import { defineConfig } from 'vite';
export default defineConfig({
  base: './',
  build: { assetsInlineLimit: 0, chunkSizeWarningLimit: 900 },
  server: { host: true, allowedHosts: true },
  preview: { host: true, allowedHosts: true },
});
