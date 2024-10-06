/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        text: 'rgba(255, 255, 255, 0.85)', // check global-style
        'text-sub': 'rgba(255, 255, 255, 0.65)',
        border: '#343746',
        background: '#0c0f1d', // check global-style
        link: '#58a6ff', //'hsl(200 100% 49.4%)',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        paimon: {
          primary: '#556DE5',
          'primary-content': '#fff',
          //secondary: '#343746',
          //"secondary-content": "rgba(255, 255, 255, 0.85)",
          //accent: 'hsl(200 100% 49.4%)', // --blue-345
          neutral: '#1b1d2a',
          'base-100': '#000',
        },
      },
    ],
  },
}
