// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  // Static output only - no SSR, no API routes
  output: 'static',

  // Site URL placeholder - update with actual domain when deployed
  site: 'https://example.com',

  // Build configuration
  build: {
    // Output directory for built files
    format: 'file',
  },

  // Vite configuration for path aliases and plugins
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@/components': '/src/components',
        '@/layouts': '/src/layouts',
        '@/content': '/src/content',
        '@/utils': '/src/utils',
      },
    },
  },
})
