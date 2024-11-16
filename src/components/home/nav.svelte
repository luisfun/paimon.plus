<script lang="ts">
import ExternalA from '@components/external-a.svelte'
import More from '@components/more.svelte'
import { type Lang, useTranslatedPath, useTranslations } from '@i18n/utils'
// client:load
import { navLink, officialLink } from './nav-data'
import NavSvg from './nav-svg.svelte'

const { lang }: { lang: Lang } = $props()
const t = useTranslations(lang)
const translatePath = useTranslatedPath(lang)

const dummy = 'data:image/gif;base64,R0lGODlhAQABAGAAACH5BAEKAP8ALAAAAAABAAEAAAgEAP8FBAA7'
let isLoading = $state(false)

const onclick = () => {
  isLoading = true
}
</script>

{#snippet svgGrid(data: typeof navLink[number][], mt?: boolean)}
<div class="grid grid-cols-3 gap-y-8" class:mt-8={mt}>
  {#each data as link}
    <a href={translatePath(link.href)}>
      <NavSvg icon={link.svg} class="max-w-28 mx-auto mb-3 px-4" />
      <div class="text-center">{t(link.text)}</div>
    </a>
  {/each}
</div>
{/snippet}

<nav class="bg-neutral pt-6 rounded-2xl">
  {@render svgGrid(navLink.slice(0,6))}
  <More {onclick}>
    {@render svgGrid(navLink.slice(6), true)}
    <div class="divider my-6 mx-12 text-xs text-text-sub">{t("home.nav.official")}</div>
    <div class="grid grid-cols-3 gap-y-8">
      {#each officialLink as link}
        <ExternalA href={`${link.href + (link.img==="checkin"? "&" : "?")}lang=${lang}`}>
          <img class="max-w-28 w-full mx-auto mb-3 px-7" src={isLoading ? `/images/official/${link.img}.webp` : dummy} alt={link.img} />
          <div class="text-center">{t(link.text)}</div>
        </ExternalA>
      {/each}
    </div>
  </More>
</nav>

