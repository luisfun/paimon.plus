import svelte from '@astrojs/svelte'
import { defineConfig } from 'astro/config'

import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja', 'ko'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [svelte(), tailwind()],
})
