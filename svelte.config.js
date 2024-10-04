import { vitePreprocess } from '@astrojs/svelte'

export default {
  preprocess: vitePreprocess(),
  compilerOptions: {
    //runes: true, //npx svelte-migrate svelte-5
  },
}
