import svelte from '@astrojs/svelte'
import tailwind from '@astrojs/tailwind'
import webmanifest from 'astro-webmanifest'
import { defineConfig, squooshImageService } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  image: {
    service: squooshImageService(), // デフォルトの sharp は他のパッケージと競合してるのかも？（動かない）
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja', 'ko'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [
    svelte(),
    tailwind(),
    webmanifest({
      name: 'Paimon+',
      start_url: '/',
      display: 'standalone',
      background_color: '#282a2e', // --primary-645
      theme_color: '#282a2e', // --primary-645
      icons: [
        {
          type: 'image/png',
          src: '/android-chrome-96x96.png',
          sizes: '96x96',
        },
        {
          type: 'image/png',
          src: '/android-chrome-144x144.png',
          sizes: '144x144',
        },
        {
          type: 'image/png',
          src: '/maskable_icon_x128.png',
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
