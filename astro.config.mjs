import svelte from '@astrojs/svelte'
import tailwind from '@astrojs/tailwind'
import webmanifest from 'astro-webmanifest'
import { defineConfig, passthroughImageService } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  //site: 'https://paimon.plus',
  image: {
    service: passthroughImageService(), // ???
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja', 'ko'], // src/i18n/ui.ts, .github/actions/update/src/data-download.js, data-shrink.js
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    svelte(),
    tailwind(),
    webmanifest({
      name: 'Paimon+',
      start_url: '/',
      display: 'standalone',
      background_color: '#1a1b1e', // --primary-730
      theme_color: '#1a1b1e', // --primary-730
      icons: [
        {
          type: 'image/png',
          src: '/icons/android-chrome-96x96.png',
          sizes: '96x96',
        },
        {
          type: 'image/png',
          src: '/icons/android-chrome-144x144.png',
          sizes: '144x144',
        },
        {
          type: 'image/png',
          src: '/icons/maskable_icon_x128.png',
          sizes: '128x128',
          purpose: 'maskable',
        },
      ],
      locales: {
        en: {
          name: 'Paimon+',
          start_url: '/en/',
        },
        ja: {
          name: 'Paimon+',
          start_url: '/ja/',
        },
        ko: {
          name: 'Paimon+',
          start_url: '/ko/',
        },
      },
    }),
  ],
})
