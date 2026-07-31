import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import AstroPWA from '@vite-pwa/astro';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://7bhil.vercel.app/',
  integrations: [react(), sitemap(), AstroPWA({
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
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}'],
      navigateFallback: null,
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
    }
  }), tailwind()],
});