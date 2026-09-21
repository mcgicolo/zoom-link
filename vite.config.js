import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'MCGI Zoom Meeting',
        short_name: 'MCGI Zoom',
        description: 'Get your personalized Zoom link with a properly formatted display name.',
        theme_color: '#f2f2f7',
        background_color: '#f2f2f7',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            // The meeting ID, contact and locales can change at any time, so always ask the
            // network (skipping the HTTP cache) and use the saved copy only when offline.
            urlPattern: /\/config\.json$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-config',
              fetchOptions: { cache: 'no-cache' }
            }
          }
        ]
      }
    })
  ],
  base: './',
  build: {
    outDir: 'docs'
  }
});
