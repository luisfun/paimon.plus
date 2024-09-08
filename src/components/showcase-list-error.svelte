<script lang="ts">
import type { ApiData } from '@components/api'
import { type Lang, useTranslations } from '@i18n/utils'

export let lang: Lang
const t = useTranslations(lang)
export let apiData: ApiData | undefined
</script>

{#if apiData}
  {#if !apiData.avatarInfoList}
    <div class="text-base text-center">
      {#if !apiData.playerInfo.showAvatarInfoList}
        {t("showcase.error.register")}
      {:else}
        {t("showcase.error.public")}
      {/if}
    </div>
  {/if}
{/if}
