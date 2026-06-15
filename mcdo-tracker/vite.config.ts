import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: "CrewTime",
        short_name: 'CrewTime',
        description: "Employee time tracking and payroll calculator for McDonald's crew",
        theme_color: '#DA291C',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        categories: ['business', 'productivity'],
        screenshots: [
          {
            src: 'screenshot-540x720.png',
            sizes: '540x720',
            type: 'image/png',
            form_factor: 'narrow'
          },
          {
            src: 'screenshot-1280x720.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide'
          }
        ],
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ],
        shortcuts: [
          {
            name: 'Add Entry',
            short_name: 'Add Time',
            description: 'Quickly add a new time entry',
            url: '/',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'View Calendar',
            short_name: 'Calendar',
            description: 'View your payroll calendar',
            url: '/',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts-cache',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: { '@': '/src' }
  },
  server: {
    strictPort: false,
    host: '0.0.0.0'
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
