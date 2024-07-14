import { defaultLang, ui } from './ui'

type Lang = keyof typeof ui

export const getStaticPaths = async () => Object.keys(ui).map(lang => ({ params: { lang } }))

export const getLangFromUrl = (url: URL) => {
  const [, lang] = url.pathname.split('/')
  if (lang in ui) return lang as Lang
  return defaultLang
}

export const useTranslations = (lang: Lang | URL) => (key: keyof (typeof ui)[typeof defaultLang]) =>
  // @ts-expect-error
  (ui[lang instanceof URL ? getLangFromUrl(lang) : lang][key] as string | undefined) || ui[defaultLang][key]

export const useTranslatedPath =
  (lang: Lang) =>
  (path: string, l: Lang = lang) =>
    `/${l}${path}`
