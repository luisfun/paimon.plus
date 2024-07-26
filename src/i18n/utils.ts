import textMap from '@game/text-map.json'
import { defaultLang, ui } from '@i18n/ui'

type Lang = keyof typeof ui

export const getStaticPaths = async () => Object.keys(ui).map(lang => ({ params: { lang } }))

export const getLangFromUrl = (url: URL) => {
  const [, lang] = url.pathname.split('/')
  if (lang in ui) return lang as Lang
  return defaultLang
}

export const useTranslations = (lang: Lang | URL) => (key: keyof (typeof ui)[typeof defaultLang] | number) => {
  const l = lang instanceof URL ? getLangFromUrl(lang) : lang
  // @ts-expect-error
  if (typeof key === 'number') return textMap[l][key] as string
  // @ts-expect-error
  return (ui[l][key] as string | undefined) || ui[defaultLang][key]
}

export const useTranslatedPath =
  (lang: Lang) =>
  (path: string, l: Lang = lang) =>
    `/${l}${path}`
