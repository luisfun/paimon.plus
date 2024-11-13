import svelte from '@astrojs/svelte'
import tailwind from '@astrojs/tailwind'
import webmanifest from 'astro-webmanifest'
import { defineConfig, passthroughImageService } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  //site: 'https://paimon.plus',
  redirects: {
    '/': '/en',
    '/atk-crit': '/en/crit-ratio',
    '/ja/atk-crit': '/ja/crit-ratio',
    '/ko/atk-crit': '/ko/crit-ratio',
    '/team-builder': '/en/team-builder',
    '/showcase': '/en/showcase',
    '/avg-dmg': '/en/avg-dmg',
    '/wish-banner': '/en/wish-banner',
    '/showcase-analytics': '/en/showcase-analytics',
    '/talent-materials': '/en/talent-materials',
    '/team-randomizer': '/en/team-randomizer',
    '/artifacter': '/en/artifacter',
    '/player-card-templates': '/en/player-card-templates',
    '/player-card': '/en/player-card',
    '/developer-tools': '/en/developer-tools',
    '/beta-access': '/en/beta-access',
    // old
    '/random-team-generator': '/en/team-randomizer',
    '/ja/random-team-generator': '/ja/team-randomizer',
  },
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
