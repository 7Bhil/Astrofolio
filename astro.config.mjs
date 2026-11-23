import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import AstroPWA from '@vite-pwa/astro';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://7bhil.vercel.app/',
  integrations: [
    react(), 
    sitemap({
      filter: (page) => !page.includes('/admin')
    }), 
    AstroPWA({
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    manifest: {
      name: '7Bhil',
      short_name: '7Bhil',
      description: 'Portfolio de Bhilal CHITOU, Spécialiste Fintech & Sécurité',
      theme_color: '#0f172a',
      background_color: '#020617',
      display: 'standalone',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      clientsClaim: true,
      globPatterns: ['**/*.{js,css,ico,png,svg,webp,jpg,jpeg}'],
      globIgnores: ['**/admin/**', '**/admin*'],
      navigateFallback: null,
      navigateFallbackDenylist: [/^\/admin/],
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages-cache',
            networkTimeoutSeconds: 3
          }
        },
        {
          urlPattern: /^\/admin/,
          handler: 'NetworkOnly'
        },
        {
          urlPattern: /^https?:\/\/.*\/api\/.*/,
          handler: 'NetworkOnly'
        }
      ],
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
    }
  }), tailwind()],
});