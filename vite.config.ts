import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/split-snap/',
  plugins: [
    react(),
    VitePWA({
      injectRegister: false,
      manifest: false,
      includeAssets: ['manifest.webmanifest', 'icons/*.png'],
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: '/split-snap/index.html',
      },
    }),
  ],
})
