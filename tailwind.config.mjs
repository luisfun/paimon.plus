/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        paimon: {
          primary: 'hsl(215 8.8% 73.3%)',
          secondary: 'hsl(227 6.5% 27.3%)',
          accent: 'hsl(200 100% 49.4%)',
          neutral: 'hsl(223 6.7% 20.6%)',
          'base-100': '#000',
        },
      },
    ],
  },
}
